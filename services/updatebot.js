const { exec } = require("child_process");

module.exports = async (socket, from) => {
    try {
        socket.sendMessage(from, { text: "🔄 *Actualizando el bot desde GitHub...*" });

        // Hacer pull desde GitHub
        exec("git pull origin main", (error, stdout, stderr) => {
            if (error) {
                return socket.sendMessage(from, { text: `❌ *Error al actualizar el bot:*\n${stderr}` });
            }

            // Si no hubo cambios
            if (stdout.includes("Already up to date.")) {
                return socket.sendMessage(from, { text: "✅ *El bot ya está actualizado.*" });
            }

            // Mostrar los cambios aplicados
            socket.sendMessage(from, {
                text: `✅ *El bot se ha actualizado correctamente.*\n\n📂 *Cambios aplicados:* \n${stdout}`
            });

            // Reiniciar el bot automáticamente después de actualizar
            socket.sendMessage(from, { text: "♻ *Reiniciando bot...*" });
            exec("pm2 restart index.js || npm start"); // Cambia según cómo inicies tu bot
        });
    } catch (err) {
        socket.sendMessage(from, { text: "❌ *Ocurrió un error inesperado.*" });
    }
};