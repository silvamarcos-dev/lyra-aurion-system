export function speak(text) {
  if (!text || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  // 🧠 limpa o texto (remove partes estranhas)
  const cleanText = text
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/\n/g, " ")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // 🎯 Configuração mais natural
  utterance.lang = "pt-BR";
  utterance.rate = 1.02;   // mais suave
  utterance.pitch = 1.1;   // leve entonação
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  // 🔥 tenta pegar vozes melhores
  const preferredVoice =
    voices.find(v => v.name.includes("Google português")) ||
    voices.find(v => v.name.includes("Microsoft Francisca")) ||
    voices.find(v => v.name.includes("Microsoft Maria")) ||
    voices.find(v => v.lang === "pt-BR") ||
    voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // 🎭 pausa leve pra parecer mais humano
  utterance.onstart = () => {
    console.log("Lyra falando...");
  };

  window.speechSynthesis.speak(utterance);
}