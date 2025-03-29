const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const karKatFile = path.join(dataDir, "karkat.json");

// Crear carpeta /data si no existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Estado inicial de KarKat
const estadoInicial = {
    hambre: 50,
    felicidad: 50,
    energia: 50,
    salud: 100,
    higiene: 50,
    durmiendo: false,
    despertarEn: null,
};

// Cargar estado desde el archivo o crearlo si está vacío o da error
function cargarEstado() {
    if (fs.existsSync(karKatFile)) {
        try {
            const data = fs.readFileSync(karKatFile, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.error("⚠️ Error al leer karkat.json. Se restaurará el estado inicial.");
            fs.writeFileSync(karKatFile, JSON.stringify(estadoInicial, null, 2));
            return estadoInicial;
        }
    } else {
        fs.writeFileSync(karKatFile, JSON.stringify(estadoInicial, null, 2));
        return estadoInicial;
    }
}

// Guardar el estado actual de KarKat
function guardarEstado(estado) {
    fs.writeFileSync(karKatFile, JSON.stringify(estado, null, 2));
}

// Función para verificar si KarKat despertó
function verificarDespertar(estado) {
    if (estado.durmiendo && Date.now() >= estado.despertarEn) {
        estado.durmiendo = false;
        estado.despertarEn = null;
    }
}

// Eventos aleatorios
const eventos = [
    { mensaje: "🐱 KarKat encontró una moneda en el suelo.", efecto: (estado) => estado.felicidad += 5 },
    { mensaje: "🍫 KarKat encontró un dulce y se lo comió. ¡Le subió la energía!", efecto: (estado) => estado.energia += 10 },
    { mensaje: "💦 KarKat se ensució jugando. Necesita un baño.", efecto: (estado) => estado.higiene -= 10 },
    { mensaje: "🤢 KarKat se enfermó un poco. Tal vez necesita medicina.", efecto: (estado) => estado.salud -= 10 },
    { mensaje: "🤢 KarKat se comio a Vriska, Ahora esta enfermo", efecto: (estado) => estado.salud -= 10 },
    { mensaje: "🐱 KarKat Se volvio sigma ahora es famoso y esta feliz.", efecto: (estado) => estado.felicidad += 5 },
];

// Función principal que maneja los comandos
module.exports = async (socket, from, args) => {
    let estado = cargarEstado();
    
    verificarDespertar(estado);

    if (estado.durmiendo) {
        await socket.sendMessage(from, { text: "💤 KarKat está durmiendo. Vuelve más tarde." });
        return;
    }

    if (!args || args.length < 1) {
        await socket.sendMessage(from, { text: "📌 Usa *karkat estado* para ver su estado." });
        return;
    }

    const comando = args[0].toLowerCase();
    let respuesta = "";

    switch (comando) {
        case "estado":
            const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)];
            eventoAleatorio.efecto(estado);
            respuesta = `♋ *KarKat - HomeStuck* 📊
🩺 *Salud:* ${estado.salud}%
🍗 *Hambre:* ${estado.hambre}%
🎾 *Felicidad:* ${estado.felicidad}%
😴 *Energía:* ${estado.energia}%
🛁 *Higiene:* ${estado.higiene}%

📝 *Evento:* ${eventoAleatorio.mensaje}`;
            break;

        case "alimentar":
        case "comer":
            estado.hambre = Math.max(0, estado.hambre - 20);
            estado.salud = Math.min(100, estado.salud + 5);
            respuesta = "🍗 Alimentaste a KarKat. ¡Ahora tiene menos hambre!";
            break;

        case "jugar":
        case "pasear":
            estado.felicidad = Math.min(100, estado.felicidad + 20);
            estado.energia = Math.max(0, estado.energia - 10);
            estado.higiene = Math.max(0, estado.higiene - 10);
            respuesta = "🎾 Jugaste con KarKat. ¡Está más feliz!";
            break;

        case "dormir":
        case "mimir":
            estado.durmiendo = true;
            estado.despertarEn = Date.now() + 3600000; // 1 hora real (60 min * 60 sec * 1000 ms)
            respuesta = "😴 KarKat se ha dormido. Volverá en 1 hora.";
            break;

        case "curar":
        case "hospital":
            estado.salud = Math.min(100, estado.salud + 30);
            respuesta = "💊 Le diste medicina a KarKat. ¡Se siente mucho mejor!";
            break;

        case "bañar":
        case "ducha":
            estado.higiene = 100;
            respuesta = "🛁 Bañaste a KarKat. ¡Ahora está limpio y feliz!";
            break;

        default:
            respuesta = "❌ Comando no válido. Usa *karkat estado* para ver opciones.";
            break;
    }

    guardarEstado(estado);
    await socket.sendMessage(from, { text: respuesta });
};