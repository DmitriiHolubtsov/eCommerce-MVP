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
exports.getBranches = void 0;
const axios_1 = __importDefault(require("axios"));
const getBranches = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: process.env.NOVA_POSHTA_API_KEY,
            modelName: 'Address',
            calledMethod: 'getWarehouses',
            methodProperties: {},
        });
        res.json(response.data.data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching Nova Poshta branches', error });
    }
});
exports.getBranches = getBranches;
