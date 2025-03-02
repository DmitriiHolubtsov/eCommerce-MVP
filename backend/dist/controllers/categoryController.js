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
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image } = req.body;
    const createdBy = req.user.id;
    const category = new Category_1.default({ name, image, createdBy });
    try {
        yield category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating category', error });
    }
});
exports.createCategory = createCategory;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find().populate('createdBy', 'name');
    res.json(categories);
});
exports.getCategories = getCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category)
        return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findByIdAndDelete(req.params.id);
    if (!category)
        return res.status(404).json({ message: 'Category not found' });
    res.status(204).send();
});
exports.deleteCategory = deleteCategory;
