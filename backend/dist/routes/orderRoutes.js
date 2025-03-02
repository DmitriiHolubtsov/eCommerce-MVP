"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/cart/add', auth_1.authMiddleware, orderController_1.addToCart);
router.post('/cart/remove', auth_1.authMiddleware, orderController_1.removeFromCart);
router.post('/create', auth_1.authMiddleware, orderController_1.createOrder);
exports.default = router;
