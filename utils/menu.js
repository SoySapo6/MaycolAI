/**
 * Menus
 *
 * @author Dev Gui </>
 */
const { BOT_NAME, PREFIX, OWNER_NUMBER } = require("../config");

exports.menu = () => {
  const date = new Date();

  return `╔══════════════╗
              
          ★彡[ᴍᴀʏᴄᴏʟ ᴀɪ]彡★
          
                 
    ⚡  Estadisticas ⚡
${PREFIX} - ${BOT_NAME}
${PREFIX}- 𝙵𝚎𝚌𝚑𝚊: ${date.toLocaleDateString("pt-br")}
${PREFIX} - 𝙷𝚘𝚛𝚊 𝙰𝚌𝚝𝚞𝚊𝚕: ${date.toLocaleTimeString("pt-br")}
${PREFIX} - 𝙿𝚛𝚎𝚏𝚒𝚓𝚘: ${PREFIX}
${PREFIX} - 𝙲𝚛𝚎𝚊𝚍𝚘𝚛: https://api.whatsapp.com/send?phone=+${OWNER_NUMBER}&text=!menu

---> *Comandos Grupales*

${PREFIX}antilink 1/0
${PREFIX}ban
${PREFIX}hidetag
${PREFIX}menuowner

---> *Diversión*

${PREFIX}attp
${PREFIX}cep
${PREFIX}grupo
${PREFIX}spam
${PREFIX}frase
${PREFIX}creador
${PREFIX}roleplay
${PREFIX}chiste
${PREFIX}raro
${PREFIX}gay
${PREFIX}guapo
${PREFIX}besar
${PREFIX}tts

---> *Programación*

${PREFIX}ejecutar
${PREFIX}ejecutarjs
${PREFIX}ejecutarpy
${PREFIX}ejecutarc
${PREFIX}ejecutarcpp
${PREFIX}ejecutarjava

---> *Herramientas*

${PREFIX}audios
${PREFIX}audio
${PREFIX}doxeo
${PREFIX}ytsearch
${PREFIX}ytmp3
${PREFIX}bug
${PREFIX}gif
${PREFIX}busqueda
${PREFIX}ytvideo
${PREFIX}ttp
${PREFIX}rule34
${PREFIX}tempmail
${PREFIX}news
${PREFIX}dalle
${PREFIX}qr
${PREFIX}qrsticker
${PREFIX}play
${PREFIX}flux

---> *KarKat* Mascota Virtual

${PREFIX}karkat
${PREFIX}karkat estado
${PREFIX}karkat jugar
${PREFIX}karkat dormir
${PREFIX}karkat curar
${PREFIX}karkat bañar

---> *Inteligencia Artificial*

${PREFIX}ia
${PREFIX}deepseek
${PREFIX}nsfw
${PREFIX}cai
${PREFIX}miaai
${PREFIX}beastai

---> *Stream* Simulador de Stremer

${PREFIX}stream
${PREFIX}stream transmitir
${PREFIX}stream jugar
${PREFIX}stream chat
${PREFIX}stream ganar
${PREFIX}stream perder

*Creadores/saludos*

---> SoyMaycol

---> Ado

---> Grupo De HomeStuck

╚══════════════╝`;
};