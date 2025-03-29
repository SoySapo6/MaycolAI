// Hecho por Maycol  
  
const {  
  default: makeWASocket,  
  DisconnectReason,  
  useMultiFileAuthState,  
  fetchLatestBaileysVersion,  
  isJidBroadcast,  
  isJidStatusBroadcast,  
  proto,  
  makeInMemoryStore,  
  isJidNewsletter,  
  delay,  
} = require("baileys");  
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
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });  
  
bannerLog();  
  
async function startConnection() {  
  try {  
    const { state, saveCreds } = await useMultiFileAuthState(BAILEYS_CREDS_DIR);  
    const { version } = await fetchLatestBaileysVersion();  
  
    const socket = makeWASocket({  
      version,  
      logger: pino({ level: "error" }),  
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
        if (!store) return proto.Message.fromObject({});  
        const msg = await store.loadMessage(key.remoteJid, key.id);  
        return msg ? msg.message : undefined;  
      },  
    });  
  
    if (!socket.authState.creds.registered) {  
      warningLog("Archivos necesarios no Encontrados.");  
  
      let enableTutor = "s";  
  
      do {  
        if (!["s", "n"].includes(enableTutor)) {  
          errorLog("Opción inválida");  
        }  
        enableTutor = await textInput("¿Deseas un tutorial? s/n : ");  
      } while (!["s", "n"].includes(enableTutor));  
  
      infoLog("Ingrese su número:");  
  
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
    }  
  
    socket.ev.on("connection.update", async (update) => {  
      const { connection, lastDisconnect } = update;  
  
      if (connection === "close") {  
        const statusCode = lastDisconnect?.error?.output?.statusCode;  
  
        if (statusCode === DisconnectReason.loggedOut) {  
          errorLog("Borre la carpeta baileys, Bot desconectado Permanentemente");  
          process.exit(1);  
        } else {  
          warningLog("Conexión perdida. Intentando reconectar en el menor tiempo posible...");  
          setTimeout(startConnection, 1);  
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
      }  
    });  
  
    socket.ev.on("creds.update", saveCreds);  
    socket.ev.on("messages.upsert", (data) => runLite({ socket, data }));  
    socket.ev.on("group-participants.update", (data) => welcome({ socket, data }));  
  
    return socket;  
  } catch (error) {  
    errorLog(`Error en la conexión: ${error.message}`);  
    warningLog("Intentando reconectar en 1 segundo...");  
    setTimeout(startConnection, 1000);  
  }  
}  
  
startConnection();  
  
// Manejo global de errores para evitar que el bot se cierre  
process.on("unhandledRejection", (reason, promise) => {  
  errorLog("Unhandled Promise Rejection:", reason);  
});  
  
process.on("uncaughtException", (error) => {  
  errorLog("Uncaught Exception:", error);  
});