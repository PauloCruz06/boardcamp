import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getCustomers, getCustomer, postCustomers } from "../controlles/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', queryValidation, getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', postCustomers);

export default customersRouter;