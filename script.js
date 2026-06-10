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

    const PT_PASSWORD = 'Instructor711$';

    const questions = {
        en: [
            {
                img: 'pt-images/q1.webp',
                q: 'You are waiting at an intersection and the traffic signal light changes to green. You may then go ahead:',
                options: [
                    'Immediately',
                    'After first yielding the right-of-way to any persons or vehicles that are within the intersection',
                    'When you think it is safe to do so'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q2.jpg',
                q: 'The road surface of a bridge may be dangerous in winter because:',
                options: [
                    'There may be ice on bridges even when other pavements are clear',
                    'The bridge surface is warmer',
                    'None of the above'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q3.webp',
                q: 'When approaching a railroad grade crossing that does NOT have ANY warning system (such as electric flashing lights or gates), you should:',
                options: [
                    'Look, listen, slow down in case you have to stop, and proceed when safe to do so',
                    'Increase speed and cross tracks as quickly as possible',
                    'Continue at your normal speed'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q4.jpg',
                q: 'When there are flashing signals at a railroad crossing and the train clears the crossing, how should you proceed?',
                options: [
                    'Follow the vehicle ahead of you',
                    'After you check to make sure another train is not approaching on another track',
                    'Just as soon as the train clears the crossing'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q5.jpg',
                q: 'When you are driving and one of your tires has a blowout, you should:',
                options: [
                    'Apply the brakes quickly to reduce speed',
                    'Quickly steer onto the right shoulder',
                    'Grip the steering wheel firmly, take your foot off the gas pedal, and let the vehicle slow down before you drive onto the shoulder'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q6.jpg',
                q: 'If you are convicted of passing a school bus that is receiving or discharging passengers, you may lose your driver\'s license for at least 3 months.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                img: 'pt-images/q7.png',
                q: 'When a two-lane pavement is marked with a single, solid yellow line on your side of the center line:',
                options: [
                    'Construction work is going on ahead, slow down',
                    'You must not cross the yellow line to pass another vehicle',
                    'You must slow down and proceed with caution'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q8.webp',
                q: 'Motorcycles are entitled to use the full width of a traffic lane, the same as a vehicle. Therefore, when you are driving a vehicle and want to pass a motorcycle, you should:',
                options: [
                    'Follow the motorcycle without passing it',
                    'Cautiously pass the motorcycle, sharing the same lane that it is using',
                    'Not pass the motorcycle in the same lane that it is using, but change lanes and pass the way you would pass another vehicle'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q9.webp',
                q: 'If you are under 18 and you drive after nighttime driving restriction hours, you must have a parent, legal guardian or someone 21 years of age or older with you. Your parents or legal guardian must approve of the person. If these conditions are not met, your license or permit may not be valid during those hours.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                img: 'pt-images/q10.jpg',
                q: 'When there are flashing signals at a railroad crossing and the train clears the crossing, how soon should you proceed?',
                options: [
                    'Follow the vehicle ahead of you',
                    'After you check to make sure another train is not approaching on another track',
                    'Just as soon as the train clears the crossing'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q11.png',
                q: 'Drivers are NOT permitted to wear headsets or have a television receiver visible from the driver\'s seat.',
                options: ['False', 'True'],
                answer: 1
            },
            {
                img: 'pt-images/q12.webp',
                q: 'The driver and front-seat passengers (age 8 and above) are required to wear seat safety belts while riding in a motor vehicle on Illinois roadways.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                img: 'pt-images/q13.jpg',
                q: 'Your driving privileges will be revoked in the State of Illinois if you are convicted of:',
                options: [
                    'Driving or being in actual physical control of a vehicle while under the influence of alcohol or other drugs (including prescription drugs that may impair driving ability) and/or combinations thereof',
                    'Leaving the scene of an accident in which you are involved as a driver, if the accident results in death or personal injury',
                    'Drag racing',
                    'All of the above'
                ],
                answer: 3
            },
            {
                img: 'pt-images/q14.webp',
                q: 'You are required by law to yield the right-of-way to any authorized vehicle engaged in highway construction or maintenance that is displaying amber (yellow) oscillating, rotating or flashing lights.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                img: 'pt-images/q15.jpg',
                q: 'Headlights are required:',
                options: [
                    'When weather conditions require the use of windshield wipers',
                    'From dusk to dawn',
                    'During periods of poor visibility',
                    'All of the above'
                ],
                answer: 3
            },
            {
                img: 'pt-images/q16.avif',
                q: 'When a right turn against a red signal light is allowed, the proper way to make the turn is to:',
                options: [
                    'Stop, sound your horn to warn other traffic, then make your turn',
                    'Stop, give the right-of-way to any persons or vehicle within the intersection, then cautiously make your turn',
                    'Turn quickly to get out of the way of other traffic'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q17.jpg',
                q: 'When headlights are required, bright lights should be dimmed at least 500 feet before meeting and 300 feet before overtaking another vehicle.',
                options: ['False', 'True'],
                answer: 1
            },
            {
                img: 'pt-images/q18.jpg',
                q: 'When an authorized emergency vehicle that is using its siren and flashing lights approaches your vehicle, you should:',
                options: [
                    'Continue at the same speed',
                    'Pull over to the right-hand edge of the highway and stop if possible',
                    'Increase your speed'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q19.jpeg',
                q: 'When driving along the highway and the front right wheel of your vehicle runs off the pavement, you should:',
                options: [
                    'Grasp the steering wheel tightly and take your foot off the accelerator',
                    'Quickly swing back onto the pavement at your normal speed',
                    'Apply the brakes immediately and swing back onto the pavement quickly'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q20.webp',
                q: 'A flashing red traffic signal light at an intersection means:',
                options: [
                    'Exactly the same thing as a stop sign',
                    'An emergency vehicle is approaching from your rear',
                    'You should be careful when going through the intersection'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q21.jpeg',
                q: 'A driver moving out of an alley, private road, or driveway within an urban area must:',
                options: [
                    'Sound his/her horn and exit quickly',
                    'Stop before reaching the sidewalk and yield to pedestrians and vehicles',
                    'Stop only if there are vehicles coming down the street'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q22.jpg',
                q: 'When a traffic light shows both a red light and a green arrow in the direction you wish to turn, you:',
                options: [
                    'Must stop and remain stopped until the red light has changed',
                    'Have the right-of-way over pedestrians in turning in the direction of the arrow',
                    'May proceed in the direction of the arrow with caution'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q23.jpg',
                q: 'This sign indicates:',
                options: [
                    'Construction or maintenance areas ahead',
                    'Pass with care',
                    'Look for a detour'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q24.jpg',
                q: 'This sign indicates:',
                options: [
                    'You may make a U-turn after a complete stop',
                    'U-turns are not allowed',
                    'Slow down for extreme danger'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q25.gif',
                q: 'This sign indicates you should:',
                options: [
                    'Start slowing down due to traffic controls ahead',
                    'Yield the right-of-way',
                    'Be prepared to merge'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q26.jpg',
                q: 'This sign indicates:',
                options: [
                    'Pedestrians are not permitted to cross in this area',
                    'You are near an intersection',
                    'Slow down, watch for people crossing the street'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q27.png',
                q: 'This sign indicates:',
                options: [
                    'You should move over into the right lane if you are driving slowly',
                    'Right turns are not allowed at this intersection',
                    'You may turn right after a complete stop'
                ],
                answer: 1
            },
            {
                img: 'pt-images/q28.jpg',
                q: 'This sign indicates you should:',
                options: [
                    'Slow down very slowly',
                    'Stop only when other traffic is close',
                    'Always stop completely'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q29.jpg',
                q: 'Illinois law requires children under age 8 to be secured by a restraining system or seat belt when travelling in a motor vehicle:',
                options: [
                    'Anywhere in a vehicle',
                    'In the back seat only',
                    'In the front seat only',
                    'Never, this is not a law'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q30.jpeg',
                q: 'This sign indicates you should:',
                options: [
                    'Never pass another vehicle at this location',
                    'Pass only if you are in a hurry',
                    'Cross the double stripe and return quickly when overtaking here'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q31.jpg',
                q: 'This sign indicates you should:',
                options: [
                    'Yield to other drivers or pedestrians',
                    'Expect other drivers or pedestrians to yield to you',
                    'Always stop'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q32.png',
                q: 'This sign indicates you should:',
                options: [
                    'Always sound your horn',
                    'Drive around this area',
                    'Watch for children'
                ],
                answer: 2
            },
            {
                img: 'pt-images/q33.png',
                q: 'This sign indicates:',
                options: [
                    'Railroad crossing ahead',
                    'Always stop',
                    'Get ready to cross a rural road'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q34.jpg',
                q: 'This sign indicates you should:',
                options: [
                    'Watch out for crossroad traffic',
                    'Watch for a stop sign',
                    'Get ready to enter a main highway'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q35.jpg',
                q: 'This sign indicates:',
                options: [
                    'Do not enter',
                    'Enter the street ahead slowly',
                    'Parking is not allowed'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q36.jpg',
                q: 'This sign indicates:',
                options: [
                    'You should prepare for a reduction in traffic lanes ahead',
                    'The road surface changes ahead',
                    'You are approaching a one-way street'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q37.jpg',
                q: 'This sign indicates you should:',
                options: [
                    'Be ready to yield to other traffic entering your lane',
                    'Watch especially for emergency vehicles here',
                    'Stop'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q38.png',
                q: 'This sign indicates you should:',
                options: [
                    'Be prepared to pay special attention for a slow moving vehicle',
                    'Be prepared to stop',
                    'Be prepared to change lanes'
                ],
                answer: 0
            },
            {
                img: 'pt-images/q39.png',
                q: 'In order to reinstate full driving privileges after a DRIVING UNDER THE INFLUENCE (DUI) revocation, a person must:',
                options: [
                    'Wait a minimum of one year',
                    'Submit to a professional assessment of alcohol and/or drug use and attend a remedial or rehabilitation program and carry high-risk auto insurance for three years',
                    'Be approved for reinstatement by the Secretary of State\'s Administrative Hearing Department and pay a reinstatement fee',
                    'All of the above'
                ],
                answer: 3
            },
            {
                img: 'pt-images/q40.jpg',
                q: 'When making a left or right turn in a business or residential district, a continuous signal to turn must be given:',
                options: [
                    'Not less than 100 feet before turning',
                    'At least 50 feet from the intersection',
                    'Only when vehicles are coming toward you'
                ],
                answer: 0
            }
        ]
    };
    questions.es = [
        {
            img: 'pt-images/q1.webp',
            q: 'Estás esperando en una intersección y el semáforo cambia a verde. Puedes avanzar:',
            options: [
                'De inmediato',
                'Después de ceder el paso a cualquier persona o vehículo que se encuentre dentro de la intersección',
                'Cuando consideres que es seguro hacerlo'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q2.jpg',
            q: 'La superficie de un puente puede ser peligrosa en invierno porque:',
            options: [
                'Puede haber hielo en los puentes aunque otras superficies estén despejadas',
                'La superficie del puente es más cálida',
                'Ninguna de las anteriores'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q3.webp',
            q: 'Cuando te acerques a un cruce de ferrocarril que NO tiene ningún sistema de advertencia (como luces intermitentes eléctricas o barreras), debes:',
            options: [
                'Mirar, escuchar, reducir la velocidad por si tienes que detenerte, y avanzar cuando sea seguro',
                'Aumentar la velocidad y cruzar las vías lo más rápido posible',
                'Continuar a tu velocidad normal'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q4.jpg',
            q: 'Cuando hay señales intermitentes en un cruce de ferrocarril y el tren despeja el cruce, ¿cómo debes proceder?',
            options: [
                'Seguir al vehículo que va adelante',
                'Después de verificar que no se acerca otro tren por otra vía',
                'En cuanto el tren despeje el cruce'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q5.jpg',
            q: 'Cuando estás manejando y una de tus llantas revienta, debes:',
            options: [
                'Aplicar los frenos rápidamente para reducir la velocidad',
                'Dirigirte rápidamente al acotamiento derecho',
                'Sujetar firmemente el volante, quitar el pie del acelerador y dejar que el vehículo disminuya la velocidad antes de dirigirte al acotamiento'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q6.jpg',
            q: 'Si te declaran culpable de rebasar un autobús escolar que está recogiendo o dejando pasajeros, puedes perder tu licencia de manejo por al menos 3 meses.',
            options: ['Verdadero', 'Falso'],
            answer: 0
        },
        {
            img: 'pt-images/q7.png',
            q: 'Cuando un camino de dos carriles tiene una línea amarilla continua en tu lado de la línea central:',
            options: [
                'Hay trabajos de construcción adelante, reduce la velocidad',
                'No debes cruzar la línea amarilla para rebasar otro vehículo',
                'Debes reducir la velocidad y avanzar con precaución'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q8.webp',
            q: 'Las motocicletas tienen derecho a usar el ancho completo de un carril, igual que cualquier vehículo. Por lo tanto, cuando quieres rebasar una motocicleta, debes:',
            options: [
                'Seguir a la motocicleta sin rebasarla',
                'Rebasar la motocicleta con precaución compartiendo el mismo carril que está usando',
                'No rebasar la motocicleta en el mismo carril, sino cambiar de carril y rebasarla como lo harías con cualquier otro vehículo'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q9.webp',
            q: 'Si tienes menos de 18 años y manejas después del horario de restricción nocturna, debes ir acompañado de uno de tus padres, tutor legal o alguien de 21 años o más. Tus padres o tutor legal deben aprobar a esa persona. Si no se cumplen estas condiciones, tu licencia o permiso puede no ser válido durante esas horas.',
            options: ['Verdadero', 'Falso'],
            answer: 0
        },
        {
            img: 'pt-images/q10.jpg',
            q: 'Cuando hay señales intermitentes en un cruce de ferrocarril y el tren despeja el cruce, ¿cuándo debes avanzar?',
            options: [
                'Seguir al vehículo que va adelante',
                'Después de verificar que no se acerca otro tren por otra vía',
                'En cuanto el tren despeje el cruce'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q11.png',
            q: 'A los conductores NO les está permitido usar audífonos ni tener un televisor visible desde el asiento del conductor.',
            options: ['Falso', 'Verdadero'],
            answer: 1
        },
        {
            img: 'pt-images/q12.webp',
            q: 'El conductor y los pasajeros del asiento delantero (de 8 años en adelante) están obligados a usar cinturón de seguridad al viajar en un vehículo de motor en las carreteras de Illinois.',
            options: ['Verdadero', 'Falso'],
            answer: 0
        },
        {
            img: 'pt-images/q13.jpg',
            q: 'Tus privilegios de manejo serán revocados en el Estado de Illinois si eres declarado culpable de:',
            options: [
                'Manejar o tener control físico de un vehículo bajo la influencia del alcohol u otras drogas (incluyendo medicamentos recetados que afecten la capacidad de manejo) y/o combinaciones de estos',
                'Abandonar el lugar de un accidente en el que estás involucrado como conductor, si el accidente resulta en muerte o lesiones',
                'Participar en carreras clandestinas',
                'Todas las anteriores'
            ],
            answer: 3
        },
        {
            img: 'pt-images/q14.webp',
            q: 'La ley te obliga a ceder el paso a cualquier vehículo autorizado que realice trabajos de construcción o mantenimiento en carreteras y que muestre luces ámbar (amarillas) oscilantes, giratorias o intermitentes.',
            options: ['Verdadero', 'Falso'],
            answer: 0
        },
        {
            img: 'pt-images/q15.jpg',
            q: 'Las luces delanteras son obligatorias:',
            options: [
                'Cuando las condiciones climáticas requieren el uso de limpiaparabrisas',
                'Del anochecer al amanecer',
                'Durante períodos de poca visibilidad',
                'Todas las anteriores'
            ],
            answer: 3
        },
        {
            img: 'pt-images/q16.avif',
            q: 'Cuando se permite dar vuelta a la derecha con semáforo en rojo, la manera correcta de hacerlo es:',
            options: [
                'Detenerse, tocar el claxon para advertir al tráfico, y luego dar la vuelta',
                'Detenerse, ceder el paso a cualquier persona o vehículo dentro de la intersección, y luego dar la vuelta con precaución',
                'Dar la vuelta rápidamente para salir del camino del tráfico'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q17.jpg',
            q: 'Cuando se requieren luces delanteras, las luces altas deben apagarse al menos 500 pies antes de cruzarte con otro vehículo y 300 pies antes de rebasarlo.',
            options: ['Falso', 'Verdadero'],
            answer: 1
        },
        {
            img: 'pt-images/q18.jpg',
            q: 'Cuando un vehículo de emergencia autorizado con sirena y luces intermitentes se acerca a tu vehículo, debes:',
            options: [
                'Continuar a la misma velocidad',
                'Orillarte al lado derecho de la carretera y detenerte si es posible',
                'Aumentar tu velocidad'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q19.jpeg',
            q: 'Cuando vas manejando en la carretera y la llanta delantera derecha de tu vehículo se sale del pavimento, debes:',
            options: [
                'Sujetar firmemente el volante y quitar el pie del acelerador',
                'Regresar rápidamente al pavimento a tu velocidad normal',
                'Aplicar los frenos de inmediato y regresar rápidamente al pavimento'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q20.webp',
            q: 'Una luz de semáforo roja intermitente en una intersección significa:',
            options: [
                'Lo mismo que una señal de alto',
                'Un vehículo de emergencia se acerca por detrás',
                'Debes tener cuidado al cruzar la intersección'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q21.jpeg',
            q: 'Un conductor que sale de un callejón, camino privado o entrada de vehículos en una zona urbana debe:',
            options: [
                'Tocar el claxon y salir rápidamente',
                'Detenerse antes de llegar a la banqueta y ceder el paso a peatones y vehículos',
                'Detenerse solo si hay vehículos que vienen por la calle'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q22.jpg',
            q: 'Cuando el semáforo muestra una luz roja y una flecha verde en la dirección en que deseas girar, debes:',
            options: [
                'Detenerte y permanecer detenido hasta que la luz roja cambie',
                'Tienes preferencia sobre los peatones al girar en la dirección de la flecha',
                'Avanzar en la dirección de la flecha con precaución'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q23.jpg',
            q: 'Esta señal indica:',
            options: [
                'Zona de construcción o mantenimiento adelante',
                'Rebase con precaución',
                'Busca un desvío'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q24.jpg',
            q: 'Esta señal indica:',
            options: [
                'Puedes hacer un giro en U después de detenerte completamente',
                'Los giros en U no están permitidos',
                'Reduce la velocidad ante peligro extremo'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q25.gif',
            q: 'Esta señal indica que debes:',
            options: [
                'Comenzar a reducir la velocidad por controles de tráfico adelante',
                'Ceder el paso',
                'Prepararte para incorporarte al tráfico'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q26.jpg',
            q: 'Esta señal indica:',
            options: [
                'Los peatones no pueden cruzar en esta área',
                'Estás cerca de una intersección',
                'Reduce la velocidad y presta atención a las personas que cruzan la calle'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q27.png',
            q: 'Esta señal indica:',
            options: [
                'Debes moverte al carril derecho si manejas despacio',
                'Los giros a la derecha no están permitidos en esta intersección',
                'Puedes girar a la derecha después de detenerte completamente'
            ],
            answer: 1
        },
        {
            img: 'pt-images/q28.jpg',
            q: 'Esta señal indica que debes:',
            options: [
                'Reducir la velocidad gradualmente',
                'Detenerte solo cuando el tráfico está cerca',
                'Detenerte completamente siempre'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q29.jpg',
            q: 'La ley de Illinois requiere que los niños menores de 8 años vayan asegurados con un sistema de retención o cinturón de seguridad al viajar en un vehículo de motor:',
            options: [
                'En cualquier lugar del vehículo',
                'Solo en el asiento trasero',
                'Solo en el asiento delantero',
                'Nunca, esto no es una ley'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q30.jpeg',
            q: 'Esta señal indica que debes:',
            options: [
                'Nunca rebasar otro vehículo en este lugar',
                'Rebasar solo si tienes prisa',
                'Cruzar la doble línea y regresar rápidamente al rebasar aquí'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q31.jpg',
            q: 'Esta señal indica que debes:',
            options: [
                'Ceder el paso a otros conductores o peatones',
                'Esperar que otros conductores o peatones te cedan el paso',
                'Detenerte siempre'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q32.png',
            q: 'Esta señal indica que debes:',
            options: [
                'Tocar el claxon siempre',
                'Rodear esta área',
                'Estar atento a la presencia de niños'
            ],
            answer: 2
        },
        {
            img: 'pt-images/q33.png',
            q: 'Esta señal indica:',
            options: [
                'Cruce de ferrocarril adelante',
                'Detenerte siempre',
                'Prepárate para cruzar un camino rural'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q34.jpg',
            q: 'Esta señal indica que debes:',
            options: [
                'Estar atento al tráfico en el cruce',
                'Estar atento a una señal de alto',
                'Prepararte para incorporarte a una carretera principal'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q35.jpg',
            q: 'Esta señal indica:',
            options: [
                'Prohibido entrar',
                'Entra a la calle de adelante despacio',
                'No se permite estacionarse'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q36.jpg',
            q: 'Esta señal indica:',
            options: [
                'Debes prepararte para una reducción de carriles adelante',
                'La superficie del camino cambia adelante',
                'Te estás acercando a una calle de un solo sentido'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q37.jpg',
            q: 'Esta señal indica que debes:',
            options: [
                'Estar preparado para ceder el paso al tráfico que se incorpora a tu carril',
                'Estar especialmente atento a vehículos de emergencia aquí',
                'Detenerte'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q38.png',
            q: 'Esta señal indica que debes:',
            options: [
                'Estar preparado para prestar atención a un vehículo de movimiento lento',
                'Estar preparado para detenerte',
                'Estar preparado para cambiar de carril'
            ],
            answer: 0
        },
        {
            img: 'pt-images/q39.png',
            q: 'Para recuperar los privilegios completos de manejo después de una revocación por MANEJAR BAJO LA INFLUENCIA (DUI), la persona debe:',
            options: [
                'Esperar un mínimo de un año',
                'Someterse a una evaluación profesional del consumo de alcohol y/o drogas, asistir a un programa de rehabilitación y llevar seguro de auto de alto riesgo por tres años',
                'Obtener la aprobación del Departamento de Audiencias Administrativas del Secretario de Estado y pagar una cuota de restablecimiento',
                'Todas las anteriores'
            ],
            answer: 3
        },
        {
            img: 'pt-images/q40.jpg',
            q: 'Al girar a la izquierda o a la derecha en una zona comercial o residencial, se debe indicar la intención de girar de manera continua:',
            options: [
                'No menos de 100 pies antes de girar',
                'Al menos 50 pies de la intersección',
                'Solo cuando los vehículos se acercan hacia ti'
            ],
            answer: 0
        }
    ];

    const LETTERS = ['A', 'B', 'C', 'D'];

    // State
    let lang = 'en';
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
        const total = questions[lang].length;
        queue = Array.from({ length: total }, (_, i) => i);
        skippedSet = new Set();
        answersMap = {};
        answeredCount = 0;
        selectedAnswer = -1;
        answered = false;
        document.getElementById('sb-correct').textContent = '0';
        document.getElementById('sb-skipped').textContent = '0';
        document.getElementById('sb-incorrect').textContent = '0';
        document.getElementById('pt-quit-modal').hidden = true;
        showScreen('quiz');
        renderQuestion();
    }

    function renderQuestion() {
        const qs = questions[lang];
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

        const imgEl = document.getElementById('pt-question-img');
        imgEl.src = q.img;
        imgEl.alt = 'Question ' + (qIdx + 1) + ' reference image';

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
        nextBtn.textContent = queue.length === 1
            ? (lang === 'es' ? 'Ver Resultados' : 'See Results')
            : (lang === 'es' ? 'Siguiente' : 'Next');
    }

    function selectAnswer(idx) {
        if (answered) return;
        answered = true;
        selectedAnswer = idx;

        const opts = document.querySelectorAll('.pt-option');
        const correct = questions[lang][queue[0]].answer;
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
        const qs = questions[lang];
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
                ? `<em>${lang === 'es' ? 'Correcto' : 'Correct'}: ${LETTERS[q.answer]}. ${q.options[q.answer]}</em>`
                : '';
            return `
                <div class="pt-review-item">
                    <div class="pt-review-icon ${correct ? 'correct' : 'incorrect'}">${correct ? '&#10003;' : '&#10007;'}</div>
                    <div>
                        <strong>${q.q}</strong>
                        ${lang === 'es' ? 'Tu respuesta' : 'Your answer'}: ${LETTERS[userAns]}. ${q.options[userAns]}
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
