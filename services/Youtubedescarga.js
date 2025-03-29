const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const descargarVideo = async (query) => {
    return new Promise((resolve, reject) => {
        const outputPath = `/storage/emulated/0/Gatito-mi-bot/videos/${Date.now()}.mp4`;
        const command = `yt-dlp -f best -o "${outputPath}" "ytsearch:${query}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(outputPath);
            }
        });
    });
};

module.exports = { descargarVideo };