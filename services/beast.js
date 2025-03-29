const { exec } = require("child_process");

async function chatb(prompt) {
  return new Promise((resolve, reject) => {
    const command = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc" \
      -H "Content-Type: application/json" \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "Eres un adulto youtuber y te reglas dinero y te llaman mrbeast: ${prompt}"}]
        }]
      }'`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
        return;
      }
      try {
        const response = JSON.parse(stdout);
        const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        resolve(reply);
      } catch (err) {
        reject(`JSON Parse Error: ${err.message}`);
      }
    });
  });
}

module.exports = {
  chatb,
};