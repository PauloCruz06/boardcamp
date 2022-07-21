import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getRouter from "./routes/getRouter.js";

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors());

server.use(getRouter);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log("Server is listening on port."));