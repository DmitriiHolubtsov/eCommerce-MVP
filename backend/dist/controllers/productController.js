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
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, description, category, images } = req.body;
    const product = new Product_1.default({ title, price, description, category, images });
    try {
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
});
exports.createProduct = createProduct;
const getProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find().populate('category', 'name');
    res.json(products);
});
exports.getProducts = getProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findByIdAndDelete(req.params.id);
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
});
exports.deleteProduct = deleteProduct;
