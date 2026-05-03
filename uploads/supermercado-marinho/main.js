gsap.registerPlugin(ScrollTrigger);

/* ── Partículas flutuantes ── */
function createParticles() {
    const container = document.getElementById('particles');
    const icons  = ['fa-apple-whole', 'fa-carrot', 'fa-lemon', 'fa-leaf'];
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#d1ff4d'];

    for (let i = 0; i < 10; i++) {
        const el = document.createElement('i');
        el.className = `fas ${icons[i % icons.length]} shape`;
        el.style.cssText = [
            'position:absolute',
            `left:${Math.random() * 92 + 4}%`,
            `top:${Math.random() * 92 + 4}%`,
            `font-size:${Math.random() * 12 + 9}px`,
            `color:${colors[Math.floor(Math.random() * colors.length)]}`,
            'opacity:0.32',
        ].join(';');
        container.appendChild(el);

        gsap.to(el, {
            y: 'random(-35, 35)',
            x: 'random(-35, 35)',
            rotation: 'random(0, 360)',
            duration: 'random(4, 9)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }
}

/* ── Animação principal ── */
function initAnimations() {
    const leftHalf  = document.getElementById('logo-left-half');
    const rightHalf = document.getElementById('logo-right-half');

    // Escala cada metade a partir do centro do logo (que é o centro do .logo-container)
    // Como .logo-container NÃO tem scale próprio, o x do GSAP nas metades opera em screen-space
    gsap.set([leftHalf, rightHalf], { transformOrigin: '50% 50%' });

    // Estados iniciais
    gsap.set('#portal-content', { opacity: 0, y: 22, scale: 0.94 });
    gsap.set('#main-wrapper',   { opacity: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start:   'top top',
            end:     '+=320%',
            pin:     true,
            scrub:   1.2,
        },
    });

    // Scroll hint + partículas somem rápido
    tl.to('.scroll-hint', { opacity: 0, y: 14, duration: 0.12 }, 0);
    tl.to('.shape', { opacity: 0, y: -70, scale: 0.4, stagger: 0.018, duration: 0.18 }, 0);

    // ── Fase 1: zoom — câmera "entra" na logo ──
    // Cada metade escala individualmente do centro do logo (sem container intermediário escalonado)
    // → a translação posterior é em screen-space
    tl.to([leftHalf, rightHalf], {
        scale: 5,
        duration: 0.58,
        ease: 'none',
    }, 0);

    // Linha de luz aparece na junção
    tl.to('#glow', { opacity: 1, duration: 0.14 }, 0.38);

    // ── Fase 2: portal abre — metades voam para os lados ──
    // x em screen-space: cada metade sai completamente da tela
    tl.to(leftHalf,  { x: '-130vw', duration: 0.46, ease: 'none' }, 0.52);
    tl.to(rightHalf, { x:  '130vw', duration: 0.46, ease: 'none' }, 0.52);

    // Linha estica e desaparece
    tl.to('#glow', { scaleX: 60, opacity: 0, duration: 0.22 }, 0.55);

    // Conteúdo do portal aparece no centro da abertura
    tl.to('#portal-content', { opacity: 1, y: 0, scale: 1, duration: 0.28 }, 0.64);

    // Header e conteúdo principal revelados no fim
    tl.to('#main-header', { opacity: 1, pointerEvents: 'auto', duration: 0.18 }, 0.82);
    tl.to('#main-wrapper', { opacity: 1, duration: 0.28 }, 0.90);
}

window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initAnimations();
});
