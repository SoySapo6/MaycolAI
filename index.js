//Creado por Maycol
 function mapearLenguaje(comando) {
    const lenguajes = {
        "ejecutar": "javascript",
        "ejecutarjs": "javascript",
        "ejecutarpy": "python",
        "ejecutarc": "c",
        "ejecutarcpp": "cpp",
        "ejecutarjava": "java"
    };

    if (!lenguajes[comando]) {
        return null; // O puedes devolver "javascript" por defecto si quieres evitar errores
    }

    return lenguajes[comando];
}
function convertirMp4aMp3(videoPath, mp3Path) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${videoPath}" -q:a 0 -map a "${mp3Path}" -y`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error al convertir a MP3: ${stderr}`);
            } else {
                resolve(mp3Path);
            }
        });
    });
}
const { duoAI } = require("./services/duoai");
const ejecutarTermux = require("./services/termux");
const { generarImagenConTexto } = require('./services/attp');
const { generarGifConTexto } = require('./services/attpgif');
const { comandoIncorrecto } = require("./services/comando_incorrecto");
const axios = require("axios");
const { descargarAPK } = require("./services/apkpure");
const { simi } = require('./services/Simi');
const { getAdReplyScript } = require("./services/AdReply");
const { obtenerInformacionBot } = require("./services/script");
const { obtenerTTS } = require("./services/tts"); // ✅ Importación correcta
const { obtenerChiste, getAdReplyChiste } = require("./services/chistes");
const loadService = (service) => import(`./services/${service}.js`).then((m) => m.default);
const menuowner = require("./services/menuowner");
const dalle = require("./services/dalle");
const news = require("./services/News");
const tempmail = require("./services/TempMail");
const deepseek = require("./services/deepseek");
const stream = require("./services/stream");
const { chatOpenRouter } = require("./services/openrouter.js");
const { chatIAPE } = require("./services/iaperuana.js");
const { roleplay } = require("./services/roleplay.js");
const rolePlayAI = require("./services/characterai.js");
const { exec } = require("child_process");
const client = require('./connection.js');
const { chatb } = require("/storage/emulated/0/Gatito-mi-bot/services/beast.js");
const { chatm } = require("/storage/emulated/0/Gatito-mi-bot/services/mia.js");
 const { ejecutarCodigo } = require("./services/glot");
 const { buscarEnGoogle } = require("./services/googleSearch.js");
const { getTenorGif } = require("./services/tenor");
const fs = require('fs');
const { descargarVideo } = require("./services/Youtubedescarga");
const { buscarEnYoutube } = require("./services/Youtube");
const { chat } = require("/storage/emulated/0/Gatito-mi-bot/services/Gemini.js");
const path = require("node:path");
const { ASSETS_DIR, BOT_NUMBER, SPIDER_API_TOKEN, API_darkstartsz, NAME_darkstartsz } = require("./config");
const { errorLog } = require("./utils/terminal");
const {
  attp,
  ttp,
  gpt4,
  playAudio,
  playVideo,
} = require("./services/spider-x-api");
const { consultarCep } = require("correios-brasil/dist");

const {
  InvalidParameterError,
  WarningError,
  DangerError,
} = require("./errors");

const {
  checkPrefix,
  deleteTempFile,
  download,
  formatCommand,
  getBuffer,
  getContent,
  getJSON,
  getProfileImageData,
  getRandomName,
  getRandomNumber,
  isLink,
  loadLiteFunctions,
  onlyLettersAndNumbers,
  onlyNumbers,
  removeAccentsAndSpecialCharacters,
  splitByCharacters,
  toUserJid,
} = require("./utils/functions");

const {
  activateAntiLinkGroup,
  deactivateAntiLinkGroup,
  isActiveAntiLinkGroup,
  activateWelcomeGroup,
  isActiveGroup,
  deactivateWelcomeGroup,
  activateGroup,
  deactivateGroup,
} = require("./database/db");

