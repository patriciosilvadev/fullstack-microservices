import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFound } from "@kmtickets/common";
import { newRoute } from "./routes/new";
import { showRoute } from "./routes/show";
import { indexRouter } from "./routes";
import { updateRoute } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(bodyParser.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    sameSite: true
  })
);

app.use(newRoute);
app.use(showRoute);
app.use(indexRouter);
app.use(updateRoute);

// NOT FOUND ROUTE
app.all(
  "*",
  async (): Promise<void> => {
    throw new NotFound();
  }
);

// ERROR HANDLING
app.use(errorHandler);

export { app };
