import { Router } from "express";
import queryValidation from "../middlewares/queryValidation.js";
import { getGames, postGames } from "../controlles/gamesController.js";

const gamesRouter = Router();

gamesRouter.get('/games', queryValidation, getGames);
gamesRouter.post('/games', postGames);

export default gamesRouter;