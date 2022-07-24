import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getCustomers, getCustomer } from "../controlles/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', queryValidation, getCustomers);
customersRouter.get('/customers/:id', getCustomer);

export default customersRouter;