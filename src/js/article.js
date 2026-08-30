let initialized = false;

function showCommentNotice(form) {
    let note = form.querySelector('.comment-demo-note');
    if (!note) {
        note = document.createElement('p');
        note.className = 'comment-demo-note comment-alert comment-alert-success';
        form.appendChild(note);
    }
    note.textContent = 'Komentar demo tersimpan di playground. Pada CMS, komentar dikirim ke endpoint SekolahKu dan menunggu persetujuan.';
    form.reset();
}

async function copyCurrentLink(button) {
    try {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = 'Tautan disalin';
    } catch {
        button.textContent = 'Salin gagal';
    }
}

export function initArticleActions() {
    if (initialized) return;
    initialized = true;

    document.addEventListener('submit', (event) => {
        const form = event.target.closest('[data-playground-comment-form]');
        if (!form) return;
        event.preventDefault();
        showCommentNotice(form);
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-copy-link]');
        if (!button) return;
        event.preventDefault();
        copyCurrentLink(button);
    });
}
