/* One speech session per page; stale utterance events cannot change current UI. */
(() => {
  'use strict';
  if (window.SpotlightAudio) return;
  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const synth = supported ? window.speechSynthesis : null;
  let generation = 0, active = null, activeStatus = null;
  const message = (node, text) => { if (node) node.textContent = text; };
  function stop() {
    generation++;
    active = null;
    message(activeStatus, 'Озвучивание остановлено.');
    activeStatus = null;
    if (synth) synth.cancel();
  }
  function say(text, status, rate = .8) {
    stop();
    message(status, '');
    if (!supported) {
      message(status, 'Озвучивание недоступно в этом браузере. Прочитай карточку со взрослым.');
      return false;
    }
    const voices = synth.getVoices();
    const voice = voices.find(v => /^en[-_]GB$/i.test(v.lang)) || voices.find(v => /^en(?:[-_]|$)/i.test(v.lang));
    if (!voice) {
      message(status, voices.length ? 'Английский голос не найден. Проверь английские голоса устройства и повтори нажатие.' : 'Список голосов пока пуст. Подожди немного и снова нажми «Слушать».');
      return false;
    }
    const ticket = generation, utterance = new window.SpeechSynthesisUtterance(text);
    active = utterance; activeStatus = status;
    utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = rate;
    const current = () => generation === ticket && active === utterance;
    message(status, 'Подготовка озвучивания…');
    utterance.onstart = () => { if (current()) message(status, 'Слушаем…'); };
    utterance.onend = () => {
      if (!current()) return;
      active = null; activeStatus = null;
      message(status, '');
    };
    utterance.onerror = event => {
      if (!current()) return;
      active = null; activeStatus = null;
      message(status, ['canceled', 'interrupted'].includes(event.error) ? 'Озвучивание остановлено.' : 'Не удалось включить голос. Проверь звук, английский голос и подключение к интернету.');
    };
    try {
      synth.speak(utterance);
      if (synth.paused) synth.resume();
      return true;
    } catch {
      if (current()) { stop(); message(status, 'Не удалось запустить озвучивание. Попробуй другой браузер.'); }
      return false;
    }
  }
  window.SpotlightAudio = { say, stop };
  window.addEventListener('pagehide', stop);
})();
