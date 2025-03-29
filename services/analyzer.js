const fs = require("fs");
const path = require("path");

async function analizarBot(socket, from) {
    await socket.sendMessage(from, { text: "Espéreme ^^" });

    const folderPath = path.join(__dirname, ".."); // Carpeta principal del bot
    let errores = [];
    const ignorarCarpetas = ["node_modules", "stickers", "flux", "MayOS", "subots", "dogs", "cats"];

    function analizarArchivo(ruta) {
        try {
            new Function(fs.readFileSync(ruta, "utf8")); // Intenta analizar el código
        } catch (error) {
            errores.push(`❌ Error en ${path.relative(folderPath, ruta)}: ${error.message}`);
        }
    }

    function recorrerCarpeta(carpeta) {
        if (ignorarCarpetas.includes(path.basename(carpeta))) return; // Ignora carpetas innecesarias

        fs.readdirSync(carpeta).forEach((archivo) => {
            const rutaCompleta = path.join(carpeta, archivo);
            if (fs.statSync(rutaCompleta).isDirectory()) {
                recorrerCarpeta(rutaCompleta);
            } else if (archivo.endsWith(".js")) {
                analizarArchivo(rutaCompleta);
            }
        });
    }

    recorrerCarpeta(folderPath);

    if (errores.length === 0) {
        await socket.sendMessage(from, { text: "✅ No se encontraron errores en el bot." });
    } else {
        await socket.sendMessage(from, { text: `⚠️ Se encontraron ${errores.length} errores:\n\n` + errores.slice(0, 10).join("\n") + (errores.length > 10 ? "\n\n🔹 Se encontraron más errores, revisa la consola para verlos todos." : "") });
    }

    // También imprime los errores en la consola
    if (errores.length > 0) console.log("Errores detectados:\n", errores.join("\n"));
}

module.exports = analizarBot;