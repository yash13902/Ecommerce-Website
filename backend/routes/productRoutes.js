const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProducts, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
.route("/products/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateProducts)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts)
.get(isAuthenticatedUser, getProductDetails);


module.exports = router;
