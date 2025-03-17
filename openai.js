const { config } = require("dotenv");
const OpenAI = require("openai");
const { parseTradingSignal } = require("./parseTradingSignal");

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Replace with your OpenAI API key
async function extractSignal(message) {
  const prompt = `Analyze the message and determine whether it contains a trading signal.
  If the message includes a signal, extract the relevant details in English and format them as follows: 
  'Pair: [currency pair], Direction: [Up/Down], Duration: [time]'.
  Exclude any links and unrelated text.
  
  ⬆️ means Up
  ⬇️ means Down

  If no signal is present, return "Not Signal"

  Example 1:
    -message:
      👉Par de moedas - EUR/AUD (OTC) - Para cima⬆️
      ⏱️Aposte por 5 minutos
    -Expected output:
      Pair: EUR/AUD, Direction: Up, Duration: 05:00
  Example 2:
    -message:
      ☑️ Mais uma vitória hoje
      ⏳ O novo sinal será dado 30 min 
      💲 Complemente seu saldo para ter mais lucro 
      👉 Inscrever-se - https://bit.ly/qxbroker_brasil
      📨 Escreva para mim - @Daily_Pro_trading
    -Expected output:
      Not Signal
  Example 3:
    -message:
      ⏱️Próximo sinal em breve!
      Em nosso próximo sinal, mudaremos o par de moedas para:
      💰 USD/JPY 💰
    -Expected output: 
      Not Signal
  Example 4:
    -message:
      Boa noite, equipe! 🌙 O dia está chegando ao fim, e quero agradecer pelo seu empenho. Amanhã será uma nova oportunidade para crescermos ainda mais juntos! 💪✨
      📊 Resultados de hoje:
      💰14 Vitórias - 20880  R$
      🤦2 Perdas - (-4000  R$)
      ♻️0 Retorna
    -Expected output: 
      Not Signal
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "developer", content: prompt },
      { role: "user", content: message },
    ],
  });

  const answer = response.choices[0].message.content;
  console.log(answer);
  // Parse signal string to object
  const signal = parseTradingSignal(answer);
  // console.log(signal);
  return signal;
}

// message = `☑️ Mais uma vitória hoje

// ⏳ O novo sinal será dado 30 min

// 💲 Complemente seu saldo para ter mais lucro

// 👉 Inscrever-se - https://bit.ly/qxbroker_brasil
// 📨 Escreva para mim - @Daily_Pro_trading`;
// extractSignal(message);

module.exports = { extractSignal };
