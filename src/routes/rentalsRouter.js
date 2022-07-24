import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getRentals } from "../controlles/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', queryValidation, getRentals);

export default rentalsRouter;