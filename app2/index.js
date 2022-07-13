const express = require("express");
const app = express();
const mongoose = require("mongoose");
const kafka = require("kafka-node");

app.use(express.json());

const init = async () => {
  mongoose.connect(process.env.MONGO_URL, () => {
    console.log("DB connection done!");
  });
  const User = new mongoose.model("user", {
    name: String,
    email: String,
    password: String,
  });

  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVER,
  });

  const consumer = new kafka.Consumer(
    client,
    [{ topic: process.env.KAFKA_TOPIC }],
    { autoCommit: false }
  );

  consumer.on("message", async (message) => {
    console.log("message", message);
    const user = await new User(JSON.parse(message.value));
    user.save();
  });

  consumer.on("error", (err) => {
    console.log("err", err);
  });
};

setTimeout(init, 10000);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at ${process.env.PORT}`);
});
