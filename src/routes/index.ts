import express, { NextFunction, Request, Response } from "express";
import loginRoutes from "./login";
import adminRoutes from "./admins";
import usersRoutes from "./users";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
	res.status(200).json();
});

router.use("/api/login", loginRoutes);
router.use("/api/admins", adminRoutes);
router.use("/api/users", usersRoutes);
router.use((_: Request, res: Response, __: NextFunction) => {
	res.status(404).send("Page does not exists!");
});

export default router;
