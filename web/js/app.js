const STORAGE_KEY = 'giStudioProjects';
const LANGUAGE_KEY = 'giStudioLanguage';
const METRICS_KEY = 'jiStudioMetrics';
const TESTIMONIALS_KEY = 'jiStudioTestimonials';
const TEAM_KEY = 'jiStudioTeam';
const MESSAGES_KEY = 'jiStudioMessages';
const DEFAULT_METRICS = { projects: 2, clients: 2, experience: 2 };
let activeTestimonial = 0;
let testimonialTimer;
let metricsAnimated = false;

const starterProjects = [
    {
        id: 'nexa-commerce',
        title: 'Nexa Commerce',
        category: 'web',
        description: 'A conversion-focused storefront for a modern lifestyle brand.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
        url: '#contact', createdAt: '2026-06-15'
    },
    {
        id: 'pulse-fitness',
        title: 'Pulse Fitness',
        category: 'app',
        description: 'A bold fitness companion that keeps members moving.',
        image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=900&q=80',
        url: '#contact', createdAt: '2026-07-02'
    },
    {
        id: 'northline-brand',
        title: 'Northline Brand',
        category: 'branding',
        description: 'A confident identity system built for a new generation.',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=900&q=80',
        url: '#contact', createdAt: '2026-08-10'
    }
];

function getProjects() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return starterProjects;
    try {
        const projects = JSON.parse(stored);
        return Array.isArray(projects) ? projects : starterProjects;
    } catch (error) {
        console.warn('Could not read saved projects.', error);
        return starterProjects;
    }
}

function renderPortfolio(filter = 'all') {
    const grid = document.getElementById('portfolioGrid');
    const empty = document.getElementById('portfolioEmpty');
    if (!grid || !empty) return;

    const projects = getProjects().filter(project => filter === 'all' || project.category === filter);
    grid.innerHTML = projects.map(project => `
        <article class="portfolio-card" data-category="${escapeHtml(project.category)}" data-aos="fade-up">
            <div class="portfolio-image">
                <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy">
                <div class="portfolio-overlay">
                    <a href="${escapeHtml(project.url || '#contact')}" class="portfolio-view" aria-label="View ${escapeHtml(project.title)}">
                        <i class="fas fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            </div>
            <div class="portfolio-info">
                <span class="portfolio-category">${escapeHtml(project.category)}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description || '')}</p>
                <time class="portfolio-date" ${project.createdAt ? `datetime="${escapeHtml(project.createdAt)}"` : ''}>
                    <i class="far fa-calendar"></i>
                    ${project.createdAt ? formatProjectDate(project.createdAt) : (document.documentElement.dataset.lang === 'bn' ? 'তারিখ উল্লেখ নেই' : 'Date not recorded')}
                </time>
            </div>
        </article>
    `).join('');
    empty.style.display = projects.length ? 'none' : 'block';
    observeAnimations();
}

function getMetrics() {
    try {
        const saved = JSON.parse(localStorage.getItem(METRICS_KEY));
        return saved && typeof saved === 'object' ? { ...DEFAULT_METRICS, ...saved } : DEFAULT_METRICS;
    } catch (error) {
        console.warn('Could not read homepage statistics.', error);
        return DEFAULT_METRICS;
    }
}

function renderMetrics() {
    const metrics = getMetrics();
    document.querySelectorAll('[data-stat]').forEach(element => {
        const value = Number(metrics[element.dataset.stat]) || 0;
        element.textContent = value.toLocaleString(document.documentElement.dataset.lang === 'bn' ? 'bn-BD' : 'en');
        const plus = element.parentElement.querySelector('.stat-plus');
        if (plus) plus.hidden = value === 0;
    });
}

function animateMetrics() {
    if (metricsAnimated) return;
    metricsAnimated = true;
    const elements = [...document.querySelectorAll('[data-stat]')];
    const targets = getMetrics();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = 1500;
    const start = performance.now();

    if (reducedMotion) {
        renderMetrics();
        return;
    }

    elements.forEach(element => {
        element.textContent = '0';
        element.classList.add('counting');
    });
    const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        elements.forEach(element => {
            const target = Number(targets[element.dataset.stat]) || 0;
            const current = Math.floor(target * easedProgress);
            element.textContent = current.toLocaleString(document.documentElement.dataset.lang === 'bn' ? 'bn-BD' : 'en');
        });
        if (progress < 1) {
            window.requestAnimationFrame(tick);
        } else {
            renderMetrics();
            elements.forEach(element => element.classList.remove('counting'));
        }
    };
    window.requestAnimationFrame(tick);
}

