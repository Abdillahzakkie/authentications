import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import requestIp from "request-ip";
import responseTime from "response-time";
// import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes";
import { limiter } from "./middleware";
import { NODE_ENV } from "./constants";
import { restResponseTimeHistogram } from "./metrics";

const app: Application = express();

app.use(express.json());
app.set("trust proxy", 1); // trust first proxy
app.use(cors());
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);
app.use(mongoSanitize());
app.use(compression());

// app.use(
// 	session({
// 		secret: "keyboard cat",
// 		resave: false,
// 		saveUninitialized: true,
// 		cookie: { secure: true },
// 	})
// );
if (NODE_ENV !== "testing")
    app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.use(cookieParser());
app.use(requestIp.mw());
app.use(
    responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    ip: req.clientIp || "unknown",
                    method: req.method,
                    route: req.route.path as string,
                    status_code: res.statusCode
                },
                time * 1000
            );
        }
    })
);

app.use(limiter({ windowMs: 1000, max: 50 }));

app.use(router);

export default app;
