import express from "express";
import * as SearchController from "../controllers/search.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.get("/", SearchController.searchDb);
router.get("/tags", SearchController.getTags);
router.delete("/:id/tags/:index", verifyToken(Roles.All), SearchController.deleteATag);

export default router;
