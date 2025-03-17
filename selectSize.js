async function selectSize(page, size) {
  try {
    // **Wait for the investment input field**
    const inputSelector =
      ".section-deal__investment .input-control--number .input-control__input";
    await page.waitForSelector(inputSelector, {
      visible: true,
      timeout: 60000,
    });
    //
    await page.click(inputSelector, { clickCount: 3 }); // Select all text
    await page.keyboard.press("Backspace"); // Clear existing text
    await page.type(inputSelector, size, { delay: 100 }); // Type new value
    console.log(`Successfully selected trade size: ${size}$`);
  } catch (error) {
    console.error("Error in selectSize:", error);
  }
}

module.exports = { selectSize };
