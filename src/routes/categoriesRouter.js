import { Router } from "express";
import { getCategories, postCategories } from "../controlles/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', postCategories);

export default categoriesRouter;