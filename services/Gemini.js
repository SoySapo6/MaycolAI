const { exec } = require("child_process");

async function chat(prompt) {
  return new Promise((resolve, reject) => {
    // Usamos exec para ejecutar el comando gemini-chatbot
    const command = `node node_modules/gemini-chatbot/gemini.js "${prompt}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
        return;
      }

      try {
        // Suponiendo que la respuesta de gemini.js esté en stdout
        // Procesamos la salida como una respuesta directa
        resolve(stdout.trim()); // Aquí asumimos que stdout contiene el mensaje de respuesta
      } catch (err) {
        reject(`Error al procesar la salida: ${err.message}`);
      }
    });
  });
}

module.exports = {
  chat,
};