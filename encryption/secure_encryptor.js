const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// AES: 256-bit encryption for file content
function encryptFileWithAES(filePath, aesKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  const input = fs.createReadStream(filePath);
  const encryptedFilePath = filePath + '.enc';
  const output = fs.createWriteStream(encryptedFilePath);

  input.pipe(cipher).pipe(output);

  return new Promise((resolve, reject) => {
    output.on('finish', () => resolve({ encryptedFilePath, iv }));
    output.on('error', reject);
  });
}

// RSA: Encrypt AES key using public key
function encryptAESKeyWithRSA(aesKey, publicKeyPem) {
  return crypto.publicEncrypt(publicKeyPem, aesKey);
}

// Utility: Generate new RSA keypair
function generateRSAKeyPair(keyPath = './keys') {
  if (!fs.existsSync(keyPath)) fs.mkdirSync(keyPath);
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  });
  fs.writeFileSync(path.join(keyPath, 'public.pem'), publicKey);
  fs.writeFileSync(path.join(keyPath, 'private.pem'), privateKey);
  return { publicKey, privateKey };
}

// Exported encryption pipeline
async function hybridEncrypt(filePath, userPublicKeyPem) {
  const aesKey = crypto.randomBytes(32); // 256-bit AES key
  const { encryptedFilePath, iv } = await encryptFileWithAES(filePath, aesKey);
  const encryptedAESKey = encryptAESKeyWithRSA(aesKey, userPublicKeyPem);
  return {
    encryptedFilePath,
    encryptedAESKey: encryptedAESKey.toString('base64'),
    iv: iv.toString('base64')
  };
}

module.exports = {
  hybridEncrypt,
  generateRSAKeyPair
};
