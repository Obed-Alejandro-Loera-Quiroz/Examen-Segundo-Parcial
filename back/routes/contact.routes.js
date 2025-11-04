const express = require("express");
const router = express.Router();
const { submitContact } = require("../controllers/contact.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Aplicar middleware antes del controlador
router.post("/send", verifyToken, submitContact);

module.exports = router;
