// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .instructor-card, .testimonial-card, .about-text, .about-image'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

// Counter Animation for Hero Stats
const animateCounter = (element, target, suffix, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };

    updateCounter();
};

// Trigger counter animation when hero stats come into view
const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                let targetNumber;
                let suffix = '';

                if (text.includes('+')) {
                    targetNumber = parseInt(text.replace('+', ''));
                    suffix = '+';
                } else if (text.includes('%')) {
                    targetNumber = parseInt(text.replace('%', ''));
                    suffix = '%';
                } else {
                    targetNumber = parseInt(text);
                    suffix = '+';
                }

                animateCounter(stat, targetNumber, suffix);
            });
            heroStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroStatsObserver.observe(heroStats);
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="spinner"></span>Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Reset form
            this.reset();

            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Show success message
            showNotification('Message sent successfully! We will contact you soon.', 'success');
        }, 2000);
    });
}

// Notification System
const showNotification = (message, type = 'info') => {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

// Form Input Animations and Validation
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        // Handle floating labels
        const handleInputState = () => {
            if (input.value || input === document.activeElement) {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        };

        input.addEventListener('focus', handleInputState);
        input.addEventListener('blur', handleInputState);
        input.addEventListener('input', handleInputState);

        // Initial state
        handleInputState();
    });
});

// Pricing Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            }
        });
    });
});

// Enhanced Interactive Testimonials
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
        // Add tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });

        // Add quote animation
        const quote = card.querySelector('p');
        if (quote) {
            const text = quote.textContent;
            quote.innerHTML = '';

            [...text].forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${i * 0.05}s`;
                span.className = 'char-animate';
                quote.appendChild(span);
            });
        }
    });
});

// Add character animation CSS
const charStyles = document.createElement('style');
charStyles.textContent = `
    .char-animate {
        display: inline-block;
        animation: charFadeIn 0.6s ease-out both;
    }

    @keyframes charFadeIn {
        0% {
            opacity: 0;
            transform: translateY(20px) rotate(5deg);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }
    }
`;
document.head.appendChild(charStyles);

// Floating Action Button
const createFloatingButton = () => {
    const fab = document.createElement('div');
    fab.innerHTML = `
        <i class="fas fa-phone"></i>
        <span class="fab-text">Call Now!</span>
    `;
    fab.className = 'floating-action-btn';
    fab.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        box-shadow: 0 8px 25px var(--shadow-colored);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1000;
        overflow: hidden;
        animation: fabBounce 2s ease-in-out infinite;
    `;

    const fabText = fab.querySelector('.fab-text');
    if (fabText) {
        fabText.style.cssText = `
            position: absolute;
            right: 70px;
            background: var(--dark-surface);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            white-space: nowrap;
            font-size: 0.9rem;
            font-weight: 600;
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
        `;
    }

    fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.1)';
        if (fabText) {
            fabText.style.opacity = '1';
            fabText.style.transform = 'translateX(0)';
        }
    });

    fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'scale(1)';
        if (fabText) {
            fabText.style.opacity = '0';
            fabText.style.transform = 'translateX(20px)';
        }
    });

    fab.addEventListener('click', () => {
        window.location.href = 'tel:(872)207-5198';
    });

    document.body.appendChild(fab);
};

// Add FAB animation CSS
const fabStyles = document.createElement('style');
fabStyles.textContent = `
    @keyframes fabBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(fabStyles);

// Initialize floating button
document.addEventListener('DOMContentLoaded', createFloatingButton);

// Enhanced Parallax Effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Hero parallax
    const heroImage = document.querySelector('.car-illustration');
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.02}deg)`;
    }

    // Background elements parallax
    const backgroundElements = document.querySelectorAll('.hero::before, .services::before');
    backgroundElements.forEach((element, index) => {
        const speed = (index + 1) * 0.3;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Floating stats parallax - disabled on mobile
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && scrolled < window.innerHeight && window.innerWidth > 768) {
        const statsRate = scrolled * -0.2;
        heroStats.style.transform = `translateX(-50%) translateY(${statsRate}px)`;
    }
});

