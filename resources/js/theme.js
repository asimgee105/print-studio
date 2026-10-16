const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
let explicitPreference = false;
try { explicitPreference = ['light', 'dark'].includes(localStorage.getItem('studio-theme')); } catch {}
function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
        const action = theme === 'light' ? button.dataset.dark : button.dataset.light;
        button.hidden = false;
        button.setAttribute('aria-label', action);
        button.title = action;
        button.querySelector('span').textContent = theme === 'light' ? '☾' : '☼';
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f8fafc' : '#090e1b';
    if (persist) {
        explicitPreference = true;
        try { localStorage.setItem('studio-theme', theme); } catch {}
    }
    document.dispatchEvent(new CustomEvent('studio:theme', { detail: { theme } }));
}
document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true));
});
systemTheme.addEventListener('change', event => {
    if (!explicitPreference) applyTheme(event.matches ? 'light' : 'dark');
});
applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

document.querySelectorAll('[data-motion-toggle]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
        const paused = root.classList.toggle('motion-paused');
        button.textContent = paused ? '▶' : 'Ⅱ';
        button.setAttribute('aria-pressed', String(paused));
        button.setAttribute('aria-label', paused ? button.dataset.play : button.dataset.pause);
        document.dispatchEvent(new CustomEvent('studio:motion', { detail: { paused } }));
    });
});
