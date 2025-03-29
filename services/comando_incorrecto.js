const { comandos } = require("../utils/comandos");
const { errorLog } = require("../utils/terminal");
const { getAdReplyScript } = require("./AdReply.js"); // Importar AdReply  

function calcularSimilitud(str1, str2) {
  let match = 0;
  const minLen = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLen; i++) {
    if (str1[i] === str2[i]) match++;
  }

  return Math.round((match / str2.length) * 100); // Basado en el comando correcto
}

function buscarComandosSimilares(input) {
  let similares = comandos
    .map(cmd => ({ comando: cmd, parecido: calcularSimilitud(input, cmd) }))
    .filter(item => item.parecido > 30) // Umbral de similitud
    .sort((a, b) => b.parecido - a.parecido) // Ordenar de mayor a menor
    .slice(0, 2); // Solo los 2 más parecidos

  return similares;
}

async function comandoIncorrecto(socket, from, input) {
  try {
    const sugerencias = buscarComandosSimilares(input);
    let mensaje = "☃ *Comando no reconocido* ☃\n" +
                  "Use *.menu* ツ para conocer los comandos disponibles.✌\n\n";

    if (sugerencias.length > 0) {
      mensaje += "( ͡❛ ω ͡❛) *Comando Parecido* ( ͡❛ ω ͡❛):\n\n";
      sugerencias.forEach((sug, index) => {
        mensaje += `• ${index + 1} *${sug.comando}* (${sug.parecido}%)\n`;
      });
    }

    let adReply = getAdReplyScript(); // Obtener AdReply

    await socket.sendMessage(from, { text: mensaje, ...adReply }); // Enviar con AdReply
  } catch (error) {
    errorLog("Error en comando incorrecto: " + error.message);
  }
}

module.exports = { comandoIncorrecto };