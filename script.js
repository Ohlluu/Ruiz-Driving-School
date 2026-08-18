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
                img: 'pt-images/q16.jpg',
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
                // Corrected: the sheet marked swinging back at normal speed, which
                // risks an overcorrection rollover. Ease off and slow first.
                answer: 0
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
            img: 'pt-images/q16.jpg',
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
            // Corrected: see the English version of this question.
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

    // =============================================
    // PRACTICE TEST 2 — the 40 written questions
    // English transcribed from the scanned "ENGLISH" sheet, Spanish from the
    // scanned "Versión B / Test #2" sheet, answers exactly as marked on paper.
    //
    // The signs section of the same sheets runs as its own test (PTS) further
    // down, so this bank is written questions only. Question count, progress
    // text and the "To Pass" figure all derive from array length, so appending
    // or removing questions needs no other change.
    //
    // NOTE: the English sheet is the older revision and carried several stale
    // values (.10% BAC, age-6 belt/restraint rules, six/24-month refusal
    // suspensions, a $60 reinstatement fee). These have been corrected to
    // current Illinois law, which also brings them into line with the Spanish
    // sheet. Both sheets also marked an unsafe answer for the
    // wheel-off-pavement question; that is corrected too. Every correction is
    // flagged with an inline comment at the line it changes.
    // =============================================
    const questions2 = {
        en: [
            {
                q: 'It is unlawful for any person to leave the roadway and travel across private property to avoid an official traffic control device.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When you come to a stop sign, you must stop your vehicle:',
                options: [
                    'As close to the stop sign as possible',
                    'At a marked stop line, before entering the crosswalk, or before entering the intersection if there is no crosswalk',
                    'At a place near the intersection, providing you come to a complete stop'
                ],
                answer: 1
            },
            {
                q: 'When there are flashing signals at a railroad crossing and the train clears the crossing, how soon should you proceed?',
                options: [
                    'Just as soon as the train clears the crossing',
                    'After you check to make sure another train is not approaching on another track',
                    'Follow the vehicle ahead of you'
                ],
                answer: 1
            },
            {
                q: 'When an authorized emergency vehicle that is using its siren and flashing lights approaches your vehicle, you should:',
                options: [
                    'Increase your speed',
                    'Continue at the same speed',
                    'Pull over to the right-hand edge of the highway and stop, if possible'
                ],
                answer: 2
            },
            {
                q: 'When passing another vehicle, you should not cut back into the right lane until you can see the vehicle that you just passed in your rearview mirror.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When driving along the highway and the front right wheel of your vehicle runs off the pavement, you should:',
                options: [
                    'Grasp the steering wheel tightly and take your foot off the accelerator',
                    'Apply the brakes immediately and swing back onto the pavement quickly',
                    'Quickly swing back onto the pavement at your normal speed'
                ],
                // Corrected: both sheets marked swinging back at normal speed, which
                // risks an overcorrection rollover. Ease off and slow first.
                answer: 0
            },
            {
                // Corrected from the sheet's "age 6" — Illinois sets this at 8.
                q: 'The driver and front-seat passengers (age 8 and above) are required to wear seat safety belts while riding in a motor vehicle on Illinois roadways.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'Illinois residents must:',
                options: [
                    'Insure their vehicles for liability',
                    'Carry proof of insurance in the vehicle',
                    'Produce proof of insurance when stopped for a traffic violation, during a random check, or if you are involved in a traffic accident',
                    'All of the above'
                ],
                answer: 3
            },
            {
                q: 'When a two-lane pavement is marked with a single, solid yellow line on your side of the center line:',
                options: [
                    'You must slow down and proceed with caution',
                    'Construction work is going on ahead, slow down',
                    'You must not cross the yellow line to pass another vehicle'
                ],
                answer: 2
            },
            {
                q: 'When a school bus is stopped on a two-lane or four-lane highway and its red warning lights are flashing and its stop signal arm is extended, you must:',
                options: [
                    'Stop before meeting or overtaking a school bus loading or unloading passengers on a two-lane highway',
                    'You do not always need to stop when meeting a stopped school bus on a roadway with four or more lanes if at least 2 lanes of traffic travel in the opposite direction',
                    'You do not need to stop if you are traveling on a four-lane highway in the opposite direction of a school bus, but you should drive cautiously',
                    'All of the above'
                ],
                answer: 3
            },
            {
                q: 'Your driving privileges will be revoked in the State of Illinois if you are convicted of:',
                options: [
                    'Leaving the scene of an accident in which you are involved as a driver, if the accident results in death or personal injury',
                    'Drag racing',
                    'Driving or being in actual physical control of a vehicle while under the influence of alcohol or other drugs (including prescription drugs that may impair driving ability) and/or combinations thereof',
                    'All of the above',
                    'None of the above'
                ],
                answer: 3
            },
            {
                q: 'When a right turn against a red signal light is allowed, the proper way to make the turn is to:',
                options: [
                    'Turn quickly to get out of the way of other traffic',
                    'Stop, give the right-of-way to any persons or vehicles within the intersection, then cautiously make your turn',
                    'Stop, sound your horn to warn other traffic, then make your turn'
                ],
                answer: 1
            },
            {
                q: 'When headlights are required, bright lights should be dimmed at least 500 feet before meeting and 300 feet before overtaking another vehicle.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'If you MUST drive during foggy weather, you should turn on the low-beam headlights and:',
                options: [
                    'Drive at a speed that will allow you to stop within your field of vision',
                    'Flash your lights routinely',
                    'Keep your foot on the brake pedal so your taillights will be seen more easily'
                ],
                answer: 0
            },
            {
                q: 'When approaching a railroad grade crossing that does NOT have ANY warning system (such as electric flashing lights or gates), you should:',
                options: [
                    'Increase speed and cross tracks as quickly as possible',
                    'Continue at your normal speed',
                    'Look, listen, slow down in case you have to stop, and proceed when safe to do so'
                ],
                answer: 2
            },
            {
                q: 'It is legal for you to pass on the shoulder of the road.',
                options: ['True', 'False'],
                answer: 1
            },
            {
                q: 'You are waiting at an intersection and the traffic signal light changes to green. You may then go ahead:',
                options: [
                    'Immediately',
                    'When you think it is safe to do so',
                    'After first yielding the right-of-way to any persons or vehicles that are within the intersection'
                ],
                answer: 2
            },
            {
                q: 'Your driver\'s license will be suspended if, after being arrested for DRIVING UNDER THE INFLUENCE of alcohol and/or drugs (DUI):',
                options: [
                    // Corrected from the sheet's .10% — Illinois dropped to .08% in 1997.
                    'You take a chemical test (breath, blood or urine) and register an amount of alcohol equal to or over the legal level of intoxication (.08%)',
                    'You refuse to take a chemical test (breath, blood or urine)',
                    'You take a chemical test and register any trace of a controlled substance or cannabis (marijuana)',
                    'All of the above'
                ],
                answer: 3
            },
            {
                q: 'Motorcycles, though smaller and lighter in weight, have the same right-of-way privileges as other vehicles. Special observance should be given to motorcyclists when they approach an intersection, a railroad crossing, bridge or when bad weather occurs.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'A person who REFUSES to submit to a chemical test, or tests, of his/her blood, breath or urine for the purpose of determining the level of alcohol and/or drug content:',
                options: [
                    // Corrected from the sheet's six / 24 months. Illinois statutory
                    // summary suspension for refusal is 12 months for a first
                    // offender and 36 for a non-first offender, matching the
                    // Spanish sheet's figures.
                    'Will receive a driver\'s license suspension for 12 months on first offense',
                    'Will receive a driver\'s license suspension for 36 months for second or more refusals within a 5-year period',
                    'May have this used as evidence against him/her in court if charged with DRIVING UNDER THE INFLUENCE of alcohol and/or drugs (DUI)',
                    'All of the above'
                ],
                answer: 3
            },
            {
                q: 'When driving on a slippery road and the rear end of your vehicle starts to skid, you should:',
                options: [
                    'Turn the front wheels in the direction of the skid',
                    'Hold the wheel firmly and steer straight ahead, braking gradually',
                    'Apply the brakes quickly'
                ],
                answer: 0
            },
            {
                q: 'Drivers are NOT permitted to wear headsets or have a television receiver visible from the driver\'s seat.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'Which of the following is the single greatest factor in fatal motor vehicle accidents?',
                options: [
                    'Alcohol',
                    'Bad road conditions',
                    'Bad weather conditions',
                    'Mechanical problems'
                ],
                answer: 0
            },
            {
                q: 'When you are driving and one of your tires has a blowout, you should:',
                options: [
                    'Apply the brakes quickly to reduce speed',
                    'Grip the steering wheel firmly, take your foot off the gas pedal, and let the vehicle slow down before you drive onto the shoulder',
                    'Quickly steer onto the right shoulder'
                ],
                answer: 1
            },
            {
                q: 'The road surface of a bridge may be dangerous in winter because:',
                options: [
                    'There may be ice on bridges even when other pavements are clear',
                    'The bridge surface is warmer',
                    'None of the above'
                ],
                answer: 0
            },
            {
                q: 'A driver moving out of an alley, private road, or driveway within an urban area must:',
                options: [
                    'Stop only if there are vehicles coming down the street',
                    'Stop before reaching the sidewalk and yield to pedestrians and vehicles before proceeding',
                    'Sound his/her horn and exit quickly'
                ],
                answer: 1
            },
            {
                q: 'A flashing red traffic signal light at an intersection means:',
                options: [
                    'You should be careful when going through the intersection',
                    'Exactly the same thing as a stop sign',
                    'An emergency vehicle is approaching from your rear'
                ],
                answer: 1
            },
            {
                // Corrected from the sheet's "under age 6" — Illinois sets this at 8.
                q: 'Illinois law requires children under age 8 to be secured by a restraining system or seat belt when traveling in a motor vehicle:',
                options: [
                    'Anywhere in the vehicle',
                    'In the front seat only',
                    'In the back seat only',
                    'Never, this is not a law'
                ],
                answer: 0
            },
            // ---- back page, questions 29-40 ----
            {
                q: 'When a traffic light shows both a red light and a green arrow in the direction you wish to turn, you:',
                options: [
                    'Must stop and remain stopped until the red light has changed',
                    'Have the right-of-way over pedestrians in turning in the direction of the arrow',
                    'May proceed in the direction of the arrow with caution'
                ],
                answer: 2
            },
            {
                q: 'With few exceptions, a person may not drive a motor vehicle (even if borrowed or rented for a short period of time) unless the operator holds a valid driver\'s license that is properly classified for that kind and type of vehicle.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'Headlights are required:',
                options: [
                    'From dusk to dawn',
                    'During periods of poor visibility',
                    'When weather conditions require the use of windshield wipers',
                    'All of the above'
                ],
                answer: 3
            },
            {
                q: 'Many intersection accidents occur because drivers FAIL to slow down and look carefully to the left and right before entering the intersection.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'In order to reinstate full driving privileges after a DRIVING UNDER THE INFLUENCE (DUI) revocation, a person must:',
                options: [
                    'Submit to a professional assessment of alcohol and/or drug use and attend a remedial or rehabilitation program',
                    'Carry high-risk auto insurance for three years',
                    // Dollar figure dropped rather than updated — the sheet's $60 is
                    // long out of date and PT1 and the Spanish sheet both state the
                    // fee without an amount, so the claim stays true as fees change.
                    'Be approved for reinstatement by a Secretary of State Hearing Officer and pay a reinstatement fee',
                    'Wait a minimum of one year',
                    'All of the above'
                ],
                answer: 4
            },
            {
                q: 'If your vehicle starts to skid on water (hydroplane), you should:',
                options: [
                    'Turn your wheel slightly to the right and brake gently',
                    'Turn your ignition off and coast to a stop',
                    'Take your foot off the accelerator and let your vehicle slow down'
                ],
                answer: 2
            },
            {
                q: 'Motorcycles are entitled to use the full width of a traffic lane, the same as a vehicle. Therefore, when you are driving a vehicle and want to pass a motorcycle, you should:',
                options: [
                    'Cautiously pass the motorcycle, sharing the same lane that it is using',
                    'Follow the motorcycle without passing it',
                    'Do not pass the motorcycle in the same lane that it is using, but change lanes and pass the way you would pass another vehicle'
                ],
                answer: 2
            },
            {
                q: 'You are required by law to yield the right-of-way to any authorized vehicle engaged in highway construction or maintenance that is displaying amber (yellow) oscillating, rotating or flashing lights.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                // Printed age was struck out on the sheet; "21 years" written in by hand.
                q: 'If you are under 17 and you drive after curfew hours, you must have a parent, legal guardian or someone 21 years of age or older with you. Your parents or legal guardian must approve of the person. If these conditions are not met, your license or permit may not be valid during those hours.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When making a left or right turn in a business or residential district, a continuous signal to turn must be given:',
                options: [
                    'Not less than 100 feet before turning',
                    'At least 50 feet from the intersection',
                    'Only when vehicles are coming toward you'
                ],
                answer: 0
            },
            {
                // Printed duration was struck out on the sheet; "3 MONTHS" written in by hand.
                q: 'If you are convicted of passing a school bus that is receiving or discharging passengers, you may lose your driver\'s license for at least 3 months.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'Most rear end collisions are caused by:',
                options: [
                    'The vehicle in front stopping too quickly',
                    'The vehicle in back following too closely',
                    'Dangerous road conditions'
                ],
                answer: 1
            }
        ],
        // ---- Versión B / Test #2, Sección I, preguntas 1-40 ----
        // Transcribed verbatim from the scanned Spanish sheet, answers exactly
        // as marked. The Spanish sheet is a later revision than the English one
        // and its order differs, so this array is NOT a positional mirror of
        // questions2.en — each language is internally consistent on its own.
        es: [
            {
                q: 'Al efectuar un giro a la izquierda o a la derecha en un distrito comercial o residencial, se debe efectuar una señal continua de viraje:',
                options: [
                    'a una distancia no inferior a 100 pies antes de virar',
                    'por lo menos a 50 pies de una intersección',
                    'sólo cuando otros vehículos se están acercando a usted'
                ],
                answer: 0
            },
            {
                q: 'Los faros delanteros son necesarios:',
                options: [
                    'desde el atardecer hasta el amanecer',
                    'durante períodos de escasa visibilidad',
                    'cuando las condiciones climáticas requieren el uso del limpiaparabrisas',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'A usted se le suspenderá su licencia si después de haber sido detenido por CONDUCIR BAJO LA INFLUENCIA del alcohol y/o drogas (DUI):',
                options: [
                    'a usted se le somete un examen para sustancias químicas (aliento, sangre u orina) y registra una cantidad de alcohol igual o superior al nivel de intoxicación permitido por la ley (.08%)',
                    'usted se niega a someterse a un examen para sustancias químicas (aliento, sangre u orín)',
                    'a usted se le somete un examen para sustancias químicas y registra algún valor (traza) de alguna substancia controlada o cannabis (marihuana)',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Es legal pasar por la orilla de la carretera.',
                options: ['Verdadero', 'Falso'],
                answer: 1
            },
            {
                q: 'La mayoría de los choques por la parte trasera del vehículo se deben a:',
                options: [
                    'que el vehículo de adelante frena demasiado rápido',
                    'que el vehículo de atrás sigue muy de cerca',
                    'condiciones peligrosas del camino'
                ],
                answer: 1
            },
            {
                q: 'Si usted es condenado por pasar a un bus escolar mientras está subiendo o bajando pasajeros, usted puede perder su licencia de conducir por lo menos 3 meses.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Al conducir en una vía resbaladiza y las ruedas traseras de su vehículo comienzan a patinar, usted debe:',
                options: [
                    'girar las ruedas delanteras en la dirección del deslizamiento',
                    'sujetar firmemente el volante (manubrio) y conducir hacia adelante, frenando gradualmente',
                    'aplicar los frenos rápidamente'
                ],
                answer: 0
            },
            {
                q: 'La superficie de un puente puede ser peligrosa en el invierno debido a que:',
                options: [
                    'en los puentes puede haber hielo, aún si otros pavimentos están despejados',
                    'la superficie del puente está más caliente',
                    'ninguna de las anteriores'
                ],
                answer: 0
            },
            {
                q: 'Si su vehículo comienza a deslizarse sobre el agua (hidroplanear), usted debe:',
                options: [
                    'girar suavemente el volante (manubrio) a la derecha y frenar suavemente',
                    'apagar el motor y dirigirse a una parada',
                    'retirar el pie del acelerador y permitir que el vehículo reduzca la velocidad'
                ],
                answer: 2
            },
            {
                q: 'Un conductor que sale de un callejón (pasadizo) de una vía privada o entrada particular dentro de un área urbana, debe:',
                options: [
                    'detenerse sólo si se aproximan vehículos por la calle',
                    'pararse antes de llegar a una vereda y ceder el paso a los peatones y vehículos antes de continuar',
                    'hacer sonar la bocina y salir rápidamente'
                ],
                answer: 1
            },
            {
                q: 'El conductor y los pasajeros del asiento delantero (mayores de 8 años) deben usar el cinturón de seguridad al viajar en un vehículo motorizado por las vías de Illinois.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Las motocicletas están habilitadas para utilizar toda la amplitud de una pista de tránsito, al igual que los vehículos. Por lo tanto, cuando usted conduce un vehículo y desea pasar a una motocicleta, usted:',
                options: [
                    'deber pasar cuidadosamente a la motocicleta, utilizando la misma pista en que ésta circula',
                    'debe seguir a la motocicleta sin pasarla',
                    'no debe pasar a la motocicleta por la misma pista en que ésta circula, sino que debe cambiarse de pista y pasar en la misma forma en que lo haría con otro vehículo'
                ],
                answer: 2
            },
            {
                q: 'Muchos accidentes en las intersecciones suceden porque los conductores NO reducen la velocidad ni miran cuidadosamente hacia la izquierda y hacia la derecha antes de ingresar a una intersección.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Usted está esperando en una intersección y el semáforo, cambia a verde. Usted puede continuar:',
                options: [
                    'inmediatamente',
                    'cuando usted crea que es seguro hacerlo',
                    'después de ceder el derecho de vía a las personas o los vehículos que se encuentren en la intersección'
                ],
                answer: 2
            },
            {
                q: 'La ley exige que usted le ceda el derecho de vía a cualquier vehículo autorizado que participe en la construcción o mantenimiento de una carretera, que tiene encendidas sus luces color ámbar (amarillo) oscilantes, rotatorias o centelleantes.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: '¿Cuál de las siguientes es el factor principal en accidentes fatales de vehículos motorizados?',
                options: [
                    'el alcohol',
                    'malas condiciones del camino',
                    'malas condiciones climáticas',
                    'problemas mecánicos'
                ],
                answer: 0
            },
            {
                q: 'Si usted tiene menos de 17 años y conduce después de horas de restricción (curfew) debe estar acompañado por uno de sus padres, custodio legal, u otra persona de 21 años o más. Sus padres o el custodio legal deben aprobar a dicha persona. Si no se cumplen estas condiciones, su licencia o permiso para conducir no será válido durante esas horas.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Cuando es necesario usar las luces delanteras, las luces altas (bright lights) deben bajarse por lo menos 500 pies antes de encontrarse con otro vehículo, y 300 pies antes de pasarlo.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Cuando usted está conduciendo y se revienta una de las llantas, usted debe:',
                options: [
                    'aplicar rápidamente los frenos para reducir la velocidad',
                    'sujetar firmemente el volante, sacar el pie del acelerador, y permitir que el vehículo reduzca la velocidad antes de conducir hacia la orilla',
                    'conducir rápidamente hacia la orilla derecha'
                ],
                answer: 1
            },
            {
                q: 'Con muy pocas excepciones, una persona no puede conducir un vehículo motorizado (aún si es prestado o rentado por un corto tiempo) a menos que posea una licencia de conducir válida, adecuadamente clasificada para esa clase y tipo de vehículo.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'En el estado de Illinois usted perderá su licencia de conducir, si es condenado por:',
                options: [
                    'abandonar el lugar de un accidente en que se ha visto involucrado como conductor, si el accidente produce la muerte o daños personales',
                    'hacer carrera de carro en la vía pública (street racing)',
                    'conducir o tener el control físico de un vehículo estando bajo la influencia del alcohol u otras drogas (incluyendo drogas prescritas que pueden disminuir su capacidad para conducir) y/o combinaciones de ellas',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Cuando una luz de tráfico muestra tanto la luz roja como una flecha verde en la dirección en que usted quiere doblar, usted:',
                options: [
                    'debe detenerse y permanecer detenido hasta que la luz roja haya cambiado',
                    'tiene el derecho de vía antes que los peatones al doblar en la dirección de la flecha',
                    'puede avanzar en la dirección de la flecha con precaución'
                ],
                answer: 2
            },
            {
                q: 'Un bus escolar se ha detenido en una carretera de dos carriles y tiene encendidas sus luces rojas de advertencia y su brazo de detención extendido:',
                options: [
                    'usted debe detenerse antes de alcanzar o pasar a un bus que esté levantando o bajando pasajeros en una carretera de dos carriles',
                    'usted no siempre debe detenerse al alcanzar a un bus escolar detenido en una carretera de cuatro o más carriles, si al menos 2 carriles de circulación caminan en sentido opuesto',
                    'usted no debe detenerse si está conduciendo en sentido opuesto al bus en una carretera de cuatro carriles, pero debe conducir con precaución',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Cuando usted esta ante a una señal de PARE o ALTO, debe detener el vehículo:',
                options: [
                    'lo más cerca posible de la señal',
                    'en la línea marcada antes de entrar en el cruce peatonal, o antes de entrar a una intersección si no hay un cruce peatonal',
                    'en un punto cerca de la intersección, siempre y cuando se pare por completo'
                ],
                answer: 1
            },
            {
                q: 'Al estar permitido doblar con luz roja, la forma correcta de hacerlo es:',
                options: [
                    'doblar rápidamente para salir de la vía de otros vehículos',
                    'detenerse, ceder el derecho de vía a cualquier persona o vehículo que se encuentre dentro de la intersección, luego doblar cuidadosamente',
                    'detenerse, tocar la bocina para advertir a los otros vehículos, y luego doblar'
                ],
                answer: 1
            },
            {
                q: 'Para poder recuperar todos sus derechos para conducir después de haber perdido su licencia por CONDUCIR BAJO LA INFLUENCIA del alcohol y/o drogas (DUI), una persona debe:',
                options: [
                    'someterse a una evaluación profesional del uso de alcohol y/o drogas y asistir a un programa de recuperación o de rehabilitación y tener un seguro personal de alto riesgo por tres años',
                    'ser aprobado para restablecimiento por el Departamento de Audiencias Administrativas de la Secretaría Del Estado y pagar el honorario de restablecimiento',
                    'esperar por lo menos un año',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Las motocicletas, a pesar de ser más pequeñas y de menos peso, tienen el mismo derecho a vía que otros vehículos. Se debe tener cuidado especial con las motocicletas cuando se aproximan a una intersección, un puente, o cuando hay malas condiciones climáticas.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Cuando un vehículo autorizado de emergencia que lleva sus luces de advertencia y su sirena funcionando se aproxima a su vehículo, usted debe:',
                options: [
                    'aumentar su velocidad',
                    'continuar a la misma velocidad',
                    'cambiarse al borde de la pista derecha de la carretera, y si es posible, pararse'
                ],
                answer: 2
            },
            {
                q: 'Al estar conduciendo en la carretera y la llanta derecha del vehículo se sale del pavimento usted debe:',
                options: [
                    'sujetar con fuerza el volante y retirar el pie del acelerador',
                    'aplicar inmediatamente los frenos y volver al pavimento rápidamente',
                    'volver rápidamente al pavimento a la velocidad normal'
                ],
                // Corrected: see the English version of this question.
                answer: 0
            },
            {
                q: 'La ley de Illinois exige que los niños menores de 8 años deben asegurarse con un sistema de fijación (restraining system) o con un cinturón de seguridad al viajar en un vehículo motorizado:',
                options: [
                    'en cualquier lugar del vehículo',
                    'sólo en el asiento delantero',
                    'sólo en el asiento trasero',
                    'nunca, esta no es una ley'
                ],
                answer: 0
            },
            {
                q: 'Al estar funcionando las luces de advertencia en un cruce de ferrocarril y el tren ha pasado el cruce, ¿cuándo debe usted avanzar?',
                options: [
                    'tan pronto que el tren haya pasado el cruce',
                    'después de haber verificado que no se aproxima otro tren por otra vía',
                    'debe seguir al vehículo que va adelante'
                ],
                answer: 1
            },
            {
                q: 'Al aproximarse a un cruce de ferrocarril que NO tiene ningún sistema de advertencia (tal como luces advertencia o rojas), usted debe:',
                options: [
                    'aumentar la velocidad y cruzar los rieles lo más rápido posible',
                    'continuar a la velocidad normal',
                    'mirar, escuchar, disminuir la velocidad por si debe detenerse, y continuar cuando sea seguro hacerlo'
                ],
                answer: 2
            },
            {
                q: 'A los conductores no se les permite usar audífonos (headsets), o tener un televisor visible desde el asiento del conductor.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Al pasar a otro vehículo usted no debe volver al carril derecho hasta que pueda ver en el retrovisor.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'La luz roja intermitente en una intersección significa:',
                options: [
                    'que usted debe tener precaución al cruzar la intersección',
                    'exactamente lo mismo que la señal de detención',
                    'que desde atrás se aproxima un vehículo de emergencia'
                ],
                answer: 1
            },
            {
                q: 'Es ilegal para cualquier persona salir de la carretera y pasar por propiedad privada para evitar un dispositivo oficial de control de tránsito.',
                options: ['Verdadero', 'Falso'],
                answer: 0
            },
            {
                q: 'Cuando una vía de dos carriles está marcada con una línea amarilla simple en su lado de la línea central:',
                options: [
                    'debe disminuir la velocidad y seguir con precaución',
                    'hay construcción más adelante, debe reducir la velocidad',
                    'usted no debe cruzar la línea amarilla para adelantar a otro vehículo'
                ],
                answer: 2
            },
            {
                q: 'Una persona que SE NIEGA a someterse a uno o más exámenes para productos químicos de sangre, aliento u orín, con el fin de determinar el nivel de alcohol y/o drogas:',
                options: [
                    'se le suspenderá la licencia de conducir por 12 meses en una primera infracción',
                    'se le suspenderá la licencia de conducir por 36 meses por una segunda o más veces que se niega a los exámenes dentro de un período de 5 años',
                    'esto puede utilizarse como evidencia en su contra en una corte si se le acusa de CONDUCIR BAJO LA INFLUENCIA del alcohol y/o drogas (DUI)',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Los residentes de Illinois deben:',
                options: [
                    'asegurar sus vehículos contra responsabilidad civil',
                    'llevar en el vehículo el comprobante de seguro',
                    'mostrar su comprobante de seguro al ser detenidos por una infracción de tránsito, durante un chequeo al azar, o si se ven involucrados en un accidente de vehículos',
                    'todas las anteriores'
                ],
                answer: 3
            },
            {
                q: 'Si usted DEBE conducir con neblina, debe encender los faros delanteros bajos y:',
                options: [
                    'conducir a una velocidad que le permita parar dentro de su campo de visibilidad',
                    'hacer cambio de luces rutinariamente',
                    'mantener el pie en el pedal de freno para que sus luces rojas traseras se vean con mayor facilidad'
                ],
                answer: 0
            }
        ]
    };

    // =============================================
    // PTS — the signs test (15 questions per language)
    //
    // Each sheet gives students one list of 17 sign names and 15 pictured signs,
    // and they write the matching number under each sign. Each sign therefore
    // becomes one question offering ALL 17 names, numbered 1-17 rather than
    // lettered, so it mirrors the paper.
    //
    // This is the signs section of the same paper sheet as PT2, but it runs as
    // its own test so PT2 stays the 40 written questions.
    // =============================================
    // The two sheets number their 17 names differently AND picture a different
    // set of 15 signs, so each language gets its own list and its own grid —
    // they are deliberately not translations of each other.
    const SIGN_NAMES = {
        en: [
            'Reduction in Lanes',                        //  1
            'No U Turn',                                 //  2
            'No Passing Zone',                           //  3
            'Merge',                                     //  4
            'Crossroad',                                 //  5
            'Yield Right of Way',                        //  6
            'Stop',                                      //  7
            'Slow Moving Vehicle',                       //  8
            'Railroad Warning',                          //  9
            'Pedestrian Crossing',                       // 10
            'Winding Road',                              // 11
            'No Right Turn',                             // 12
            'Signal Ahead',                              // 13
            'School Zone & School Crossing',             // 14
            'Side Road',                                 // 15
            'Do Not Enter',                              // 16
            'Road Construction and Maintenance Area'     // 17
        ],
        es: [
            'Cruce de Peatones',                                    //  1
            'Disminuir la Velocidad',                               //  2
            'Cruce de Caminos',                                     //  3
            'Prohibido Entrar',                                     //  4
            'Vía con Curvas',                                       //  5
            'Cruce de Ferrocarril (Advertencia al Nivel de Paso)',  //  6
            'Reducción de Carriles',                                //  7
            'Vía Lateral',                                          //  8
            'Prohibido Pasar',                                      //  9
            'Ceda el Paso',                                         // 10
            'Pare o Alto',                                          // 11
            'Prohibido Doblar a la Derecha',                        // 12
            'Prohibido la Vuelta en U',                             // 13
            'Zona y Cruce Escolar',                                 // 14
            'Área en Construcción y Mantenimiento Vial',            // 15
            'Señal de Unión',                                       // 16
            'Hay una Señal Adelante'                                // 17
        ]
    };

    const SIGN_PROMPT = {
        en: 'Match this sign to its name:',
        es: 'Relacione esta señal con su nombre:'
    };

    // Each sheet's pictured signs, in its own grid order (left to right, top to
    // bottom). `name` is the number from that language's SIGN_NAMES. Art is
    // reused from PT1's sign questions where it matches.
    //
    // The English sheet omits Merge and Stop; the Spanish sheet omits Vía con
    // Curvas (winding road) and Vía Lateral (side road). Those four names still
    // appear as options in their language, acting as distractors only.
    //
    // Winding road and side road had no art in PT1, so those two files were
    // added for the English section. Any future sign without art can be marked
    // `pendingArt: true` to show a labelled placeholder instead of a broken
    // image until its file lands.
    const SIGN_ITEMS = {
        en: [
            { img: 'pt-images/q25.gif',                    name: 13 },
            { img: 'pt-images/q26.jpg',                    name: 10 },
            { img: 'pt-images/q30.jpeg',                   name: 3  },
            { img: 'pt-images/q31.jpg',                    name: 6  },
            { img: 'pt-images/q36.jpg',                    name: 1  },
            { img: 'pt-images/sign11-winding-road.png',    name: 11 },
            { img: 'pt-images/sign15-side-road.jpg',       name: 15 },
            { img: 'pt-images/q23.jpg',                    name: 17 },
            { img: 'pt-images/q33.png',                    name: 9  },
            { img: 'pt-images/q24.jpg',                    name: 2  },
            { img: 'pt-images/q35.jpg',                    name: 16 },
            { img: 'pt-images/q38.png',                    name: 8  },
            { img: 'pt-images/q34.jpg',                    name: 5  },
            { img: 'pt-images/q27.png',                    name: 12 },
            { img: 'pt-images/q32.png',                    name: 14 }
        ],
        es: [
            { img: 'pt-images/q37.jpg',                    name: 16 },
            { img: 'pt-images/q34.jpg',                    name: 3  },
            { img: 'pt-images/q35.jpg',                    name: 4  },
            { img: 'pt-images/q25.gif',                    name: 17 },
            { img: 'pt-images/q28.jpg',                    name: 11 },
            { img: 'pt-images/q27.png',                    name: 12 },
            { img: 'pt-images/q33.png',                    name: 6  },
            { img: 'pt-images/q38.png',                    name: 2  },
            { img: 'pt-images/q31.jpg',                    name: 10 },
            { img: 'pt-images/q32.png',                    name: 14 },
            { img: 'pt-images/q36.jpg',                    name: 7  },
            { img: 'pt-images/q24.jpg',                    name: 13 },
            { img: 'pt-images/q26.jpg',                    name: 1  },
            { img: 'pt-images/q23.jpg',                    name: 15 },
            { img: 'pt-images/q30.jpeg',                   name: 9  }
        ]
    };

    // PTS — the signs test. Its own bank, so PT2 stays the 40 written questions
    // and the signs stand alone as a 15-question test in each language.
    const questions3 = { en: [], es: [] };
    Object.keys(SIGN_ITEMS).forEach(l => {
        questions3[l] = SIGN_ITEMS[l].map(sign => ({
            img: sign.img,
            q: SIGN_PROMPT[l],
            options: SIGN_NAMES[l],
            answer: sign.name - 1,
            numbered: true,  // render options as 1-17, and lay them out in a grid
            pendingArt: !!sign.pendingArt
        }));
    });

    // =============================================
    // PRACTICE TEST 4 — 20 written questions
    // Transcribed verbatim from the scanned "Written Basic" sheet (2 pages),
    // answers exactly as circled on the paper.
    //
    // This is the newest of the sheets: it already carries age 8, the printed
    // 3-month school-bus suspension and the under-17 curfew, and it covers
    // topics the older sheets predate — the texting ban, wireless phones in
    // school and work zones, and the three-foot bicycle passing law.
    //
    // The scan clips the right margin on five lines; the missing fragments were
    // reconstructed from context and confirmed (Q1 "it is", Q4 "road", Q7
    // "seat", Q12 "If these", Q13 "in a").
    //
    // TO ADD SPANISH: fill questions4.es with a parallel array. Until it has
    // entries, Spanish falls back to English (see getBank).
    // =============================================
    const questions4 = {
        en: [
            {
                q: 'If a pedestrian is crossing in the middle of the street, not at a crosswalk (jaywalking) even if it is illegal, you:',
                options: [
                    'must stop for them',
                    'do not have to stop for them',
                    'should honk your horn at them'
                ],
                answer: 0
            },
            {
                q: 'What should a driver do when approaching a traffic control signal that is not in operation?',
                options: [
                    'Come to a full stop and yield the right-of-way before entering the intersection',
                    'If the intersection is clear, the driver does not need to stop',
                    'Drive quickly through the intersection to get out of the way of other vehicles'
                ],
                answer: 0
            },
            {
                q: 'A yellow-dashed line on the roadway means:',
                options: [
                    'passing is prohibited on both sides',
                    'passing is permitted on both sides',
                    'passing is permitted on your side'
                ],
                answer: 1
            },
            {
                q: 'When passing a bicyclist or pedestrian who is riding or walking on the road or shoulder of the road, you must keep a minimum of three feet between your vehicle and the bicyclist or pedestrian.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When are you permitted to open car doors on the side on which traffic is moving?',
                options: [
                    'It is legal only in rural areas',
                    'It is legal only if it can be done without interfering with the movement of other traffic',
                    'It is legal at all times'
                ],
                answer: 1
            },
            {
                q: 'When driving on a slippery road and the rear end of your vehicle starts to skid, you should:',
                options: [
                    'turn the front wheels in the direction of the skid',
                    'hold the wheel firmly and steer straight ahead, braking gradually',
                    'apply the brakes quickly'
                ],
                answer: 0
            },
            {
                q: 'Drivers are NOT permitted to wear headsets or have a television receiver visible from the driver\'s seat.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When turning left and there is a bicyclist entering the intersection from the opposite direction, you should wait for the bicyclist to pass before making the turn.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'When must a driver slow down for a school zone?',
                options: [
                    'On school days between 7 a.m. and 4 p.m. when children are present and signs are posted',
                    'On weekends',
                    'Only during recess'
                ],
                answer: 0
            },
            {
                q: 'It is unlawful for any person to leave the roadway and travel across private property to avoid an official traffic control device.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'At a 4-way stop:',
                options: [
                    'the driver reaching the intersection first should be given the right-of-way',
                    'the driver to the right should be given the right-of-way',
                    'the driver to the left should be given the right-of-way'
                ],
                answer: 0
            },
            {
                q: 'If you are under 17 and you drive after curfew hours, you must have a parent, legal guardian or someone 21 years of age or older with you. Your parents or legal guardian must approve of the person. If these conditions are not met, your license or permit may not be valid during those hours.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'Any person, regardless of age, is prohibited from using a wireless telephone at any time while driving in a school speed zone, or a highway construction or maintenance speed zone.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'If you are convicted of passing a school bus that is receiving or discharging passengers, you may lose your driver\'s license for at least 3 months.',
                options: ['True', 'False'],
                answer: 0
            },
            {
                q: 'A driver may type, send, or read a text message while operating a motor vehicle.',
                options: ['True', 'False'],
                answer: 1
            },
            {
                q: 'When a two-lane pavement is marked with a single, solid yellow line on your side of the center line:',
                options: [
                    'you must slow down and proceed with caution',
                    'construction work is going on ahead, slow down',
                    'you must not cross the yellow line to pass another vehicle'
                ],
                answer: 2
            },
            {
                q: 'When parking your vehicle facing uphill with a curb:',
                options: [
                    'your wheels should be turned toward the curb',
                    'your wheels should be turned away from the curb',
                    'your wheels should face straight ahead'
                ],
                answer: 1
            },
            {
                // Sheet reads "stopping to quickly"; corrected to "too" as a plain typo.
                q: 'Most rear end collisions are caused by:',
                options: [
                    'the vehicle in front stopping too quickly',
                    'the vehicle in back following too closely',
                    'dangerous road conditions'
                ],
                answer: 1
            },
            {
                q: 'A driver moving out of an alley, private road, or driveway within an urban area must:',
                options: [
                    'stop only if there are vehicles coming down the street',
                    'stop before reaching the sidewalk and yield to pedestrians and vehicles before proceeding',
                    'sound his/her horn and exit quickly'
                ],
                answer: 1
            },
            {
                q: 'Illinois law requires children under age 8 to be secured by a restraining system or seat belt when traveling in a motor vehicle:',
                options: [
                    'anywhere in the vehicle',
                    'in the front seat only',
                    'in the back seat only',
                    'never, this is not a law'
                ],
                answer: 0
            }
        ],
        es: []
    };

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

    // 1 = PT (written), 2 = PT2 (written), 3 = PTS (signs), 4 = PT4 (written)
    const TESTS = { 1: questions, 2: questions2, 3: questions3, 4: questions4 };

    // Returns the question array for the active test + language. All three tests
    // have both languages; the fallback only guards against a bank being emptied
    // in future, so the quiz never receives a zero-length array.
    function getBank() {
        const bank = TESTS[currentTest] || questions;
        const set = bank[lang];
        return (set && set.length) ? set : bank.en;
    }

    function openOverlay(testNum) {
        currentTest = testNum;
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