function getTeamMembers() {
    try {
        const saved = JSON.parse(localStorage.getItem(TEAM_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn('Could not read team profiles.', error);
        return [];
    }
}

function isWebUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function renderTeam() {
    const grid = document.getElementById('teamGrid');
    const empty = document.getElementById('teamEmpty');
    if (!grid || !empty) return;
    const members = getTeamMembers();
    empty.hidden = members.length > 0;
    grid.innerHTML = members.map(member => {
        const socials = [
            ['facebook', member.facebook, 'fab fa-facebook-f'],
            ['instagram', member.instagram, 'fab fa-instagram'],
            ['linkedin', member.linkedin, 'fab fa-linkedin-in'],
            ['github', member.github, 'fab fa-github']
        ].filter(([, url]) => isWebUrl(url));
        return `<article class="team-card" data-aos="fade-up">
            <div class="team-img">
                <img class="team-photo" src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" loading="lazy">
                ${socials.length ? `<div class="team-social">${socials.map(([label, url, icon]) =>
                    `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${label} profile for ${escapeHtml(member.name)}"><i class="${icon}"></i></a>`
                ).join('')}</div>` : ''}
            </div>
            <div class="team-info"><h4>${escapeHtml(member.name)}</h4><span>${escapeHtml(member.title)}</span></div>
        </article>`;
    }).join('');
    observeAnimations();
}

function getTestimonials() {
    try {
        const saved = JSON.parse(localStorage.getItem(TESTIMONIALS_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn('Could not read client testimonials.', error);
        return [];
    }
}

function renderTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const dots = document.getElementById('testDots');
    if (!track || !dots) return;
    const testimonials = getTestimonials();
    if (!testimonials.length) {
        activeTestimonial = 0;
        track.innerHTML = `<div class="testimonial-empty">${document.documentElement.dataset.lang === 'bn' ? 'ক্লায়েন্টদের মতামত শীঘ্রই এখানে যোগ করা হবে।' : 'Client feedback will appear here soon.'}</div>`;
        dots.replaceChildren();
        return;
    }

    activeTestimonial = ((activeTestimonial % testimonials.length) + testimonials.length) % testimonials.length;
    track.innerHTML = testimonials.map(item => {
        const quote = document.documentElement.dataset.lang === 'bn' && item.quoteBn
            ? item.quoteBn
            : item.quoteEn;
        const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));
        return `<article class="testimonial-card">
            <div class="testimonial-stars" aria-label="${rating} out of 5 stars">${'<i class="fas fa-star" aria-hidden="true"></i>'.repeat(rating)}</div>
            <p>“${escapeHtml(quote)}”</p>
            <div class="testimonial-author">
                <div class="author-avatar"><i class="fas fa-user"></i></div>
                <div class="author-info"><h5>${escapeHtml(item.name)}</h5><span>${escapeHtml(item.role)}</span></div>
            </div>
        </article>`;
    }).join('');
    dots.innerHTML = testimonials.map((_, index) =>
        `<button class="test-dot${index === activeTestimonial ? ' active' : ''}" type="button" data-testimonial-index="${index}" aria-label="Show client comment ${index + 1}"></button>`
    ).join('');
    dots.querySelectorAll('[data-testimonial-index]').forEach(dot => {
        dot.addEventListener('click', () => {
            activeTestimonial = Number(dot.dataset.testimonialIndex);
            updateTestimonialPosition();
            restartTestimonialTimer();
        });
    });
    updateTestimonialPosition();
}

function updateTestimonialPosition() {
    const track = document.getElementById('testimonialTrack');
    if (track) track.style.transform = `translateX(-${activeTestimonial * 100}%)`;
    document.querySelectorAll('.test-dot').forEach((dot, index) => dot.classList.toggle('active', index === activeTestimonial));
}

function slideTestimonial(direction) {
    const testimonials = getTestimonials();
    if (testimonials.length < 2) return;
    activeTestimonial = (activeTestimonial + direction + testimonials.length) % testimonials.length;
    updateTestimonialPosition();
    restartTestimonialTimer();
}

function restartTestimonialTimer() {
    window.clearInterval(testimonialTimer);
    if (getTestimonials().length > 1) {
        testimonialTimer = window.setInterval(() => slideTestimonial(1), 6000);
    }
}

function formatProjectDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return document.documentElement.dataset.lang === 'bn' ? 'তারিখ উল্লেখ নেই' : 'Date not recorded';
    }
    return new Intl.DateTimeFormat(document.documentElement.dataset.lang === 'bn' ? 'bn-BD' : 'en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
}

