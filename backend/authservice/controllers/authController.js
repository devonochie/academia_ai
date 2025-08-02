require('dotenv').config()
const User = require('../model/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const logger = require('../../utils/logger')
const userValidators = require('../validators/auth')
const mailer = require('../../utils/mailer')
const crypto = require('crypto')
const {  welcomeEmail } = require('../../messages/welcome')
const forgetPasswordEmail = require('../../messages/forgetPassword')
const resetPasswordConfirmationEmail = require('../../messages/resetPassword')

class AuthControllers {
   async register(req, res, next) {
    try {
      const { success, error, data } = userValidators.safeParse(req.body);
      if (!success) {
        return res.status(400).json({ error: error.errors });
      }

      const { email, password, name } = req.body;

      if (await User.findOne({ email })) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ email, password: hashedPassword, name });
      await user.save();

      await mailer.sendMail(user, welcomeEmail(user));

      res.status(201).json({
        user: { email: user.email, name: user.name },
        message: 'User created successfully'
      });

    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
   }

   async login(req, res, next) {
      try {
         const { email, password } = req.body;
         const user = await User.findOne({ email });

         if (!user || !(await bcrypt.compare(password, user.password))) {
         return res.status(401).json({ error: "Invalid credentials" });
         }

         const userToken = { email: user.email, user_id: user._id };
         
         const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
         const refreshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });

         // Store refresh token
         user.refreshTokens = user.refreshTokens || [];
         user.refreshTokens.push({
         token: refreshToken,
         expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
         });
         await user.save();

         // Set cookies
         res.cookie('accessToken', accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 15 * 60 * 1000,
         sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
         });
         
         res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 2 * 24 * 60 * 60 * 1000,
         sameSite: "strict"
         });

         res.json({ 
         accessToken, 
         refreshToken, 
         user: { email: user.email, name: user.name }, 
         message: 'Login successful'  
         });

      } catch (error) {
         logger.error('Login Error:', error);
         next(error);
      }
   }

   async refreshToken(req, res, next) {
      try {
         const refreshToken = req.cookies.refreshToken;

         if (!refreshToken) {
         return res.status(403).json({ 
            error: 'No refresh token provided',
            code: 'MISSING_REFRESH_TOKEN'
         });
         }

         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
         const user = await User.findById(decoded.user_id);

         if (!user) {
         return res.status(403).json({
            error: 'Invalid refresh token',
            code: 'INVALID_USER'
         });
         }

         // Verify token exists and is not expired
         const tokenIndex = user.refreshTokens.findIndex(
         t => t.token === refreshToken && new Date(t.expiresAt) > new Date()
         );

         if (tokenIndex === -1) {
         return res.status(403).json({
            error: 'Refresh token expired or invalid',
            code: 'EXPIRED_REFRESH_TOKEN'
         });
         }

         // Generate new tokens
         const userToken = { email: user.email, user_id: user._id };
         const newAccessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
         const newRefreshToken = jwt.sign(userToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });

         // Reload user to avoid version conflict
         const freshUser = await User.findById(user._id);
         if (!freshUser) {
            return res.status(403).json({
               error: 'User not found during token rotation',
               code: 'USER_NOT_FOUND_REFRESH'
            });
         }
         freshUser.refreshTokens = freshUser.refreshTokens || [];
         freshUser.refreshTokens = freshUser.refreshTokens.filter(
            t => t.token !== refreshToken
         );
          freshUser.refreshTokens.push({
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          });
         await freshUser.save();

         // Set new cookies
          res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 15 * 60 * 1000,
          sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
          });
         
         res.cookie('refreshToken', newRefreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 2 * 24 * 60 * 60 * 1000,
         sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
         });

         res.json({
         accessToken: newAccessToken,
         expiresIn: 15 * 60,
         message: 'Token refreshed successfully'
         });

      } catch (error) {
         if (error.name === 'TokenExpiredError') {
         return res.status(403).json({
            error: 'Refresh token expired',
            code: 'REFRESH_TOKEN_EXPIRED'
         });
         }
         if (error.name === 'JsonWebTokenError') {
         return res.status(403).json({
            error: 'Invalid refresh token',
            code: 'INVALID_REFRESH_TOKEN'
         });
         }
         logger.error('Refresh token error:', error);
         next(error);
      }
   }

   async logout(req, res) {
      try {
         const cookieOptions = {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
         path: '/'
         };

         res.clearCookie('accessToken', cookieOptions);
         res.clearCookie('refreshToken', cookieOptions);

         const refreshToken = req.cookies.refreshToken;
         if (refreshToken) {
         try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.user_id);
            if (user) {
               user.refreshTokens = user.refreshTokens.filter(
               t => t.token !== refreshToken
               );
               await user.save();
            }
         } catch (err) {
            logger.debug('Token cleanup skipped:', err.message);
         }
         }

         res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
         logger.error('Logout error:', error);
         res.status(200).json({ message: 'Logged out successfully' });
      }
   }

   // forgot password - generate reset token
   async forgotPassword(req, res, next) {
      try {
         const { email } = req.body
         const user = await User.findOne({ email })
         
         if(!user) {
            return res.status(404).json({
               error: 'User mot found'
            })
         }

         //generate reset token
         const resetToken = crypto.randomBytes(20).toString('hex')
         const resetTokenExpires = new Date(Date.now() + 3600000 )

         user.resetPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex')
         
         user.resetPasswordExpires = resetTokenExpires
         await user.save()

         //send email with reset link
         const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

         await mailer.sendMail( user, forgetPasswordEmail(user, resetUrl))
         res.json({ message: 'Password reset email sent'})
      } catch (error) {
          logger.error('Forgot passwor error:', error)
          next(error)
      }
   }
   
   // Reset Password
   async resetPassword(req, res, next) {
      try {
         const { token } = req.params
         const { password } = req.body

         // Ensure token is provided
         if (!token) {
            return res.status(400).json({
               error: 'Reset token is required'
            })
         }

         // Ensure password is provided
         if (!password) {
            return res.status(400).json({
               error: 'Password is required'
            })
         }

         //hash the token to compare with the stored one
         const hashedToken = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex')

         const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
         })

         if (!user){
            return res.status(400).json({
               error: 'Token is invalid or has expired'
            })

         }

         //update password
         const salt = await bcrypt.genSalt(10)
         user.password = await bcrypt.hash(password, salt)
         user.resetPasswordExpires = undefined
         user.resetPasswordToken = undefined
         await user.save()

         //send confirmation email
         await mailer.sendMail(
            user,
           resetPasswordConfirmationEmail(user, process.env.FRONTENDLOGINURL)
         );

         res.json({
            message: 'Password updated successfully'
         })
      } catch (error) {
         logger.error('Reset Password Error:', error)
         next(error)
      }
   }


   // Get current user
   async me(req, res) {
      res.json(req.user || undefined)
   }
}

module.exports = new AuthControllers()
