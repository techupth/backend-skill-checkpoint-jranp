import express from "express";
import questionsRouter from "./Apps/QuestionsRouter.js";
import bodyParser from "body-parser";
import { client } from "./utils/db.js";

const init = async () => {
  await client.connect();
  const app = express();

  app.use(bodyParser.json());
  app.use("/questions", questionsRouter);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = 4002;
  app.listen(port, () => {
    console.log(`running on http://localhost:${port}`);
  });

  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });
};
init();
