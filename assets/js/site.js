// Theme (light/dark) and language (de/en) switches.
// Loaded in <head> without defer so the stored choice applies before first paint.
(function () {
  var root = document.documentElement;

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncTheme() {
    var theme = currentTheme();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#121212' : '#ffffff';
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  // Only pages that carry both languages declare data-lang on <html>.
  function applyLang(lang) {
    if (!root.dataset.lang) return;
    root.dataset.lang = lang;
    root.lang = lang;
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });
  }

  // First of the browser's preferred languages that we offer; English otherwise.
  function browserLang() {
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (code === 'de' || code === 'en') return code;
    }
    return 'en';
  }

  var storedTheme = load('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;

  var storedLang = load('lang');
  var lang = storedLang === 'de' || storedLang === 'en' ? storedLang : browserLang();
  applyLang(lang);

  document.addEventListener('DOMContentLoaded', function () {
    syncTheme();
    applyLang(lang);

    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        save('theme', next);
        syncTheme();
      });
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        lang = b.dataset.setLang;
        save('lang', lang);
        applyLang(lang);
      });
    });
  });
})();
