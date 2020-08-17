const express = require('express')
const router = express.Router()

//Array distructureing other wise will show object error
const {requiredSignin,isAuth,isAdmin}=require('../controllers/authController')

const {read,update,userById}=require('../controllers/userController')

router.get('/secret/:userid',requiredSignin,isAuth,isAdmin,(req,res)=>{
    return res.json(
        {
            user:req.profile
        }
    )
})

router.get('/user/:userid',requiredSignin,isAuth,read)
router.put('/user/:userid',requiredSignin,isAuth,update)

router.param('userid',userById);

module.exports=router