function switchLang(language) {
    const nextLanguage = language === 'bn' ? 'bn' : 'en';
    document.documentElement.dataset.lang = nextLanguage;
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    document.querySelectorAll('[data-en][data-bn]').forEach(element => {
        const directTextNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (directTextNode) {
            directTextNode.nodeValue = `${element.dataset[nextLanguage]} `;
        } else {
            element.textContent = element.dataset[nextLanguage];
        }
    });
    document.getElementById('langEn')?.classList.toggle('active', nextLanguage === 'en');
    document.getElementById('langBn')?.classList.toggle('active', nextLanguage === 'bn');
    renderPortfolio(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
    renderTestimonials();
    renderMetrics();
    renderTeam();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function observeAnimations() {
    const elements = document.querySelectorAll('[data-aos]:not(.aos-ready)');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('aos-animate'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    elements.forEach(element => {
        element.classList.add('aos-ready');
        observer.observe(element);
    });
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 28; index += 1) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${5 + Math.random() * 7}s`;
        fragment.appendChild(particle);
    }
    container.appendChild(fragment);
}

function initSite() {
    window.setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), 650);
    switchLang(localStorage.getItem(LANGUAGE_KEY) || 'en');
    setTheme(localStorage.getItem('giStudioTheme') || 'dark');
    createParticles();
    renderPortfolio();
    renderMetrics();
    window.setTimeout(animateMetrics, 700);
    renderTestimonials();
    renderTeam();
    restartTestimonialTimer();
    window.addEventListener('storage', event => {
        if ([METRICS_KEY, TESTIMONIALS_KEY, TEAM_KEY, MESSAGES_KEY].includes(event.key)) {
            if (event.key === METRICS_KEY) {
                metricsAnimated = false;
                renderMetrics();
                animateMetrics();
            }
            if (event.key === TESTIMONIALS_KEY) {
                activeTestimonial = 0;
                renderTestimonials();
                restartTestimonialTimer();
            }
            if (event.key === TEAM_KEY) renderTeam();
        }
    });
    observeAnimations();

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 30);
        backToTop?.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });
    navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navLinks.classList.remove('active');
    }));

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            renderPortfolio(button.dataset.filter || 'all');
        });
    });

    document.getElementById('contactForm')?.addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const submission = {
            id: `message-${Date.now()}`,
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            submittedAt: new Date().toISOString(),
            read: false
        };
        try {
            const existing = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
            if (!Array.isArray(existing)) throw new Error('Saved contact messages have an invalid format.');
            localStorage.setItem(MESSAGES_KEY, JSON.stringify([submission, ...existing]));
        } catch (error) {
            console.error('Could not save contact message.', error);
            showToast(document.documentElement.dataset.lang === 'bn'
                ? 'বার্তাটি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।'
                : 'Could not save your message. Please try again.', 'error');
            return;
        }
        showToast(document.documentElement.dataset.lang === 'bn'
            ? 'আপনার বার্তা জমা হয়েছে। আমরা যোগাযোগ করব।'
            : 'Your message has been received. We will be in touch.');
        form.reset();
    });
    document.querySelector('.newsletter-form')?.addEventListener('submit', event => {
        event.preventDefault();
        showToast(document.documentElement.dataset.lang === 'bn' ? 'সাবস্ক্রাইব সম্পন্ন হয়েছে!' : 'You are on the list!');
        event.target.reset();
    });
}

function setTheme(theme) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('giStudioTheme', nextTheme);
    const button = document.getElementById('themeToggle');
    if (button) {
        const isDark = nextTheme === 'dark';
        button.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
        button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        button.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    }
}

document.addEventListener('DOMContentLoaded', initSite);
