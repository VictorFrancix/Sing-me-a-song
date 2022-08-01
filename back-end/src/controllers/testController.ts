import { Request, Response } from "express";

import * as testService from "../services/testService.js";

export async function reset(req: Request, res: Response) {
    await testService.reset();

    res.send(200);
}