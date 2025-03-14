const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Add the stealth plugin
puppeteer.use(StealthPlugin());

(async () => {
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

  // Set viewport to mimic a real browser
  await page.setViewport({ width: 1920, height: 1080 });
})();
