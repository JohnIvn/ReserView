import express from "express";
import { Kafka } from "kafkajs";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({ clientId: "backend", brokers: ["kafka:9092"] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  app.post("/api/reserve", async (req, res) => {
    const { seat, user } = req.body;
    await producer.send({
      topic: "seat-reservation",
      messages: [{ value: JSON.stringify({ seat, user }) }],
    });
    res.json({ status: "sent", seat, user });
  });

  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
};

run().catch(console.error);
