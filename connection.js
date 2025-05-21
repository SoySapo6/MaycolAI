// 👻 Hecho por Maycol 🚽 Tematizado de Hanako-kun 👻

// Importaciones principales de @whiskeysockets/baileys 
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, isJidBroadcast, isJidStatusBroadcast, proto, isJidNewsletter, delay } = require("@whiskeysockets/baileys");

const config = require("./config"); 
const moment = require("moment"); 
const NodeCache = require("node-cache"); 
const pino = require("pino"); 
const { BAILEYS_CREDS_DIR } = require("./config"); 
const { runLite } = require("./index"); 
const { onlyNumbers } = require("./utils/functions"); 
const chalk = require("chalk"); // Añadimos chalk para colores arcoíris
const gradient = require("gradient-string"); // Añadimos gradient-string para texto gradiente
const figlet = require("figlet"); // Para texto ASCII art
const { 
  textInput, 
  infoLog, 
  warningLog, 
  errorLog, 
  successLog, 
  tutorLog, 
  bannerLog, 
} = require("./utils/terminal");
const { welcome } = require("./welcome");

// Arreglo de emojis de Hanako-kun
const hanakoEmojis = ["👻", "🚽", "✨", "🔮", "⚰️", "🖤", "💫", "🌸"];

// Función para obtener un emoji aleatorio
const randomEmoji = () => hanakoEmojis[Math.floor(Math.random() * hanakoEmojis.length)];

// Función para crear texto arcoiris
const rainbowText = (text) => {
  return gradient.rainbow(text);
};

// Caracteres especiales para decoración
const decorChars = ["༉‧₊˚✧", "•*¨*•.¸¸♪", "꒦꒷꒦꒷꒦꒷", "彡☆", "˚₊· ͟͟͞͞➳❥", "¸¸♬·¯·♩¸"];
const randomDecor = () => decorChars[Math.floor(Math.random() * decorChars.length)];

const msgRetryCounterCache = new NodeCache();

// Crear un logger silencioso para el store 
const storeLogger = pino({ level: 'fatal' });

// Función para crear un almacén en memoria simple 
function createSimpleStore() { 
  const messages = {};

  return { 
    loadMessage: async (jid, id) => { 
      return messages[`${jid}:${id}`] || null; 
    },

    storeMessage: async (msg) => {
      if (msg.key && msg.key.remoteJid && msg.key.id) {
        messages[`${msg.key.remoteJid}:${msg.key.id}`] = msg;
      }
    },

    bind: (ev) => {
      ev.on('messages.upsert', ({ messages: newMessages }) => {
        for (const msg of newMessages) {
          if (msg.key && msg.key.remoteJid && msg.key.id) {
            messages[`${msg.key.remoteJid}:${msg.key.id}`] = msg;
          }
        }
      });
    }
  }; 
}

// Crear un almacén simple 
const store = createSimpleStore();

// Banner personalizado de Hanako-kun
function customBannerLog() {
  console.log(`
${gradient.pastel("╔══════════════════════════════════════════════════╗")}
${gradient.pastel("║")}  ${chalk.magenta("🚽 𝕄𝕒𝕪𝕔𝕠𝕝𝔸𝕀 × 𝓗𝓪𝓷𝓪𝓴𝓸-𝓴𝓾𝓷 🚽")}  ${gradient.pastel("║")}
${gradient.pastel("╚══════════════════════════════════════════════════╝")}
${chalk.cyan("ʕ•́ᴥ•̀ʔっ♡")} ${chalk.yellow("Hola, soy el fantasma del baño número 7")} ${chalk.cyan("♡ʕ•́ᴥ•̀ʔっ")}
${gradient.rainbow("✧･ﾟ: *✧･ﾟ:* 𝐵𝒾𝑒𝓃𝓋𝑒𝓃𝒾𝒹𝑜 𝒶𝓁 𝑀𝓊𝓃𝒹𝑜 𝐸𝓈𝓅𝒾𝓇𝒾𝓉𝓊𝒶𝓁 *:･ﾟ✧*:･ﾟ✧")}
`);
}

// Reemplazar el banner original con nuestro banner personalizado
bannerLog = customBannerLog;
bannerLog();

let tutorialCompleto = false;
let intentosConexion = 0;
const MAX_INTENTOS = 3;

