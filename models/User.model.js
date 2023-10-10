const mongoose=require('mongoose')
const Schema=mongoose.Schema

const RegisterSchema=new Schema({
    Username:{
       type:String,
       required:true
    },

    Email:{ 
       type:String,
       required:true
    },

    Password:{
        type:String,
        required:true
    },
       
})
const Register= mongoose.model('User',RegisterSchema);

module.exports=Register;