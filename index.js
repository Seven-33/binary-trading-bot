const { config } = require("dotenv");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// MongoDB connection
const { connectDB, mongoClient } = require("./db");

// Extract Signal from Message Using OpenAI
const { extractSignal } = require("./openai");

// Telegram Client
const { TelegramClient, Api } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const readline = require("readline");

const { selectPair } = require("./selectPair");
const { selectDuration } = require("./selectDuration");
const { selectDirection } = require("./selectDirection");

config();

const apiId = Number(process.env.TELEGRAM_APP_ID);
const apiHash = process.env.TELEGRAM_APP_HASH;
const email = process.env.QUOTEX_EMAIL;
const password = process.env.QUOTEX_PASSWORD;

const storeSession = new StoreSession("telegram_session");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Add the stealth plugin
puppeteer.use(StealthPlugin());

(async () => {
  // Connect to MongoDB before running the bot
  await connectDB();

  // ------------------------------------
  // Launch Broswer and Login into Quotex
  // ------------------------------------
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

  await page.goto("https://qxbroker.com/en/sign-in");
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[style*="width: 4000px"]');
    elements.forEach((element) => {
      element.style.width = "100%"; // Set width to 100% of viewport
      element.style.maxWidth = "1920px"; // Match the viewport width
    });
  });

  // Log in quotex trading platform
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
    // Click sign in button
    await page.click("#tab-1 .modal-sign__block-button");
    console.log("Typed email and password successfully");
  } else {
    console.log("Login input field not found!");
  }

  // -----------------------
  // Loading Telegram Client
  // -----------------------
  console.log("Loading Telegram Client");
  const client = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve)
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve)
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve)
      ),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  client.session.save(); // Save this string to avoid logging in again

  // --------------------------------------------
  // Get Signal and Execute Trade Based on Signal
  // --------------------------------------------
  async function handler(event) {
    const message = event.message;

    const sender = await message.getSender();
    // const messageId = message.id;
    const text = message.text;
    console.log(`New message from ${sender?.username || "Unknown"}: ${text}`);

    // Get Signal from message using OpenAI
    const signal = await extractSignal(text);

    // Execute if there is a signal
    if (signal) {
      await selectPair(page, signal["Pairs"]);
      await selectDuration(page, signal["Duration"]);
      await selectDirection(page, signal["Direction"]);
    } else {
      console.log("This is not a signal!");
      return;
    }
  }

  // Register an event handler to process new messages in Signal Channel
  client.addEventHandler(
    handler,
    new NewMessage({ chats: ["-1001784669828"] })
  );
})();
