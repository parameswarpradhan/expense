const mongoose=require('mongoose');


const userschema=mongoose.Schema(
    {
        username:String,
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:String,
        balance:Number

    }
);
module.exports= mongoose.model("user",userschema);