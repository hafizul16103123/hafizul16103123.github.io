const Product=require('../models/product')
const formidable=require('formidable')
const _=require('lodash')
const fs=require('fs')
const product = require('../models/product')
const { exec } = require('child_process')

exports.create=(req,res)=>{
   let form=new formidable.IncomingForm()
   form.keepExtensions=true
   form.parse(req,(err,fields,files)=>{
       if(err){
            return res.status(400).json({
                err:"Image could not be uploaded"
            })
       }
       //check all fields 
       const {name,description,price,category, shipping}=fields
       if(!name||!description||!price||!category||! shipping){
        return res.status(400).json({
            err:"All field is required"
        })
       }

       let product=new Product(fields)
       if(files.photo){
           //1kb = 1000
           //1mb = 1000000
           if(files.photo.size>1000000){
            return res.status(400).json({
                err:"Image should be 1 md or less "
            })
           }
           product.photo.data=fs.readFileSync(files.photo.path)
           product.photo.contentType=files.photo.type
       }
       product.save((err,data)=>{

        if(err){
           return res.status(400).json({
                err:"Product did not create"
            })
        }

        res.json(data)

       })
   }) 
}
exports.productById=(req,res,next,id)=>{
    product.findById(id).exec((err,product)=>{
        if(err ||!product){
            return res.status(400).json({
                err:"Product not found"
            })
        }
        req.product=product
        next()
    })

}
exports.read=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product)

}
exports.remove=(req,res)=>{
    let product=req.product
        product.remove((err,deletedProduct)=>{
            if(err){
                return res.status(400).json({
                    err:"Product did not delete"
                })
            }
            res.json({
                "message":"Product Deleted Successfully"
            })
        })

}

exports.update=(req,res)=>{
    let form=new formidable.IncomingForm()
    form.keepExtensions=true
    form.parse(req,(err,fields,files)=>{
        if(err){
             return res.status(400).json({
                 err:"Image could not be uploaded"
             })
        }
        //check all fields 
        const {name,description,price,category, shipping}=fields
        if(!name||!description||!price||!category||! shipping){
         return res.status(400).json({
             err:"All field is required"
         })
        }

 //product is available in req by middleware
        let product=req.product
        //lodash provide extend method to update data
        product=_.extend(product,fields)

        if(files.photo){
            //1kb = 1000
            //1mb = 1000000
            if(files.photo.size>1000000){
             return res.status(400).json({
                 err:"Image should be 1 md or less "
             })
            }
            product.photo.data=fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }
        product.save((err,data)=>{
 
         if(err){
            return res.status(400).json({
                 err:"Product did not create"
             })
         }
 
         res.json(data)
 
        })
    }) 
 }


 /*
 *api/products?sortBy=sold&order=desc&limit=5
 *api/products?sortBy=createdAt&order=desc&limit=5
 *
 */
 exports.list=(req,res)=>{
    let order=req.query.order ? req.query.order:"desc";
    let sortBy=req.query.sortBy ? req.query.sortBy:"_id";
    let limit=req.query.limit ? parseInt(req.query.limit):5;

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err,data)=>{
            if(err){
                return res.status(400).json({
                    err:"Product did not create"
                }) 
            }
            res.json(data);
        })
 }
/**
 * find products based on req product category
 * other products that has the same category will be returned
 *  */
 exports.listRelated=(req,res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit):5;
    Product.find({_id:{$ne:req.product},category:req.product.category})
        .limit(limit)
        .populate('category','_id name')
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    err:"Products not found"
                }) 
            }
            res.json(products)
        })

 }
 exports.categories=(err,res)=>{
    Product.distinct('category',{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                err:"categories not found"
            }) 
        }
        res.json(categories)
    })
       
}
 exports.listBySearch=(req,res)=>{
 
    let order=req.query.order ? req.query.order:"desc";
    let sortBy=req.query.sortBy ? req.query.sortBy:"_id";
    let limit=req.query.limit ? parseInt(req.query.limit):5;
    let skip=parseInt(req.body.skip)
    let findArg={}

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key==='price'){
                findArg[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }
            else{
                findArg[key]=req.body.filters[key]
            }
        }
    }

Product.find(findArg)
    .select('-photo')
    .populate('category')
    .sort([[sortBy , order]])
    .skip(skip)
    .limit(limit)
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({
                err:"Product not found"
            }) 
        }
        res.json({
            size:data.length,
            data
        })
    })
      
}
exports.photo=( req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()

}