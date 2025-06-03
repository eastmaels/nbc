const { network, ethers} = require("hardhat");
const { expect } = require("chai");
const web3 = require("@solana/web3.js");
const { getMint, getAccount, createTransferInstruction } = require("@solana/spl-token");
const config = require("../config.js");
const { deployContract, airdropSOL } = require("./utils.js");

describe('\u{1F680} \x1b[36mSPL Token program composability tests\x1b[33m',  function() {

    console.log("Network name: " + network.name)

    const solanaConnection = new web3.Connection(config.svm_node[network.name], "processed")

    const seed = config.composability.tokenMintSeed[network.name]
    const decimals = config.composability.tokenMintDecimals[network.name]
    const AMOUNT = ethers.parseUnits('1', decimals)
    const SMALL_AMOUNT = ethers.parseUnits('1', decimals)
    const ZERO_AMOUNT = BigInt(0)
    const ZERO_BYTES32 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
    const WSOL_MINT_PUBKEY = Buffer.from('069b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001', 'hex')
    const SPL_TOKEN_ACCOUNT_SIZE = 165

    let deployer,
        neonEVMUser,
        otherNeonEVMUser,
        callSPLTokenProgram,
        callSystemProgram,
        callAssociatedTokenProgram,
        tx,
        contractPublicKeyInBytes,
        deployerPublicKeyInBytes,
        neonEVMUserPublicKeyInBytes,
        otherNeonEVMUserPublicKeyInBytes,
        solanaUser,
        tokenMintInBytes,
        deployerTokenAccountInBytes,
        deployerWSOLTokenAccountInBytes,
        neonEVMUserTokenAccountInBytes,
        solanaUserTokenAccountInBytes,
        solanaUserAssociatedTokenAccountInBytes,
        contractAssociatedTokenAccountInBytes,
        newMintAuthorityInBytes,
        newFreezeAuthorityInBytes,
        currentOwnerInBytes,
        newOwnerInBytes,
        currentCloseAuthorityInBytes,
        newCloseAuthorityInBytes,
        initialDeployerBalance,
        newDeployerBalance,
        initialDeployerTokenAccountBalance,
        newDeployerTokenAccountBalance,
        initialDeployerTokenAccountSOLBalance,
        newDeployerTokenAccountSOLBalance,
        initialDeployerTokenAccountWSOLBalance,
        newDeployerTokenAccountWSOLBalance,
        initialNeonEVMUserTokenAccountBalance,
        newNeonEVMUserTokenAccountBalance,
        initialSolanaUserTokenAccountBalance,
        initialContractTokenAccountBalance,
        info

    before(async function() {
        const deployment = await deployContract('CallSPLTokenProgram', "0x2413A1ABE521EeF1Fb31dAac2ff40234d512e337")
        deployer = deployment.deployer
        neonEVMUser = deployment.user
        //otherNeonEVMUser = deployment.otherUser
        callSPLTokenProgram = deployment.contract
        callSystemProgram = (await deployContract('CallSystemProgram', "0x801C0B35C6A00a42b04321096EF12B2461CdBbBd")).contract
        callAssociatedTokenProgram = (await deployContract('CallAssociatedTokenProgram', "0x69Db081873b9809d64942915653Af1A1F962EC2c")).contract

        tokenMintInBytes =  "0x6884708e0eba127a4f5b6e436e0a987b98955e4908948131dddf59a6592d97b1";
    })

    describe('Re-checking', async function() {
    
      it('Call SPL token mint data getters', async function() {
          info = await getMint(solanaConnection, new web3.PublicKey(ethers.encodeBase58(tokenMintInBytes)))
          console.log("SPL Token mint address: ", info.address.toBase58())

          expect(info.address.toBase58()).to.eq(ethers.encodeBase58(tokenMintInBytes))
      })
    })

    describe('Rechecking mintTo', function() {
        it('Mint SPL token amount to deployer token account', async function() {
            tx = await callSPLTokenProgram.connect(deployer).createInitializeArbitraryTokenAccount(
                tokenMintInBytes,
                Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), // Leave owner field empty so that msg.sender controls the token account through CallSPLTokenProgram contract
                Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), // Leave tokenOwner field empty so that CallSPLTokenProgram contract owns the token account
            )
            await tx.wait(1)
            console.log("Create arbitrary token account: ", tx.hash)

            deployerPublicKeyInBytes = await callSPLTokenProgram.getNeonAddress(deployer.address)
            deployerTokenAccountInBytes = await callSPLTokenProgram.getArbitraryTokenAccount(
                tokenMintInBytes,
                deployerPublicKeyInBytes,
                0 // Arbitrary nonce used to create the arbitrary token account
            )
            console.log("Deployer token account: ", ethers.encodeBase58(deployerTokenAccountInBytes))

            initialDeployerTokenAccountBalance = BigInt((await solanaConnection.getTokenAccountBalance(
                new web3.PublicKey(ethers.encodeBase58(deployerTokenAccountInBytes))
            )).value.amount)

            console.log("seeder: ", seed)
            tx = await callSPLTokenProgram.connect(deployer).mint(
                Buffer.from(seed), // Seed that was used to generate SPL token mint
                deployerTokenAccountInBytes, // Recipient token account
                AMOUNT // Amount to mint
            )
            await tx.wait(1) // Wait for 1 confirmation
            console.log("Mint SPL token amount to deployer token account: ", tx.hash)

            info = await getMint(solanaConnection, new web3.PublicKey(ethers.encodeBase58(tokenMintInBytes)))
            console.log("SPL Token mint info after mint: ", info.supply)

            // expect(info.address.toBase58()).to.eq(ethers.encodeBase58(tokenMintInBytes))
            // expect(info.mintAuthority.toBase58()).to.eq(ethers.encodeBase58(contractPublicKeyInBytes))
            // expect(info.freezeAuthority.toBase58()).to.eq(ethers.encodeBase58(contractPublicKeyInBytes))
            // expect(info.supply).to.eq(AMOUNT)
            // expect(info.decimals).to.eq(decimals)
            // expect(info.isInitialized).to.eq(true)
            // expect(info.tlvData.length).to.eq(0)

            info = await solanaConnection.getTokenAccountBalance(
              new web3.PublicKey(ethers.encodeBase58(deployerTokenAccountInBytes))
            )
            
            console.log("SOL token account balance after mint: ", info.value.uiAmount)
            console.log("SOL token account balance after mint: ", info.value.uiAmountString)

            // expect(info.value.amount).to.eq((initialDeployerTokenAccountBalance + AMOUNT).toString())
            // expect(info.value.decimals).to.eq(decimals)
            // expect(info.value.uiAmount).to.eq(parseInt(ethers.formatUnits((initialDeployerTokenAccountBalance + AMOUNT), decimals)))
            // expect(info.value.uiAmountString).to.eq(ethers.formatUnits((initialDeployerTokenAccountBalance + AMOUNT), decimals).split('.')[0])
        })
    })

})
