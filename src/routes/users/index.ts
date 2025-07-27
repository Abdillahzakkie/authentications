import express from "express";
import {
	addNewUserHandler,
	getAllUsersHandler,
	getTotalUsersCountHandler,
} from "../../controllers";
import { authenticateHandler, isAdminHandler } from "../../middleware";

const router = express();

router.post("/all", authenticateHandler, isAdminHandler, getAllUsersHandler);
router.get(
    "/all/count",
    authenticateHandler,
    isAdminHandler,
    getTotalUsersCountHandler
);
router.post("/new/:account", addNewUserHandler);

export default router;
