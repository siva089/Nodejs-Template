const User = require("../models/User")

const filterObj = (obj, ...allowedFields) => {
    try {
        const newObj={}
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el)) {
               newObj[el]=obj[el]
           }
        })
        return newObj
    } catch (error) {
        console.error(error)
        return {}
    
    }
}

exports.getMe = async(req,res,next) => {
    try {
        const updateUser = await User.findById(req.user._id)

        res.json({ success: true, user: updateUser })
    } catch (error) {
        res.json({ success: false, message: error })
        console.error(error)
    }
}




const updateMe = async(req,res,next) => {
    try {
        if (req.body.password || req.body.passwordConfirm) {
            throw new Error('This route is not for password updates. Please use update password')}
        const filterBody = filterObj(req.body, 'name', 'email')
        const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, { new: true, runValidators: true })
      
        res.json({ success: true,user:updateUser })
    } catch (error) {
        res.json({success:false,message:error})
        console.error(error)
    }
}

exports.updateMe=updateMe

exports.deleteMe =async(req, res, next) => {
 try {
     await User.findOneAndUpdate(req.user.id, { active: false })
     res.json({success:true})
 } catch (error) {
     console.error(error)
     res.json({ success: false })
 }   
}


















exports.getAllUsers = (req, res) => {
    res.status(500).json({ status: 'error' })
}

exports.createUser = (req, res) => {
    res.status(500).json({ status: 'error' })
}


exports.getUser = (req, res) => {
    res.status(500).json({ status: 'error' })
}

exports.updateUser = (req, res) => {
    res.status(500).json({ status: 'error' })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({ status: 'error' })
}
