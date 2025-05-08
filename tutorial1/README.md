# Neon Bootcam - Tutorial 1

This is the submission for the first tutorial to Neon's Bootcamp as original described [here](https://bootcamp.neonevm.org/videos/deploy-an-erc-20-for-spl-token-on-neon-evm-and-test-on-solana).

The objective of this first tutorial is to get acquainted with the Neon network and understand the concepts the lie under how EVM communicates with Solana.

The tutorial is composed of severals steps which breaks down into:

1. Setting up your local environment (installing required nodejs)
2. Cloning neon-tutorials repo
3. Modifying the deployment script

One of the challenges I encountered was getting my private key from the default generated secretkey which is a Uint8Array.
I had to create a script to retrieve my string private key from this Uint8Array and then used this key as value for environment variable `PRIVATE_KEY_SOLANA`.

## Clone repository and change to hardhat directory

Run command

```sh
git clone https://github.com/neonlabsorg/neon-tutorials.git
git checkout -b dev-bootcamp-video
cd neon-tutorials/hardhat
```

**NOTE** All the next operations must be performed from the **neon-tutorials/hardhat** directory.

## Install the required dependencies

```sh
npm install
```

## Setup Neon network in the Metamask wallet

1. Go to [Chainlist](https://chainlist.org/?search=Neon+EVM&testnets=true) and add the Neon EVM DevNet and Neon EVM MainNet networks to your Metamask wallet.
2. Airdrop at most 100 NEONs to the created **account #1** [from here](https://neonfaucet.org/)
3. Copy your Metamask account's private key (Account Details >> Export Private Key) and insert them into **.env**
   **NOTE!** Add **0x** prefix at the beginning

## Set up .env file

Create a .env file in the root project folder and add these lines -

```sh
PRIVATE_KEY_OWNER=<1ST_PRIVATE_KEY>
USER1_KEY=<2ND_PRIVATE_KEY>
PRIVATE_KEY_SOLANA=<SOLANA_PRIVATE_KEY>
```

## Run the Deploy script

`npx hardhat run scripts/TestCallSolana/TestDevBootcamp.js --network neondevnet`

