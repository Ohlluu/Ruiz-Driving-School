// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
    });
});

// Navbar scroll shadow + Scroll Spy
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 60 ? '0 2px 20px rgba(0,0,0,0.35)' : 'none';

    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, { passive: true });

// Scroll Reveal
document.addEventListener('DOMContentLoaded', () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = [...(entry.target.parentElement?.children || [])].filter(el => el.classList.contains('reveal'));
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 75}ms`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// Counter Animation for Hero Stats
const animateCounter = (el, target, suffix, duration = 1800) => {
    let start = 0;
    const step = target / (duration / 16);
    const tick = () => {
        start += step;
        if (start < target) {
            el.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    };
    tick();
};

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                const text = el.textContent.trim();
                const suffix = text.includes('+') ? '+' : text.includes('%') ? '%' : '';
                animateCounter(el, parseInt(text), suffix);
            });
        });
    }, { threshold: 0.1 }).observe(heroStats);
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(open => {
                open.classList.remove('active');
                open.querySelector('.faq-answer').hidden = true;
                open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('active');
                answer.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});

// Floating Action Button
document.addEventListener('DOMContentLoaded', () => {
    const fab = document.createElement('a');
    fab.href = 'tel:8722075198';
    fab.innerHTML = '<i class="fas fa-phone"></i>';
    fab.className = 'floating-action-btn';
    fab.setAttribute('aria-label', 'Call Ruiz Driving School');
    document.body.appendChild(fab);
});

// Page load fade-in
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.45s ease';
        document.body.style.opacity = '1';
    }, 40);
});

// Accessibility: skip link
document.addEventListener('DOMContentLoaded', () => {
    const skip = document.createElement('a');
    skip.href = '#home';
    skip.textContent = 'Skip to content';
    skip.style.cssText = `position:absolute;top:-50px;left:8px;background:var(--yellow);color:#111;
        padding:8px 14px;border-radius:4px;font-weight:700;font-size:0.85rem;text-decoration:none;
        z-index:9999;transition:top 0.2s;`;
    skip.addEventListener('focus', () => (skip.style.top = '8px'));
    skip.addEventListener('blur', () => (skip.style.top = '-50px'));
    document.body.insertBefore(skip, document.body.firstChild);
});

// Konami Code
let kc = [];
document.addEventListener('keydown', e => {
    kc = [...kc, e.keyCode].slice(-10);
    if (kc.join() === '38,38,40,40,37,39,37,39,66,65') {
        const n = document.createElement('div');
        n.textContent = '🚗 You found the secret! Safe driving! 🚗';
        n.style.cssText = `position:fixed;top:90px;right:20px;background:#10b981;color:#fff;
            padding:1rem 1.5rem;border-radius:8px;z-index:1001;font-weight:600;font-size:0.9rem;
            box-shadow:0 8px 24px rgba(0,0,0,0.15);`;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 4000);
    }
});
