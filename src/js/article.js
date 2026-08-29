export function initArticleActions() {
    const button = document.querySelector('[data-copy-link]');
    button?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            button.textContent = 'Tautan disalin';
        } catch {
            button.textContent = 'Salin gagal';
        }
    });
}
