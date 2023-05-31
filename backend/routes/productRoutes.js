const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProducts, getProductDetails, createProductReview, getAllProductReviews, deleteProductReviews } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
.route("/admin/products/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateProducts)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts);

router.route("/products/:id").get(isAuthenticatedUser, getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews").get(getAllProductReviews).delete(isAuthenticatedUser, deleteProductReviews);

module.exports = router;
