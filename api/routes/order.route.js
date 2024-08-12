import express from "express";
import { bookig } from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router= express.Router();

router.post('/book/:id',verifyToken,bookig);

export default router;
