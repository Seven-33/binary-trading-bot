async function fetchLastTradeResult(page) {
  try {
    // **Wait for deal list
    await page.waitForSelector(".deal-list.active", {
      visible: true,
      timeout: 10000,
    });
    //
    await page.waitForSelector(".deal-list__items.active", {
      visible: true,
      timeout: 10000,
    });

    await page.waitForSelector(
      ".trades-list__item.trades-list-item.trades-list-item__close",
      {
        visible: true,
        timeout: 10000,
      }
    );

    // const payout = await page.$eval(
    //   ".trades-list__item.trades-list-item.trades-list-item__close .trades-list-item__delta-right.trades-list-item__delta--down",
    //   (element) => element.innerText.trim()
    // );
    // const tradeValue = await page.$eval(
    //   ".trades-list__item.trades-list-item.trades-list-item__close .trades-list-item__countdown",
    //   (element) => element.innerText.trim()
    // );
    const hasDeltaDown = await page.$eval(
      ".trades-list__item.trades-list-item.trades-list-item__close ",
      (element) =>
        !!element.querySelector(
          ".trades-list-item__delta-right.trades-list-item__delta--down"
        )
    );

    console.log(hasDeltaDown);
    return hasDeltaDown;
  } catch (error) {
    console.error("Error in fethcing last trade value:", error);
  }
}

module.exports = { fetchLastTradeResult };
