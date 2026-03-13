const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh
} = require('../utils/jwt');

// UNIVERSAL COOKIE CONFIGURATION
// Localhost needs 'lax'. Render + Vercel needs 'none' + secure.
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax', 
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
};


// CONTROLLERS
const register = async (req, res) => {
  console.log('REGISTER BODY:', req.body);
  
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // password hashing is done in User model pre-save hook
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    const payload = { id: user._id, role: user.role, email: user.email };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return res.status(201).json({
      message: 'Node established successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
    
  } catch (err){
    console.error('Register Error ->', err);

    if (err.name == 'ValidationError'){
      //Extracts the specific Mongoose schema validation failure
      const messages = Object.values(err.erros).map(val => val.message);
      return res.status(400).json({ message: messages.join(',') });
    }

    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
};

const loginBasic = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please provide both email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (err) {
    console.error('Basic Login Error ->', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role, email: user.email };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    // Attach the secure cookie configuration here
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });

  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: 'No refresh token provided' });

    const decoded = verifyRefresh(token);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const payload = { id: user._id, role: user.role, email: user.email };
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    // Attach the secure cookie configuration here
    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = verifyRefresh(token);
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch (err) {
        console.warn('Logout Token Clear Error:', err.message);
      }
    }

    // pass the exact same options to successfully destroy a strict/secure cookie
    res.clearCookie('refreshToken', getCookieOptions());
    return res.json({ message: 'Logged out successfully' });

  } catch (err) {
    res.clearCookie('refreshToken', getCookieOptions());
    res.json({ message: 'Logged out' });
  }
};

const getMe = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (err) {
    console.error('getMe Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  loginBasic, 
  refresh,
  logout,
  getMe
};