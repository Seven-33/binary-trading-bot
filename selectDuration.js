async function selectDuration(page, duration) {
  try {
    await page.waitForSelector(".section-deal", {
      visible: true,
      timeout: 60000,
    });
    console.log("Right Tab is visible");

    await page.waitForSelector(".section-deal__time", {
      visible: true,
      timeout: 30000,
    });
    console.log("Duration Form is visible");

    // **Click time input field
    await page
      .locator(
        ".input-control.input-control--time.input-control--dark.section-deal__input-control"
      )
      .click();
    // Select duration to trade
    await page.waitForSelector(".input-control__dropdown", {
      visible: true,
      timeout: 10000,
    });
    await page.waitForSelector(".input-control__dropdown-option");

    //Get all dropdown options
    const options = await page.$$(".input-control__dropdown-option");

    for (const option of options) {
      //Get the text content of each option
      const text = await page.evaluate((el) => el.textContent.trim(), option);
      //Check if the text matches the required duration
      if (text === duration) {
        await option.click();
        console.log(`Selected duration: ${duration}`);
        return;
      }
    }
  } catch (error) {
    console.log("Error in selectDuration: ", error);
  }
}

module.exports = { selectDuration };
