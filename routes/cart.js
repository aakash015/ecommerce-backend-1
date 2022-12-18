const express = require("express");
const { addItemToCart, removeItemFromCart, getItemFromCart } = require("../controllers/cart");
const router = express.Router();


router.post('/cart/addtocart',addItemToCart);
router.put('/cart/removeitemfromcart',removeItemFromCart)
router.post('/cart/getitemsfromcart',getItemFromCart);

module.exports = router;