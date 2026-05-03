gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Forçar o início do site sempre no topo ao carregar/recarregar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ── Partículas abstratas ── */
function createParticles() {
    const container = document.getElementById('particles');

    for (let i = 0; i < 18; i++) {
        const el = document.createElement('div');
        const size = Math.random() * 5 + 2;
        const colors = [
            'rgba(80,160,255,0.5)',
            'rgba(120,200,255,0.4)',
            'rgba(180,220,255,0.35)',
            'rgba(100,180,255,0.45)',
            'rgba(209,255,77,0.25)',
        ];
        el.className = 'shape particle-dot';
        el.style.cssText = [
            'position:absolute',
            `left:${Math.random() * 90 + 5}%`,
            `top:${Math.random() * 90 + 5}%`,
            `width:${size}px`,
            `height:${size}px`,
            'border-radius:50%',
            `background:${colors[Math.floor(Math.random() * colors.length)]}`,
            `box-shadow:0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]}`,
            'opacity:0',
        ].join(';');
        container.appendChild(el);

        gsap.to(el, { opacity: 1, duration: 0.8, delay: Math.random() * 1.5 });
        gsap.to(el, {
            y: 'random(-30, 30)', x: 'random(-20, 20)',
            duration: 'random(4, 8)', repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: Math.random() * 3,
        });
    }

    for (let i = 0; i < 4; i++) {
        const ring = document.createElement('div');
        const size = Math.random() * 80 + 40;
        ring.className = 'shape particle-ring';
        ring.style.cssText = [
            'position:absolute',
            `left:${Math.random() * 80 + 10}%`,
            `top:${Math.random() * 80 + 10}%`,
            `width:${size}px`, `height:${size}px`,
            'border-radius:50%',
            'border:1px solid rgba(80,160,255,0.18)',
            'transform:translate(-50%,-50%)',
            'opacity:0',
        ].join(';');
        container.appendChild(ring);
        gsap.to(ring, { opacity: 1, duration: 1.2, delay: Math.random() * 2 });
        gsap.to(ring, {
            scale: 'random(0.8,1.3)', opacity: 'random(0.05,0.18)',
            duration: 'random(5,10)', repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: Math.random() * 3,
        });
    }
}

/* ── Animação de flutuação da logo via GSAP (para evitar conflitos) ── */
let logoFloatAnimation;
function startLogoFloat() {
    const logoContainer = document.querySelector('.logo-container');
    if (!logoContainer) return;
    
    logoFloatAnimation = gsap.to(logoContainer, {
        y: -10,
        rotation: 0.5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

function initPortalAnimation() {
    const hero          = document.getElementById('hero');
    const logoContainer = document.querySelector('.logo-container');
    const leftHalf      = document.getElementById('logo-left-half');
    const rightHalf     = document.getElementById('logo-right-half');
    const glowLine      = document.getElementById('glow');
    const flashEl       = document.getElementById('portal-flash');
    const logoGlowBg    = document.querySelector('.logo-glow-bg');
    const mainWrapper   = document.getElementById('main-wrapper');
    const header        = document.getElementById('main-header');

    if (!logoContainer) return;

    /* ── Transform origins ── */
    gsap.set(logoContainer, { transformOrigin: '50% 50%' });
    gsap.set(leftHalf,      { transformOrigin: '50% 50%' });
    gsap.set(rightHalf,     { transformOrigin: '50% 50%' });

    /* ── Estados iniciais ── */
    gsap.set(flashEl,     { opacity: 0 });
    gsap.set(glowLine,    { opacity: 0, scaleX: 1, scaleY: 1 });
    gsap.set(mainWrapper, { opacity: 0, y: 100 });
    gsap.set(header,      { opacity: 0, y: -20, pointerEvents: 'none' });
    
    // Forçar estado inicial dos filtros para evitar o "preto"
    gsap.set([leftHalf, rightHalf], { filter: 'brightness(1) saturate(1)' });

    let introPlayed = false;

    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            document.body.style.overflow = 'auto';
            // Scroll lento e automático até a seção de contatos
            gsap.to(window, {
                scrollTo: { y: "#contacts-anchor", autoKill: false },
                duration: 3.5,
                ease: "power1.inOut",
                delay: 0.2
            });
        }
    });

    /* ══════════════════════════════════════
       TIMELINE CINEMATOGRÁFICA (Estilo Netflix)
    ══════════════════════════════════════ */

    // 1. Zoom inicial suave
    tl.to('.scroll-hint', { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
      .to(logoGlowBg, { scale: 2, opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(logoContainer, { 
          scale: 1.15, 
          duration: 0.6, 
          ease: 'power1.inOut' 
      }, 0);

    // 2. Aceleração e Zoom Massivo
    tl.to(logoContainer, {
        scale: 80,
        duration: 1.2,
        ease: 'power4.in'
    }, 0.6);

    tl.to([leftHalf, rightHalf], {
        filter: 'brightness(2.5) saturate(1.5)',
        duration: 0.8,
        ease: 'power2.in'
    }, 0.6);

    // 3. Linha de Luz e Split
    tl.to(glowLine, {
        opacity: 1,
        duration: 0.15,
        ease: 'none'
    }, 1.6);

    tl.to(flashEl, {
        opacity: 1,
        duration: 0.1,
        ease: 'power4.in'
    }, 1.7);

    tl.to(leftHalf, {
        x: '-250vw',
        rotate: -20,
        duration: 1.2,
        ease: 'power3.inOut'
    }, 1.7);

    tl.to(rightHalf, {
        x: '250vw',
        rotate: 20,
        duration: 1.2,
        ease: 'power3.inOut'
    }, 1.7);

    // 4. Fade do Hero e Reveal do Conteúdo
    tl.to(hero, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onStart: () => {
            gsap.set(mainWrapper, { opacity: 1 });
        }
    }, 2.2);

    tl.to(mainWrapper, {
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    }, 2.3);

    tl.to(header, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.8,
        ease: 'power2.out'
    }, 2.5);

    tl.to(flashEl, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    }, 2.2);

    tl.set(hero, { display: 'none' });

    /* ── Gatilhos ── */
    function playIntro() {
        if (introPlayed) return;
        introPlayed = true;
        
        // Mata a animação de flutuação antes de começar o portal
        if (logoFloatAnimation) logoFloatAnimation.kill();
        
        tl.play();
    }

    document.body.style.overflow = 'hidden';

    // Roda do mouse
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) playIntro();
    }, { passive: true });

    // Touch mobile
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        let touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 20) {
            playIntro();
        }
    }, { passive: true });

    // Fallback de scroll (caso o overflow não bloqueie totalmente em algum browser)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 5) playIntro();
    }, { passive: true });

    // Clique na logo ou no hero
    hero.addEventListener('click', playIntro);
    logoContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        playIntro();
    });
}

/* ── Animação de entrada dos cards ── */
function initCardAnimations() {
    document.querySelectorAll('.card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 28,
            duration: 0.45,
            delay: (i % 2) * 0.06,
            ease: 'power2.out',
        });
    });

    gsap.from('.info-item', {
        scrollTrigger: { trigger: '.info-bar', start: 'top 92%' },
        opacity: 0,
        y: 20,
        stagger: 0.07,
        duration: 0.42,
        ease: 'power2.out',
    });
}

window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    startLogoFloat();
    initPortalAnimation();
    initCardAnimations();
});
