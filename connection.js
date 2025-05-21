// Hecho por Maycol

// Importaciones principales de @whiskeysockets/baileys 
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, isJidBroadcast, isJidStatusBroadcast, proto, isJidNewsletter, delay } = require("@whiskeysockets/baileys");

const config = require("./config"); 
const moment = require("moment"); 
const NodeCache = require("node-cache"); 
const pino = require("pino"); 
const { BAILEYS_CREDS_DIR } = require("./config"); 
const { runLite } = require("./index"); 
const { onlyNumbers } = require("./utils/functions"); 
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

bannerLog();

async function startConnection() { 
  try { 
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
          errorLog("Borre la carpeta baileys, Bot desconectado Permanentemente");
          process.exit(1);
        } else {
          warningLog("Conexión perdida. Intentando reconectar en el menor tiempo posible...");
          setTimeout(startConnection, 300); // Espera 300ms antes de reconectar
        }
      } else if (connection === "open") {
        successLog("¡El bot está conectado exitosamente!");

        try {
          // Cambiar la biografía del perfil del bot
          const nuevaBio = "★彡[ᴍᴀʏᴄᴏʟᴀɪ]彡★  ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
          await socket.updateProfileStatus(nuevaBio);
          successLog("✅ Biografía del bot actualizada a: " + nuevaBio);
        } catch (error) {
          errorLog("❌ Error al actualizar la biografía del bot.");
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
╔════════════════════════════╗
║      🔮 ✧ 𝑵𝒖𝒆𝒗𝒐 𝑴𝒆𝒏𝒔𝒂𝒋𝒆 ✧ 🔮     ║
╚════════════════════════════╝

⏰ (⁠｡⁠･⁠ω⁠･⁠｡⁠)ﾉ⁠♡ 𝑯𝒐𝒓𝒂: ${hora}
✉️ ⊂(⁠(⁠・⁠▽⁠・⁠)⁠)⁠⊃ 𝑻𝒊𝒑𝒐 𝒅𝒆 𝑴𝒆𝒏𝒔𝒂𝒋𝒆: ${tipoMensaje}
✧༚ 𝑵𝒖́𝒎𝒆𝒓𝒐/𝑮𝒓𝒖𝒑𝒐: ${destino} ༚✧

━━━━━༺༻━━━━━
🚽 *${config.BOT_NAME}* te observa desde el baño…
¡𝑪𝒖𝒊𝒅𝒂𝒅𝒐 𝒔𝒊 𝒔𝒖𝒔𝒖𝒓𝒓𝒂 𝒕𝒖 𝒏𝒐𝒎𝒃𝒓𝒆! ༼⁠⁰⁠o⁠⁰⁠；༽
━━━━━༺༻━━━━━
`);

          runLite({ socket, data: { messages, type } });
        });
        
        socket.ev.on("group-participants.update", (data) => welcome({ socket, data }));
      }
    });

    // Proceso de vinculación (si es necesario)
    if (!socket.authState.creds.registered) {
      warningLog("Archivos necesarios no Encontrados.");

      let enableTutor = "s";

      do {
        if (!["s", "n"].includes(enableTutor)) {
          errorLog("Opción inválida");
        }
        enableTutor = await textInput("¿Deseas un tutorial? s/n : ");
      } while (!["s", "n"].includes(enableTutor));

      const phoneNumber = await textInput("Ingrese su número:");

      if (!phoneNumber) {
        errorLog("Número incorrecto, Ejemplo: 51921826291.");
        process.exit(1);
      }

      if (enableTutor === "s") {
        await delay(1000);
        tutorLog("Estamos generando su código... Recuerda:\n");
        await delay(5000);
        tutorLog("⌛ Generando código, aguarde.. 25% completado.\n");
        await delay(10000);
        tutorLog("⌛ Generando código, aguarde... 50% completado.\n", "cyan");
        await delay(10000);
        tutorLog("⌛ Generando código, aguarde... 75% completado.\n");
        await delay(10000);
        tutorLog("✅ Generación completada! Enviando código...\n", "green");
        await delay(5000);
      }

      const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
      infoLog(`Código: ${code}`);
      
      // Informar al usuario que debe completar el proceso de vinculación
      successLog("Por favor, complete el proceso de vinculación ingresando el código en su WhatsApp.");
      successLog("Esperando a que se complete la vinculación...");
    }

    // No devuelvas el socket dentro del event listener
    return socket;
  } catch (error) { 
    errorLog(`Error en la conexión: ${error.message}`); 
    warningLog("Intentando reconectar en 1 segundo..."); 
    setTimeout(startConnection, 1000);
    return null; 
  } 
}

// Iniciar el bot
const mainBot = startConnection();

// Manejo global de errores para evitar que el bot se cierre 
process.on("uncaughtException", function (err) { 
  if (!err.message.includes("No SenderKeyRecord found")) { 
    console.error("Uncaught Exception:", err); 
  } 
});

process.on("unhandledRejection", function (reason) { 
  if (!String(reason).includes("No SenderKeyRecord found")) { 
    console.error("Unhandled Rejection:", reason); 
  } 
});
