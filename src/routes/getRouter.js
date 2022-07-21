import { Router } from "express";
import { getFunction } from "../controlles/getController.js";

const getRouter = Router();

getRouter.get('/:route', getFunction);

export default getRouter;