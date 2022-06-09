const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// create product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    // req.body.images === "string" --> this means if their is a single image i.e. it will not be an array, it will be string
    images.push(req.body.images);
  } else {
    // if multiple image then we will directly write images equal to the array
    images = req.body.images;
  }


  // Using the below for loop we upload the images on cloudinary 
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  req.body.user = req.user.id; // Here we save the user id ,who is creating the product with product details

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  //.clone() is used as ....Mongoose no longer allows executing the same query object twice.
  //If you do, you'll get a Query was already executed error. Executing the same query instance
  //twice is typically indicative of mixing callbacks and promises, but if you need to execute
  // the same query twice, you can call Query#clone() to clone the query and re-execute it.
  let products = await apiFeatures.query.clone();

  let filteredProductsCount = products.length;

  apiFeatures.pagination(resultPerPage);

  products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

//Get all products -- Admin
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//Update product -- admin
exports.updateproduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404)); // Next is basically a call back function
  }

  //  IMages Start Here
  let images = [];
  if (typeof req.body.images === "string") {
    // req.body.images === "string" --> this means if their is a single image i.e. it will not be an array, it will be string
    images.push(req.body.images);
  } else {
    // if multiple image then we will directly write images equal to the array
    images = req.body.images;
  }

  if(images !== undefined){
    // Delete Image from cloudinary
    for(let i = 0; i < product.images.length; i++){
      await cloudinary.v2.uploader.destroy(productimages[i].public_id)
    }

  // Using the below for loop we upload the images on cloudinary 
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
req.body.images = imagesLinks;
  }
  

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Get product details ( single product detail )

exports.getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404)); // Next is basically a call back function
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product --Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404)); // Next is basically a call back function
  }

  // Deleting Images From Cloudinary
  for(let i = 0; i < product.images.length; i++){
    await cloudinary.v2.uploader.destroy(productimages[i].public_id)
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

// create a new review or update Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
  }

  product.numberOfReviews = product.reviews.length;

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id); // req.query.id => it is productID

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete a review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString() // req.query.id => It is review Id
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;

  const numberOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
