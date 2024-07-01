const CheckIgLikes = async (browser, url, output) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForNetworkIdle();

    try {
      const element = await page.waitForSelector("span ::-p-text( likes)", {
        timeout: 100,
      });
      const text = await element.evaluate((el) => el.textContent);
      const convertedText = ConvertTextToNumber(text, "likes");

      console.log(`${url} => ${text}`);

      output.set(url, convertedText);
    } catch (err) {
      if (err.name === "TimeoutError") {
        await page.waitForSelector("span ::-p-text(Liked by)");

        console.log(`${url} => less than 50 likes`);

        output.set(url, "less than 100 likes");
      }
    }
  } catch (err) {
    output.set(url, "error");
  }
};

const CheckIgReelViews = async (page, url, output) => {
  try {
    const selectorAvatar =
      "#mount_0_0_R+ > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x17snn68.x6osk4m.x1porb0y > section > main > div > div.x6s0dn4.x78zum5.xdt5ytf.xdj266r.xkrivgy.xat24cr.x1gryazu.x1n2onr6.xh8yej3 > div > div.x4h1yfo > div > div.xyinxu5.x1pi30zi.x1g2khh7.x1swvt13 > div > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.x1q0g3np.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1 > div > div:nth-child(1) > div:nth-child(1) > div > span > span > div > a";
    await page.waitForSelector(selectorAvatar, {
      timeout: 2000,
    });
    await page.click(selectorAvatar);
    await page.waitForNetworkIdle();

    const selectorUserPostItem = "[data-e2e='user-post-item']";
    await page.waitForSelector(selectorUserPostItem, {
      timeout: 4000,
    });
    const text = await page.evaluate((url) => {
      const posts = document.querySelectorAll("[data-e2e='user-post-item']");
      for (const p of posts) {
        if (p.getElementsByTagName("a")[0].href === url) {
          return p.querySelector("[data-e2e='video-views']").textContent;
        }
      }
    }, url);

    output.set(url, text);
  } catch (err) {
    console.log(err);
    output.set(url, "error");
  }
};

const CheckTiktokLikes = async (browser, url, output) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForNetworkIdle();

    const element = await page.waitForSelector("[data-e2e='like-count']", {
      timeout: 1000,
    });
    const text = await element.evaluate((el) => el.textContent);
    const convertedText = ConvertTextToNumber(text, "likes");

    console.log(`${url} => ${text} likes`);

    output.set(url, convertedText);
  } catch (err) {
    output.set(url, "error");
  }
};

const CheckTiktokViews = async (browser, url, output) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForNetworkIdle();

    const selectorAvatar = "[data-e2e='browse-user-avatar']";
    await page.waitForSelector(selectorAvatar, {
      timeout: 2000,
    });
    await page.click(selectorAvatar);
    await page.waitForNetworkIdle();

    const selectorUserPostItem = "[data-e2e='user-post-item']";
    await page.waitForSelector(selectorUserPostItem, {
      timeout: 4000,
    });
    const text = await page.evaluate((url) => {
      const posts = document.querySelectorAll("[data-e2e='user-post-item']");
      for (const p of posts) {
        if (p.getElementsByTagName("a")[0].href === url) {
          return p.querySelector("[data-e2e='video-views']").textContent;
        }
      }
    }, url);

    const postClip = await page.evaluate((url) => {
      const posts = document.querySelectorAll("[data-e2e='user-post-item']");
      for (const p of posts) {
        if (p.getElementsByTagName("a")[0].href === url) {
          const pos = p.getBoundingClientRect();
          return {
            x: pos.x,
            y: pos.y,
            width: pos.width,
            height: pos.height,
          };
        }
      }
    }, url);

    const parseUrl = url.split("/");
    await page.screenshot({
      path: `output/ss/${parseUrl[parseUrl.length - 1]}.png`,
      clip: postClip,
    });

    output.set(url, text);
  } catch (err) {
    console.log(err);
    output.set(url, "error");
  }
};

const ConvertTextToNumber = (text, textToRemove) => {
  const removeTexts = text.replace(` ${textToRemove}`, "");
  const removeComma = removeTexts.replaceAll(",", "");
  return Number(removeComma);
};

const DigitFormatter = (text) => {
  const digitMap = new Map();
  digitMap.set("K", 1000);
  digitMap.set("M", 1000000);

  // 9.5K --> ambil length -1 (K/M)
  // [9.5 K]
  // 9.5 * (K/M)
  const regex = /([k|K|m|M])/g;
  const check = text.match(regex);
  if (check) {
    const textSplit = text.trim().split(regex);
    return textSplit[0] * digitMap.get(textSplit[1]);
  }

  return Number(text);
};

const IsIgLink = (url) => {
  const isMatch = url.match("instagram");
  if (isMatch !== null) return true;
  return false;
};

const IsTiktokLink = (url) => {
  const isMatch = url.match("tiktok");
  if (isMatch !== null) return true;
  return false;
};

const IsYoutubeLink = (url) => {
  const isMatch = url.match("youtube");
  if (isMatch !== null) return true;
  return false;
};

const CheckAndSplitUrls = (urls) => {
  const output = {
    ig: [],
    tt: [],
    yt: [],
  };

  for (const url of urls) {
    if (IsIgLink(url)) output.ig.push(url);
    if (IsTiktokLink(url)) output.tt.push(url);
    if (IsYoutubeLink(url)) output.yt.push(url);
  }
  return output;
};

module.exports = {
  CheckIgLikes,
  CheckTiktokLikes,
  IsIgLink,
  IsTiktokLink,
  IsYoutubeLink,
  CheckAndSplitUrls,
  CheckTiktokViews,
  DigitFormatter,
  ConvertTextToNumber,
};
