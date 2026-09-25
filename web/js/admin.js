const PROJECT_KEY = 'giStudioProjects';
const demoProjects = [
    { id: 'nexa-commerce', title: 'Nexa Commerce', category: 'web', description: 'A conversion-focused storefront for a modern lifestyle brand.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80', url: '#contact' },
    { id: 'pulse-fitness', title: 'Pulse Fitness', category: 'app', description: 'A bold fitness companion that keeps members moving.', image: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=900&q=80', url: '#contact' },
    { id: 'northline-brand', title: 'Northline Brand', category: 'branding', description: 'A confident identity system built for a new generation.', image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=900&q=80', url: '#contact' }
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
        <tr><td><strong>${escapeHtml(project.title)}</strong><br><small>${escapeHtml(project.description)}</small></td>
        <td><span class="status-badge">${escapeHtml(project.category)}</span></td>
        <td><div class="table-actions"><button class="delete-btn" data-delete="${escapeHtml(project.id)}" title="Delete project"><i class="fas fa-trash"></i></button></div></td></tr>
    `).join('');
    document.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => {
        saveProjects(readProjects().filter(project => project.id !== button.dataset.delete));
        renderProjects();
        toast('Project removed.');
    }));
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', event => {
        event.preventDefault();
        if (document.getElementById('adminEmail').value !== 'admin@gistudio.dev' || document.getElementById('adminPassword').value !== 'admin123') {
            toast('Use the demo credentials shown below.');
            return;
        }
        document.getElementById('loginView').hidden = true;
        document.getElementById('dashboardView').hidden = false;
        renderProjects();
    });
    document.getElementById('projectForm').addEventListener('submit', event => {
        event.preventDefault();
        const project = {
            id: `project-${Date.now()}`,
            title: document.getElementById('projectTitle').value.trim(),
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value.trim(),
            image: document.getElementById('projectImage').value.trim(),
            url: document.getElementById('projectUrl').value.trim() || '#contact'
        };
        saveProjects([project, ...readProjects()]);
        event.target.reset();
        renderProjects();
        toast('Project published successfully.');
    });
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
