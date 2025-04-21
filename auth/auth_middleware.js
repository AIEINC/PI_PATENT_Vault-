const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'secure_patent_jwt_key';
const JWT_EXPIRY = '2h';

// Middleware to verify JWT in protected routes
function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// Issue new token
function issueJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Refresh token
function refreshToken(req, res) {
  const oldToken = req.headers.authorization?.split(' ')[1];
  if (!oldToken) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true });
    const newToken = issueJWT({ user: decoded.user });
    res.json({ token: newToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Mock Pi verification — replace with real API call
async function validatePiToken(piToken) {
  return piToken && piToken.length > 10;
}

// Auth login route logic
async function loginWithPiToken(req, res) {
  const { piToken } = req.body;
  if (!piToken) return res.status(400).json({ error: 'Missing Pi token' });

  try {
    const isValid = await validatePiToken(piToken);
    if (!isValid) return res.status(401).json({ error: 'Invalid Pi token' });

    const payload = { user: 'pi-user' };
    const token = issueJWT(payload);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  verifyJWT,
  loginWithPiToken,
  refreshToken
};
