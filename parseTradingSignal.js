const parseTradingSignal = (text) => {
  let parsedSignal = {};
  if (text !== "Not Signal") {
    const pairs = text.split(", ");
    pairs.forEach((pair) => {
      const [key, value] = pair.split(": ");
      parsedSignal[key.trim()] = value.trim();
    });
    return parsedSignal;
  }
  return null;
};

module.exports = { parseTradingSignal };
