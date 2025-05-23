# Neon Bootcamp - Tutorial 2

This is the submission for the second tutorial to Neon's Bootcamp as original described [here](https://bootcamp.neonevm.org/videos/build-a-memecoin-launchpad-on-solana-using-neon-evm).

The objective of this first tutorial is to launch a fully onchain memecoin launchpad.

The tutorial is composed of severals steps which breaks down into:

1. Setting up your local environment (installing required nodejs)
2. Cloning neon-tutorials repo
3. Running the test script

One of the challenges I encountered was running the test script because I didn't have any Wrapped SOL.
This was immediately resolved the following day.

## Clone repository and change to hardhat directory

Run command

```sh
git clone git@github.com:neonlabsorg/neon-pocs.git
cd neon-pocs
```

**NOTE** All the next operations must be performed from the **neon-tutorials/hardhat** directory.

## Install the required dependencies

```sh
npm install
```

## Send Wrapped SOL to your EVM Wallet

1. Go to [[Chainlist](https://devnet.neonpass.live/)](https://devnet.neonpass.live/) .
2. Connect your EVM wallet and Solana wallets
3. Send SOL to your EVM wallet 

If you need test tokens:
* SOL: https://faucet.solana.com/
* NEON: https://neonfaucet.org/

## Set up .env file

Create a .env file in the root project folder and add these lines -

```sh
PRIVATE_KEY_OWNER=<1ST_PRIVATE_KEY>
PRIVATE_KEY_SOLANA=<SOLANA_PRIVATE_KEY>
```

## Run the Deploy script

`npx hardhat test test/MemeLaunchpad/MemeLaunchpad.js --network neondevnet`


## Results

* MemeLaunchpad Deployed Contract

[0x10cb57e84609815302F035caC867540cF5185583](https://devnet.neonscan.org/address/0x10cb57e84609815302f035cac867540cf5185583)

* Create Token Sale Tx

[0xf967b9ae7e369e7c90d7d92d8873d16e14604d355e504b9c98dd5256aa487928](https://devnet.neonscan.org/tx/0xf967b9ae7e369e7c90d7d92d8873d16e14604d355e504b9c98dd5256aa487928)


* Funding goal being reached for a token sale _( Raydium pool creation; Locking of initial LP )_ - 

[0x8918392c0b15a4ce2a75ae3caa35c7578397d6af5021da0a4ae6163e1e305b63](https://devnet.neonscan.org/tx/0x8918392c0b15a4ce2a75ae3caa35c7578397d6af5021da0a4ae6163e1e305b63)

* Collecting fees generated from Raydium's pool activity - 
[0x6f646382b0f61e3c211026a28768dcff96705d1759e1f34f53edac69d6e310e5](https://devnet.neonscan.org/tx/0x6f646382b0f61e3c211026a28768dcff96705d1759e1f34f53edac69d6e310e5)

### Run the POC
* ```npx hardhat test test/MemeLaunchpad/MemeLaunchpad.js --network neondevnet```