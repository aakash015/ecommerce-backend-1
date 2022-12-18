const express = require("express");
const { addAddress } = require("../controllers/address");
const router = express.Router();

router.put('/address/add',addAddress);

module.exports = router;