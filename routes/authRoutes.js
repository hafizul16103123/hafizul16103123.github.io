const express = require('express')
const router = express.Router()

//Array distructureing other wise will show object error
const {userSignupValidator} = require('../validators')
const {signup,signin,signout}=require('../controllers/authController')

//auth routes
router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);


module.exports=router