async function startConnection() { 
  try { 
    intentosConexion++;
    const { state, saveCreds } = await useMultiFileAuthState(BAILEYS_CREDS_DIR); 
    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      logger: pino({ level: "error" }), // solo muestra errores importantes
      printQRInTerminal: false,
      defaultQueryTimeoutMs: 60 * 1000,
      auth: state,
      shouldIgnoreJid: (jid) =>
        isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
      keepAliveIntervalMs: 60 * 1000,
      markOnlineOnConnect: true,
      msgRetryCounterCache,
      shouldSyncHistoryMessage: () => false,
      getMessage: async (key) => {
        try {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg ? msg.message : undefined;
        } catch (error) {
          return proto.Message.fromObject({});
        }
      },
    });

    // Enlazar nuestra store personalizada con el socket
    store.bind(socket.ev);

    // Configurar los manejadores de eventos primero
    socket.ev.on("creds.update", saveCreds);
    
    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          errorLog("🚽👻 " + chalk.redBright("Borre la carpeta baileys, Bot desconectado Permanentemente"));
          process.exit(1);
        } else {
          warningLog(`${randomEmoji()} ${chalk.yellowBright("Conexión perdida. Hanako-kun está intentando reconectar...")} ${randomEmoji()}`);
          if (intentosConexion < MAX_INTENTOS) {
            setTimeout(startConnection, 300); // Espera 300ms antes de reconectar
          } else {
            errorLog("👻 Demasiados intentos de reconexión fallidos. ¡Hanako-kun está cansado!");
            process.exit(1);
          }
        }
      } else if (connection === "open") {
        intentosConexion = 0; // Reiniciar contador de intentos
        successLog(`${randomDecor()} ${chalk.greenBright("¡El fantasma de Hanako-kun está presente!")} ${randomDecor()}`);

        try {
          // Cambiar la biografía del perfil del bot
          const nuevaBio = "🚽👻 ★彡[ʜᴀɴᴀᴋᴏ-ᴋᴜɴ × ᴍᴀʏᴄᴏʟᴀɪ]彡★ ꒷꒦꒷꒦ ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
          await socket.updateProfileStatus(nuevaBio);
          successLog("✅ " + chalk.cyanBright("Biografía del fantasma actualizada a: ") + chalk.magentaBright(nuevaBio));
        } catch (error) {
          errorLog("❌ " + chalk.redBright("Error al actualizar la biografía del fantasma."));
        }

        // Configurar manejadores de eventos para mensajes cuando la conexión está abierta
        socket.ev.on("messages.upsert", async ({ messages, type }) => {
          const msg = messages[0];
          if (!msg.message) return;

          const hora = moment().format("HH:mm:ss");
          const isGroup = msg.key.remoteJid.endsWith("@g.us");
          const senderID = isGroup ? msg.key.participant : msg.key.remoteJid;
          const mensajeTexto = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
          const tipoMensaje = mensajeTexto ? mensajeTexto : "Contenido Multimedia o Corrupto";
          const destino = isGroup ? `Grupo: ${msg.key.remoteJid}` : `Privado: ${senderID.replace(/@s\.whatsapp\.net/, "")}`;

          console.log(`
${gradient.passion("╔════════════════════════════════╗")}
${gradient.passion("║")} ${chalk.magentaBright("🔮 ✧ 𝑵𝒖𝒆𝒗𝒐 𝑴𝒆𝒏𝒔𝒂𝒋𝒆 𝑬𝒔𝒑𝒊𝒓𝒊𝒕𝒖𝒂𝒍 ✧ 🔮")} ${gradient.passion("║")}
${gradient.passion("╚════════════════════════════════╝")}

${chalk.cyanBright("⏰")} ${chalk.yellowBright("(⁠｡⁠･⁠ω⁠･⁠｡⁠)ﾉ⁠♡")} ${gradient.rainbow("𝑯𝒐𝒓𝒂: " + hora)}
${chalk.cyanBright("✉️")} ${chalk.yellowBright("⊂(⁠(⁠・⁠▽⁠・⁠)⁠)⁠⊃")} ${gradient.rainbow("𝑻𝒊𝒑𝒐 𝒅𝒆 𝑴𝒆𝒏𝒔𝒂𝒋𝒆: " + tipoMensaje)}
${chalk.cyanBright("👻")} ${gradient.rainbow("𝑵𝒖́𝒎𝒆𝒓𝒐/𝑮𝒓𝒖𝒑𝒐: " + destino)}

${chalk.magentaBright("━━━━━༺♥༻━━━━━")}
${chalk.cyan("🚽")} ${chalk.yellowBright(`*${config.BOT_NAME}*`)} ${chalk.whiteBright("te observa desde el baño número 7...")}
${chalk.magentaBright("¡𝑪𝒖𝒊𝒅𝒂𝒅𝒐 𝒔𝒊 𝒔𝒖𝒔𝒖𝒓𝒓𝒂 𝒕𝒖 𝒏𝒐𝒎𝒃𝒓𝒆!")} ${chalk.red("༼⁠⁰⁠o⁠⁰⁠；༽")}
${chalk.magentaBright("━━━━━༺♥༻━━━━━")}
`);

          runLite({ socket, data: { messages, type } });
        });
        
        socket.ev.on("group-participants.update", (data) => welcome({ socket, data }));
      }
    });

    // Proceso de vinculación (si es necesario)
    if (!socket.authState.creds.registered) {
      warningLog(gradient.rainbow("⚰️ ") + chalk.yellowBright("Archivos necesarios no Encontrados. Hanako-kun necesita vincularse.") + gradient.rainbow(" ⚰️"));

      if (!tutorialCompleto) { // Evitamos el bucle con esta variable
        tutorialCompleto = true; // Marcamos que ya pasamos por aquí
        let enableTutor = await textInput(gradient.rainbow("¿Deseas un tutorial? s/n : "));
        
        // Validamos la respuesta
        while (!["s", "n"].includes(enableTutor.toLowerCase())) {
          errorLog(chalk.redBright("Opción inválida") + " " + chalk.cyanBright("(⁠っ⁠˘̩⁠╭⁠╮⁠˘̩⁠)⁠っ"));
          enableTutor = await textInput(gradient.rainbow("¿Deseas un tutorial? s/n : "));
        }

        const phoneNumber = await textInput(chalk.cyanBright("Ingrese su número (ejemplo: 51921826291): "));

        if (!phoneNumber || !onlyNumbers(phoneNumber)) {
          errorLog(chalk.redBright("Número incorrecto, Ejemplo: 51921826291.") + " " + chalk.magentaBright("ಥ_ಥ"));
          process.exit(1);
        }

        if (enableTutor.toLowerCase() === "s") {
          await delay(1000);
          tutorLog(chalk.cyanBright("Hanako-kun está generando su código... Recuerda:") + "\n");
          await delay(5000);
          tutorLog(chalk.yellowBright("⌛ Generando código, aguarde.. 25% completado.") + " " + chalk.magentaBright("ʕ•ᴥ•ʔ") + "\n");
          await delay(10000);
          tutorLog(chalk.yellowBright("⌛ Generando código, aguarde... 50% completado.") + " " + chalk.magentaBright("(づ｡◕‿‿◕｡)づ") + "\n", "cyan");
          await delay(10000);
          tutorLog(chalk.yellowBright("⌛ Generando código, aguarde... 75% completado.") + " " + chalk.magentaBright("(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧") + "\n");
          await delay(10000);
          tutorLog(chalk.greenBright("✅ Generación completada! Hanako-kun está enviando el código...") + " " + chalk.magentaBright("ヽ(^o^)ノ") + "\n", "green");
          await delay(5000);
        }

        const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
        infoLog(gradient.rainbow(`Código de Hanako-kun: ${code}`));
        
        // Informar al usuario que debe completar el proceso de vinculación
        successLog(chalk.greenBright("Por favor, complete el proceso de vinculación ingresando el código en su WhatsApp."));
        successLog(chalk.cyanBright("Esperando a que se complete la vinculación con el mundo espiritual...") + " " + chalk.magentaBright("(∩｡･ｪ･｡)っ.ﾟ☆｡'`"));
      }
    }

    return socket;
  } catch (error) { 
    errorLog(`${randomEmoji()} ${chalk.redBright("Error en la conexión espiritual: " + error.message)} ${randomEmoji()}`); 
    warningLog(chalk.yellowBright("Hanako-kun intentará reconectar en 1 segundo...")); 
    setTimeout(startConnection, 1000);
    return null; 
  } 
}

