const fs = require('fs');
const { createHelia } = require('helia');
const { unixfs } = require('@helia/unixfs');

async function uploadMetadata(req, res) {
  try {
    const metadata = req.body;
    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({ error: 'Invalid metadata format' });
    }

    const tempPath = './tmp_metadata.json';
    fs.writeFileSync(tempPath, JSON.stringify(metadata, null, 2));

    const helia = await createHelia();
    const fsys = unixfs(helia);
    const data = fs.readFileSync(tempPath);
    const cid = await fsys.addBytes(data);
    fs.unlinkSync(tempPath);

    res.json({ metadataCID: cid.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadMetadata };
