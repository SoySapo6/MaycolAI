const fs = require("fs");
const path = "./services/roleplay_data.json";

// Cargar datos del juego o inicializar si no existe
let gameData = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

// Guardar datos en el archivo
function guardarDatos() {
    fs.writeFileSync(path, JSON.stringify(gameData, null, 2));
}

// Crear personaje
function crearPersonaje(user) {
    if (!gameData[user]) {
        gameData[user] = {
            nombre: "Usuario",
            nivel: 1,
            experiencia: 0,
            vida: 100,
            oro: 50,
            inventario: [],
        };
        guardarDatos();
        return "🎮 ¡Personaje creado! Usa *!roleplay stats* para ver tu progreso.";
    } else {
        return "⚠️ ¡Ya tienes un personaje!";
    }
}

// Ver estadísticas
function verStats(user) {
    if (!gameData[user]) return "❌ No tienes un personaje. Usa *!crear* para comenzar.";
    let p = gameData[user];
    return `👤 *Nombre:* ${p.nombre}\n🏆 *Nivel:* ${p.nivel}\n💖 *Vida:* ${p.vida}\n💰 *Oro:* ${p.oro}\n🎒 *Inventario:* ${p.inventario.length ? p.inventario.join(", ") : "Vacío"}`;
}

// Luchar contra un enemigo
function luchar(user) {
    if (!gameData[user]) return "❌ No tienes un personaje. Usa *!roleplay crear* para comenzar.";
    let p = gameData[user];

    let enemigo = { nombre: "Goblin", vida: 50, daño: 10 };
    let resultado = "";

    if (Math.random() > 0.5) {
        p.oro += 20;
        p.experiencia += 15;
        resultado = `⚔️ ¡Has derrotado a un ${enemigo.nombre}!\n+20💰 oro, +15 XP`;
    } else {
        p.vida -= enemigo.daño;
        resultado = `💀 El ${enemigo.nombre} te ha golpeado. -${enemigo.daño}💖 vida`;
    }

    if (p.vida <= 0) {
        resultado += "\n⚰️ ¡Has muerto! Se reiniciará tu personaje.";
        delete gameData[user];
    }

    guardarDatos();
    return resultado;
}

// Explorar para encontrar objetos
function explorar(user) {
    if (!gameData[user]) return "❌ No tienes un personaje. Usa *!roleplay crear* para comenzar.";
    
    let objetos = ["Espada de Hierro", "Poción de Vida", "Escudo de Madera", "Gema Mágica"];
    let encontrado = objetos[Math.floor(Math.random() * objetos.length)];

    gameData[user].inventario.push(encontrado);
    guardarDatos();
    
    return `🌍 Has encontrado un objeto: *${encontrado}*`;
}

// Manejo de comandos
function roleplay(command, user) {
    switch (command) {
        case "crear":
            return crearPersonaje(user);
        case "stats":
            return verStats(user);
        case "luchar":
            return luchar(user);
        case "explorar":
            return explorar(user);
        default:
            return "❓ Comandos válidos: *!crear, !stats, !luchar, !explorar*";
    }
}

module.exports = { roleplay };