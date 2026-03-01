/**
 * Lightbox - abre imagens em tela cheia ao clicar
 * Navegação prev/next limitada à galeria aberta
 * Zoom com rolagem nas quatro direções
 */
(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxWrapper = document.querySelector('.lightbox-img-wrapper');
  const btnFechar = document.querySelector('.lightbox-fechar');
  const btnPrev = document.querySelector('.lightbox-prev');
  const btnNext = document.querySelector('.lightbox-next');
  const btnZoomIn = document.querySelector('.lightbox-zoom-in');
  const btnZoomOut = document.querySelector('.lightbox-zoom-out');

  if (!lightbox || !lightboxImg || !lightboxWrapper) return;

  var imagensAtuais = [];
  var indiceAtual = 0;
  var escalaAtual = 1;
  var baseWidth = 0;
  var baseHeight = 0;

  function calcularBaseSize() {
    var nw = lightboxImg.naturalWidth;
    var nh = lightboxImg.naturalHeight;
    if (!nw || !nh) {
      var w = lightboxImg.offsetWidth;
      var h = lightboxImg.offsetHeight;
      if (w && h) {
        baseWidth = w;
        baseHeight = h;
      }
      return;
    }
    var maxW = window.innerWidth * 0.9;
    var maxH = window.innerHeight * 0.9;
    var ratio = nw / nh;
    if (maxW / maxH > ratio) {
      baseHeight = maxH;
      baseWidth = maxH * ratio;
    } else {
      baseWidth = maxW;
      baseHeight = maxW / ratio;
    }
  }

  function resetarZoom() {
    escalaAtual = 1;
    lightboxImg.style.width = '';
    lightboxImg.style.height = '';
    lightboxImg.style.minWidth = '';
    lightboxImg.style.minHeight = '';
    lightboxImg.style.maxWidth = '90vw';
    lightboxImg.style.maxHeight = '90vh';
    lightboxImg.classList.remove('zoom-ativo');
  }

  function aplicarZoom() {
    if (!baseWidth || !baseHeight) {
      calcularBaseSize();
    }
    if (baseWidth && baseHeight) {
      var w = Math.round(baseWidth * escalaAtual);
      var h = Math.round(baseHeight * escalaAtual);
      lightboxImg.style.maxWidth = '';
      lightboxImg.style.maxHeight = '';
      lightboxImg.style.width = w + 'px';
      lightboxImg.style.height = h + 'px';
      lightboxImg.style.minWidth = w + 'px';
      lightboxImg.style.minHeight = h + 'px';
      lightboxImg.classList.add('zoom-ativo');
    }
  }

  function zoomIn() {
    if (escalaAtual < 3) {
      escalaAtual = Math.min(3, escalaAtual + 0.5);
      aplicarZoom();
    }
  }

  function zoomOut() {
    if (escalaAtual > 0.5) {
      escalaAtual = Math.max(0.5, escalaAtual - 0.5);
      aplicarZoom();
    }
  }

  function abrir(img) {
    var galeria = img.closest('.galeria');
    if (!galeria) return;

    imagensAtuais = Array.from(galeria.querySelectorAll('.galeria-img'));
    indiceAtual = imagensAtuais.indexOf(img);
    if (indiceAtual < 0) indiceAtual = 0;

    atualizarImagem();
    atualizarBotoes();
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  }

  function aoCarregarImagem() {
    calcularBaseSize();
    if (escalaAtual !== 1) {
      aplicarZoom();
    }
  }

  function atualizarImagem() {
    if (imagensAtuais[indiceAtual]) {
      lightboxImg.src = imagensAtuais[indiceAtual].src;
      lightboxImg.alt = imagensAtuais[indiceAtual].alt;
      baseWidth = 0;
      baseHeight = 0;
      resetarZoom();
      if (lightboxImg.complete && lightboxImg.naturalWidth) {
        aoCarregarImagem();
      } else {
        setTimeout(aoCarregarImagem, 50);
      }
    }
  }

  lightboxImg.addEventListener('load', function () {
    aoCarregarImagem();
  });

  function atualizarBotoes() {
    if (!btnPrev || !btnNext) return;
    btnPrev.classList.toggle('oculto', indiceAtual <= 0);
    btnNext.classList.toggle('oculto', indiceAtual >= imagensAtuais.length - 1);
  }

  function anterior() {
    if (indiceAtual > 0) {
      indiceAtual--;
      atualizarImagem();
      atualizarBotoes();
    }
  }

  function proximo() {
    if (indiceAtual < imagensAtuais.length - 1) {
      indiceAtual++;
      atualizarImagem();
      atualizarBotoes();
    }
  }

  function fechar() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('ativo');
    document.body.style.overflow = '';
    imagensAtuais = [];
    indiceAtual = 0;
    resetarZoom();
  }

  document.querySelectorAll('.galeria-img').forEach(function (img) {
    img.addEventListener('click', function () {
      abrir(this);
    });
  });

  if (btnFechar) btnFechar.addEventListener('click', fechar);
  if (btnPrev) btnPrev.addEventListener('click', anterior);
  if (btnNext) btnNext.addEventListener('click', proximo);
  if (btnZoomIn) btnZoomIn.addEventListener('click', function (e) { e.stopPropagation(); zoomIn(); });
  if (btnZoomOut) btnZoomOut.addEventListener('click', function (e) { e.stopPropagation(); zoomOut(); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) fechar();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('ativo')) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') anterior();
    if (e.key === 'ArrowRight') proximo();
  });
})();