async function runLite({ socket, data }) {
  const functions = loadLiteFunctions({ socket, data });

  if (!functions) {
    return;
  }

  const {
    args,
    body,
    command,
    from,
    fullArgs,
    info,
    isImage,
    isReply,
    isSticker,
    isVideo,
    lite,
    prefix,
    replyJid,
    userJid,
    audioFromURL,
    ban,
    downloadImage,
    downloadSticker,
    downloadVideo,
    errorReact,
    errorReply,
    imageFromFile,
    imageFromURL,
    isAdmin,
    isOwner,
    react,
    recordState,
    reply,
    sendText,
    stickerFromFile,
    stickerFromInfo,
    stickerFromURL,
    successReact,
    successReply,
    typingState,
    videoFromURL,
    waitReact,
    waitReply,
    warningReact,
    warningReply,
  } = functions;

  if (!isActiveGroup(from) && !(await isOwner(userJid))) {
    return;
  }

  if (!checkPrefix(prefix)) {
    /**
     * ⏩ Um auto responder simples ⏪
     *
     * Se a mensagem incluir a palavra
     * (ignora maiúsculas e minúsculas) use:
     * body.toLowerCase().includes("palavra")
     *
     * Se a mensagem for exatamente igual a
     * palavra (ignora maiúsculas e minúsculas) use:
     * body.toLowerCase() === "palavra"
     */
    if (body.toLowerCase().includes("Wao")) {
      await reply("Increíble 🫢");
      return;
    }

    if (body === "Hola") {
      await reply("Hola, Soy MaycolAI. Si quieres uaar el bot usa .menu");
      return;
    }

    // ⬇ Coloque mais respostas do auto-responder abaixo ⬇

    // ⬆ Coloque mais respostas do auto-responder acima ⬆
  }

  /**
   * 🚫 Anti-link 🔗
   */
  if (
    !checkPrefix(prefix) &&
    isActiveAntiLinkGroup(from) &&
    isLink(body) &&
    !(await isAdmin(userJid))
  ) {
    await ban(from, userJid);
    await reply("¡Anti-enlace activado! Te han eliminado por enviar un enlace!");

    return;
  }

  /**
   * Se não houver um
   * prefixo, não faça nada.
   */
  if (!checkPrefix(prefix)) {
    return;
  }

  try {
    /**
     * Aqui você vai definir
     * as funções que
     * o seu bot vai executar via "cases".
     *
     * ⚠ ATENÇÃO ⚠: Não traga funções
     * ou "cases" de
     * outros bots para cá
     * sem saber o que está fazendo.
     *
     * Cada bot tem suas
     * particularidades e,
     * por isso, é importante
     * tomar cuidado.
     * Não nos responsabilizamos
     * por problemas
     * que possam ocorrer ao
     * trazer códigos de outros
     * bots pra cá,
     * na tentativa de adaptação.
     *
     * Toda ajuda será *COBRADA*
     * caso sua intenção
     * seja adaptar os códigos
     * de outro bot para este.
     *
     * ✅ CASES ✅
     */
    switch (removeAccentsAndSpecialCharacters(command?.toLowerCase())) {
      case "antilink":
        if (!args.length) {
          throw new InvalidParameterError(
            "¡Debes ingresar 1 o 0 (activado o desactivado)!"
          );
        }

        const antiLinkOn = args[0] === "1";
        const antiLinkOff = args[0] === "0";

        if (!antiLinkOn && !antiLinkOff) {
          throw new InvalidParameterError(
            "¡Debes ingresar 1 o 0 (activado o desactivado)!"
          );
        }

        if (antiLinkOn) {
          activateAntiLinkGroup(from);
        } else {
          deactivateAntiLinkGroup(from);
        }

        await successReact();

        const antiLinkContext = antiLinkOn ? "activado" : "desactivado";

        await reply(`Activado ${antiLinkContext} Exitosamente ⚡👻!`);
        break;
        case "dog":
        await reply("Guau Guau 🐶");
    await require("./services/dog")(socket, from);
    break;
case "karkat":
    await require("./services/KarKat")(socket, from, args);
    break;
    case "attp":
  await require("./services/attp")(socket, from, args);
  break;
        case "deepseek":
    await reply("Generando Respuesta... Espera ^^");
    await deepseek.execute(socket, from, args);
    break;
    case "script":
    await socket.sendMessage(from, { text: obtenerInformacionBot(), ...getAdReplyScript() });
    break;
case "stream":
    await stream.execute(socket, from, args);
    break;
    case "playaudio":
    case "play":
    await require("./services/SoundCloud").execute(socket, from, args);
    break;
case "dalle":
    await require("./services/dalle").execute(socket, from, args);
    break;
    case "news":
    await reply("Buscando Noticias, Espera ^^");
    await news.execute(socket, from);
    break;
    case "tempmail":
    await tempmail.execute(socket, from, args);
    break;
case "menu":
    await successReact();
    await successReply("¡Aquí tienes el menú!");

    // Obtener el AdReply
    let adReplyMenu = getAdReplyScript(); // Llama a la función para obtener el AdReply

    // Enviar el menú con el MP4 y AdReply
    await socket.sendMessage(from, {
        video: { url: path.join(ASSETS_DIR, "images", "menu.mp4") }, // Usamos el MP4 optimizado
        caption: await menuowner(), // Llamamos a menuowner() para obtener el texto del menú
        gifPlayback: true, // Hace que se vea como GIF
        mimetype: "video/mp4",
        contextInfo: adReplyMenu.contextInfo // Adjuntamos el AdReply aquí
    });

    break;
    case "qr":
case "qrsticker":
    await waitReply("Generando QR Esperame ^^");
    if (!args.length) {
        await socket.sendMessage(from, { text: "📌 *Uso correcto:* qr (contenido) / qrsticker (contenido)" });
        break;
    }
    
    const qrText = args.join(" ");
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`;
    const fileName = `./stickers/qr_${Date.now()}.png`;

    try {
        // Descargar la imagen QR
        const res = await fetch(qrUrl);
        const buffer = await res.arrayBuffer();
        await fs.promises.writeFile(fileName, Buffer.from(buffer));

        // Enviar como sticker o imagen
        if (command === "qr") {
            await socket.sendMessage(from, { image: { url: fileName }, caption: "✅ *Código QR generado*" });
        } else {
            await socket.sendMessage(from, { sticker: { url: fileName } });
        }

        // Eliminar el archivo después de enviarlo
        await fs.promises.unlink(fileName);
    } catch (error) {
        await socket.sendMessage(from, { text: "❌ Error al generar el QR." });
        console.error(error);
    }
    break;
      case "ban":
      case "banir":
      case "kick":
        if (!(await isAdmin(userJid))) {
          throw new DangerError(
            "Que te Crees? Maycol/Admin o Que 🫵😂"
          );
        }

        if (!args.length && !isReply) {
          throw new InvalidParameterError(
            "¡Debes mencionar o etiquetar a un miembro!"
          );
        }

        const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
        const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

        if (
          memberToRemoveNumber.length < 7 ||
          memberToRemoveNumber.length > 15
        ) {
          throw new InvalidParameterError("Número inválido!");
        }

        if (memberToRemoveJid === userJid) {
          throw new DangerError("¡No puedes quitarlo tú mismo!");
        }

        const botJid = toUserJid(BOT_NUMBER);

        if (memberToRemoveJid === botJid) {
          throw new DangerError("¡No puedes eliminarme!");
        }

        await ban(from, memberToRemoveJid);

        await successReact();

        await reply("Bueno, yo hice mi trabajo.");
        break;
      case "cep":
        const cep = args[0];

        if (!cep || ![8, 9].includes(cep.length)) {
          throw new InvalidParameterError(
            "Debe enviar un código postal en el formato 00000-000 o 00000000!"
          );
        }

        const data = await consultarCep(cep);

        if (!data.cep) {
          await warningReply("CEP não encontrado!");
          return;
        }

        await successReply(`*Resultado*
        
*CEP*: ${data.cep}
*Logradouro*: ${data.logradouro}
*Complemento*: ${data.complemento}
*Bairro*: ${data.bairro}
*Localidade*: ${data.localidade}
*UF*: ${data.uf}
*IBGE*: ${data.ibge}`);
        break;
      case "bot":
case "ia":
case "lite":
  const text = args.join(" "); // Unir los argumentos en caso de múltiples palabras

  if (!text) {
    throw new InvalidParameterError("Ingresa un texto para hablar conmigo");
  }

  await waitReply("Maycol AI está procesando su solicitud 🤓");

  try {
    const responseText = await chat(text);
    await successReply(responseText);
  } catch (error) {
    await errorReply("Hubo un error al obtener la respuesta de Gemini 🤖");
    console.error(error);
  }
        break;
        case "getfile":
  try {
    if (!(await isOwner(userJid))) {
      return socket.sendMessage(from, { text: "❌ No tienes permisos para usar este comando." });
    }

    if (!args[0]) {
      // Listar archivos en segundo plano sin mostrar en la terminal
      const { exec } = require("child_process");
      exec("ls", { cwd: __dirname }, (error, stdout) => {
        if (error) {
          return socket.sendMessage(from, { text: "❌ Error al listar archivos." });
        }
        socket.sendMessage(from, { text: `📂 Archivos disponibles:\n${stdout}` });
      });
      return;
    }

    // Verificar que el archivo solicitado esté dentro de la carpeta del bot
    const filePath = `${__dirname}/${args[0]}`;
    if (!fs.existsSync(filePath)) {
      return socket.sendMessage(from, { text: "❌ Archivo no encontrado." });
    }

    // Enviar el archivo
    await socket.sendMessage(from, { document: fs.readFileSync(filePath), fileName: args[0] });
  } catch (err) {
    console.error(err);
    socket.sendMessage(from, { text: "❌ Ocurrió un error al procesar el comando." });
  }
  break;
      case "on":
        if (!(await isOwner(userJid))) {
          throw new DangerError(
            "Que te Crees? Maycol o Que 🫵😂"
          );
        }

        activateGroup(from);

        await successReply("Bot activado en el grupo!");
        break;
        case "attpgif":
    const textogif = args.join(' '); // Tomamos el texto que sigue a "attpgif"
    if (!textogif) {
      await socket.sendMessage(from, { text: 'Por favor, ingresa el texto para crear el gif.' });
      break;
    }

    try {
      // Llamamos a la función que genera el video con el texto
      const videoGenerado = await generarGifConTexto(textogif);

      // Enviar el video como si fuera un GIF
      await socket.sendMessage(from, {
        video: { url: videoGenerado },
        caption: 'Aquí está tu video con el texto cambiando de color.',
        gifPlayback: true, // Esto hace que se vea como GIF
        mimetype: "video/mp4"
      });

      // Eliminamos el video para liberar espacio
      fs.unlinkSync(videoGenerado);
    } catch (error) {
      await socket.sendMessage(from, { text: 'Hubo un error al generar el video. Por favor, intenta de nuevo más tarde.' });
    }
    break;
    case "attp":
    const texto = args.join(' '); // Tomamos el texto que sigue a "attp"
    if (!texto) {
      await socket.sendMessage(from, { text: 'Por favor, ingresa el texto para crear la imagen.' });
      break;
    }

    try {
      // Llamamos a la función que genera la imagen con el texto
      const imagenGenerada = await generarImagenConTexto(texto);

      // Enviamos la imagen
      await socket.sendMessage(from, { image: fs.readFileSync(imagenGenerada), caption: 'Aquí está tu imagen con el texto.' });

      // Eliminamos la imagen para liberar espacio
      fs.unlinkSync(imagenGenerada);
    } catch (error) {
      await socket.sendMessage(from, { text: 'Hubo un error al generar la imagen. Por favor, intenta de nuevo más tarde.' });
    }
    break;
    case "termux":
    if (!args.length) {
        await socket.sendMessage(from, { text: "❌ *Debes escribir un comando para ejecutar.*" });
        return;
    }
    await ejecutarTermux(socket, from, args.join(" "));
    break;
case "perro":
  await react("🐶");
  await reply("Obteniendo una foto de un perro...");
  
  try {
    // Realizamos la petición a la URL de la API
    const response = await axios.get('https://9d8bf1c7-058e-43a6-9ddf-f49848225e45-00-fx4xgpqmoyrg.spock.repl.co/', {
      headers: {
        'Authorization': 'Bearer maycol_pk_0d112c26ee9c4a92b73ff4ddbe1b9a0e'
      }
    });

    // Asegúrate de que 'response.data' contiene la URL de la imagen
    const dogImageUrl = response.data.url; // Aquí aseguramos que la URL sea la correcta

    // Verifica si la URL está disponible y no es indefinida
    if (dogImageUrl) {
      await reply("Aquí tienes tu foto de perro:");
      await sock.sendMessage(from, { image: { url: dogImageUrl }, caption: '¡Mira este perro! 🐶' });
    } else {
      await reply("No se pudo obtener la imagen del perro.");
    }

  } catch (error) {
    console.error('Error al obtener la foto del perro:', error);
    await reply("Lo siento, no pude obtener la foto de un perro en este momento.");
  }
  break;
  case "setpass":
    await require("./services/setpass")(socket, from, args);
    break;
      case "doxeo":
        await react("💻");
        await reply("Subiendo toda la informacion a la Deep Web")
        await reply("Subido con Exito!");
        break;
        case "ytvideo":
await socket.sendMessage(from, { text: "Descargando video... Espere ^^" });
    if (!args.length) {
        await socket.sendMessage(from, { text: "⚠️ Ingresa el nombre del video." });
        break;
    }

    try {
        const videoPath = await descargarVideo(args.join(" "));
        await socket.sendMessage(from, { text: "🎥 Video descargado!, enviando..." });
        await socket.sendMessage(from, { video: { url: videoPath }, caption: "Tome ^^" });
    } catch (error) {
        console.error("Error al descargar el video:", error);
        await socket.sendMessage(from, { text: `❌ Error al descargar: ${error.message || error}` });
    }
    break;
    case "prueba":
    await react("✅");  // Agregar una reacción para mayor interactividad
    await reply("Este es un mensaje de prueba con AdReply.");

    // Crear el AdReply con la función importada
    const adReply = getAdReplyScript();

    // Enviar el mensaje con AdReply
    await socket.sendMessage(from, {
        text: "Está es una prueba con AdReply.",
        contextInfo: adReply.contextInfo  // Incluir el AdReply en el mensaje
    });
    break;
    case "flux":
    {
        const fluxService = await loadService("flux");
if (fluxService) await fluxService(socket, from, args.join(" "));
    }
    break;
case "apk":
    if (!args[0]) {
        await socket.sendMessage(from, { text: "⚠️ Usa el comando correctamente: apk <enlace>" });
        return;
    }

    let enlaceAPK = body.substring(body.indexOf(" ") + 1).trim();
    console.log("🔗 Enlace recibido:", enlaceAPK); 

    await descargarAPK(socket, from, enlaceAPK);
    break;
    case "emojimix":
    await require("./services/emojimix")(socket, from, text);
    break;
    case "spotify":
case "music":
  await import("./services/spotify.js").then((mod) => mod.default(socket, from, args.join(" ")));
  break;
case "ytsearch":
        await react("📺"); // Reacciona con un emoji de TV
        const consulta = args.join(" "); // Obtiene la consulta del usuario

        if (!consulta) {
            await reply("❌ *Debes escribir algo para buscar en YouTube.*\n\nEjemplo: *yt música relajante*");
            break;
        }

        await reply(`🔍 Buscando en YouTube: *${consulta}*...`);

        const resultados = await buscarEnYoutube(consulta);

        if (resultados.length === 0) {
            await reply("❌ No encontré videos en YouTube para esa búsqueda.");
        } else {
            let respuesta = "📺 *Resultados en YouTube:*\n\n";
            resultados.forEach((video, i) => {
                respuesta += `${i + 1}. *${video.titulo}*\n${video.url}\n\n`;
            });
            await reply(respuesta);
        }
        break;
      case "creador":
        await react("🤓");
        await reply("SoyMaycol, Maycol te Manda Saludos");
        break
case "info":
case "status":
case "estado":
case "infobot":
  await require("./services/info")(socket, from);
  break;
case "ytmp3doc":
    await socket.sendMessage(from, { text: "Descargando audio... Espere ^^" });

    if (!args.length) {
        await socket.sendMessage(from, { text: "⚠️ Ingresa el nombre del video." });
        break;
    }

    try {
        const videoPath = await descargarVideo(args.join(" "));
        await socket.sendMessage(from, { text: "🎧 Enviando Audio..." });

        // Convertir a MP3
        const mp3Path = videoPath.replace(".mp4", ".mp3");
        await convertirMp4aMp3(videoPath, mp3Path);

        // Enviar el archivo MP3
        await socket.sendMessage(from, { 
            document: { url: mp3Path }, 
            mimetype: "audio/mpeg", 
            fileName: "MaycolAI_Audio.mp3", 
            caption: "Tome mi amig@ 🤓" 
        });

        // Eliminar archivos después de enviarlos
        fs.unlinkSync(videoPath);
        fs.unlinkSync(mp3Path);
    } catch (error) {
        console.error("Error al descargar o convertir:", error);
        await socket.sendMessage(from, { text: `❌ Error: ${error.message || error}` });
    }

    break;
    case "gupdategit":
    await react("🤓");
    await reply("Actualizando GitHub, Espere ^^");
    await require("./services/update")(socket, from);
    break;
        case "bug":
    if (!fullArgs.length) {
        throw new InvalidParameterError("Debes ingresar un mensaje de error.");
    }

    // Ruta de la carpeta Bugs
    const bugsDir = path.join(__dirname, "Bugs");

    // Verificar si la carpeta Bugs existe, si no, crearla
    if (!fs.existsSync(bugsDir)) {
        fs.mkdirSync(bugsDir, { recursive: true });
    }

    // Nombre del archivo basado en la fecha y hora
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const bugFile = path.join(bugsDir, `bug-${timestamp}.txt`);

    // Guardar el contenido en el archivo
    fs.writeFileSync(bugFile, fullArgs, "utf8");

    await successReply("🐞 Bug reportado exitosamente. Gracias por tu ayuda!");
    break;
    case "gupdatebot":
    await require("./services/updatebot")(socket, from);
    break;
    case "despiertamaycol":
    await react("🔊");
    await reply("¡Despierta Maycol! 🔥");

    // Reproducir el audio en Termux con volumen alto
    const { exec } = require("child_process");
    exec('mpv --volume=100 "/storage/emulated/0/Gatito-mi-bot/audios/despiertamaycol.mp3"');

    break;
        case "grupo":
        await react("💬");
        await reply("https://chat.whatsapp.com/JZKpCJLq8GZ3uEzsxzR7u8");
        break;
        case "money1":
        await reply("Comando Secreto!");
        await react("🤑");
        await reply("Espere un Momento...");
        await reply("Se ha transferido 100$ a su cuenta bancaria");
        break;
        case "gif":
    if (!args.length) {
        await socket.sendMessage(from, { text: "Debes escribir algo para buscar un GIF. Ejemplo: gif gatos" });
        break;
    }

    let query = args.join(" ");
    let gifUrl = await getTenorGif(query);

    if (gifUrl) {
        await socket.sendMessage(from, { video: { url: gifUrl }, caption: "Aquí tienes tu GIF." });
    } else {
        await socket.sendMessage(from, { text: "No se encontró ningún GIF para tu búsqueda." });
    }
    break;
case "chiste":
    await react("🤣");
    await reply("Mira, escucha este jsjs");

    let chiste = obtenerChiste();
    let adReplyc = getAdReplyChiste();

    await socket.sendMessage(from, { text: chiste, ...adReplyc });
    break;
    case "nsfw":
case "openrouter":
    const userMessage = args.join(" ");
    if (!userMessage) {
        await reply("Por favor, ingresa un mensaje para hablar conmigo.");
        break;
    }

    await waitReply("Procesando tu solicitud con OpenRouter...");

    try {
        const respuesta = await chatOpenRouter(userMessage);
        await successReply(respuesta);
    } catch (error) {
        await errorReply("Hubo un error al obtener la respuesta de OpenRouter.");
    }
    break;
    case "duoai":
    await reply("Espere, Generando Respuesta ^^");
    if (!args.length) {
        socket.sendMessage(from, { text: "❌ Debes escribir un mensaje para iniciar la conversación." });
        break;
    }
    const mensajeDuoAI = await duoAI(args.join(" "));
    socket.sendMessage(from, { text: mensajeDuoAI });
    break;
case "ejecutar":
case "ejecutarjs":
case "ejecutarpy":
case "ejecutarc":
case "ejecutarcpp":
case "ejecutarjava":
    if (!args[0]) {
        socket.sendMessage(from, { text: `Uso: *${command} (código)*` });
        break;
    }

    let lenguaje = mapearLenguaje(command); // Mapea el lenguaje correctamente

    if (!lenguaje) {
        socket.sendMessage(from, { text: "Lenguaje no soportado." });
        break;
    }

    let codigo = body.slice(command.length + 1).trim(); // Extrae el código sin espacios extra

    ejecutarCodigo(lenguaje, codigo)
        .then(resultado => {
            socket.sendMessage(from, { text: "Resultado:\n```" + resultado + "```" });
        })
        .catch(err => {
            socket.sendMessage(from, { text: "Error al ejecutar el código." });
        });
    break;
    case "audio":
    if (!args.length) {
        await socket.sendMessage(from, { text: "Debes escribir el nombre del audio. Ejemplo: audio ahogado" });
        break;
    }

    const audioName = args.join("").toLowerCase() + ".mp3"; // Convierte el nombre a minúsculas y le añade ".mp3"
    const audioPath = path.join(__dirname, "audios", audioName);

    // Verificar si el archivo existe
    if (fs.existsSync(audioPath)) {
        await socket.sendMessage(from, {
            audio: { url: audioPath },
            mimetype: "audio/mpeg"
        });
    } else {
        await socket.sendMessage(from, { text: "❌ No encontré ese audio. Prueba con otro nombre." });
    }
    break;
    case 'simi':
    // Verificar si se pasó texto
    const textsimi = args.join(' '); // Unimos los argumentos que pasaron
    await simi(socket, from, textsimi); // Llamamos a la función simi
    break;
case 'audios':
    const imagePath = './assets/images/audios.png';

    try {
        await socket.sendMessage(from, { image: { url: imagePath }, caption: "🎧 *Menú de Audios* 🎧" });
    } catch (error) {
        console.error("Error al enviar la imagen:", error);
    }
    break;
    case 'besar':
    const imagePathbeso = './assets/images/beso.gif';

    try {
        await socket.sendMessage(from, { image: { url: imagePathbeso }, caption: "Jsjs" });
    } catch (error) {
        console.error("Error al enviar la imagen:", error);
    }
    break;
    case 'trolear':
    const imagePathtroll = './assets/images/troll.gif';

    try {
        await socket.sendMessage(from, { image: { url: imagePathtroll }, caption: "JAJSJ IDIOTA" });
    } catch (error) {
        console.error("Error al enviar la imagen:", error);
    }
    break;
    case "tts":
    await waitReply("Generando TTS, Espere ^^");
  if (!args.length) return reply("Uso: tts <texto>");
  
  let ttsPath = await obtenerTTS(args.join(" "));
  
  if (ttsPath) {
    await socket.sendMessage(from, { audio: { url: ttsPath }, mimetype: "audio/mp4" });
    fs.unlinkSync(ttsPath); // Elimina el archivo para ahorrar espacio
  } else {
    reply("Error generando el TTS.");
  }
  break;
    case "cai":
            if (!args) {
                await reply("Por favor, escribe un mensaje para la IA.");
                break;
            }
            await react("🤖");
            const response = await rolePlayAI(args);
            await reply(response);
            break;
        case "spam":
        await react("🗣️");
        await reply("Tengo Sigma");
        await reply("Momazos diego");
        await reply("ei ei ei");
        await reply("Pollito con papas");
        await reply("OMGGG");
        await reply("BereBonni");
        await reply("Peru");
        await reply("Come");
        await reply("Palomas");
        await reply("Tonotos");
        await reply("Spam Termindado");
        break;
        case "rule34":
        await react("🥵");
        await reply("Pajero de Mierda.");
        await reply("Enviando FBI...");
        break;
case "miaai":
  const inputText = args.join(""); // Unir los argumentos en caso de múltiples palabras

  if (!inputText) {
    throw new InvalidParameterError("Ingresa un texto para hablar conmigo");
  }

  await waitReply("Mia AI está procesando su solicitud 🤓");

  try {
    const responseText = await chatm(inputText);
    await successReply(responseText);
  } catch (error) {
    await errorReply("Hubo un error al obtener la respuesta de Gemini 🤖");
    console.error(error);
  }
  break;
  case "beastai":
  const inputTextb = args.join(""); // Unir los argumentos en caso de múltiples palabras

  if (!inputTextb) {
    throw new InvalidParameterError("Ingresa un texto para hablar conmigo");
  }

  await waitReply("MrBeast está procesando su solicitud 🤓");

  try {
    const responseText = await chatb(inputTextb);
    await successReply(responseText);
  } catch (error) {
    await errorReply("Hubo un error al obtener la respuesta de Gemini 🤖");
    console.error(error);
  }
  break;

      case "sticker":
      case "f":
      case "fig":
      case "figu":
      case "s":
        if (!isImage && !isVideo) {
          throw new InvalidParameterError(
            "Debes etiquetar una imagen/gif/video o responder a una imagen/gif/video"
          );
        }

        await waitReact("🕘");
        await stickerFromInfo(info);
        break;
        
      case "welcome":
      case "bemvindo":
      case "boasvinda":
      case "boasvindas":
      case "boavinda":
      case "boavindas":
        if (!args.length) {
          throw new InvalidParameterError(
            "¡Debes ingresar 1 o 0 (activado o desactivado)!"
          );
        }

        const welcome = args[0] === "1";
        const notWelcome = args[0] === "0";

        if (!welcome && !notWelcome) {
          throw new InvalidParameterError(
            "¡Debes ingresar 1 o 0 (activado o desactivado)!"
          );
        }

        if (welcome) {
          activateWelcomeGroup(from);
        } else {
          deactivateWelcomeGroup(from);
        }

        await successReact();

        const welcomeContext = welcome ? "activado" : "desactivado";

        await reply(`Recurso de boas-vindas ${welcomeContext} com sucesso!`);
        break;
    case "roleplay":
        if (!args.length) {
            await reply("🎮 Usa: *!roleplay (crear, stats, luchar, explorar)*");
            break;
        }
        const respuesta = roleplay(args[0], userJid);
        await reply(respuesta);
        break;
case "reg":
  const inputTextreg = args.join(""); // Unir argumentos

  if (!inputTextreg.includes(".")) {
    throw new InvalidParameterError("Formato incorrecto. Usa: !reg Nombre.Edad");
  }

  const [nombre, edad] = inputTextreg.split(".");

  if (!nombre || !edad || isNaN(edad)) {
    throw new InvalidParameterError("Formato incorrecto. Usa: !reg Nombre.Edad");
  }

  const filePath = `perfiles/${nombre}.json`;

  // Verificar si la carpeta "perfiles" existe, si no, crearla
  if (!fs.existsSync("perfiles")) {
    fs.mkdirSync("perfiles", { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    await successReply(`El usuario ${nombre} ya está registrado.`);
  } else {
    const perfil = { nombre, edad: parseInt(edad) };
    fs.writeFileSync(filePath, JSON.stringify(perfil, null, 2));

    await successReply(`Usuario ${nombre} registrado con éxito.`);

    // Añadir el AdReply
    let adReplyReg = getAdReplyScript(); // Llama a la función para obtener el AdReply

    // Enviar las estadísticas con el AdReply
    await socket.sendMessage(from, {
      text: `        Cuenta Registrada!

          Nombre: ${nombre}
           Edad: ${edad} 

      Bienvenido a la Familia!
     Hey ${nombre}, Te Quiero <3

Usᴀ !ᴍᴇɴú ᴘᴀʀᴀ ᴠᴇʀ ᴇʟ ᴍᴇɴᴜ`,
      contextInfo: adReplyReg.contextInfo // Adjuntamos el AdReply aquí
    });
  }
  break;
  
  case "raro":
    const porcentaje = Math.floor(Math.random() * 101); // Genera un porcentaje aleatorio entre 0 y 100
    let respuestararo;

    if (args.length === 0) {
        respuestararo = `Eres *${porcentaje}%* rar@ 🧐`;
    } else if (args[0].startsWith("@")) {
        respuestararo = `${args[0]} es *${porcentaje}%* raro 🤔`;
    } else {
        respuestararo = `${args.join(" ")} es *${porcentaje}%* rar@ 😏`;
    }

    await socket.sendMessage(from, { text: respuestararo });
    break;
    case "gay":
    const porcentajegay = Math.floor(Math.random() * 101); // Genera un porcentaje aleatorio entre 0 y 100
    let respuestagay;

    if (args.length === 0) {
        respuestagay = `Eres *${porcentajegay}%* gay 🏳️‍🌈`;
    } else if (args[0].startsWith("@")) {
        respuestagay = `${args[0]} es *${porcentajegay}%* gay 🏳️‍🌈`;
    } else {
        respuestagay = `${args.join(" ")} es *${porcentajegay}%* gay 🏳️‍🌈`;
    }

    await socket.sendMessage(from, { text: respuestagay });
    break;
        case "guapo":
    const porcentajeguapo = Math.floor(Math.random() * 101); // Genera un porcentaje aleatorio entre 0 y 100
    let respuestaguapo;

    if (args.length === 0) {
        respuestaguapo = `Eres *${porcentajeguapo}%* Guap@ 🥴`;
    } else if (args[0].startsWith("@")) {
        respuestaguapo = `${args[0]} es *${porcentajeguapo}%* Guap@ 🥴`;
    } else {
        respuestaguapo = `${args.join(" ")} es *${porcentajeguapo}%* Guap@ 🥴`;
    }

    await socket.sendMessage(from, { text: respuestaguapo });
    break;
    default:
    await comandoIncorrecto(socket, from, command);
    break;
    }
    // ❌ Não coloque nada abaixo ❌
  } catch  (error) {
    /**
     * ❌ Não coloque nada abaixo ❌
     * Este bloco é responsável por tratar
     * os erros que ocorrerem durante a execução
     * das "cases".
     */
    if (error instanceof InvalidParameterError) {
      await warningReply(`Mal usado! ${error.message}`);
    } else if (error instanceof WarningError) {
      await warningReply(error.message);
    } else if (error instanceof DangerError) {
      await errorReply(error.message);
    } else {
      errorLog(`Error al ejecutar el comando!\n\nDetalles: ${error.message}`);

      await errorReply(
        `Se produjo un error al ejecutar el comando :( ${command.name}!

📄 *Detalles*: ${error.message}`
      );
    }
    // ❌ Não coloque nada abaixo ❌
  }
}

module.exports = { runLite };
