"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.removeFromCart = exports.addToCart = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    let order = yield Order_1.default.findOne({ user: userId, novaPoshtaBranch: null }); // Корзина = замовлення без novaPoshtaBranch
    if (!order) {
        order = new Order_1.default({ user: userId, products: [], totalPrice: 0 });
    }
    const product = yield Product_1.default.findById(productId);
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    const productIndex = order.products.findIndex((p) => p.product.toString() === productId);
    if (productIndex > -1) {
        order.products[productIndex].quantity += quantity;
    }
    else {
        order.products.push({ product: productId, quantity });
    }
    order.totalPrice = order.products.reduce((total, p) => {
        return total + (p.quantity * (product.price || 0));
    }, 0);
    yield order.save();
    res.json(order);
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.user.id;
    const order = yield Order_1.default.findOne({ user: userId, novaPoshtaBranch: null });
    if (!order)
        return res.status(404).json({ message: 'Cart not found' });
    order.products = order.products.filter((p) => p.product.toString() !== productId);
    order.totalPrice = 0;
    for (const p of order.products) {
        const product = yield Product_1.default.findById(p.product);
        if (product) {
            order.totalPrice += p.quantity * product.price;
        }
    }
    yield order.save();
    res.json(order);
});
exports.removeFromCart = removeFromCart;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { novaPoshtaBranch } = req.body;
    const userId = req.user.id;
    const order = yield Order_1.default.findOne({ user: userId, novaPoshtaBranch: null });
    if (!order || order.products.length === 0)
        return res.status(400).json({ message: 'Cart is empty' });
    order.novaPoshtaBranch = novaPoshtaBranch;
    yield order.save();
    res.status(201).json(order);
});
exports.createOrder = createOrder;
