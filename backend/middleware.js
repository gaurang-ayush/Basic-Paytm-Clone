const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        console.log("no token provided or incorrext format");
        return res.status(403).json({});
    }

    const token = authHeader && authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        console.log("Decoded Token:", decoded); 
        req.userID = decoded.userID;
        next();
    } catch(err){
        return res.status(403).json({});
    }
};

module.exports = { authMiddleware }