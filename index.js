const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const { mongoose, url } = require("./database/mongo");
const router = require("./routes");

config();
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", router);

mongoose
  .connect(url)
  .then(() => console.log("Connected with success!"))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`Servidor iniciado na porta ${port}`));
