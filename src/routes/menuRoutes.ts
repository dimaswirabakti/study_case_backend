import { Router } from "express";
import * as menuController from "../controllers/menuController";

const router = Router();

router.get("/", menuController.getMenus);
router.get("/group-by-category", menuController.getMenusGrouped);
router.get("/search", menuController.getMenus);
router.post("/", menuController.createMenu);
router.get("/:id", menuController.getMenuById);
router.put("/:id", menuController.updateMenu);
router.delete("/:id", menuController.deleteMenu);

export default router;
