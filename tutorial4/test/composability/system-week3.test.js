const { network, ethers} = require("hardhat");
const { expect } = require("chai");
const web3 = require("@solana/web3.js");
const { getAccount, TOKEN_PROGRAM_ID, ACCOUNT_SIZE } = require("@solana/spl-token");
const { deployContract, airdropSOL } = require("./utils.js");
const config = require("../config.js");

describe('\u{1F680} \x1b[36mSystem program composability tests\x1b[33m',  async function() {

    console.log("Network name: " + network.name)

    const solanaConnection = new web3.Connection(config.svm_node[network.name], "processed")

    const ZERO_AMOUNT = BigInt(0)
    const ZERO_BYTES32 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
    const AMOUNT = ethers.parseUnits('1', 9)

    let deployer,
        neonEVMUser,
        callSystemProgram,
        mockCallSystemProgram,
        tx,
        seed,
        basePubKey,
        rentExemptBalance,
        createWithSeedAccountInBytes,
        info,
        initialRecipientSOLBalance,
        newRecipientSOLBalance

    before(async function() {
        const deployment = await deployContract('CallSystemProgram', "0xdCf4712546aC9E154c2EFb1EaB76a4f9Fd0985eB")
        deployer = deployment.deployer
        neonEVMUser = deployment.user
        callSystemProgram = deployment.contract
        mockCallSystemProgram = (await deployContract('MockCallSystemProgram', "0x81ba323dCe19A4f22587C439283eF2abf9De6b96")).contract

        basePubKey = await callSystemProgram.getNeonAddress(callSystemProgram.target)
        rentExemptBalance = await solanaConnection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE)
        console.log("Rent exempt balance: " + rentExemptBalance.toString())
    })

    describe('\n\u{231B} \x1b[33m Testing on-chain formatting and execution of Solana\'s System program \x1b[36mcreateAccountWithSeed\x1b[33m instruction\x1b[0m', function() {

        it('Create account with seed', async function() {
            // Generate the public key of the account we want to create from a seed and the id of the program it will
            // be assigned to
            seed = 'seed' + Date.now().toString()
            createWithSeedAccountInBytes = await callSystemProgram.getCreateWithSeedAccount(
                basePubKey,
                TOKEN_PROGRAM_ID.toBuffer(),
                Buffer.from(seed)
            )

            // Assign the account to the specified program, allocate space to it and fund it
            tx = await callSystemProgram.createAccountWithSeed(
                TOKEN_PROGRAM_ID.toBuffer(), // SPL token program
                Buffer.from(seed),
                ACCOUNT_SIZE // SPL token account data size
            )
            await tx.wait(1) // Wait for 1 confirmation

            info = await solanaConnection.getAccountInfo(new web3.PublicKey(ethers.encodeBase58(createWithSeedAccountInBytes)))
            expect(info.owner.toBase58()).to.eq(TOKEN_PROGRAM_ID.toBase58())
            expect(info.executable).to.be.false
            expect(info.lamports).to.eq(rentExemptBalance)
            expect(info.space).to.eq(ACCOUNT_SIZE)

            info = await getAccount(solanaConnection, new web3.PublicKey(ethers.encodeBase58(createWithSeedAccountInBytes)))
            expect(info.address.toBase58()).to.eq(ethers.encodeBase58(createWithSeedAccountInBytes))
            expect(info.mint.toBase58()).to.eq(ethers.encodeBase58(ZERO_BYTES32))
            expect(info.owner.toBase58()).to.eq(ethers.encodeBase58(ZERO_BYTES32))
            expect(info.delegate).to.eq(null)
            expect(info.closeAuthority).to.eq(null)
            expect(info.amount).to.eq(ZERO_AMOUNT)
            expect(info.delegatedAmount).to.eq(ZERO_AMOUNT)
            expect(info.isInitialized).to.eq(false)
            expect(info.isFrozen).to.eq(false)
            expect(info.isNative).to.eq(false)
            expect(info.rentExemptReserve).to.eq(null)
            expect(info.tlvData.length).to.eq(0)
        })
    })

    describe('\n\u{231B} \x1b[33m Testing on-chain formatting and execution of Solana\'s System program \x1b[36mtransfer\x1b[33m instruction\x1b[0m', function() {

        it('Transfer SOL', async function() {
            // Generate a random key pair
            const recipient = web3.Keypair.generate()
            initialRecipientSOLBalance = await solanaConnection.getBalance(recipient.publicKey)

            // Transfer SOL to the recipient account
            tx = await callSystemProgram.transfer(
                recipient.publicKey.toBuffer(), // Transfer recipient public key
                AMOUNT // Amount of SOL to transfer
            )
            await tx.wait(1) // Wait for 1 confirmation

            newRecipientSOLBalance = await solanaConnection.getBalance(recipient.publicKey)
            expect(newRecipientSOLBalance - initialRecipientSOLBalance).to.eq(AMOUNT)
        })
    })

})