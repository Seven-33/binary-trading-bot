async function selectPair(page, tradePair) {
  try {
    // Click the active tab
    await page.waitForSelector("div.tab.desktop.active", { visible: true });
    await page.click("div.tab.desktop.active");
    console.log("Clicked on the active tab.");

    // await page.locator(".trading-chart .asset-select").click();
    // // const content = await page.content();
    // // console.log(content);
    await page.waitForSelector(".asset-select__dropdown", {
      visible: true,
      timeout: 60000,
    });
    console.log("Asset selection dropdown is visible.");

    // **Find and type in the search input**
    await page.waitForSelector(".asset-select__search-input", {
      visible: true,
      timeout: 10000,
    });

    await page.type(".asset-select__search-input", tradePair, { delay: 100 }); // Simulate real typing
    console.log(`Entered trade pair: ${tradePair}`);

    // **Press Enter to search**
    await page.keyboard.press("Enter");
    console.log("Search submitted.");

    // **Wait for search results to load**
    await page.waitForSelector(".asset-select__content-wrapper", {
      visible: true,
      timeout: 10000,
    });
    console.log("Search results loaded.");

    // **Wait for and select the first trade pair item**
    await page.waitForSelector(".assets-table__item", {
      visible: true,
      timeout: 10000,
    });

    // **Get the text inside the span before clicking**
    const tradePairName = await page.$eval(
      ".assets-table__item .assets-table__name span",
      (el) => el.textContent.trim()
    );
    console.log(`Trade Pair Name: ${tradePairName}`);

    // **Click the first trade pair in the list**
    await page.click(".assets-table__item");
    console.log(`Selected trade pair: ${tradePairName}`);
  } catch (error) {
    console.error("Error in selectPair:", error);
  }
}

module.exports = { selectPair };

// export default async function selectPair(page, tradePair) {
//   try {
//     console.log("Navigating to the trade page...");

//     // **Retry Mechanism for page.goto**
//     let retryCount = 0;
//     while (retryCount < 3) {
//       try {
//         await page.goto("https://qxbroker.com/en/trade", {
//           waitUntil: "domcontentloaded",
//           timeout: 60000,
//         });
//         console.log("Successfully navigated to the trade page.");
//         break;
//       } catch (error) {
//         console.warn(
//           `Navigation attempt ${retryCount + 1} failed. Retrying...`
//         );
//         retryCount++;
//         if (retryCount === 3) throw error;
//       }
//     }

//     // Confirm we're on the trade page
//     await page.waitForFunction(() => window.location.href.includes("/trade"), {
//       timeout: 60000,
//     });
//     console.log("Confirmed on the trade page.");

//     // Click the active tab
//     await page.waitForSelector("div.tab.desktop.active", { visible: true });
//     await page.click("div.tab.desktop.active");
//     console.log("Clicked on the active tab.");

//     // **Wait for the asset selection dropdown to appear**
//     await page.waitForSelector(".asset-select__dropdown", {
//       visible: true,
//       timeout: 10000,
//     });
//     console.log("Asset selection dropdown is visible.");

//     // **Find and type in the search input**
//     await page.waitForSelector(".asset-select__search-input", {
//       visible: true,
//       timeout: 10000,
//     });
//     await page.type(".asset-select__search-input", tradePair, { delay: 100 }); // Simulate real typing
//     console.log(`Entered trade pair: ${tradePair}`);

//     // **Press Enter to search**
//     await page.keyboard.press("Enter");
//     console.log("Search submitted.");

//     // **Wait for search results to load**
//     await page.waitForSelector(".asset-select__content-wrapper", {
//       visible: true,
//       timeout: 10000,
//     });
//     console.log("Search results loaded.");

//     // **Wait for and select the first trade pair item**
//     await page.waitForSelector(".assets-table__item", {
//       visible: true,
//       timeout: 10000,
//     });

//     // **Get the text inside the span before clicking**
//     const tradePairName = await page.$eval(
//       ".assets-table__item .assets-table__name span",
//       (el) => el.textContent.trim()
//     );
//     console.log(`Trade Pair Name: ${tradePairName}`);

//     // **Click the first trade pair in the list**
//     await page.click(".assets-table__item");
//     console.log(`Selected trade pair: ${tradePairName}`);
//   } catch (error) {
//     console.error("Error in selectPair:", error);
//   }
// }
