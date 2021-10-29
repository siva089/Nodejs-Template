const crypto=require("crypto")
const mongoose = require("mongoose")
const Validator=require("validator")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true,'please tell us your name'] },
    email: {
        type: String, required: [true, 'please provide email'], unique: true, lowercase: true,validate:[Validator.isEmail,'please provide a valid email']
    },
    photo: { type: String },
    password: { type: String, required: [true,'please provide a password'],min:8,max:20,select:false },
    passwordConfirm: {
        type: String, required: true, validate: {
            validator: function (el) {
                return el===this.password
        }
        }
    },
    passwordChangedAt: { type: Date },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default:'user'
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    active:{type:Boolean,default:true,select:false}
})

userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: {$ne:false} })
    next()
})

userSchema.methods.correctPassword =async function (candidatePassword,userpassword) {
return await bcrypt.compare(candidatePassword,userpassword)
}

userSchema.methods.changepasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changeTimeStamp =parseInt(this.passwordChangedAt.getTime() / 1000,10);

        return (changeTimeStamp>JWTTimestamp)
   }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
    }

module.exports = mongoose.model('User', userSchema)