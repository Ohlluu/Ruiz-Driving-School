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

// =============================================
//   PRACTICE TEST
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('pt-overlay');
    if (!overlay) return;

    const PT_PASSWORD = 'Instructor7';

    const questions = {
        en: [
            {
                q: "In Illinois, what does a flashing red traffic light require you to do?",
                options: [
                    "Slow down and proceed carefully",
                    "Stop completely, then proceed when safe",
                    "Yield to cross traffic only",
                    "Stop and wait for the light to turn green"
                ],
                answer: 1
            },
            {
                q: "What is the speed limit in Illinois when driving through an alley?",
                options: ["10 mph", "15 mph", "20 mph", "25 mph"],
                answer: 1
            },
            {
                q: "In Illinois, you must signal a turn at least how many feet before turning?",
                options: ["50 feet", "100 feet", "200 feet", "300 feet"],
                answer: 1
            },
            {
                q: "What does a pennant-shaped yellow sign on the left side of the road indicate?",
                options: [
                    "Yield ahead",
                    "No passing zone",
                    "School crossing ahead",
                    "Construction zone ahead"
                ],
                answer: 1
            },
            {
                q: "In Illinois, when are you required to use your headlights?",
                options: [
                    "Only between midnight and 4 AM",
                    "Only on highways and expressways",
                    "From sunset to sunrise and when visibility is reduced",
                    "Only when it is actively raining"
                ],
                answer: 2
            }
        ],
        es: [
            {
                q: "En Illinois, ¿qué te obliga a hacer una luz de tráfico roja intermitente?",
                options: [
                    "Reducir la velocidad y proceder con cuidado",
                    "Detenerse completamente y proceder cuando sea seguro",
                    "Ceder el paso solo al tráfico cruzado",
                    "Detenerse y esperar a que el semáforo se ponga verde"
                ],
                answer: 1
            },
            {
                q: "¿Cuál es el límite de velocidad en Illinois cuando se conduce por un callejón?",
                options: ["10 mph", "15 mph", "20 mph", "25 mph"],
                answer: 1
            },
            {
                q: "En Illinois, ¿con cuántos pies de anticipación debes señalizar una vuelta antes de girar?",
                options: ["50 pies", "100 pies", "200 pies", "300 pies"],
                answer: 1
            },
            {
                q: "¿Qué indica un letrero amarillo en forma de banderín al lado izquierdo de la carretera?",
                options: [
                    "Cruce de peatones adelante",
                    "Zona de no adelantamiento",
                    "Cruce escolar adelante",
                    "Zona de construcción adelante"
                ],
                answer: 1
            },
            {
                q: "En Illinois, ¿cuándo se requiere usar las luces delanteras?",
                options: [
                    "Solo entre la medianoche y las 4 AM",
                    "Solo en autopistas y carreteras expresas",
                    "Desde el atardecer hasta el amanecer y cuando la visibilidad es reducida",
                    "Solo cuando llueve activamente"
                ],
                answer: 2
            }
        ]
    };

    const LETTERS = ['A', 'B', 'C', 'D'];

    // State
    let lang = 'en';
    let qIndex = 0;
    let answers = [];
    let answered = false;

    // Elements
    const screens = {
        password: document.getElementById('pt-screen-password'),
        language: document.getElementById('pt-screen-language'),
        quiz: document.getElementById('pt-screen-quiz'),
        results: document.getElementById('pt-screen-results')
    };

    function showScreen(name) {
        Object.values(screens).forEach(s => { s.hidden = true; });
        screens[name].hidden = false;
    }

    function openOverlay() {
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        document.getElementById('pt-password-input').value = '';
        document.getElementById('pt-password-error').hidden = true;
        showScreen('password');
        setTimeout(() => document.getElementById('pt-password-input').focus(), 60);
    }

    function closeOverlay() {
        overlay.hidden = true;
        document.body.style.overflow = '';
    }

    // Open via PT link
    document.getElementById('pt-link').addEventListener('click', e => {
        e.preventDefault();
        openOverlay();
    });

    // Close buttons
    document.getElementById('pt-close-btn').addEventListener('click', closeOverlay);
    document.getElementById('pt-close-lang').addEventListener('click', closeOverlay);

    // Close on backdrop click
    overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !overlay.hidden) closeOverlay();
    });

    // Password check
    function checkPassword() {
        const val = document.getElementById('pt-password-input').value;
        const err = document.getElementById('pt-password-error');
        if (val === PT_PASSWORD) {
            err.hidden = true;
            showScreen('language');
        } else {
            err.hidden = false;
            document.getElementById('pt-password-input').select();
        }
    }

    document.getElementById('pt-password-submit').addEventListener('click', checkPassword);
    document.getElementById('pt-password-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') checkPassword();
    });

    // Back to password
    document.getElementById('pt-back-to-pw').addEventListener('click', () => showScreen('password'));

    // Language selection
    document.querySelectorAll('.pt-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            lang = btn.dataset.lang;
            startQuiz();
        });
    });

    function startQuiz() {
        qIndex = 0;
        answers = [];
        answered = false;
        showScreen('quiz');
        renderQuestion();
    }

    function renderQuestion() {
        const qs = questions[lang];
        const q = qs[qIndex];
        const total = qs.length;
        answered = false;

        document.getElementById('pt-progress-fill').style.width = `${((qIndex + 1) / total) * 100}%`;
        document.getElementById('pt-progress-text').textContent =
            lang === 'es' ? `Pregunta ${qIndex + 1} de ${total}` : `Question ${qIndex + 1} of ${total}`;
        document.getElementById('pt-question-text').textContent = q.q;

        const optContainer = document.getElementById('pt-options');
        optContainer.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'pt-option';
            btn.innerHTML = `<span class="pt-option-letter">${LETTERS[i]}</span><span class="pt-option-text">${opt}</span>`;
            btn.addEventListener('click', () => selectAnswer(i));
            optContainer.appendChild(btn);
        });

        const nextBtn = document.getElementById('pt-next-btn');
        nextBtn.disabled = true;
        const isLast = qIndex === total - 1;
        nextBtn.textContent = isLast
            ? (lang === 'es' ? 'Ver Resultados' : 'See Results')
            : (lang === 'es' ? 'Siguiente' : 'Next');
    }

    function selectAnswer(idx) {
        if (answered) return;
        answered = true;
        answers.push(idx);

        const opts = document.querySelectorAll('.pt-option');
        const correct = questions[lang][qIndex].answer;
        opts[idx].classList.add(idx === correct ? 'correct' : 'selected');
        opts.forEach((btn, i) => {
            if (i === correct) btn.classList.add('correct');
            else if (i === idx && idx !== correct) btn.classList.add('incorrect');
        });

        document.getElementById('pt-next-btn').disabled = false;
    }

    document.getElementById('pt-next-btn').addEventListener('click', () => {
        qIndex++;
        if (qIndex >= questions[lang].length) {
            showResults();
        } else {
            renderQuestion();
        }
    });

    function showResults() {
        const qs = questions[lang];
        let score = 0;
        answers.forEach((ans, i) => { if (ans === qs[i].answer) score++; });

        const pct = Math.round((score / qs.length) * 100);
        const passed = pct >= 80;

        document.getElementById('pt-score-display').innerHTML = `
            <div class="pt-score-num">${score}/${qs.length}</div>
            <div class="pt-score-pct">${pct}% ${lang === 'es' ? 'correcto' : 'correct'}</div>
        `;

        document.getElementById('pt-result-badge').innerHTML = passed
            ? `<span class="pt-pass-badge">&#10003; ${lang === 'es' ? 'Aprobado' : 'Passed'}</span>`
            : `<span class="pt-fail-badge">&#10007; ${lang === 'es' ? 'Reprobado' : 'Failed'}</span>`;

        const reviewHtml = qs.map((q, i) => {
            const correct = answers[i] === q.answer;
            const wrongCorrectLine = !correct
                ? `<em>${lang === 'es' ? 'Correcto' : 'Correct'}: ${LETTERS[q.answer]}. ${q.options[q.answer]}</em>`
                : '';
            return `
                <div class="pt-review-item">
                    <div class="pt-review-icon ${correct ? 'correct' : 'incorrect'}">${correct ? '&#10003;' : '&#10007;'}</div>
                    <div>
                        <strong>${q.q}</strong>
                        ${lang === 'es' ? 'Tu respuesta' : 'Your answer'}: ${LETTERS[answers[i]]}. ${q.options[answers[i]]}
                        ${wrongCorrectLine}
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('pt-review').innerHTML = reviewHtml;
        document.getElementById('pt-progress-fill').style.width = '100%';

        const retakeBtn = document.getElementById('pt-retake-btn');
        retakeBtn.textContent = lang === 'es' ? 'Repetir Examen' : 'Retake Test';

        showScreen('results');
    }

    document.getElementById('pt-retake-btn').addEventListener('click', () => showScreen('language'));
    document.getElementById('pt-exit-btn').addEventListener('click', closeOverlay);
});
