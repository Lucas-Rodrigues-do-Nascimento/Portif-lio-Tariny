/**
 * Menu hamburger para navegação mobile
 * Controla abertura/fechamento e acessibilidade
 */
(function () {
    'use strict';

    const menuButton = document.getElementById('menu-toggle');
    const nav = document.querySelector('header nav');
    const navLinks = document.querySelectorAll('header nav a');

    if (!menuButton || !nav) return;

    function toggleMenu() {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isOpen);
        menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
        nav.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', !isOpen);
    }

    function closeMenu() {
        menuButton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
    }

    menuButton.addEventListener('click', toggleMenu);

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeMenu();
    });
})();
