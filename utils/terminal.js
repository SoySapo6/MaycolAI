/**
 * Funções de log e interação com o terminal.
 *
 * @author Dev Gui </>
 */
 const fs = require("fs");
const { version } = require("../package.json");
const { BOT_NAME } = require("../config");
const readline = require("node:readline");

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
  console.log(
    `\x1b[${textColor.red}m[🔥 ${botName}: CUIDADO!!!]\x1b[0m \x1b[${textColor.red}m${message}\x1b[0m`
  );
}

function successLog(message) {
  console.log(
    `\x1b[${textColor.green}m[🎉 ${botName}: Hecho Exitosamente!]\x1b[0m \x1b[${textColor.green}m${message}\x1b[0m`
  );
}

function warningLog(message) {
  console.log(
    `\x1b[${textColor.yellow}m[☢ ${botName}: ATENCION]\x1b[0m \x1b[${textColor.yellow}m${message}\x1b[0m`
  );
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
