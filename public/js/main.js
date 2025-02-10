// Handle password confirmation
document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.querySelector('form:has(#new_password)');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const newPassword = document.querySelector('#new_password');
            const confirmPassword = document.querySelector('#confirm_password');
            
            if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
                e.preventDefault();
                alert('New password and confirmation do not match!');
            }
        });
    }

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Handle maintenance request form
    const maintenanceForm = document.querySelector('#newRequestModal form');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', function(e) {
            const title = document.querySelector('#title').value.trim();
            const description = document.querySelector('#description').value.trim();

            if (!title || !description) {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav a.nav-link');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
}); 