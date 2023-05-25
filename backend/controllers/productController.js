const Product = require("../models/productModels");

//Create Product -- admin
exports.createProduct = async (req, res, next) => {
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
};

//get all products
exports.getAllProducts = async (req, res)=>{

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
}

//update product -- admin
exports.updateProducts = async (req, res)=>{
    
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not Found"
        })
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
}

//delete product -- admin

exports.deleteProducts = async (req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not Found"
        }) 
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message: "Product Deleted Successfully"
    })
}

//get single product

exports.getProductDetails = async (req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(200).json({
        success: true,
        product
    });


}