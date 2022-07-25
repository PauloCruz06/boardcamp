import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getRentals, postRentals, setRentals } from "../controlles/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', queryValidation, getRentals);
rentalsRouter.post('/rentals', postRentals);
rentalsRouter.post('/rentals/:id/return', setRentals);

export default rentalsRouter;