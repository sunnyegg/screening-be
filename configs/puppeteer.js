module.exports = (userData) => {
  return {
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    userDataDir: userData ? userData : "./userData",
  };
};
