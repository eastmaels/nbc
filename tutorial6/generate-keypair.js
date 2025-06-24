const web3 = require("@solana/web3.js");
const bs58 = require("bs58");

console.log('Generating new Solana keypair...\n');

// Generate a new keypair
const keypair = web3.Keypair.generate();

console.log('Public Key:', keypair.publicKey.toBase58());
console.log('\nPrivate Key (Base58 format):');
console.log(bs58.default.encode(keypair.secretKey));

console.log('\nPrivate Key (Hex format):');
console.log('0x' + Buffer.from(keypair.secretKey).toString('hex'));

console.log('\nTo use this keypair:');
console.log('1. Add the private key to your .env file:');
console.log('   PRIVATE_KEY_SOLANA=' + bs58.default.encode(keypair.secretKey));
console.log('\n2. Fund the account with some SOL for testing:');
console.log('   solana airdrop 1 ' + keypair.publicKey.toBase58() + ' --url devnet');
console.log('\n3. Run your script:');
console.log('   node token-transfer-solana-signer-sdk.js');

console.log('\n⚠️  WARNING: This is a new keypair with no funds. You will need to:');
console.log('   - Add SOL to the account for transaction fees');
console.log('   - Add USDC to the associated token account for transfers');
console.log('   - Never use this private key in production without proper security measures'); 