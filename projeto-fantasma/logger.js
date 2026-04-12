const chalk = require("chalk");

function log(msg, type = "info") {
  const time = new Date().toLocaleTimeString("pt-BR", { hour12: false });
  const prefix = chalk.gray(`[${time}]`);

  switch (type) {
    case "info":
      console.log(`${prefix} ${chalk.cyan("ℹ INFO :")} ${msg}`);
      break;
    case "success":
      console.log(`${prefix} ${chalk.green("✔ OK   :")} ${chalk.greenBright(msg)}`);
      break;
    case "warn":
      console.log(`${prefix} ${chalk.yellow("⚠ AVISO:")} ${chalk.yellow(msg)}`);
      break;
    case "error":
      console.log(`${prefix} ${chalk.red("✖ ERRO :")} ${chalk.redBright(msg)}`);
      break;
    case "bot":
      console.log(`${prefix} ${chalk.magenta("🤖 FANTASMA:")} ${chalk.magentaBright(msg)}`);
      break;
    case "flashscore":
      console.log(`${prefix} ${chalk.blueBright("📡 FLASHSCORE:")} ${msg}`);
      break;
    case "betano":
      console.log(`${prefix} ${chalk.hex("#FF7A00")("🍊 BETANO:")} ${msg}`);
      break;
    default:
      console.log(`${prefix} ${msg}`);
  }
}

function logAposta(jogo, mercado, odd) {
  const msg = 
    `\n${chalk.bgGreen.black(" 🎯 APONTAMENTO SNIPER ")}\n` +
    `${chalk.white("Partida:")} ${chalk.cyanBright(jogo)}\n` +
    `${chalk.white("Mercado:")} ${chalk.yellow(mercado)}\n` +
    `${chalk.white("Odd:")} ${chalk.greenBright.bold(odd)}\n`;
  console.log(msg);
}

module.exports = { log, logAposta };
