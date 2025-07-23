import { Kafka } from "kafkajs";
import pkg from "pg";
const { Client } = pkg;

const kafka = new Kafka({ clientId: "middleware", brokers: ["kafka:9092"] });
//if running locally, use brokers: ["localhost:9092"]
const consumer = kafka.consumer({ groupId: "seat-group" });

const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "admin",
  port: 5432,
});

const run = async () => {
  await pgClient.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: "seat-reservation", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { seat, user } = JSON.parse(message.value.toString());
      console.log(`Reserving seat ${seat} for ${user}`);
      await pgClient.query(
        "INSERT INTO reservations(seat, email) VALUES($1, $2) ON CONFLICT (seat) DO NOTHING",
        [seat, user]
      );
    },
  });
};

run().catch(console.error);
