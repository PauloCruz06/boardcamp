import { Router } from "express";
import { getGames } from "../controlles/gamesController.js";

const gamesRouter = Router();

gamesRouter.get('/games', getGames);

export default gamesRouter;