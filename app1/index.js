const express = require("express");
const app = express();
const sequalize = require("sequelize");
const db = new sequalize(process.env.POSTGRES_URL);
const kafka = require("kafka-node");

app.use(express.json());

const init = async () => {
  const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVER,
  });

  const User = db.define("user", {
    name: sequalize.STRING,
    email: sequalize.STRING,
    password: sequalize.STRING,
  });

  db.sync({ force: true });

  const producer = new kafka.Producer(client);

  producer.on("ready", () => {
    console.log("producer is ready");
    app.post("/", async (req, res) => {
      producer.send(
        [
          {
            topic: process.env.KAFKA_TOPIC,
            messages: JSON.stringify(req.body),
          },
        ],
        async (err, data) => {
          if (err) {
            console.log("error", err);
          } else {
            await User.create(req.body);
            console.log("Data", data);
          }
        }
      );
      return res
        .status(200)
        .json({ message: "The new user has been created!. Hurray!!" });
    });
  });
};

setTimeout(init, 10000);
app.listen(process.env.PORT, () => {
  console.log(`server is listening at ${process.env.PORT}`);
});
