const Category=require('../models/category')
const { isBuffer } = require('lodash')

exports.create=(req,res)=>{
    const category=new Category(req.body)
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                err
            })
        }
        res.json({data})
    })
}
exports.categoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err ||!category){
            return res.status(400).json({
                err:"Category not found"
            })
        }
        req.category=category
        next()
    })

}
exports.read=(req,res)=>{
    res.json(req.category)
 
}
exports.update=(req,res)=>{
    const category=req.category
    category.name=req.body.name
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"Category did not update"
            })
        }
        res.json(data)
    })
}
exports.remove=(req,res)=>{
    const category=req.category
    category.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"Category did not remove"
            })
        }
        res.json({
            message:"Category deleted"
        })
    })
}

exports.list=(req,res)=>{
    Category.find((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"Categories did not Find"
            })
        }
        res.json(data)
    })
}
