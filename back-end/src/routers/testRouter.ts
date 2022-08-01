import { Router } from "express";
import dotenv from "dotenv";

import * as testController from "../controllers/testController.js";

dotenv.config();

const testRouter = Router();

if (process.env.NODE_ENV === "test") {
    testRouter.delete("/reset-database", testController.reset);
}

export default testRouter;