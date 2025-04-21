require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createHelia } = require('helia');
const { unixfs } = require('@helia/unixfs');
const { CID } = require('multiformats/cid');
const { hybridEncrypt } = require('./encryption/secure_encryptor');

const app = express();
const { verifyJWT, loginWithPiToken } = require('./auth/auth_middleware');
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Simulated public key (would be submitted by user in real scenario)
const publicKeyPem = fs.readFileSync('./keys/public.pem', 'utf8');

async function initializeHelia() {
  const helia = await createHelia();
  const fsys = unixfs(helia);
  return { helia, fsys };
}



// Login with Pi token and get JWT
app.post('/login', loginWithPiToken);

app.post('/upload', verifyJWT, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { encryptedFilePath, encryptedAESKey, iv } = await hybridEncrypt(file.path, publicKeyPem);

    const { helia, fsys } = await initializeHelia();
    const encryptedData = fs.readFileSync(encryptedFilePath);
    const cid = await fsys.addBytes(encryptedData);

    fs.unlinkSync(file.path); // Clean original
    fs.unlinkSync(encryptedFilePath); // Clean encrypted version

    res.json({
      cid: cid.toString(),
      aes_iv: iv,
      encrypted_key: encryptedAESKey
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
