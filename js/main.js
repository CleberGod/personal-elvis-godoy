/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */
const WHATS_NUMBER = "5515997897433"; // somente dígitos
const WHATS_MSG = encodeURIComponent("Olá Elvis! Vim pelo site e quero agendar uma aula experimental.");
const WHATS_LINK = `https://wa.me/${WHATS_NUMBER}?text=${WHATS_MSG}`;
const INSTA_LINK = "https://www.instagram.com/elvis.godoyy/";

/* Helper */
const $ = (sel) => document.querySelector(sel);

/* =========================================================
   LINKS / CTAs — fallback no HTML + reforço via JS
   ========================================================= */
/* Reforça todos os anchors que marcarem data-link="whats" ou "insta" */
document.querySelectorAll('[data-link="whats"]').forEach(a => {
    a.href = WHATS_LINK;
    a.target = "_blank";
    a.rel = "noopener";
});
document.querySelectorAll('[data-link="insta"]').forEach(a => {
    a.href = INSTA_LINK;
    a.target = "_blank";
    a.rel = "noopener";
});

/* Serviços → WhatsApp com mensagem personalizada por serviço */
document.querySelectorAll(".service-cta").forEach((btn) => {
    const tipo = btn.getAttribute("data-service") || "Serviço";
    const msg = encodeURIComponent(`Olá Elvis! Vim pelo site e tenho interesse em ${tipo}. Podemos conversar?`);
    btn.href = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
    btn.target = "_blank";
    btn.rel = "noopener";
});


/* =========================================================
   MENU MOBILE
   ========================================================= */
const burger = $("#burger");
const mobileMenu = $("#mobileMenu");
burger.addEventListener("click", () => {
    const open = mobileMenu.hasAttribute("hidden");
    if (open) {
        mobileMenu.removeAttribute("hidden");
        burger.setAttribute("aria-expanded", "true");
    } else {
        mobileMenu.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
    }
});
mobileMenu.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
        mobileMenu.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
    }
});

/* =========================================================
   TEMA (auto → dark → light) + LOGOS (header & footer)
   ========================================================= */
const btnTheme = $("#btnTheme");
const brandLogo = $("#brandLogo");
const footerLogo = $("#footerLogo");

/* Aplica logo apropriada para o tema atual */
function applyLogoForTheme(theme) {
    const isDark = theme === "dark" ||
        (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const headerSrc = isDark ? "assets/img/logo-light.png" : "assets/img/logo-dark.png";
    const footerSrc = headerSrc; // mantém a mesma versão no rodapé

    if (brandLogo) brandLogo.src = headerSrc;
    if (footerLogo) footerLogo.src = footerSrc;
}

/* Estado inicial */
let savedTheme = localStorage.getItem("theme") || "auto";
if (savedTheme !== "auto") document.body.setAttribute("data-theme", savedTheme);
applyLogoForTheme(savedTheme);

/* Alternância cíclica */
btnTheme.addEventListener("click", () => {
    const order = ["auto", "dark", "light"];
    const idx = order.indexOf(savedTheme);
    savedTheme = order[(idx + 1) % order.length];

    if (savedTheme === "auto") document.body.removeAttribute("data-theme");
    else document.body.setAttribute("data-theme", savedTheme);

    localStorage.setItem("theme", savedTheme);
    applyLogoForTheme(savedTheme);
});

/* Se SO muda e estamos em "auto", atualiza logo */
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if ((localStorage.getItem("theme") || "auto") === "auto") applyLogoForTheme("auto");
});

/* =========================================================
   HEADER sticky com estado ao rolar
   ========================================================= */
const siteHeader = $("#siteHeader");
function onScrollHeader() {
    const y = window.scrollY || window.pageYOffset;
    if (y > 12) siteHeader.classList.add("is-scrolled");
    else siteHeader.classList.remove("is-scrolled");
}
onScrollHeader();
window.addEventListener("scroll", onScrollHeader);

/* =========================================================
   NAVEGAÇÃO SUAVE
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

/* =========================================================
   HERO CAROUSEL (fade) — 3 imagens
   ========================================================= */
