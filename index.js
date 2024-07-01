const express = require("express");
const bodyParser = require("body-parser");
const { youtube } = require("./usecases");
const logger = require("./utils/logger");

require("./configs/websocket");

const app = express();
app.use(bodyParser.json());
app.get("/", (_, res) => res.send("ok"));

// const type
const allTypes = ["youtube-comment", "youtube-view"];
const screeningTypes = new Map();
for (const v of allTypes) {
  screeningTypes.set(v, true);
}

app.post("/screening", async (req, res) => {
  try {
    const { urls, type, username } = req.body;

    if (!Array.isArray(urls)) {
      throw new Error(`urls is not recognized`);
    }

    if (!urls.length) {
      throw new Error(`urls is empty`);
    }

    if (!screeningTypes.has(type)) {
      throw new Error(`screening type: ${type} - is not recognized`);
    }

    if (!username) {
      throw new Error("username is empty");
    }

    if (type === "youtube-comment") {
      youtube.comment(urls, type, username);
    }

    return res.status(200).json({
      message: `success operation: ${type}`,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

app.listen(3000);
logger("log", `express started on port 3000`);
