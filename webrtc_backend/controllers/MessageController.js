let messageModel = require('../model/MessageModel');
const saveMessage=async (req,res,next)=>{
   try{
   const messageField = new messageModel({
       senderId:req.body.senderId,
       receiverId:req.body.receiverId,
       message:req.body.message
   });
   var newMessageSaved = await messageField.save();
   res.statusCode=200;
   res.json({message:newMessageSaved, status:true});
   }
   catch(error)
   {
    res.statusCode = 500;
    res.json({ error: error})
   }

};

const getMessages = async(req,res,next) =>{
   try{
     let messages = await messageModel.find({$or:[
         {senderId:req.body.senderId ,receiverId:req.body.receiverId},
         {senderId:req.body.receiverId,receiverId:req.body.senderId}
     ]});
     res.statusCode=200;
     res.json({status:true,messages:messages});
   }catch(error)
   {
    res.statusCode=500;
    res.json({status:false});
   }
}

module.exports = {
    saveMessage,
    getMessages
}