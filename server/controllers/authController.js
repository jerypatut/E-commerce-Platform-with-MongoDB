const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require('../utils');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // First registered user becomes admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
    });

    const origin = 'http://localhost:3000';

    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Success! Please check your email to verify your account.',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verificationToken !== verificationToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Verification failed',
      });
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';

    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Verification process failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Please verify your email',
      });
    }

    const tokenUser = createTokenUser(user);
    let refreshToken = '';

    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
      if (!existingToken.isValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
      refreshToken = existingToken.refreshToken;
    } else {
      refreshToken = crypto.randomBytes(40).toString('hex');
      await Token.create({
        refreshToken,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        user: user._id,
      });
    }

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      user: tokenUser,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    await Token.findOneAndDelete({ user: req.user.userId });

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const passwordToken = crypto.randomBytes(70).toString('hex');
      const origin = 'http://localhost:3000';

      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });

      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 10);
      await user.save();
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Please check your email for the reset password link',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Forgot password process failed',
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required values',
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const currentDate = new Date();

      if (
        user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Password reset failed',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
