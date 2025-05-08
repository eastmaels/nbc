// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const bs58 = require("bs58");

require('dotenv').config();
const { config } = require("./config.js");
const { C } = require("@raydium-io/raydium-sdk-v2/lib/raydium-64d94f53.js");

async function main() {
    const SOLANA_NODE = config.SOLANA_NODE;
    const DEVNET_ERC20ForSPL_FACTORY = "0xF6b17787154C418d5773Ea22Afc87A95CAA3e957";

    let solanaTx;
    let tx;
    let ts;
    let receipt;

    const connection = new web3.Connection(SOLANA_NODE, "processed");
    const keypair = web3.Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY_SOLANA));
    const [user1] = await ethers.getSigners();

    const ER20ForSplFactoryContract = await ethers.getContractFactory("ERC20ForSplFactory");
    const ERC20ForSPLMintableContract = await ethers.getContractFactory("ERC20ForSPLMintable");
    const ERC20ForSPlFactory = ERC20ForSplFactoryContract.attach(DEVNET_ERC20ForSPL_FACTORY);

    tx = await ERC20ForSPlFactory.connect(user1).createERC20ForSPLMintable("DevBootcamp Blurtopian TOKEN " + Date.now().toString(), "DBBLTPN", 9, user1.address);
    await tx.wait(1);

    receipt = await connection.confirmTransaction(tx, "processed");
    console.log("ERC20ForSPLMintable created");

    const ERC20ForSPLMintableAddress = await ERC20ForSPlFactory.allErc20ForSpl(
        parseInt((await ERC20ForSPlFactory.allErc20ForSplLength()).toString()) - 1
    );
    const ERC20ForSPLMintable = ERC20ForSPLMintableContract.attach(ERC20ForSPLMintableAddress);
    console.log(ERC20ForSPLMintable.target, 'ERC20ForSPLMintableAddress');

    const tokenMint = await ERC20ForSPLMintable.tokenMint();
    console.log(tokenMint, 'tokenMint');

    // deploy TestDevBootcamp contract
    const TestDevBootcamp = await ethers.deployContract("TestDevBootcamp", [ERC20ForSPLMintableAddress.target]);
    await TestDevBootcamp.waitForDeployment();
    console.log(`TestDevBootcamp deployed to ${TestDevBootcamp.target}`);

    const contractPublicKey = ethers.encodeBase58(await TestDevBootcamp.getNeonAddress(TestDevBootcamp.target));
    console.log(contractPublicKey, 'contractPublicKey');

    // setup sender & receiver ATA's with solana Web3
    const randomSolanaAccount = web3.Keypair.generate();
    const senderATA = await getAssociatedTokenAddress(
        new web3.PublickKey(ethers.encodeBase58(tokenMint)),
        new web3.PublickKey(randomSolanaAccount.publicKey.toBase58()),
        true
    );
    console.log(senderATA, 'senderATA');

    const recipientATA = await getAssociatedTokenAddress(
        new web3.PublickKey(ethers.encodeBase58(tokenMint)),
        new web3.PublickKey(randomSolanaAccount.publicKey.toBase58()),
        true
    );
    console.log(recipientATA, 'recipientATA');

    solanaTx = new web3.Transaction();
    solanaTx.add(
        createAssociatedTokenAccountInstruction(
            keypair.publicKey,
            senderATA,
            new web3.PublickKey(contractPublicKey),
            new web3.PublickKey(ethers.encodeBase58(tokenMint))
        ),
        createAssociatedTokenAccountInstruction(
            keypair.publicKey,
            recipientATA,
            new web3.PublickKey(randomSolanaAccount.publicKey.toBase58())
        )
    );
    
    const signature = await web3.sendAndConfirmTransaction(connection, solanaTx, [keypair]);
    console.log(signature, 'transaction sender & recipient ATA\'s creation');

    // make the token approval so the contract can handle the user's token deposit
    const amount = 10 * 10 ** 9; // 10 tokens
    tx = await ERC20ForSPLMintable.approve(TestDevBootcamp.target, amount);
    await tx.wait(1);
    console.log(tokenMint, 'erc20forspl approve');

    // perform the deposit with the transfer through a composability request
    ts = await TestDevBootcamp.transfer(amount, config.utils.publicKeyToBytes32(randomSolanaAccount.publicKey.toBase58()));
    await ts.wait(1);
    console.log('TestDevBootcamp transfer');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});