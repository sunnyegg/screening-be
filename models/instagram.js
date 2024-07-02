const logger = require("../utils/logger");
const utils = require("../utils");

module.exports = {
  CheckInstagramLikes: async (browser, url, output) => {
    try {
      const page = await browser.newPage();
      await page.goto(url);
      await page.setViewport({ width: 1080, height: 1024 });
      await page.waitForNetworkIdle();

      try {
        const element = await page.waitForSelector("span ::-p-text( likes)", {
          timeout: 1000,
        });
        const text = await element.evaluate((el) => el.textContent);
        const convertedText = utils.ConvertTextToNumber(text, "likes");

        output.set(url, convertedText);
        await page.close();
      } catch (err) {
        if (err.name === "TimeoutError") {
          await page.waitForSelector("span ::-p-text(Liked by)", {
            timeout: 1000,
          });

          output.set(url, "less than 100 likes");
        }
        await page.close();
      }
    } catch (err) {
      logger("error", err.message);
      output.set(url, "error => " + err.message);
    }
  },
};
