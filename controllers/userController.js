const User=require('../models/user')
const { json } = require('body-parser')

exports.userById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                err:"User Not found"
            })
        }
        req.profile=user   //user with userid param
        next()

    })
}

exports.read=(req,res)=>{
    req.profile.hashed_password=undefined
    req.profile.salt=undefined
    return res.json(req.profile)

}
exports.update=(req,res)=>{
 User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true},(err,user)=>{
    if(err || !user){
        return res.status(400).json({
            err:"You are not Authorize to perform this Error"
        })
    }
    req.profile.hashed_password=undefined
    req.profile.salt=undefined
    return res.json(user)
 })

}