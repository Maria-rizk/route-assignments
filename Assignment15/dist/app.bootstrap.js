"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const bootstrap = () => {
    const app = (0, express_1.default)();
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Landing page" });
    });
    app.get("/*dummy", (req, res, next) => {
        return res.status(404).json({ message: "Invalid application routing" });
    });
    app.use("/auth", modules_1.authRouter);
    app.listen(3000, () => {
        console.log("Server is running on port 3000🪷");
    });
    console.log("Application bootstrapped successfully👌");
};
exports.default = bootstrap;
