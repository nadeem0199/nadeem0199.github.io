document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        htmlElement.classList.add('dark');
        updateToggleIcon(true);
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        htmlElement.classList.remove('dark');
        updateToggleIcon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            if (newTheme === 'dark') {
                htmlElement.classList.add('dark');
            } else {
                htmlElement.classList.remove('dark');
            }
            localStorage.setItem('theme', newTheme);
            updateToggleIcon(newTheme === 'dark');
        });
    }

    function updateToggleIcon(isDark) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Smooth Scroll with Offset for Fixed Header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-rain');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const chars = '0123456789ABCDEF@#$%&<>?/|{}[]';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = width / fontSize;
        
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        function draw() {
            // Fade out effect
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.globalCompositeOperation = 'source-over';
            
            // Get current accent color
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
            ctx.fillStyle = accentColor;
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        setInterval(draw, 50);
    }

    // Code Sprinkles Effect
    const sprinkleCanvas = document.getElementById('code-sprinkles');
    if (sprinkleCanvas) {
        const ctx = sprinkleCanvas.getContext('2d');
        let width = sprinkleCanvas.width = window.innerWidth;
        let height = sprinkleCanvas.height = window.innerHeight;

        const symbols = ['<?php', '->', '::', '=>', 'use', 'class', 'public', '$this', 'dd()', 'Route', '@if', '{{ }}', '[]', ';'];
        const particles = [];
        const particleCount = 40;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.size = Math.random() * 14 + 10; // 10px to 24px
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.01 + 0.005;
                this.fadingOut = Math.random() > 0.5;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    'rgba(255, 45, 32, ',  // Laravel Red
                    'rgba(168, 85, 247, ', // Purple (PHP)
                    'rgba(236, 72, 153, ', // Pink
                    'rgba(255, 255, 255, ' // White
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.fadingOut) {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0) {
                        this.opacity = 0;
                        this.fadingOut = false;
                        this.reset(); // Reset position when invisible
                    }
                } else {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.6) {
                        this.fadingOut = true;
                    }
                }

                // Wrap around screen
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.font = `bold ${this.size}px "JetBrains Mono", monospace`;
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateSprinkles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateSprinkles);
        }

        window.addEventListener('resize', () => {
            width = sprinkleCanvas.width = window.innerWidth;
            height = sprinkleCanvas.height = window.innerHeight;
        });

        animateSprinkles();
    }

    // Typing Effect
    const typewriters = document.querySelectorAll('.typewriter');
    
    typewriters.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.classList.remove('typing-cursor'); 
        
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        
        setTimeout(() => {
            el.classList.add('typing-cursor');
            let i = 0;
            
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, Math.random() * 50 + 50); 
                } else {
                    setTimeout(() => {
                        el.classList.remove('typing-cursor');
                    }, 1000); 
                }
            }
            
            type();
        }, delay);
    });
});
