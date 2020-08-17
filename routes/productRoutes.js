const express = require('express')
const router = express.Router()
const {requiredSignin,isAuth,isAdmin}=require('../controllers/authController')

const {userById}=require('../controllers/userController')

const {create,read,remove,update,list,listRelated,categories,listBySearch,photo,productById}=require('../controllers/productController')

//routes
router.get('/product/:productid',read)
router.post('/product/create/:userid',requiredSignin,isAuth,isAdmin,create)
router.delete('/product/:productid/:userid',requiredSignin,isAuth,isAdmin,remove)
router.put('/product/:productid/:userid',requiredSignin,isAuth,isAdmin,update)
router.get('/products',list)
router.get('/products/related/:productid',listRelated)
router.get('/products/categories',categories)
router.post('/products/by/search',listBySearch)
router.get('/product/photo/:productid',photo)


//routes middleware
router.param('userid',userById);
router.param('productid',productById);

module.exports=router