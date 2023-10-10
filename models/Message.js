const mongoose=require('mongoose')
const Schema=mongoose.Schema


const Message=new Schema({
    to: {type : String , required : true}, 
    from: {type : String , required : true}, 
    messages: [
        { 
          text: {
            type: String,
          },
          writtenBy: {
            type: String,
            required: true
          },
          
         
        }
      ],
  }
  ,{
      timestamps : true
  }
    
  )
  const Taskstate= mongoose.model('message',Message)
  module.exports=Taskstate;