// Service Cards Stagger Animation with Mouse Tracking
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 200);
                });
                servicesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesObserver.observe(servicesGrid);
    }

    // Add mouse tracking effect to service cards
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--x', x + '%');
            card.style.setProperty('--y', y + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--x', '50%');
            card.style.setProperty('--y', '50%');
        });
    });
});

// Phone Number Formatting
const formatPhoneNumber = (input) => {
    const phoneNumber = input.value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) {
        input.value = phoneNumber;
    } else if (phoneNumberLength < 7) {
        input.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        input.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            formatPhoneNumber(e.target);
        });
    }
});

// Booking Button Click Tracking
document.addEventListener('DOMContentLoaded', () => {
    const bookingButtons = document.querySelectorAll('a[href="#book"], a[href^="tel:"]');

    bookingButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Track booking button clicks (analytics)
            console.log('Booking button clicked:', button.textContent);

            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
});

// Easter Egg: Konami Code
let konamiCode = [];
const targetCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === targetCode.join(',')) {
        showNotification('🚗 You found the secret driving code! Safe driving! 🚗', 'success');
        // Add some fun effect
        document.body.style.animation = 'pulse 0.5s ease-in-out 3';
    }
});

// Performance Optimization with exciting loading states
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Add loading shimmer effect
                    img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
                    img.style.backgroundSize = '200% 100%';
                    img.style.animation = 'shimmer 1.5s infinite';

                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.style.animation = 'none';
                        img.style.background = 'none';
                        img.classList.add('loaded-with-style');
                    };
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add shimmer animation
const shimmerStyles = document.createElement('style');
shimmerStyles.textContent = `
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    .loaded-with-style {
        animation: imageReveal 0.6s ease-out;
    }

    @keyframes imageReveal {
        0% {
            opacity: 0;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(shimmerStyles);

// Accessibility Improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.setAttribute('role', 'main');
        heroSection.id = 'main';
    }
});

// Exciting Page Load Animation
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);

    // Cursor trail effect
    createCursorTrail();

    // Add particle effect on click
    addClickParticles();
});

// Cursor Trail Effect - Disabled per user request
function createCursorTrail() {
    // Cursor trail effect has been disabled
    return;
}

// Click Particles Effect
function addClickParticles() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, .btn, a[href]')) {
            createParticles(e.clientX, e.clientY);
        }
    });
}

function createParticles(x, y) {
    const colors = ['#ff6b35', '#f7931e', '#8b5cf6', '#3b82f6', '#10b981'];

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleExplode 0.6s ease-out forwards;
        `;

        const angle = (i / 12) * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const dx = Math.cos(angle) * velocity * 20;
        const dy = Math.sin(angle) * velocity * 20;

        particle.style.setProperty('--dx', dx + 'px');
        particle.style.setProperty('--dy', dy + 'px');

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

// Add particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleExplode {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Magnetic Button Effect
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            button.style.transform = `translate(${(relX - rect.width/2) * 0.1}px, ${(relY - rect.height/2) * 0.1}px) scale(1.05)`;
        });

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            button.style.transform = `translate(${(relX - rect.width/2) * 0.1}px, ${(relY - rect.height/2) * 0.1}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
});

// Scroll-triggered text animations
const observeTextElements = () => {
    const textElements = document.querySelectorAll('h1, h2, h3, p');

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'textSlideIn 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });

    textElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        textObserver.observe(el);
    });
};

// Add text animation CSS
const textStyles = document.createElement('style');
textStyles.textContent = `
    @keyframes textSlideIn {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(textStyles);

// Initialize text animations
document.addEventListener('DOMContentLoaded', observeTextElements);

console.log('🚗✨ Ruiz Driving School website loaded with EXCITEMENT! Drive safe! ✨🚗');