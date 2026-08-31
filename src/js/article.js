let initialized = false;

function showCommentNotice(form) {
    let note = form.querySelector('.comment-demo-note');
    if (!note) {
        note = document.createElement('p');
        note.className =
            'comment-demo-note comment-alert comment-alert-success';
        form.appendChild(note);
    }
    note.textContent =
        'Komentar demo tersimpan di playground. Pada CMS, komentar dikirim ke endpoint SekolahKu dan menunggu persetujuan.';
    form.reset();
}

async function copyCurrentLink(button) {
    const originalContent = button.innerHTML;
    const url = window.location.href;

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(url);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const copied = document.execCommand('copy');
            textarea.remove();

            if (!copied) {
                throw new Error('Clipboard copy failed');
            }
        }

        button.innerHTML =
            '<i data-lucide="check" aria-hidden="true"></i><span>Tautan disalin</span>';
        button.setAttribute('aria-label', 'Tautan berhasil disalin');

        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }

        window.setTimeout(() => {
            button.innerHTML = originalContent;
            button.setAttribute('aria-label', 'Salin tautan');

            if (window.lucide?.createIcons) {
                window.lucide.createIcons();
            }
        }, 2000);
    } catch {
        button.innerHTML =
            '<i data-lucide="circle-alert" aria-hidden="true"></i><span>Salin gagal</span>';
        button.setAttribute('aria-label', 'Gagal menyalin tautan');

        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }

        window.setTimeout(() => {
            button.innerHTML = originalContent;
            button.setAttribute('aria-label', 'Salin tautan');

            if (window.lucide?.createIcons) {
                window.lucide.createIcons();
            }
        }, 2000);
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
