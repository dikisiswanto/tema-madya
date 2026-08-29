import '../css/app.css';
import { initState } from './state.js';
import { initNavigation } from './navigation.js';
import { initRouter } from './router.js';
import { initArticleActions } from './article.js';
import { initIcons } from './icons.js';

window.addEventListener('DOMContentLoaded', () => {
    initState();
    initNavigation();
    initRouter();
    initArticleActions();
    initIcons();
});
