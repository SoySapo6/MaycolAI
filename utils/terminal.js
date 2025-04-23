/**
 * Funções de log e interação com o terminal.
 *
 * @author Dev Gui </>
 */
 const fs = require("fs");
const { version } = require("../package.json");
const { BOT_NAME } = require("../config");
const readline = require("node:readline");
const { execSync } = require("child_process");
const botName = BOT_NAME.replace(" BOT", "");

const textColor = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};

function infoLog(message) {
  console.log(
    `\x1b[${textColor.blue}m[🤖 ${botName}: INFO]\x1b[0m \x1b[${textColor.cyan}m${message}\x1b[0m`
  );
}

function getProfileCount() {
  const directoryPath = "perfiles";
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);
    return files.length;
  } else {
    return 0;
  }
}

function MensajeLog(message) {
  console.log(
    `\x1b[${textColor.blue}m[🤖 ${botName}: MENSAJE]\x1b[0m \x1b[${textColor.cyan}m${message}\x1b[0m`
  );
}

function errorLog(message) {
  const red = '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`${red}╭» 🚫 ERROR 🚫`);
  console.log(`│→ Ha ocurrido un Error, Información:`);
  console.log(`│${message}`);
  console.log(`╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ⌫ ♻${reset}`);
}

function successLog(message) {
  const green = '\x1b[32m';
  const reset = '\x1b[0m';

  console.log(`${green}| • ʜᴇᴄʜᴏ ᴇxɪᴛᴏꜱᴀᴍᴇɴᴛᴇ • | Hecho por SoyMaycol • | Infø: ${message} • |${reset}`);
}

function warningLog(message) {
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${yellow}╭» ⚠️ ADVERTENCIA ⚠️`);
  console.log(`│→ Se ha detectado una advertencia:`);
  console.log(`│${message}`);
  console.log(`╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 〄 ↺${reset}`);
}

function tutorLog(message, color = "magenta") {
  const localTextColor = textColor[color];

  console.log(
    `\x1b[${localTextColor}m[🎓 ${botName}: TUTOR]\x1b[0m \x1b[${localTextColor}m${message}\x1b[0m`
  );
}

function bannerLog() {
  console.log(`\x1b[${textColor.cyan}m__  __                       _    _    ___\x1b[0m`);
  console.log(`\x1b[${textColor.cyan}m|  \\/  | __ _ _   _  ___ ___ | |  / \\  |_ _|\x1b[0m`);
  console.log(`\x1b[${textColor.cyan}m| |\\/| |/ _\` | | | |/ __/ _ \\| | / _ \\  | |\x1b[0m`);
  console.log(`\x1b[${textColor.cyan}m| |  | | (_| | |_| | (_| (_) | |/ ___ \\ | |\x1b[0m`);
  console.log(`\x1b[${textColor.cyan}m|_|  |_|\\__,_|\\__, |\\___\\___/|_/_/   \\_\\___|\x1b[0m`);
  console.log(`\x1b[${textColor.cyan}m              |___/\x1b[0m`);
  console.log(``);
  console.log(`\x1b[${textColor.cyan}m👥 Registrados: ${getProfileCount()}`);
  console.log(`\x1b[${textColor.cyan}m🌐 Creador: SoyMaycol`);
  console.log(`\x1b[${textColor.cyan}m🤖 Vercion: \x1b[0m${version}\n`);

  // Mostrar imagen ASCII con jp2a
  try {
    const asciiImage = execSync("jp2a --color --width=40 HanakoTerminal.jpg", { encoding: "utf-8" });
    console.log(asciiImage);
  } catch (err) {
    console.error("Error al mostrar la imagen:", err.message);
  }
}
async function textInput(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `\x1b[${textColor.magenta}m[🤖 ${botName}: INPUT]\x1b[0m \x1b[${textColor.magenta}m${message}\x1b[0m `,
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
}

module.exports = {
  textColor,
  bannerLog,
  errorLog,
  infoLog,
  tutorLog,
  successLog,
  warningLog,
  textInput,
  MensajeLog,
};
