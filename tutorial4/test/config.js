module.exports = {
    neon_faucet: {
        curvestand: {
            url: "https://curve-stand.neontest.xyz/request_neon",
            min_balance: "10000",
        },
        neondevnet: {
            url: "https://api.neonfaucet.org/request_neon",
            min_balance: "100",
        },
        neonmainnet: {
            url: "",
            min_balance: "0",
        },
    },
    evm_sol_node: {
        curvestand: "https://curve-stand.neontest.xyz/SOL",
        neondevnet: "https://devnet.neonevm.org/SOL",
        neonmainnet: "https://neonevm.org/SOL",
    },
    svm_node: {
        curvestand: "https://curve-stand.neontest.xyz/solana",
        neondevnet: "https://api.devnet.solana.com",
        neonmainnet: "https://api.mainnet-beta.solana.com",
    },
    composability: {
        CallSystemProgram: {
            curvestand: "",
            neondevnet: "0x801C0B35C6A00a42b04321096EF12B2461CdBbBd",
            neonmainnet: "",
        },
        MockCallSystemProgram: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        CallSPLTokenProgram: {
            curvestand: "",
            neondevnet: "0x2413A1ABE521EeF1Fb31dAac2ff40234d512e337",
            neonmainnet: "",
        },
        CallMetaplexProgram: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        CallAssociatedTokenProgram: {
            curvestand: "",
            neondevnet: "0x69Db081873b9809d64942915653Af1A1F962EC2c",
            neonmainnet: "",
        },
        CallRaydiumProgram: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        tokenMintSeed: {
            curvestand: "myTokenMintSeed",
            neondevnet: "myTokenMintSeed",
            neonmainnet: "myTokenMintSeed",
        },
        tokenMintDecimals: {
            curvestand: 9,
            neondevnet: 9,
            neonmainnet: 9,
        },
        tokenMetadata: {
            curvestand: {
                tokenName: "Test token",
                tokenSymbol: "TEST_0",
                uri: "https://my-test-token.fi/logo.png"
            },
            neondevnet: {
                tokenName: "Test token",
                tokenSymbol: "TEST_0",
                uri: "https://my-test-token.fi/logo.png"
            },
            neonmainnet: {
                tokenName: "Test token",
                tokenSymbol: "TEST_0",
                uri: "https://my-test-token.fi/logo.png"
            },
        }
    },
    token: {
        ERC20ForSplFactory: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        ERC20ForSpl: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        ERC20ForSplTokenMint: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        },
        MockVault: {
            curvestand: "",
            neondevnet: "",
            neonmainnet: "",
        }
    }
}

