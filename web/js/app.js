const STORAGE_KEY = 'giStudioProjects';
const LANGUAGE_KEY = 'giStudioLanguage';

const starterProjects = [
    {
        id: 'nexa-commerce',
        title: 'Nexa Commerce',
        category: 'web',
        description: 'A conversion-focused storefront for a modern lifestyle brand.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
        url: '#contact'
    },
    {
        id: 'pulse-fitness',
        title: 'Pulse Fitness',
        category: 'app',
        description: 'A bold fitness companion that keeps members moving.',
        image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=900&q=80',
        url: '#contact'
    },
    {
        id: 'northline-brand',
        title: 'Northline Brand',
        category: 'branding',
        description: 'A confident identity system built for a new generation.',
        image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=900&q=80',
        url: '#contact'
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
        <article class="portfolio-card" data-category="${project.category}" data-aos="fade-up">
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
            </div>
        </article>
    `).join('');
    empty.style.display = projects.length ? 'none' : 'block';
    observeAnimations();
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
        element.textContent = element.dataset[nextLanguage];
    });
    document.getElementById('langEn')?.classList.toggle('active', nextLanguage === 'en');
    document.getElementById('langBn')?.classList.toggle('active', nextLanguage === 'bn');
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
    createParticles();
    renderPortfolio();
    observeAnimations();

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
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
        showToast(document.documentElement.dataset.lang === 'bn' ? 'বার্তা পাঠানো হয়েছে!' : 'Message sent successfully!');
        event.target.reset();
    });
    document.querySelector('.newsletter-form')?.addEventListener('submit', event => {
        event.preventDefault();
        showToast(document.documentElement.dataset.lang === 'bn' ? 'সাবস্ক্রাইব সম্পন্ন হয়েছে!' : 'You are on the list!');
        event.target.reset();
    });
}

document.addEventListener('DOMContentLoaded', initSite);
