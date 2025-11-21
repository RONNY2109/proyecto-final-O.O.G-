const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
name:{
type:String,
required:true
},
price:{
type:Number,
required:true
},
image:{
type:String,
default:''
},
description:{
type:String,
default:'' // Campo nuevo: Texto vacío por defecto
}
});

productSchema.set('toJSON',{
transform:(document,returnedObject)=>{
returnedObject.id=returnedObject._id.toString();
delete returnedObject._id;
delete returnedObject.__v;
}
});

module.exports=mongoose.model('Product',productSchema);