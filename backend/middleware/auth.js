const jwt=require('jsonwebtoken');
require("dotenv").config();

function authenticate(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.redirect("/login");
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        console.log("jwt error",err);
        res.redirect("/login");
    }
}
module.exports = authenticate;