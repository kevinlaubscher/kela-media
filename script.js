document.addEventListener("DOMContentLoaded", () => {
    // 1. Footer Jahr
    document.getElementById("year").textContent = new Date().getFullYear();

    // 2. Mobile Menu Toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener("click", () => {
            mobileNav.classList.toggle("show");
        });

        const mobileLinks = mobileNav.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("show");
            });
        });
    }

    // 3. Counter Animation
    const animate = (el, target) => {
        let current = 0;
        const speed = target / 50;
        const timer = setInterval(() => {
            current += speed;
            el.textContent = Math.ceil(current);
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, 30);
    };

    // 4. Intersection Observer für Counter & Reveals
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero-proof')) {
                    animate(document.getElementById("kpi1"), 100);
                    animate(document.getElementById("kpi2"), 3);
                    animate(document.getElementById("kpi3"), 5);
                }
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal").forEach(r => observer.observe(r));

    const proof = document.querySelector(".hero-proof");
    if (proof) observer.observe(proof);

    // 5. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 6. Telefon Ländervorwahl
    const phoneCountry = document.getElementById('phoneCountry');
    const phoneInput = document.getElementById('phoneInput');
    const phoneWrapper = document.getElementById('phoneWrapper');

    const phonePlaceholders = {
        '+41':  '44 123 45 67',
        '+49':  '30 12345678',
        '+43':  '1 23456789',
        '+423': '232 1234'
    };

    if (phoneCountry && phoneInput && phoneWrapper) {
        phoneCountry.addEventListener('change', () => {
            phoneInput.placeholder = phonePlaceholders[phoneCountry.value];
        });

        phoneInput.addEventListener('focus', () => phoneWrapper.classList.add('focused'));
        phoneInput.addEventListener('blur', () => phoneWrapper.classList.remove('focused'));
        phoneCountry.addEventListener('focus', () => phoneWrapper.classList.add('focused'));
        phoneCountry.addEventListener('blur', () => phoneWrapper.classList.remove('focused'));
    }

    // 7. Form Handling (Web3Forms)
    const form = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");

    if (form && formSuccess) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = "Wird gesendet...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: new FormData(form)
                });

                const data = await response.json();

                if (response.ok) {
                    formSuccess.style.display = "block";
                    form.reset();
                    if (phoneInput) phoneInput.placeholder = '44 123 45 67';
                    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    setTimeout(() => {
                        formSuccess.style.display = "none";
                    }, 5000);
                } else {
                    alert("Fehler: " + data.message);
                }
            } catch (error) {
                alert("Verbindungsfehler. Bitte versuche es erneut.");
            } finally {
                submitBtn.textContent = "Anfrage senden";
                submitBtn.disabled = false;
            }
        });
    }

    // 8. Header Shadow on Scroll
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // 9. Newsletter Popup
    const nlOverlay = document.getElementById('newsletterOverlay');
    const nlClose   = document.getElementById('nlClose');
    const nlForm    = document.getElementById('nlForm');
    const nlSuccess = document.getElementById('nlSuccess');
    const nlError   = document.getElementById('nlError');
    const nlSubmit  = document.getElementById('nlSubmit');

    if (nlOverlay && !sessionStorage.getItem('nlShown')) {
        setTimeout(() => {
            nlOverlay.classList.add('show');
            sessionStorage.setItem('nlShown', 'true');
        }, 10000);
    }

    if (nlClose) {
        nlClose.addEventListener('click', () => nlOverlay.classList.remove('show'));
    }
    if (nlOverlay) {
        nlOverlay.addEventListener('click', (e) => {
            if (e.target === nlOverlay) nlOverlay.classList.remove('show');
        });
    }

    if (nlForm) {
        nlForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('nlEmail').value;
            const name  = document.getElementById('nlName').value;

            nlSubmit.textContent = 'Wird angemeldet...';
            nlSubmit.disabled = true;

            try {
                const response = await fetch('/.netlify/functions/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name })
                });

                if (response.ok) {
                    nlForm.style.display = 'none';
                    nlSuccess.style.display = 'block';
                    setTimeout(() => nlOverlay.classList.remove('show'), 3000);
                } else {
                    nlError.style.display = 'block';
                }
            } catch {
                nlError.style.display = 'block';
            } finally {
                nlSubmit.textContent = 'Jetzt anmelden';
                nlSubmit.disabled = false;
            }
        });
    }

    // 10. Cookie Banner
    const cookieBanner  = document.getElementById('cookieBanner');
    const cookieAccept  = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    if (cookieBanner && !localStorage.getItem('cookieChoice')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }

    if (localStorage.getItem('cookieChoice') === 'accepted') {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', { analytics_storage: 'granted' });
        }
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieChoice', 'accepted');
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', { analytics_storage: 'granted' });
            }
            cookieBanner.classList.remove('show');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieChoice', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
});