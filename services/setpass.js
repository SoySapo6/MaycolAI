const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = async (socket, from, args) => {
    // Verificar si el usuario es el dueño del bot
    if (from !== config.OWNER_NUMBER + "@s.whatsapp.net") {
        return socket.sendMessage(from, { text: "❌ *No tienes permiso para hacer esto.*" });
    }

    // Verificar que se ingresaron usuario y contraseña
    if (args.length < 2) {
        return socket.sendMessage(from, { text: "⚠ *Uso correcto:* .setpass (usuario) (contraseña)" });
    }

    const [username, password] = args;

    // Guardar las credenciales en Git
    const gitCredentials = `https://${username}:${password}@github.com`;
    
    try {
        // Configurar Git con las credenciales
        fs.writeFileSync(path.join(process.env.HOME, ".git-credentials"), gitCredentials);
        
        // Hacer que Git use siempre estas credenciales
        require("child_process").execSync("git config --global credential.helper store");

        socket.sendMessage(from, { text: "✅ *Credenciales de GitHub guardadas correctamente.*" });
    } catch (err) {
        socket.sendMessage(from, { text: "❌ *Error al guardar las credenciales.*" });
    }
};