// Iniciar el bot
const mainBot = startConnection();

// Manejo global de errores para evitar que el bot se cierre 
process.on("uncaughtException", function (err) { 
  if (!err.message.includes("No SenderKeyRecord found")) { 
    console.error(chalk.redBright("Hanako-kun encontró un error no manejado:"), err); 
  } 
});

process.on("unhandledRejection", function (reason) { 
  if (!String(reason).includes("No SenderKeyRecord found")) { 
    console.error(chalk.redBright("Hanako-kun rechazó una promesa:"), reason); 
  } 
});

// Mensaje de despedida al cerrar
process.on("SIGINT", function() {
  console.log(`
${gradient.pastel("╔══════════════════════════════════════════════════╗")}
${gradient.pastel("║")}  ${chalk.magenta("👻 𝕄𝕒𝕪𝕔𝕠𝕝𝔸𝕀 × 𝓗𝓪𝓷𝓪𝓴𝓸-𝓴𝓾𝓷 se despide 👻")}  ${gradient.pastel("║")}
${gradient.pastel("╚══════════════════════════════════════════════════╝")}
${chalk.cyan("(っ˘̩╭╮˘̩)っ")} ${chalk.yellow("Hanako-kun volverá al baño número 7...")} ${chalk.cyan("(っ˘̩╭╮˘̩)っ")}
${gradient.rainbow("✧･ﾟ: *✧･ﾟ:* 𝐺𝓇𝒶𝒸𝒾𝒶𝓈 𝓅𝑜𝓇 𝒾𝓃𝓋𝑜𝒸𝒶𝓇𝓂𝑒 *:･ﾟ✧*:･ﾟ✧")}
  `);
  process.exit(0);
});