(function initHeroCarousel() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.hero-prev');
    const nextBtn = slider.querySelector('.hero-next');

    let index = 0;
    let timer;
    const DELAY = 6000;

    const show = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, n) => {
            s.classList.toggle('is-active', n === index);
            s.setAttribute('aria-hidden', String(n !== index));
        });
        dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
    };

    const start = () => { stop(); timer = setInterval(() => show(index + 1), DELAY); };
    const stop = () => { if (timer) clearInterval(timer); };

    nextBtn?.addEventListener('click', () => { show(index + 1); start(); });
    prevBtn?.addEventListener('click', () => { show(index - 1); start(); });
    dots.forEach((d) => d.addEventListener('click', () => { show(+d.dataset.index); start(); }));

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('touchstart', stop, { passive: true });
    slider.addEventListener('touchend', start);

    // Pré-carrega imagens
    slides.forEach(s => {
        const src = (s.getAttribute('style') || '').match(/url\(['"]?(.+?)['"]?\)/);
        if (src && src[1]) { const im = new Image(); im.src = src[1]; }
    });

    show(0); start();
})();

/* =========================================================
   LIGHTBOX COM NAVEGAÇÃO (Antes/Depois e mais imagens)
   ========================================================= */
(function initLightbox() {
    // Cria a estrutura do Lightbox
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Imagem ampliada">
      <button class="lightbox-close" aria-label="Fechar">✕</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Anterior">◀</button>
      <img class="lightbox-img" src="" alt="" />
      <button class="lightbox-nav lightbox-next" aria-label="Próxima">▶</button>
    </div>
  `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbClose = lb.querySelector('.lightbox-close');
    const btnPrev = lb.querySelector('.lightbox-prev');
    const btnNext = lb.querySelector('.lightbox-next');

    // Lista de todas imagens com data-lightbox
    const allImgs = Array.from(document.querySelectorAll('img[data-lightbox]'));
    let currentIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= allImgs.length) return;
        currentIndex = index;
        const src = allImgs[index].dataset.lightbox;
        const alt = allImgs[index].alt || 'Imagem ampliada';
        lbImg.src = src;
        lbImg.alt = alt;
        lb.classList.add('is-open');
        document.body.classList.add('lb-lock');
        lbClose.focus();
    }

    function closeLightbox() {
        lb.classList.remove('is-open');
        document.body.classList.remove('lb-lock');
        setTimeout(() => { lbImg.src = ''; }, 200);
    }

    function showNext(step) {
        let nextIndex = (currentIndex + step + allImgs.length) % allImgs.length;
        openLightbox(nextIndex);
    }

    // Eventos de navegação
    btnPrev.addEventListener('click', () => showNext(-1));
    btnNext.addEventListener('click', () => showNext(1));

    // Fecha ao clicar fora do conteúdo
    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
    });

    // Botão fechar
    lbClose.addEventListener('click', closeLightbox);

    // Fecha com ESC / navega com setas do teclado
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext(1);
        if (e.key === 'ArrowLeft') showNext(-1);
    });

    // Delegação: clique em qualquer thumb ou botão de zoom
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img[data-lightbox]');
        const btn = e.target.closest('.ba-zoom');
        if (img) {
            const index = allImgs.indexOf(img);
            openLightbox(index);
        }
        if (btn) {
            const fig = btn.closest('.ba-thumb');
            const pic = fig?.querySelector('img[data-lightbox]');
            if (pic) {
                const index = allImgs.indexOf(pic);
                openLightbox(index);
            }
        }
    });
})();


/* =========================================================
   RODAPÉ: ano automático
   ========================================================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   FLOAT WHATSAPP: evita sobrepor o link "Topo" do rodapé
   - Quando o footer entra na viewport, adiciona .is-raised
   ========================================================= */
(function raiseFloatWhenFooterVisible() {
    const floatBtn = $("#floatWhats");
    const footer = document.querySelector(".site-footer");
    if (!floatBtn || !footer) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) floatBtn.classList.add("is-raised");
            else floatBtn.classList.remove("is-raised");
        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -10% 0px" // aciona um pouco antes de encostar
    });

    io.observe(footer);
})();
