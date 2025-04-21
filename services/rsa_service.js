const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  });

  return {
    publicKey,
    privateKey
  };
}

// Save or return keypair to simulate user generation
function provisionUserKeys(userId, saveDir = './userkeys') {
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);
  const pubPath = path.join(saveDir, `${userId}_pub.pem`);
  const privPath = path.join(saveDir, `${userId}_priv.pem`);

  if (fs.existsSync(pubPath) && fs.existsSync(privPath)) {
    return {
      publicKey: fs.readFileSync(pubPath, 'utf8'),
      privateKey: fs.readFileSync(privPath, 'utf8')
    };
  }

  const { publicKey, privateKey } = generateRSAKeyPair();
  fs.writeFileSync(pubPath, publicKey);
  fs.writeFileSync(privPath, privateKey);

  return { publicKey, privateKey };
}

module.exports = {
  provisionUserKeys
};
