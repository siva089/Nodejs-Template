const JWT = require("jsonwebtoken")
const Crypto = require("crypto")
const {promisify}=require('util')
const User = require("../models/User")
const SendEmail = require("../utils/email")

const createJWTToken = (id) => (JWT.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }))


exports.signup = async(req, res)=> {
    try {
        const newUser = await User.create(req.body)
        const token = createJWTToken(newUser._id)
        res.cookie('jwt', token, {
            expires: new Date(Date.now()) + process.env.JWT_COKKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
            // secure: true,
            httpOnly:true
        })
        res.status(201).json({
           success:true,
            data: {
                token:token,
                user:newUser
            }
        })
    } catch (error) {
        console.error(error)
    res.status(500).json({success:false})
    }
  
}


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body
        console.log(email,password)
        if (!email || !password) throw new Error('ep_required')
        const user = await User.findOne({ email: email }).select('+password')
        if (!user) throw new Error('user_not_found')
        const correct = await user.correctPassword(password, user.password)
        if(!correct) throw new Error('Invalid Credentials')
        const token = createJWTToken(user._id)
        res.cookie('jwt', token, {
            expires: new Date(Date.now()) + process.env.JWT_COKKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
            // secure: true,
            httpOnly: true
        })
        res.json({success:true,token})
    } catch (error) {
let errorMessage=''
        if (error === 'ep_required') {
errorMessage='please provide password and email'
        }
        else if (error === 'user_not_found') {
            errorMessage=`Account does't exist`
        }
        else if (error === 'Invalid Credentials') {
            errorMessage =`Invalid Credentials`
        }
console.log(error)
   res.status(500).json({success:false,message:errorMessage})     
    }
}



exports.protect =async (req, res,next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token=req.headers.authorization.split(' ')[1]
        }
        if (!token) throw new Error('You are not logged in.')
      
 const decoded=await promisify(JWT.verify)(token, process.env.JWT_SECRET)
  
        const user = await User.findById(decoded.id)
        if (!user) throw new Error('The token belonging to the user does no longer exist')
        if (user.changepasswordAfter(decoded.iat)) {
         throw new Error('User Password Changed, Please login again')
        }
        req.user=user
        next()
    } catch (error) {
      res.json({success:false,message:'You are not logged in. Please login to continue.'})
        console.error(error)   
    }
}

exports.restrictTo = (...roles) =>  (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                throw new Error('U dont have permssion to perform this action')
            }
            next()
        } catch (error) {
         res.json({success:false,message:error})   
        }
      
        
    }
   

exports.forgotPassword = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(!user)throw new Error('User doest exist')
        const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        const message=`Forgot ur password submit a  patch request with your password and password confirm to ${resetUrl}`
        try {
            await SendEmail({ email: user.email, subject: 'your password reset token', message })
        }
        catch (e) {
            console.log(e)
            user.passwordResettoken = undefined;
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            return res.json({ success: false, message: 'Error Sending email' })
        }

        res.json({ success: true,message:'Token sent to email'})
  } catch (error) {
      console.error(error)
      res.json({success:false,message:error})
  }      
}

exports.resetPassword = async(req, res, next) => {
 //Get User based on token
    try {
        const hashedToken = Crypto.createHash('sha56').update(req.params.token).digest('hex')
        
        const user = await User.findOne({ passwordResetToken: hashedToken,passwordResetExpires:{$gt:Date.now()} })
        
        if (!user) {
        return res.json({success:false,message:"Token invalid or expired"})
        }
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save()
        const token = createJWTToken(user._id)
        res.cookie('jwt', token, {
            expires: new Date(Date.now()) + process.env.JWT_COKKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
            // secure: true,
            httpOnly: true
        })
        
        res.json({success:true,token})
    } catch (error) {
        res.json({ success: false,message:error})
        console.error(error)
    }
}

exports.updatePassword = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+password')
        if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
            throw new Error('Current password is wrong')
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;

       await user.save()
        const token = createJWTToken(user._id)
        res.cookie('jwt', token, {
            expires: new Date(Date.now()) + process.env.JWT_COKKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
            // secure: true,
            httpOnly: true
        })
        res.json({success:true,token})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:error})
    }
}