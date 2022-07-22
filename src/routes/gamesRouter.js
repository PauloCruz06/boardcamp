import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getGames } from "../controlles/gamesController.js";

const gamesRouter = Router();

gamesRouter.get('/games', queryValidation, getGames);

export default gamesRouter;