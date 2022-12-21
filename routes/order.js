const express = require('express');
const router = express.Router();
const {isSignedIn,isAuthenticated, isAdmin} = require('../controllers/auth');
const {getUserById,pushOrderInPurchaseList} = require('../controllers/user');
const  {updateStock} = require("../controllers/product");
const {getOrderById,createOrder,getAllOrders,getOrderStatus,updateStatus, getOrderByUser} = require("../controllers/order");


//params

router.param("userId",getUserById);
router.param("orderId",getOrderById);

//actual routes

//,pushOrderInPurchaseList
//,updateStock
router.post("/order/create/:userId",createOrder);
router.post('/order/getorders',getOrderByUser);
router.get("/order/all/",getAllOrders);

router.get("/order/status/:userId",isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isAdmin,updateStatus)



module.exports=router;

