const PROJECT_KEY = 'giStudioProjects';
const METRICS_KEY = 'jiStudioMetrics';
const TESTIMONIALS_KEY = 'jiStudioTestimonials';
const TEAM_KEY = 'jiStudioTeam';
const MESSAGES_KEY = 'jiStudioMessages';
const DEFAULT_METRICS = { projects: 2, clients: 2, experience: 2 };
const setDefaultProjectDate = () => {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    document.getElementById('projectDate').value = localToday;
};
const demoProjects = [
    { id: 'nexa-commerce', title: 'Nexa Commerce', category: 'web', description: 'A conversion-focused storefront for a modern lifestyle brand.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80', url: '#contact', createdAt: '2026-06-15' },
    { id: 'pulse-fitness', title: 'Pulse Fitness', category: 'app', description: 'A bold fitness companion that keeps members moving.', image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=900&q=80', url: '#contact', createdAt: '2026-07-02' },
    { id: 'northline-brand', title: 'Northline Brand', category: 'branding', description: 'A confident identity system built for a new generation.', image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=900&q=80', url: '#contact', createdAt: '2026-08-10' }
];

const readProjects = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(PROJECT_KEY));
        return Array.isArray(saved) ? saved : demoProjects;
    } catch (error) {
        console.warn('Could not read portfolio data.', error);
        return demoProjects;
    }
};
const saveProjects = projects => localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
const readTestimonials = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(TESTIMONIALS_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn('Could not read client testimonials.', error);
        return [];
    }
};
const readTeam = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(TEAM_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn('Could not read team profiles.', error);
        return [];
    }
};
const readMessages = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(MESSAGES_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.warn('Could not read contact messages.', error);
        return [];
    }
};
const toast = message => {
    const element = document.getElementById('toast');
    element.textContent = message;
    element.className = 'toast show success';
    setTimeout(() => element.classList.remove('show'), 2800);
};

function renderProjects() {
    const projects = readProjects();
    document.getElementById('projectCount').textContent = projects.length;
    document.getElementById('projectsTable').innerHTML = projects.map(project => `
        <tr><td><strong>${escapeHtml(project.title)}</strong><br><small>${escapeHtml(project.description)}</small><br><small>${project.createdAt ? escapeHtml(project.createdAt) : 'Date not recorded'}</small></td>
        <td><span class="status-badge">${escapeHtml(project.category)}</span></td>
        <td><div class="table-actions"><button class="delete-btn" data-delete="${escapeHtml(project.id)}" title="Delete project"><i class="fas fa-trash"></i></button></div></td></tr>
    `).join('');
    document.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => {
        saveProjects(readProjects().filter(project => project.id !== button.dataset.delete));
        renderProjects();
        toast('Project removed.');
    }));
}

function renderMetricsForm() {
    let metrics = DEFAULT_METRICS;
    try {
        const saved = JSON.parse(localStorage.getItem(METRICS_KEY));
        if (saved && typeof saved === 'object') metrics = { ...DEFAULT_METRICS, ...saved };
    } catch (error) {
        console.warn('Could not read homepage statistics.', error);
    }
    document.getElementById('metricProjects').value = metrics.projects;
    document.getElementById('metricClients').value = metrics.clients;
    document.getElementById('metricExperience').value = metrics.experience;
}

function renderTestimonials() {
    const testimonials = readTestimonials();
    const table = document.getElementById('testimonialsTable');
    document.getElementById('testimonialsEmpty').hidden = testimonials.length > 0;
    table.innerHTML = testimonials.map(item => `
        <tr>
            <td><strong>${escapeHtml(item.name)}</strong><br><small>${escapeHtml(item.role)}</small></td>
            <td>${escapeHtml(item.quoteEn)}${item.quoteBn ? `<br><small>${escapeHtml(item.quoteBn)}</small>` : ''}</td>
            <td>${'★'.repeat(Math.min(5, Math.max(1, Number(item.rating) || 5)))}</td>
            <td><div class="table-actions"><button class="delete-btn" type="button" data-delete-testimonial="${escapeHtml(item.id)}" title="Delete comment"><i class="fas fa-trash"></i></button></div></td>
        </tr>
    `).join('');
    table.querySelectorAll('[data-delete-testimonial]').forEach(button => {
        button.addEventListener('click', () => {
            localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(
                readTestimonials().filter(item => item.id !== button.dataset.deleteTestimonial)
            ));
            renderTestimonials();
            toast('Client comment removed.');
        });
    });
}

function renderTeam() {
    const members = readTeam();
    const table = document.getElementById('teamTable');
    document.getElementById('teamTableEmpty').hidden = members.length > 0;
    table.innerHTML = members.map(member => `
        <tr>
            <td><strong>${escapeHtml(member.name)}</strong></td>
            <td>${escapeHtml(member.title)}</td>
            <td><div class="table-actions"><button class="delete-btn" type="button" data-delete-member="${escapeHtml(member.id)}" title="Delete team member"><i class="fas fa-trash"></i></button></div></td>
        </tr>
    `).join('');
    table.querySelectorAll('[data-delete-member]').forEach(button => {
        button.addEventListener('click', () => {
            localStorage.setItem(TEAM_KEY, JSON.stringify(
                readTeam().filter(member => member.id !== button.dataset.deleteMember)
            ));
            renderTeam();
            toast('Team member removed.');
        });
    });
}

