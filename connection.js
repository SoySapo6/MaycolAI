// Hecho por Maycol

// Importaciones principales de @whiskeysockets/baileys
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, 
        isJidBroadcast, isJidStatusBroadcast, proto, isJidNewsletter, delay } = require("@whiskeysockets/baileys");

const config = require("./config");
const moment = require("moment");
const NodeCache = require("node-cache");
const pino = require("pino");
const { BAILEYS_CREDS_DIR } = require("./config");
const { runLite } = require("./index");
const { onlyNumbers } = require("./utils/functions");
const { textInput, infoLog, warningLog, errorLog, successLog, tutorLog, bannerLog, } = require("./utils/terminal");
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

    if (!socket.authState.creds?.pairingCode && !socket.authState.creds?.signedIdentityKey) {
  warningLog("Archivos necesarios no Encontrados.");

  let enableTutor = "s";

  do {
    if (!["s", "n"].includes(enableTutor)) {
      errorLog("Opción inválida");
    }
    enableTutor = await textInput("¿Deseas un tutorial? s/n : ");
  } while (!["s", "n"].includes(enableTutor));

  const phoneNumber = await textInput("Ingrese su número:");

  if (!phoneNumber || !onlyNumbers(phoneNumber)) {
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
    tutorLog("✅ Generación completada! Escanee el código QR para continuar...\n", "green");
    await delay(5000);
  }

  // Aquí removemos la línea que pide código directamente para que el socket gestione el QR
  // const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));
  // infoLog(`Código: ${code}`);

  // En cambio, podemos activar la impresión del QR en consola (temporal):
  socket.ev.on('connection.update', (update) => {
    if (update.qr) {
      infoLog(`Escanee este código QR con el número ${phoneNumber}:`);
      console.log(update.qr);  // o generar QR en terminal con una librería QR para mejor visualización
    }
  });
    }
  }
        try {
          // Cambiar la biografía del perfil del bot
          const nuevaBio = "★彡[ᴍᴀʏᴄᴏʟᴀɪ]彡★  ᴴᵉᶜʰᵒ ᵖᵒʳ ˢᵒʸᴹᵃʸᶜᵒˡ";
          await socket.updateProfileStatus(nuevaBio);
          successLog("✅ Biografía del bot actualizada a: " + nuevaBio);
        } catch (error) {
          errorLog("❌ Error al actualizar la biografía del bot.");
        }

        socket.ev.on("creds.update", saveCreds);
        socket.ev.on("messages.upsert", async ({ messages, type }) => {
          const msg = messages[0];
          if (!msg.message) return;

          const hora = moment().format("HH:mm:ss");
          const isGroup = msg.key.remoteJid.endsWith("@g.us");
          const senderID = isGroup ? msg.key.participant : msg.key.remoteJid;
          const mensajeTexto = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
          const tipoMensaje = mensajeTexto ? mensajeTexto : "Contenido Multimedia o Corrupto";
          const destino = isGroup ? `Grupo: ${msg.key.remoteJid}` : `Privado: ${senderID.replace(/@s\.whatsapp\.net/, "")}`;

          console.log(`✨🗨️ *Nuevo Mensaje* 💬

⏰ | Hora: ${hora} | ⏰

🌿💚 | Mensaje: ${tipoMensaje} | 💚🌿

👥📞 | Número/Grupo: ${destino} | 📞👥

🔮💫 ${config.BOT_NAME} te observa... 🔮💫\n`);

          runLite({ socket, data: { messages, type } });
        });
        socket.ev.on("group-participants.update", (data) => welcome({ socket, data }));

        return socket;
      }
    });

    return socket;
  } catch (error) {
    errorLog(`Error en la conexión: ${error.message}`);
    warningLog("Intentando reconectar en 1 segundo...");
    setTimeout(startConnection, 1000);
  }
}

startConnection();

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
