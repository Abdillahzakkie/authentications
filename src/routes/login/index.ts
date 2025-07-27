import express from "express";
import {
	generateLoginSignatureDataHandler,
	loginHandler,
	verifyAuthTokenHandler,
} from "../../controllers";

const router = express();

router.get("/", generateLoginSignatureDataHandler);
router.post("/", loginHandler);
router.get("/verify", verifyAuthTokenHandler);

export default router;
