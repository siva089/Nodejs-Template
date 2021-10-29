const express = require("express")
const { getAllUsers, createUser, getMe, deleteUser, updateUser, updateMe,deleteMe } = require("../controllers/userController")
const {signup,login,forgotPassword,resetPassword, updatePassword,protect}=require("../controllers/authController")

const   router = express.Router()

router.post(`/signup`, signup)
router.post(`/login`, login)
router.post(`/forgotpassword`, forgotPassword)
router.patch(`/resetpassword/:resettoken`, resetPassword)
router.patch(`/updateMyPassword`,protect,updatePassword)
router.patch(`/updateMe`, protect, updateMe)
router.delete(`/deleteMe`,protect,deleteMe)

router.route(`/`).get(protect, getAllUsers).post(protect,createUser)
router.route(`/:id`).get(protect, getMe).patch(protect, updateUser).delete(protect,deleteUser)

module.exports=router