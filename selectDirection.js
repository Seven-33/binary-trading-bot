async function selectDirection(page, direction) {
  try {
    console.log(`Selecting trade direction: ${direction.toUpperCase()}...`);

    let buttonSelector;

    if (direction.toLowerCase() === "up") {
      buttonSelector = ".section-deal__success .button--success";
    } else if (direction.toLowerCase() === "down") {
      buttonSelector = ".section-deal__danger .button--danger";
    } else {
      throw new Error("Invalid direction. Use 'up' or 'down'.");
    }
    // Wait for the button to be visible
    await page.waitForSelector(buttonSelector, {
      visible: true,
      timeout: 10000,
    });

    // Click the button
    await page.click(buttonSelector);
    console.log(`Clicked on ${direction.toLowerCase()} button`);
  } catch (error) {
    console.log("Error in selectDirection: ", error);
  }
}

module.exports = { selectDirection };
