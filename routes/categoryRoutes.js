const express = require('express')
const router = express.Router()
const {requiredSignin,isAuth,isAdmin}=require('../controllers/authController')
const {userById}=require('../controllers/userController')
const {create,read,update,remove,list,categoryById}=require('../controllers/categoryController')

//category controller
router.post('/category/create/:userid',requiredSignin,isAuth,isAdmin,create)
router.get('/category/:categoryid/:userid',requiredSignin,isAuth,isAdmin,read)
router.put('/category/:categoryid/:userid',requiredSignin,isAuth,isAdmin,update)
router.delete('/category/:categoryid/:userid',requiredSignin,isAuth,isAdmin,remove)
router.get('/categories',list)

//route middleware
router.param('userid',userById);
router.param('categoryid',categoryById);

module.exports=router