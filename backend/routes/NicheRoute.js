import express from "express";
import {
  generateNicheResult,
  getUserData,
  deleteUserData,
  getUserAssets,
} from "../controllers/NicheController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateUser, generateNicheResult);
router.get("/user/:email", authenticateUser, getUserData);
router.delete("/user/:email", authenticateUser, deleteUserData);
router.get("/userassets", authenticateUser, getUserAssets);

export default router;
