// Main Interactive Script for GrapeCrux Website
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Navigation Menu Toggle placeholder logic
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            alert("Mobile menu clicked!");
        });
    }
});
