#!/data/data/com.termux/files/usr/bin/bash  

clear

# Colores
Cyan="\e[1;36m"
Purple="\e[1;35m"
Green="\e[1;32m"
Red="\e[1;31m"
Yellow="\e[1;33m"
Reset="\e[0m"

# Función para imprimir texto ASCII con estilo  
function print_ascii() {  
    echo -e "$Cyan"  
    figlet -f slant "$1"  
    echo -e "$Reset"  
}  

# Presentación mágica
CHARACTER_1="Hanako-kun $Yellow✨"
CHARACTER_2="Nene Yashiro $Purple♡"
CHARACTER_3="Kou Minamoto $Green⚔️"

echo -e "$Yellow$CHARACTER_1 aparece flotando sobre el script..."
echo -e "$Purple$CHARACTER_2: ¡Hora de instalar algo genial!"
echo -e "$Green$CHARACTER_3: ¡Vamos, que esto será rápido y fácil!$Reset"
sleep 2

print_ascii "MaycolAI"
echo -e "$PurpleAjusta la Escala de la Pantalla para una mejor experiencia...$Reset"
echo -e "$GreenHecho con amor por SoyMaycol$Reset"
echo -e "$Yellow$CHARACTER_1 Te pondré Musica ^^"
mpv --really-quiet --loop https://files.catbox.moe/vv6jqt.mp3 &  
MUSIC_PID=$!
sleep 2  

# Actualización  
print_ascii "Actualizando"  
echo -e "$Yellow$CHARACTER_1: ¡Vamos a actualizar todo antes de empezar!$Reset"
pkg update -y && pkg upgrade -y  

# Instalación de herramientas esenciales  
print_ascii "Instalando"  
echo -e "$Purple$CHARACTER_2: Instalando herramientas esenciales...$Reset"
pkg install git -y  
pkg install nodejs-lts -y  
pkg install ffmpeg -y  
pkg install python-pip -y  
npm install -g yarn  
pip install yt-dlp  

# Clonando repositorio  
print_ascii "Clonando Repo"  
echo -e "$Green$CHARACTER_3: Descargando MaycolAI desde los cielos digitales...$Reset"
git clone https://github.com/SoySapo6/MaycolAI 
echo -e "$Yellow$CHARACTER_1: Estamos en medio de la Instalación ♪$Reset"

cd MaycolAI
curl -s -o Hanako.png https://files.catbox.moe/aml84a.png

# Instalando módulos del proyecto  
print_ascii "Dependencias"  
echo -e "$Yellow$CHARACTER_1: Invocando todos los módulos necesarios...$Reset"
npm install  
npm install gemini-chatbot
npm install moment
npm install qrcode

echo -e "$Yellow$CHARACTER_1: Todo Hecho 🥸$Reset"

# Eliminando sesiones antiguas  
print_ascii "Limpieza"  
echo -e "$Red$CHARACTER_3: Eliminando sesiones pasadas para evitar errores...$Reset"
rm -rf baileys  
mkdir temp

# Detener música antes de iniciar el bot
kill $MUSIC_PID

# Mensaje final  
clear  
print_ascii "SoyMaycol"
jp2a --color Hanako.png
echo -e "$Purple Gracias por usar MaycolAI, eres lo máximo <3$Reset"
echo -e "$Green Para iniciar el bot, ejecuta manualmente el siguiente comando:$Reset"
echo -e "$Cyan"
echo "cd MaycolAI && npm start"
echo -e "$Reset"
read -p "Presiona Enter para salir..."
