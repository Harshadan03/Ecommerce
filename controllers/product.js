//A node.js module for parsing form data, especially file uploads. Current status.
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Product = require('../models/product')
const { errorHandler } = require("../helpers/dbErrorHandler")

//get product by productId
exports.productById = (req, res, next, id) => {
    Product.findById(id).populate("category").exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found!"
            })
        }
        req.product = product
        next()
    })
}

//read the product from the req
exports.readProduct = (req, res) => {
    //photo is made undefined bcz we dont want it be shown in the response bcz photo has large size
    req.product.photo = undefined
    return res.json(req.product)
}

// create product of a particular category
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // check for all fields
        const { name, description, price, category, quantity, shipping } = fields
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let product = new Product(fields)
        // 'photo' is the name of the image field in the product schema
        if (files.photo) {
            // if the file size greater than 1 mb 
            // 1kb = 1000
            // 1mb =1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "image should be less than 1mb"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

// delete the product by id
exports.removeProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Product deleted successfully"
        })
    })
}



// update product of a particular category
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // check for all fields
        // const { name, description, price, category, quantity, shipping } = fields
        // if (!name || !description || !price || !category || !quantity || !shipping) {
        //     return res.status(400).json({
        //         error: "All fields are required"
        //     })
        // }

        // //once we have the product, replace the existing information with new information  
        // and for that we use 'extend' method that comes with lodash library
        let product = req.product
        product = _.extend(product, fields)//fiesr arg is product itself and 2nd is updated fields

        // 'photo' is the name of the image field in the product schema
        if (files.photo) {
            // if the file size greater than 1 mb 
            // 1kb = 1000
            // 1mb =1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "image should be less than 1mb"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
        })
    })
}

/**
 * product on sell/ arrival
 * by sell  = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
exports.listOfProducts = (req, res) => {
    let order = req.query.order ? req.query.order : "asc"
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found!"
                })
            }
            res.json(products)
        })
}

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 * 
 */
exports.listRelatedProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    // find the ralted product of the same category but 
    // don't include the product which is requested
    // $ne = not include
    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found!"
                })
            }
            res.json(products)
        })
}

//list product categoies
//get categories of those products which are present
exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found!"
            })
        }
        res.json(categories)
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

//get foto of the product
exports.productPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.listSearch = (req, res) => {
    //create query object to hold search value and category value
    const query = {}
    //assign search value to query.name

    if (req.query.search) {
        // i in options is for case insensitivity
        query.name = { $regex: req.query.search, $options: "i" }
        //assign category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category
        }

        //find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select("-photo")
    }
}

exports.decreaseQuantityAndIncreaseSold = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            // this  updateOne method is  provided by mongoose 
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })

    //bulkWeite is method provided by mongoose
    Product.bulkWrite(bulkOps, {}, (error, data) => {
        if (error) {
            return res.status(400).json({
                error: "Could not Update Product"
            })
        }
        next()
    })
}