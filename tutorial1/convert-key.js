const fs = require('fs');
const bs58 = require('bs58');

// Read the keypair file
const keypairData = JSON.parse(fs.readFileSync(process.env.HOME + '/.config/solana/id.json', 'utf8'));

// Convert to Uint8Array
const secretKey = new Uint8Array(keypairData);

// Convert to base58
const base58Key = bs58.default.encode(secretKey);

console.log('Your base58 private key:');
console.log(base58Key); 