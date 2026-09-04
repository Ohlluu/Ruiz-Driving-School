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
        const href = this.getAttribute('href');
        // Bare "#" links (the practice-test triggers) are not scroll targets, and
        // querySelector('#') throws a SyntaxError — which is what used to fill the
        // console every time one was clicked.
        if (!href || href === '#') return;
        const target = document.querySelector(href);
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

    // Question banks are no longer in this file. They live server side in
    // lib/questions.js and arrive from /api/questions once a valid instructor
    // code has been accepted, so the answer keys are never delivered to a
    // browser that has not logged in.
    let TESTS = null;
    let sessionWho = null;

    // 'E' supports PT2's two 5-option questions (Q11, which keeps the sheet's
    // "None of the above", and Q33). PT1 is unaffected — it has none.
    const LETTERS = ['A', 'B', 'C', 'D', 'E'];

    // Signs questions are numbered 1-17 to match the printed list students
    // work from; everything else keeps the A/B/C lettering.
    function optLabel(q, i) {
        return q.numbered ? String(i + 1) : LETTERS[i];
    }

    // State
    let lang = 'en';
    let currentTest = 1;
    let queue = [];
    let skippedSet = new Set();
    let answersMap = {};
    let answeredCount = 0;
    let selectedAnswer = -1;
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

    // Returns the question array for the active test + language. TESTS is keyed
    // 1 = PT, 2 = PT2, 3 = PTS (signs), 4 = PT4, and is filled from
    // /api/questions after login. The language fallback only guards against a
    // bank being empty (PT4 has no Spanish yet), so the quiz never receives a
    // zero-length array.
    function getBank() {
        if (!TESTS) return [];
        const bank = TESTS[currentTest] || TESTS[1];
        const set = bank[lang];
        return (set && set.length) ? set : bank.en;
    }

    // Fetches the banks for the current session. Returns true once TESTS is
    // populated, false if the session is missing or expired.
    async function loadQuestions() {
        if (TESTS) return true;
        try {
            const res = await fetch('/api/questions', { credentials: 'same-origin' });
            if (!res.ok) return false;
            const data = await res.json();
            if (!data || !data.tests) return false;
            TESTS = data.tests;
            sessionWho = data.who || null;
            return true;
        } catch (e) {
            return false;
        }
    }

    function setCodeError(msg) {
        const el = document.getElementById('pt-password-error');
        if (msg) el.textContent = msg;
        el.hidden = !msg;
    }

    async function openOverlay(testNum) {
        currentTest = testNum;
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        document.getElementById('pt-password-input').value = '';
        setCodeError('');

        // An 8-hour session means a second test in the same shift should not ask
        // for the code again — try the session first and only fall back to the
        // code screen if it has gone.
        showScreen('password');
        if (await loadQuestions()) {
            showScreen('language');
            return;
        }
        setTimeout(() => document.getElementById('pt-password-input').focus(), 60);
    }

    function closeOverlay() {
        overlay.hidden = true;
        document.body.style.overflow = '';
    }

    // Open via PT links — each link picks its test, then password → language → quiz
    document.getElementById('pt-link').addEventListener('click', e => {
        e.preventDefault();
        openOverlay(1);
    });

    document.getElementById('pt2-link').addEventListener('click', e => {
        e.preventDefault();
        openOverlay(2);
    });

    document.getElementById('pts-link').addEventListener('click', e => {
        e.preventDefault();
        openOverlay(3);
    });

    document.getElementById('pt4-link').addEventListener('click', e => {
        e.preventDefault();
        openOverlay(4);
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

    // Code check — validated by the server, which also records the attempt.
    // Nothing here can tell whether a code is right; only /api/login can.
    let submitting = false;

    async function submitCode() {
        if (submitting) return;
        const input = document.getElementById('pt-password-input');
        const btn = document.getElementById('pt-password-submit');
        const code = input.value.trim();
        if (!code) {
            setCodeError('Enter your instructor code.');
            input.focus();
            return;
        }

        submitting = true;
        btn.disabled = true;
        const label = btn.textContent;
        btn.textContent = 'Checking…';
        setCodeError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ code })
            });

            if (res.status === 429) {
                setCodeError('Too many attempts. Wait a few minutes and try again.');
            } else if (res.status === 500) {
                setCodeError('Login is not set up yet on this site. Contact the office.');
            } else if (!res.ok) {
                setCodeError('That code was not recognised.');
                input.select();
            } else if (await loadQuestions()) {
                showScreen('language');
            } else {
                setCodeError('Signed in, but the questions could not be loaded. Try again.');
            }
        } catch (e) {
            setCodeError('No connection. Check the internet and try again.');
        } finally {
            submitting = false;
            btn.disabled = false;
            btn.textContent = label;
        }
    }

    document.getElementById('pt-password-submit').addEventListener('click', submitCode);
    document.getElementById('pt-password-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') submitCode();
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
        const total = getBank().length;
        queue = Array.from({ length: total }, (_, i) => i);
        skippedSet = new Set();
        answersMap = {};
        answeredCount = 0;
        selectedAnswer = -1;
        answered = false;
        document.getElementById('sb-correct').textContent = '0';
        document.getElementById('sb-skipped').textContent = '0';
        document.getElementById('sb-incorrect').textContent = '0';
        // Pass mark is 80% of however many questions this test has
        document.getElementById('sb-topass').textContent = Math.ceil(total * 0.8);
        document.getElementById('pt-quit-modal').hidden = true;
        showScreen('quiz');
        renderQuestion();
    }

    function renderQuestion() {
        const qs = getBank();
        const qIdx = queue[0];
        const q = qs[qIdx];
        const total = qs.length;
        answered = false;
        selectedAnswer = -1;

        document.getElementById('pt-progress-fill').style.width = `${(answeredCount / total) * 100}%`;
        document.getElementById('pt-progress-text').textContent =
            lang === 'es' ? `Pregunta ${answeredCount + 1} de ${total}` : `Question ${answeredCount + 1} of ${total}`;

        const wasSkipped = skippedSet.has(qIdx);
        document.getElementById('pt-skipped-label').hidden = !wasSkipped;
        document.getElementById('pt-skip-btn').hidden = wasSkipped;

        // Text-only questions (PT2) carry no `img` — pull the element out of the
        // layout instead of leaving a broken-image icon behind. If a path is set
        // but the file is missing (sign art not added yet), fall back to a
        // labelled placeholder so the question is still answerable.
        const imgEl = document.getElementById('pt-question-img');
        const phEl = document.getElementById('pt-question-placeholder');
        imgEl.onerror = null;
        if (q.pendingArt) {
            // Art we know isn't here yet — show the placeholder outright rather
            // than loading a missing file and flashing a broken image first.
            imgEl.removeAttribute('src');
            imgEl.alt = '';
            imgEl.hidden = true;
            phEl.textContent = 'Sign image coming soon';
            phEl.hidden = false;
        } else if (q.img) {
            imgEl.onerror = () => {
                imgEl.onerror = null;
                imgEl.hidden = true;
                phEl.textContent = 'Sign image not available yet';
                phEl.hidden = false;
            };
            phEl.hidden = true;
            imgEl.src = q.img;
            imgEl.alt = 'Question ' + (qIdx + 1) + ' reference image';
            imgEl.hidden = false;
        } else {
            imgEl.removeAttribute('src');
            imgEl.alt = '';
            imgEl.hidden = true;
            phEl.hidden = true;
        }

        document.getElementById('pt-question-text').textContent = q.q;

        const optContainer = document.getElementById('pt-options');
        optContainer.innerHTML = '';
        // 17 sign names would make an absurdly tall card in one column
        optContainer.classList.toggle('pt-options-grid', !!q.numbered);
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'pt-option';
            btn.innerHTML = `<span class="pt-option-letter">${optLabel(q, i)}</span><span class="pt-option-text">${opt}</span>`;
            btn.addEventListener('click', () => selectAnswer(i));
            optContainer.appendChild(btn);
        });

        const nextBtn = document.getElementById('pt-next-btn');
        nextBtn.disabled = true;
        nextBtn.textContent = queue.length === 1
            ? (lang === 'es' ? 'Ver Resultados' : 'See Results')
            : (lang === 'es' ? 'Siguiente' : 'Next');
    }

    function selectAnswer(idx) {
        if (answered) return;
        answered = true;
        selectedAnswer = idx;

        const opts = document.querySelectorAll('.pt-option');
        const correct = getBank()[queue[0]].answer;
        opts[idx].classList.add(idx === correct ? 'correct' : 'selected');
        opts.forEach((btn, i) => {
            if (i === correct) btn.classList.add('correct');
            else if (i === idx && idx !== correct) btn.classList.add('incorrect');
        });

        const sbId = idx === correct ? 'sb-correct' : 'sb-incorrect';
        const sbEl = document.getElementById(sbId);
        sbEl.textContent = parseInt(sbEl.textContent) + 1;

        document.getElementById('pt-next-btn').disabled = false;
        document.getElementById('pt-skip-btn').hidden = true;
    }

    document.getElementById('pt-next-btn').addEventListener('click', () => {
        const qIdx = queue.shift();
        answersMap[qIdx] = selectedAnswer;
        answeredCount++;
        if (queue.length > 0) {
            renderQuestion();
        } else {
            showResults();
        }
    });

    document.getElementById('pt-skip-btn').addEventListener('click', () => {
        const qIdx = queue.shift();
        skippedSet.add(qIdx);
        queue.push(qIdx);
        const sbSkip = document.getElementById('sb-skipped');
        sbSkip.textContent = parseInt(sbSkip.textContent) + 1;
        renderQuestion();
    });

    function showResults() {
        const qs = getBank();
        let score = 0;
        qs.forEach((q, i) => { if (answersMap[i] === q.answer) score++; });

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
            const userAns = answersMap[i];
            const correct = userAns === q.answer;
            const wrongCorrectLine = !correct
                ? `<em>${lang === 'es' ? 'Correcto' : 'Correct'}: ${optLabel(q, q.answer)}. ${q.options[q.answer]}</em>`
                : '';
            return `
                <div class="pt-review-item">
                    <div class="pt-review-icon ${correct ? 'correct' : 'incorrect'}">${correct ? '&#10003;' : '&#10007;'}</div>
                    <div>
                        <strong>${q.q}</strong>
                        ${lang === 'es' ? 'Tu respuesta' : 'Your answer'}: ${optLabel(q, userAns)}. ${q.options[userAns]}
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

    const quitModal = document.getElementById('pt-quit-modal');
    document.getElementById('pt-quit-btn').addEventListener('click', () => { quitModal.hidden = false; });
    document.getElementById('pt-quit-cancel').addEventListener('click', () => { quitModal.hidden = true; });
    document.getElementById('pt-quit-confirm').addEventListener('click', () => {
        quitModal.hidden = true;
        closeOverlay();
    });

    document.getElementById('pt-retake-btn').addEventListener('click', () => showScreen('language'));
    document.getElementById('pt-exit-btn').addEventListener('click', closeOverlay);
});
