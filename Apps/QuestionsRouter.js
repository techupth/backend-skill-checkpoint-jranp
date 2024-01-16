// QuestionsRouter.js
import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("Questionest");
    const QuestionsData = { ...req.body, created_at: new Date() };
    const newQuestionsData = await collection.insertOne(QuestionsData);
    return res.status(200).json({
      message: `Create questions ${newQuestionsData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error}`,
    });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("Questionest");
    const limit = req.query.limit;
    const questions = await collection.find().limit(100).toArray();
    if (limit > 100) {
      return res.status(401).json({
        message: "Invalid request. Can fetch up to 100 posts per request.",
      });
    }
    return res.status(200).json({ data: questions });
  } catch (error) {
    return res.status(500);
  }
});

questionsRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("Questionest");
    const questionId = new ObjectId(req.params.id);

    const questionIndex = await collection.findOne({ _id: questionId });

    if (!questionIndex) {
      res.status(404).json({ error: "Please check your ID and try again" });
      return;
    }

    res.status(200).json(questionIndex);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

questionsRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("Questionest");
    const newQuestion = { ...req.body, modified_at: new Date() };
    const questionId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQuestion,
      }
    );
    return res.status(200).json("Question has been update !");
  } catch (error) {
    return res.status(500).json({ message: `${error}` });
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("Questionest");
    const questionId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: questionId });
    return res.status(200).json({ message: "Question has been delete" });
  } catch (error) {
    return res.status(500).json({ error: "Error please try again" });
  }
});

export default questionsRouter;
