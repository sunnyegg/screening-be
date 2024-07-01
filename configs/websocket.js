const { WebSocketServer } = require("ws");
const url = require("url");
const logger = require("../utils/logger");
const controllers = require("../controllers");

const wss = new WebSocketServer({ port: 8080 });
const socketUser = {};

wss.setMaxListeners(5);

wss.on("connection", (ws, req) => {
  const id = url.parse(req.url, true).query?.id;
  if (!id) {
    return;
  } else {
    ws.send(
      JSON.stringify({
        type: "welcome",
        data: `connection established for: ${id}`,
      })
    );
    socketUser[id] = ws;
  }

  logger("log", `${id} is connected`);

  wss.addListener("screening", (data) => {
    const dataParsed = JSON.parse(data);
    if (dataParsed.username && socketUser[dataParsed.username]) {
      socketUser[dataParsed.username].send(
        JSON.stringify({
          type: dataParsed.type,
          data: dataParsed.data,
        })
      );
    }
  });

  wss.addListener("usecases-error", (data) => {
    const dataParsed = JSON.parse(data);
    if (dataParsed.username && socketUser[dataParsed.username]) {
      socketUser[dataParsed.username].send(
        JSON.stringify({
          type: "error",
          data: dataParsed.message,
        })
      );
    }
  });

  wss.addListener("progress", (data) => {
    const dataParsed = JSON.parse(data);
    if (dataParsed.username && socketUser[dataParsed.username]) {
      socketUser[dataParsed.username].send(
        JSON.stringify({
          type: dataParsed.type,
          data: dataParsed.data,
        })
      );
    }
  });

  ws.on("message", (data) => {
    controllers.screening(data, socketUser, wss);
  });

  ws.on("error", (err) => {
    logger("error", `error ${id}: ${err.message}`);
    logger("error", `error ${id}: ${err.stack}`);
  });

  ws.on("close", () => {
    delete socketUser[id];

    logger("log", `${id} is disconnected`);
    logger(
      "log",
      `remaining connection: ${JSON.stringify(Object.keys(socketUser))}`
    );
  });
});

logger("log", `ws started on port 8080`);
