# POC - MemeLaunchpad with composability requests to Solana

The following POC aims to validate that it's possible to build MemeLaunchpad project that deploys pool in a chosen DEX on Solana. Pool is being created when the funding goal for each token sale has been reached, then the initial supply of LP gets locked. The requesting from Neon EVM to Solana is possible through a composability feature that Neon EVM supports and more specifically Solidity requests to a custom precompile `0xFF00000000000000000000000000000000000006`. More details about the feature [here](https://neonevm.org/docs/composability/common_solana_terminology). Data about the POC:

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