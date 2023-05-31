const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures")
//Create Product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    });
});

//update product -- admin
exports.updateProducts = catchAsyncErrors(async (req, res) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
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

exports.deleteProducts = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
});

//get single product details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

//create new review or update old one

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })
})


//get all product reviews
exports.getAllProductReviews = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Produdct not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//delete product review
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const r = product.reviews.filter((rev) => 
        rev._id.toString() === req.query.id.toString() && rev.user.toString() === req.user._id.toString()
    );


    if(r.length == 0){
        return next(new ErrorHandler("You cannot delete this review", 400));
    }

    const reviews = product.reviews.filter((rev) => 
        rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    let ratings = 0;
    if(reviews.length !== 0){
        reviews.forEach((rev) => {
            avg += rev.rating;
        })
        ratings = avg / reviews.length;
    }
    
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false  
    });



    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully!!"
    });
});