const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ====================== JWT GENERATION ======================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ====================== REGISTER USER ======================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== LOGIN USER ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== FORGOT PASSWORD ======================
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;

    res.status(200).json({
      success: true,
      resetUrl,
      message: 'Password reset token generated (send via email in production)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== RESET PASSWORD ======================
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== MIDDLEWARE ======================

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from DB
    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    req.user = user; // Attach full user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
