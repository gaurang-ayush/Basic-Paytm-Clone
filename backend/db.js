const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://2229032:8shqRfSc8CAhJHgl@cluster0.xdw0omb.mongodb.net/paytm");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength:3,
        maxLength:30
    },
    password: {
        type:String,
        required:true,
        minLength:8
    },
    firstName: {
        type:String,
        required:true,
        maxLength:50
    },
    lastName: {
        type:String,
        required:true,
        maxLength:50
    },
})

const accountSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },balance:{
        type:Number,
        required:true
    }
});

const Account = mongoose.model('Account',accountSchema);
const User = mongoose.model("User",userSchema);

module.exports = {User,Account}