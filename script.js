document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // TYPEWRITER EFFECT
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter-text');
    const words = ["web interfaces.", "creative tech.", "user-friendly systems.", "secure UI layouts."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Speed up deleting
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // Normal typing speed
        }

        // If word is completely typed
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500; // Pause at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    if (typewriterElement) {
        type();
    }

    // ==========================================================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Toggle hamburger animation/symbol
            if (isOpen) {
                mobileToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
            } else {
                mobileToggle.innerHTML = `
                    <svg class="hamburger" viewBox="0 0 24 24" width="24" height="24">
                        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.innerHTML = `
                        <svg class="hamburger" viewBox="0 0 24 24" width="24" height="24">
                            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    `;
                }
            });
        });
    }

    // ==========================================================================
    // YEAR-BY-YEAR TAB SWITCHING LOGIC
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');

            // Deactivate all buttons, activate clicked one
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Deactivate all panes, activate target one
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetTabId) {
                    pane.classList.add('active');
                    
                    // Immediately reveal hidden elements in this active pane
                    const revealInPane = pane.querySelectorAll('.project-card');
                    revealInPane.forEach(el => {
                        el.classList.add('active');
                    });
                }
            });
        });
    });

    // ==========================================================================
    // STICKY HEADER & ACTIVE NAV LINKS ON SCROLL
    // ==========================================================================
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');

    function checkScroll() {
        const scrollY = window.pageYOffset;

        // Header style change on scroll
        if (scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
        }

        // Active Nav Link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once on load

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    // Add '.reveal' class dynamically to give clean fallback if JS is disabled
    const revealElements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.about-text-content'),
        ...document.querySelectorAll('.about-card-grid .info-card'),
        ...document.querySelectorAll('.skills-category-card'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.contact-card')
    ];

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // INTERACTIVE MOUSE-TRACKING GLOW EFFECT FOR CARDS
    // ==========================================================================
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the element
            const y = e.clientY - rect.top;  // y coordinate inside the element

            // Pass mouse coordinates to custom CSS variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
