const logger = require("../utils/logger");
const types = require("../configs/types");
const { youtube } = require("../usecases");

module.exports = {
  screening: (data, socketUser, wss) => {
    try {
      const { urls, type, username } = JSON.parse(data.toString());

      if (!Array.isArray(urls)) {
        throw new Error(`urls is not recognized`);
      }

      if (!urls.length) {
        throw new Error(`urls is empty`);
      }

      if (!types.screeningTypes().has(type)) {
        throw new Error(`screening type: ${type} - is not recognized`);
      }

      if (!username) {
        throw new Error("username is empty");
      }

      switch (type) {
        case "comment":
          youtube.comment(urls, type, username, wss);
          break;

        case "like":
          youtube.like(urls, type, username, wss);
          break;

        case "subscriber":
          youtube.subscriber(urls, type, username, wss);
          break;

        case "view":
          youtube.view(urls, type, username, wss);
          break;

        default:
          break;
      }
    } catch (err) {
      const { username } = JSON.parse(data.toString());
      if (username && socketUser[username]) {
        socketUser[username].send(
          JSON.stringify({
            type: "error",
            data: err.message,
          })
        );
      }
      logger("error", `error ${id}: ${err.message}`);
    }
  },
};
