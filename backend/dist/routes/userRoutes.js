"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authMiddleware, userController_1.getUsers); // Список користувачів (тільки для адмінів)
router.get('/:id', auth_1.authMiddleware, userController_1.getUser); // Отримати одного користувача
router.put('/:id', auth_1.authMiddleware, userController_1.updateUser); // Оновити користувача
router.delete('/:id', auth_1.authMiddleware, userController_1.deleteUser); // Видалити користувача
exports.default = router;
