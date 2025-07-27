import express from "express";
import {
	getAccountAdminStatusHandler,
	getAllAdminsHandler,
	getAllRolesHandler,
	grantRoleHandler,
	revokeRoleHandler,
} from "../../controllers/admin";
import { authenticateHandler, isAdminHandler } from "../../middleware";

const router = express.Router();

router.get("/all", authenticateHandler, isAdminHandler, getAllAdminsHandler);
router.get(
    "/roles/all",
    authenticateHandler,
    isAdminHandler,
    getAllRolesHandler
);
router.post("/grant", authenticateHandler, isAdminHandler, grantRoleHandler);
router.post("/revoke", authenticateHandler, isAdminHandler, revokeRoleHandler);
router.get("/:account", getAccountAdminStatusHandler);

// // grant admin role only in DEVELOPMENT & TESTS mode
// if (NODE_ENV === "testing") {
// 	router.post("/test/grant", authenticateHandler, TestGrantRoleHandler);
// }

export default router;
