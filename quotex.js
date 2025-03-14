// const puppeteer = require("puppeteer-core");
const puppeteer = require("puppeteer-extra");
const { config } = require("dotenv");

config();

const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { selectPair } = require("./selectPair");
const { selectDuration } = require("./selectDuration");
const { selectDirection } = require("./selectDirection");

//add the stealth plugin
puppeteer.use(StealthPlugin());

//login credentials
const email = process.env.QUOTEX_EMAIL;
const password = process.env.QUOTEX_PASSWORD;

(async () => {
  //launch the browser and open a new blank page

  const browser = await puppeteer.launch({
    // executablePath:
    //   "C:\\Users\\h\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    headless: false, //make broswer visible
    defaultViewport: null, //maximize chrome browser
    // args: [], //maximize chrome browser
    args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Set a realistic User-Agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  // set viewport to mimic a real browser
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto("https://qxbroker.com/en/sign-in");

  // // Wait for an element with the class "header__buttons" to appear on the page.
  // await page.waitForSelector(".header__buttons");
  // // Click on a link of "header__button-log-in" element.
  // await page.click("a.header__button-log-in");
  // // Type a email into the email input field
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[style*="width: 4000px"]');
    elements.forEach((element) => {
      element.style.width = "100%"; // Set width to 100% of viewport
      element.style.maxWidth = "1920px"; // Match the viewport width
    });
  });

  //log in quotex trading platform
  const loginInputExists = await page.$("#tab-1");
  if (loginInputExists) {
    await page.waitForSelector("#tab-1");
    // type email
    await page.type("#tab-1 .modal-sign__input input[name='email']", email, {
      delay: 100,
    });
    // type password
    await page.type(
      "#tab-1 .modal-sign__input input[name='password']",
      password,
      {
        delay: 100,
      }
    );
    //click sign in button
    await page.click("#tab-1 .modal-sign__block-button");
    console.log("Typed email and password successfully");
  } else {
    console.log("Login input field not found!");
  }

  // Step 1:Trade Pair
  const tradePair = "USD/DZD";
  await selectPair(page, tradePair);

  // Step 2: Set Duration
  const duration = "10:00";
  await selectDuration(page, duration);

  // Step 3: Set Direction
  const direction = "up";
  await selectDirection(page, direction);
  //Log all class names in the DOM
  // const allElements = await page.evaluate(() =>
  //   [...document.querySelectorAll("*")].map((el) => el.className)
  // );
  // console.log(allElements);

  // console.log("Current URL:", page.url());

  // Trade with signal
  // const assetSelectInputExist = await page.$(".trading-chart .asset-select");
  // if (assetSelectInputExist) {
  //   await page.locator(".asset-select__button").click();
  // } else {
  //   console.log("Asset-select field is not found!");
  // }

  // await page.goto("https://qxbroker.com/en/trade", {
  //   waitUntil: "networkidle0", // Wait until the network is idle (no ongoing requests)
  // });

  // const allElements = await page.evaluate(() =>
  //   [
  //     ...document.querySelectorAll(
  //       ".asset-select__dropdown .asset-select__content-wrapper *"
  //     ),
  //   ].map((el) => el.className)
  // );
  // console.log(allElements);
  // await page.waitForSelector(".asset-select__content .asset-table__item");
  // await page.waitForFunction(() => {
  //   return (
  //     document.querySelectorAll(".assets-table .asset-table__item").length > 0
  //   );
  // });
  // const pairs = await page.$$(".assets-table .asset-table__item");
  // console.log(pairs.length);
  // for (const pair of pairs) {
  //   const text = await pair.$eval(
  //     ".asset-table__name span",
  //     (el) => el.innerText
  //   );
  //   console.log(text);
  // }
  // await page.locator(".assets-table__item .assets-table__name").click();
})();
