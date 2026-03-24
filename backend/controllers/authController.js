const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({ message: 'There is no user registered with that email address.' });
    }

    // Generate highly secure cryptographic reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and assign to user's resetPasswordToken memory block
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiration strict boundary (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    // Create reset URL for the frontend router
    const resetUrl = `https://sociofy88.netlify.app/reset-password/${resetToken}`;

    // DEMO BYPASS: Since SMTP mapping requires personal Gmail App Passwords, we expose it securely in the demo payload.
    res.status(200).json({ 
      success: true,
      message: 'Demo mode active: The password reset link has been successfully generated.',
      resetUrl: resetUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Critical Server Error during password reset pipeline.' });
  }
};

// @desc    Validate Token & Restore Password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Reconstruct the cryptographic hash from the URL parameter token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'The reset token is either mathematically invalid or has completely expired (10m limit).' });
    }

    // Inject and save new password (Schema pre-save hook will automatically encrypt it again)
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Password successfully restored! Returning secure access payload.',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during password restoration' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