function renderMessages() {
    const messages = readMessages();
    const unreadCount = messages.filter(message => !message.read).length;
    document.getElementById('inboxCount').textContent = unreadCount;
    document.getElementById('inboxCount').hidden = unreadCount === 0;
    document.getElementById('inboxSummary').textContent = `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`;
    document.getElementById('messagesEmpty').hidden = messages.length > 0;
    const table = document.getElementById('messagesTable');
    table.innerHTML = messages.map(message => {
        const date = new Date(message.submittedAt);
        const formattedDate = Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString();
        return `<tr class="${message.read ? '' : 'message-unread'}">
            <td><strong>${escapeHtml(message.name)}</strong><br><a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></td>
            <td><strong>${escapeHtml(message.subject)}</strong><p class="admin-message-body">${escapeHtml(message.message)}</p></td>
            <td>${escapeHtml(formattedDate)}</td>
            <td><div class="table-actions">
                ${message.read ? '' : `<button class="edit-btn" type="button" data-read-message="${escapeHtml(message.id)}" title="Mark as read"><i class="fas fa-check"></i></button>`}
                <button class="delete-btn" type="button" data-delete-message="${escapeHtml(message.id)}" title="Delete message"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`;
    }).join('');
    table.querySelectorAll('[data-read-message]').forEach(button => {
        button.addEventListener('click', () => {
            const updated = readMessages().map(message => message.id === button.dataset.readMessage
                ? { ...message, read: true }
                : message);
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
            renderMessages();
            toast('Message marked as read.');
        });
    });
    table.querySelectorAll('[data-delete-message]').forEach(button => {
        button.addEventListener('click', () => {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(
                readMessages().filter(message => message.id !== button.dataset.deleteMessage)
            ));
            renderMessages();
            toast('Message deleted.');
        });
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('adminPassword').addEventListener('input', event => {
        event.currentTarget.value = event.currentTarget.value.replace(/\s/g, '');
    });
    document.getElementById('loginForm').addEventListener('submit', event => {
        event.preventDefault();
        const password = document.getElementById('adminPassword').value.replace(/\s/g, '');
        if (document.getElementById('adminEmail').value.trim() !== 'admin@gistudio.dev' || password !== 'admin123') {
            toast('Invalid email or password.');
            return;
        }
        document.getElementById('loginView').hidden = true;
        document.getElementById('dashboardView').hidden = false;
        renderProjects();
        renderMetricsForm();
        renderTestimonials();
        renderTeam();
        renderMessages();
    });
    document.getElementById('metricsForm').addEventListener('submit', event => {
        event.preventDefault();
        const metrics = {
            projects: Number(document.getElementById('metricProjects').value),
            clients: Number(document.getElementById('metricClients').value),
            experience: Number(document.getElementById('metricExperience').value)
        };
        localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
        toast('Homepage statistics saved.');
    });
    window.addEventListener('storage', event => {
        if (event.key === MESSAGES_KEY) renderMessages();
    });
    document.getElementById('testimonialForm').addEventListener('submit', event => {
        event.preventDefault();
        const testimonial = {
            id: `testimonial-${Date.now()}`,
            name: document.getElementById('testimonialName').value.trim(),
            role: document.getElementById('testimonialRole').value.trim(),
            quoteEn: document.getElementById('testimonialQuoteEn').value.trim(),
            quoteBn: document.getElementById('testimonialQuoteBn').value.trim(),
            rating: Number(document.getElementById('testimonialRating').value)
        };
        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify([testimonial, ...readTestimonials()]));
        event.target.reset();
        renderTestimonials();
        toast('Client comment added.');
    });
    document.getElementById('teamForm').addEventListener('submit', event => {
        event.preventDefault();
        const image = document.getElementById('workerImage').value.trim();
        try {
            const imageUrl = new URL(image);
            if (!['http:', 'https:'].includes(imageUrl.protocol)) throw new Error('Unsupported image URL protocol.');
        } catch {
            toast('Enter a valid HTTP or HTTPS profile image URL.');
            return;
        }
        const member = {
            id: `team-${Date.now()}`,
            name: document.getElementById('workerName').value.trim(),
            title: document.getElementById('workerTitle').value.trim(),
            image,
            facebook: document.getElementById('workerFacebook').value.trim(),
            instagram: document.getElementById('workerInstagram').value.trim(),
            linkedin: document.getElementById('workerLinkedin').value.trim(),
            github: document.getElementById('workerGithub').value.trim()
        };
        localStorage.setItem(TEAM_KEY, JSON.stringify([member, ...readTeam()]));
        event.target.reset();
        renderTeam();
        toast('Team member added.');
    });
    document.getElementById('projectForm').addEventListener('submit', event => {
        event.preventDefault();
        const project = {
            id: `project-${Date.now()}`,
            title: document.getElementById('projectTitle').value.trim(),
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value.trim(),
            image: document.getElementById('projectImage').value.trim(),
            url: document.getElementById('projectUrl').value.trim() || '#contact',
            createdAt: document.getElementById('projectDate').value
        };
        saveProjects([project, ...readProjects()]);
        event.target.reset();
        setDefaultProjectDate();
        renderProjects();
        toast('Project published successfully.');
    });
    setDefaultProjectDate();
    document.getElementById('resetProjects').addEventListener('click', () => {
        saveProjects(demoProjects);
        renderProjects();
        toast('Demo projects restored.');
    });
    document.getElementById('logoutButton').addEventListener('click', () => {
        document.getElementById('dashboardView').hidden = true;
        document.getElementById('loginView').hidden = false;
    });
    document.getElementById('sidebarToggle').addEventListener('click', () => document.getElementById('adminSidebar').classList.add('open'));
    document.getElementById('sidebarClose').addEventListener('click', () => document.getElementById('adminSidebar').classList.remove('open'));
});
