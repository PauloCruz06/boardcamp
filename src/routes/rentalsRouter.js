import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getRentals, postRentals } from "../controlles/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', queryValidation, getRentals);
rentalsRouter.post('/rentals', postRentals);

export default rentalsRouter;