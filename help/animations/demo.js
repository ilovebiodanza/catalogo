/* Reproductor mínimo para las animaciones de ayuda.
   La secuencia se define en cada HTML; el CSS hace las transiciones. */
(function () {
  'use strict';

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function HelpDemo(root, config) {
    const screens = [...root.querySelectorAll('[data-screen]')];
    const cursor = root.querySelector('[data-cursor]');
    const caption = root.querySelector('[data-caption]');
    const progress = root.querySelector('[data-progress]');
    const speed = Math.max(
      0.25,
      Number(root.dataset.speed || config.speed || 1) || 1,
    );
    const duration =
      Number(root.dataset.duration || config.duration || 12000) / speed;
    const timers = new Set();
    const intervals = new Set();
    let raf = 0;
    let startedAt = 0;
    let running = false;

    function clearTimers() {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      timers.clear();
      intervals.clear();
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function reset() {
      clearTimers();
      running = false;
      screens.forEach(screen => screen.classList.remove('is-active'));
      root.querySelectorAll('.is-clicked, .is-focus, .is-checked').forEach(
        element => {
          if (element.classList.contains('demo-check')) {
            element.classList.remove('is-checked');
          } else if (element.classList.contains('demo-input')) {
            element.classList.remove('is-focus');
          } else {
            element.classList.remove('is-clicked');
          }
        },
      );
      root.querySelectorAll('[data-typed]').forEach(element => {
        element.textContent = element.dataset.placeholder || '';
      });
      if (cursor) {
        cursor.style.left = '50%';
        cursor.style.top = '50%';
        cursor.classList.remove('is-clicking');
      }
      if (caption) {
        caption.classList.remove('is-visible');
        caption.innerHTML = '';
      }
      if (progress) progress.style.width = '0%';
    }

    function show(name) {
      screens.forEach(screen => {
        screen.classList.toggle('is-active', screen.dataset.screen === name);
      });
    }

    function setCaption(text) {
      if (!caption) return;
      caption.innerHTML = text;
      caption.classList.add('is-visible');
    }

    function focus(selector) {
      root.querySelectorAll('.demo-input.is-focus').forEach(element => {
        element.classList.remove('is-focus');
      });
      const target = root.querySelector(selector);
      const input = target && target.closest('.demo-input');
      if (input) input.classList.add('is-focus');
      return target;
    }

    function moveTo(selector) {
      if (!cursor) return;
      const target = root.querySelector(selector);
      if (!target) return;
      const stage = root.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      cursor.style.left = `${box.left - stage.left + box.width / 2}px`;
      cursor.style.top = `${box.top - stage.top + box.height / 2}px`;
      focus(selector);
    }

    function click(selector) {
      moveTo(selector);
      const target = root.querySelector(selector);
      if (!target) return;
      target.classList.add('is-clicked');
      if (cursor) cursor.classList.add('is-clicking');
      timers.add(
        setTimeout(() => {
          target.classList.remove('is-clicked');
          if (cursor) cursor.classList.remove('is-clicking');
        }, 420),
      );
    }

    function type(selector, text, speed = 650) {
      const target = focus(selector);
      if (!target) return;
      target.textContent = '';
      const characters = [...String(text)];
      const interval = Math.max(38, speed / Math.max(1, characters.length));
      let index = 0;
      const timer = setInterval(() => {
        target.textContent += characters[index] || '';
        index += 1;
        if (index >= characters.length) {
          clearInterval(timer);
          intervals.delete(timer);
        }
      }, interval);
      intervals.add(timer);
      timers.add(setTimeout(() => clearInterval(timer), speed + 450));
    }

    function check(selector) {
      const target = root.querySelector(selector);
      if (target) target.classList.add('is-checked');
    }

    function tick(now) {
      if (!running) return;
      const elapsed = now - startedAt;
      const percent = Math.min(100, (elapsed / duration) * 100);
      if (progress) progress.style.width = `${percent}%`;
      if (elapsed < duration) raf = requestAnimationFrame(tick);
    }

    function play() {
      reset();
      running = true;
      startedAt = performance.now();
      raf = requestAnimationFrame(tick);
      config.timeline
        .slice()
        .sort((a, b) => a.at - b.at)
        .forEach(step => {
          timers.add(
            setTimeout(() => {
              step.run({
                show,
                caption: setCaption,
                focus,
                moveTo,
                click,
                type,
                check,
                reset,
              });
            }, step.at / speed),
          );
        });
      timers.add(
        setTimeout(() => {
          running = false;
        }, duration + 80),
      );
    }

    const replay =
      root.querySelector('[data-replay]') ||
      (root.parentElement && root.parentElement.querySelector('[data-replay]'));
    if (replay) {
      replay.addEventListener('click', () => {
        play();
      });
    }

    reset();
    if (root.dataset.autoplay !== 'false') {
      setTimeout(play, 250);
    }

    return { play, reset };
  }

  window.HelpDemo = HelpDemo;
  window.helpDemoWait = wait;
})();
