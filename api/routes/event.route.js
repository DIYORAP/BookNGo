import express from "express";
import { createEvent, getevent, getevents } from "../controllers/event.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createEvent);
router.get("/show/:id",getevent);
router.get("/show",getevents);
   
export default router;
