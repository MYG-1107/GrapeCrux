// Main Interactive Script for GrapeCrux Website
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Include Loader for Modular Header & Footer files in /includes folder
    async function loadInclude(placeholderId, filePath) {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const html = await response.text();
                    placeholder.innerHTML = html;
                }
            } catch (e) {
                console.log(`Notice: Could not load include ${filePath}`, e);
            }
        }
    }

    loadInclude('header-placeholder', 'includes/header.html');
    loadInclude('footer-placeholder', 'includes/footer.html');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Navigation Toggle
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if(navLinks) {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-secondary)';
                navLinks.style.padding = '24px';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }
});
