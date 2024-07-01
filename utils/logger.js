module.exports = (level, message) => {
  const dt = new Date().toISOString();
  switch (level) {
    case "error":
      console.error(`[${dt}] ${message}`);
      break;

    default:
      console.log(`[${dt}] ${message}`);
      break;
  }
};
