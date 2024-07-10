"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gov_1 = __importDefault(require("./routes/gov"));
const gov_2 = __importDefault(require("./routes/gov"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/gov", gov_1.default);
app.use("/deel", gov_2.default);
app.get("/", (_, res) => {
    res.send("Zukyc Pod Issuer Server");
});
exports.default = app;
