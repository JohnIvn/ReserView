import express from "express";
import { Kafka } from "kafkajs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const kafka = new Kafka({ clientId: "backend", brokers: ["localhost:9092"] });
//if running locally, use brokers: ["localhost:9092"] for docker use, use brokers: ["kafka:9092"]
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

  app.listen(PORT, () =>
    console.log(`Backend running at http://localhost:${PORT}`)
  );
};

run().catch(console.error);
