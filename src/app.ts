import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from "express";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Application Routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Book My Table Server",
  });
});

app.use(globalErrorHandler);

app.use(((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found.",
    },
  });
}) as RequestHandler);

export default app;
