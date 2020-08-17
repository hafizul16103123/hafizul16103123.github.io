const mongoose=require('mongoose')

//for creating hashed password 
const crypto=require('crypto')

//define user schema
const userSchema=new mongoose.Schema({
     
        name:{
            type:String,
            trim:true,
            required:true,
            maxLength:32
        },
        email:{
            type:String,
            trim:true,
            required:true,
            unique:32
        },
        //hashed password will be created by userSchema virtual box
        hashed_password:{
            type:String,
            required:true
        },
        about:{
            type:String,
            trim:true
        
        },
        //provide long string to generate hashed password
        salt:String,
        role:{
            type:Number, 
            default:0
        },
        history:{
            type:Array,
            default:[]
        }
    },
    {timestamps:true}
);

// add virtual field Schema
userSchema.virtual('password')
    .set(function(password){
        this._password=password
        this.salt=genRandomString(16)
        this.hashed_password=this.encryptPassword(password)
    })
    .get( function(){
        return this._password;
    });

 //add methods to userSchema   
userSchema.methods={

    authenticate:function(password){
        return this.encryptPassword(password)===this.hashed_password;
    },
    
    encryptPassword:function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt)
                            .update(password)
                            .digest("hex");
        }catch(err){
            return "";
        }
    }
   
}; 

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
};

module.exports = mongoose.model("User",userSchema);