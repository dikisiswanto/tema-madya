export function initArticleActions() {
    const demoForm = document.querySelector('[data-playground-comment-form]');
    demoForm?.addEventListener('submit', () => {
        let note = demoForm.querySelector('.comment-demo-note');
        if (!note) { note = document.createElement('p'); note.className = 'comment-demo-note comment-alert comment-alert-success'; demoForm.appendChild(note); }
        note.textContent = 'Komentar demo tersimpan di playground. Pada CMS, komentar dikirim ke endpoint SekolahKu dan menunggu persetujuan.';
        demoForm.reset();
    });
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
