const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//Create Product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res)=>{

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
});

//update product -- admin
exports.updateProducts = catchAsyncErrors(async (req, res)=>{
    
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });


    res.status(200).json({
        success: true,
        product
    })
});

//delete product -- admin

exports.deleteProducts = catchAsyncErrors(async (req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message: "Product Deleted Successfully"
    })
});

//get single product details

exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});