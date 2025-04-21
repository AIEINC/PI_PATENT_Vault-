# Pi Patent Vault – Backend v2

## Features
- Encrypted file upload (AES-256 + RSA per user)
- IPFS decentralized file + metadata storage
- Real database (SQLite) for users, CIDs, tokens
- JWT authentication with refresh token
- Smart contract deployer + NFT/FT mint engine (via Hardhat)
- Metadata uploader to IPFS
- Rate limiting
- Admin CSV + PDF exports
- Docker + Docker Compose support

## API

### Auth
- `POST /login` → `{ piToken }` → `{ token }`
- `POST /refresh-token` → `Authorization: Bearer <old token>` → `{ new token }`

### Upload
- `POST /upload` (JWT required, file encrypted + CID returned)

### Metadata
- `POST /metadata` → `{ json }` → `{ metadataCID }`

### Admin
- `GET /admin/export/csv`
- `GET /admin/export/pdf`

### Deploy
- `POST /deploy` → Returns contract addresses (admin only)

## Dev
```bash
cd pi-backend-main
npm install
npx hardhat compile
node server.js
```

## Docker
```bash
docker-compose up --build
```
