import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { deleteRentals, getRentals, postRentals, setRentals } from "../controlles/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', queryValidation, getRentals);
rentalsRouter.post('/rentals', postRentals);
rentalsRouter.post('/rentals/:id/return', setRentals);
rentalsRouter.delete('/rentals/:id', deleteRentals)

export default rentalsRouter;