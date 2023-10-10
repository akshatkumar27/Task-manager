const mongoose=require('mongoose')
const Schema=mongoose.Schema

const Task=new Schema({
  description: {type : String , required : true},
  completed : {type : Boolean , default : false},
  owner :{
      type : mongoose.Schema.Types.ObjectId,
      required: true,
      ref : 'User'
  }
}
,{
    timestamps : true
}
  
)
const Taskstate= mongoose.model('task',Task)
module.exports=Taskstate;