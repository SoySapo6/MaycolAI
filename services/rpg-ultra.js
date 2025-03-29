//ADVERTENCIA: NO EDITAR SIN PERMISO DE SOY MAYCOL DE LO CONTRARIO EL BOT DETECTARA Y NO SE PODRA USAR SE FORMA PERMANENTE.

//Vercion: V3

const fs = require("fs");

const dataFile = "./services/rpg-data.json";
let players = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : {};

function saveData() {
    fs.writeFileSync(dataFile, JSON.stringify(players, null, 2));
}

function getPlayer(id) {
    if (!players[id]) {
        players[id] = {
            nombre: `Jugador ${Object.keys(players).length + 1}`,
            vida: 100,
            energia: 100,
            dinero: 50,
            nivel: 1,
            experiencia: 0,
            hogar: null,
            familia: null,
            inventario: [],
            historialCartas: [],
            victorias: 0,
            derrotas: 0,
            mascota: null,
            clan: null
        };
        saveData();
    }
    return players[id];
}

async function rpgUltra(socket, from, command, args) {
    const player = getPlayer(from);

    switch (command) {
        case "rpgestado":
            await socket.sendMessage(from, { text: `📜 *Estado de ${player.nombre}*\n\n❤️ Vida: ${player.vida}\n⚡ Energía: ${player.energia}\n💰 Dinero: ${player.dinero}\n🎚 Nivel: ${player.nivel}\n🛡️ Experiencia: ${player.experiencia}\n🏠 Hogar: ${player.hogar ? "Sí" : "No"}\n🐾 Mascota: ${player.mascota || "Ninguna"}\n👥 Clan: ${player.clan || "Ninguno"}\n🏆 Victorias: ${player.victorias}\n💀 Derrotas: ${player.derrotas}` });
            break;

        case "rpgtrabajar":
            const ganancia = Math.floor(Math.random() * 50) + 10;
            player.dinero += ganancia;
            player.energia -= 10;
            saveData();
            await socket.sendMessage(from, { text: `💼 Trabajaste y ganaste 💰 ${ganancia} monedas. Energía -10.` });
            break;

        case "rpgcomprar":
            if (args.length === 0) {
                await socket.sendMessage(from, { text: "🛍️ *Tienda RPG*\n1️⃣ Espada - 💰 100\n2️⃣ Armadura - 💰 150\n3️⃣ Poción - 💰 50\n4️⃣ Mascota - 💰 200\n\nUsa: `rpgcomprar (número)`" });
                return;
            }
            const item = parseInt(args[0]);
            if (item === 1 && player.dinero >= 100) {
                player.dinero -= 100;
                player.inventario.push("Espada");
                saveData();
                await socket.sendMessage(from, { text: "⚔️ Compraste una Espada." });
            } else if (item === 2 && player.dinero >= 150) {
                player.dinero -= 150;
                player.inventario.push("Armadura");
                saveData();
                await socket.sendMessage(from, { text: "🛡️ Compraste una Armadura." });
            } else if (item === 3 && player.dinero >= 50) {
                player.dinero -= 50;
                player.vida += 30;
                saveData();
                await socket.sendMessage(from, { text: "🧪 Compraste una Poción. Vida +30." });
            } else if (item === 4 && player.dinero >= 200) {
                const mascotas = ["Perro", "Gato", "Lobo", "Dragón Bebé"];
                player.mascota = mascotas[Math.floor(Math.random() * mascotas.length)];
                player.dinero -= 200;
                saveData();
                await socket.sendMessage(from, { text: `🐾 Adoptaste un ${player.mascota}!` });
            } else {
                await socket.sendMessage(from, { text: "❌ No tienes suficiente dinero o elige un número válido." });
            }
            break;

        case "rpgapostar":
            const apuesta = parseInt(args[0]);
            if (isNaN(apuesta) || apuesta <= 0 || apuesta > player.dinero) {
                await socket.sendMessage(from, { text: "🎲 Usa: `rpgapostar (monto)` (No puedes apostar más de lo que tienes)." });
                return;
            }
            const resultado = Math.random() < 0.5;
            if (resultado) {
                player.dinero += apuesta;
                await socket.sendMessage(from, { text: `🎉 Ganaste 💰 ${apuesta}! Tu dinero actual: 💰 ${player.dinero}` });
            } else {
                player.dinero -= apuesta;
                await socket.sendMessage(from, { text: `💸 Perdiste 💰 ${apuesta}. Tu dinero actual: 💰 ${player.dinero}` });
            }
            saveData();
            break;

        case "rpgmision":
            const recompensa = Math.floor(Math.random() * 100) + 50;
            player.experiencia += recompensa;
            player.dinero += 20;
            saveData();
            await socket.sendMessage(from, { text: `🔮 Completaste una misión! XP +${recompensa}, 💰 +20` });
            break;

        case "rpgentrenar":
            player.experiencia += 30;
            player.energia -= 20;
            saveData();
            await socket.sendMessage(from, { text: "💪 Entrenaste y ganaste +30 XP. Energía -20." });
            break;

        case "rpgsubirnivel":
            if (player.experiencia >= 100) {
                player.nivel += 1;
                player.experiencia = 0;
                saveData();
                await socket.sendMessage(from, { text: `🎖️ ¡Subiste al Nivel ${player.nivel}!` });
            } else {
                await socket.sendMessage(from, { text: "🔺 Necesitas 100 XP para subir de nivel." });
            }
            break;

        case "rpgclan":
            if (!args[0]) {
                await socket.sendMessage(from, { text: "👥 Usa: `rpgclan crear (nombre)` o `rpgclan unirse (nombre)`." });
                return;
            }
            if (args[0] === "crear") {
                if (player.clan) {
                    await socket.sendMessage(from, { text: "❌ Ya perteneces a un clan." });
                    return;
                }
                player.clan = args.slice(1).join(" ");
                saveData();
                await socket.sendMessage(from, { text: `🚀 Creaste el clan *${player.clan}*` });
            } else if (args[0] === "unirse") {
                player.clan = args.slice(1).join(" ");
                saveData();
                await socket.sendMessage(from, { text: `👥 Te uniste al clan *${player.clan}*` });
            }
            break;

        default:
            await socket.sendMessage(from, { text: "❌ Comando no válido." });
            break;
    }
}

module.exports = rpgUltra;