const { exec } = require("child_process");

module.exports = async (socket, from) => {
    try {
        // Ejecutar "git status --porcelain" para ver archivos modificados
        exec("git status --porcelain", (error, stdout) => {
            if (error) {
                return socket.sendMessage(from, { text: "❌ Error al obtener el estado de Git." });
            }

            if (!stdout.trim()) {
                return socket.sendMessage(from, { text: "✅ No hay cambios para actualizar en GitHub." });
            }

            // Contar cantidad de archivos modificados
            const archivos = stdout.split("\n").map(line => line.trim().split(" ")[1]).filter(Boolean);
            const cantidad = archivos.length;

            // Agregar todos los archivos modificados sin límite
            exec("git add .", (error) => {
                if (error) {
                    return socket.sendMessage(from, { text: "❌ Error al agregar archivos a Git." });
                }

                // Hacer commit con mensaje "Actualización automática"
                exec('git commit -m "Actualización automática del bot"', (error) => {
                    if (error) {
                        return socket.sendMessage(from, { text: "❌ Error al hacer commit en Git." });
                    }

                    // Hacer "git pull" antes del push para evitar conflictos
                    exec("git pull origin main --rebase", (error) => {
                        if (error) {
                            return socket.sendMessage(from, { text: "⚠️ No se pudo hacer pull. Intentando push directo..." });
                        }

                        // Hacer push a GitHub
                        exec("git push origin main", (error) => {
                            if (error) {
                                return socket.sendMessage(from, { text: "❌ Error al subir cambios a GitHub. Puede haber un conflicto." });
                            }

                            // Responder con éxito y mostrar cuántos archivos fueron actualizados
                            socket.sendMessage(from, {
                                text: `✅ *Actualización exitosa.*\n📂 *Archivos actualizados:* ${cantidad}\n\n🔄 *GitHub sincronizado.*`
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        socket.sendMessage(from, { text: "❌ Ocurrió un error inesperado." });
    }
};