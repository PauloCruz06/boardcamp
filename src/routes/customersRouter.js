import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getCustomers, getCustomer, postCustomers, setCustomers } from "../controlles/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', queryValidation, getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', postCustomers);
customersRouter.put('/customers/:id', setCustomers);

export default customersRouter;