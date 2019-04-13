const mongoose = require('mongoose')
const {User,Product} = require("../models/db");
const productSchema = new mongoose.Schema(
	{
        productName :{
            type:String,
            required:true,
            index :{unique:true}

        },
        priceAfter:{
            type:Number,

        },
        priceBefore:{
            type:Number,
        

        },
        productCategory:{
            type:String,
            required:true,
        },
        productDescription:{
            type:String,
            required:true
        },
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User" 
        }, 
    } 

    
    );
    
  productSchema.pre('remove', async function(next) {
        try {
            let user = await User.findById(this.user);
            user.products.remove(this.id);
            await user.save();
            return next();
        } catch (err) {
            return next(err);
        } 
    });

 module.exports = mongoose.model('Product', productSchema); 