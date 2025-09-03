// Middlewares/authMiddleWare.js
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

const getTokenFromReq = (req) => {
  // 1) Authorization header: Bearer <token>
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  // 2) Cookie (optional)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  // 3) Query (not recommended for production, but handy for testing)
  if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authorized: token missing' });
    }

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // differentiate expired vs invalid if you want:
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized: token expired' });
      }
      return res.status(401).json({ message: 'Not authorized: token invalid' });
    }

    // attach user (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized: user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('protect middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // ensure protect ran earlier
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized: missing user (call protect first)' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };
