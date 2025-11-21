const {log}=require('console');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require("nodemailer");
const User=require("../models/user");
const {PAGE_URL}=require("../config");
const productRouter=require('express').Router();
const Product=require('../models/product');

productRouter.get('/',async(request,response)=>{
const products=await Product.find({});
response.json(products);
});

productRouter.get('/:id',async(request,response)=>{
const product=await Product.findById(request.params.id);
if(product){
response.json(product);
}else{
response.status(404).end();
}
});

productRouter.post('/',async(request,response)=>{
const body=request.body;
if(!body.name||!body.price){
return response.status(400).json({error:'Falta el nombre o el precio'});
}

const product=new Product({
name:body.name,
price:Number(body.price),
image:body.image||'',
description:body.description||'' // NUEVO: Agregado el campo descripción
});

try{
const savedProduct=await product.save();
response.status(201).json(savedProduct);
}catch(error){
console.error(error);
response.status(500).json({error:'Error al guardar el producto'});
}
});

productRouter.put('/:id',async(request,response)=>{
const body=request.body;

const product={
name:body.name,
price:Number(body.price),
image:body.image,
description:body.description // NUEVO: Agregado el campo descripción
};

try{
const updatedProduct=await Product.findByIdAndUpdate(request.params.id,product,{new:true});
response.json(updatedProduct);
}catch(error){
console.error(error);
response.status(400).json({error:'Error al actualizar'});
}
});

productRouter.delete('/:id',async(request,response)=>{
try{
await Product.findByIdAndDelete(request.params.id);
response.status(204).end();
}catch(error){
console.error(error);
response.status(400).json({error:'Error al eliminar'});
}
});

module.exports=productRouter;