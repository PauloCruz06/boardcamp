import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getCategories, postCategories } from "../controlles/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', queryValidation, getCategories);
categoriesRouter.post('/categories', postCategories);

export default categoriesRouter;