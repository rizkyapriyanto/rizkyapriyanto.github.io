// ============================================================
// PORTOFOLIO - script.js
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // --------------------------------------------------------
    // NAVBAR: Active link & mobile toggle
    // --------------------------------------------------------
    const navLinks = document.querySelectorAll('.navbar-nav a');
    const sections = document.querySelectorAll('section[id]');
    const toggle   = document.getElementById('navToggle');
    const navMenu  = document.getElementById('navMenu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', () => navMenu.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
            }
        });
    }

    // Highlight active nav on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));

    // --------------------------------------------------------
    // SKILL BARS: Animate on scroll
    // --------------------------------------------------------
    const skillFills = document.querySelectorAll('.skill-fill[data-level]');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.level + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));

    // --------------------------------------------------------
    // CONTACT FORM: AJAX submit
    // --------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const alertBox    = document.getElementById('formAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = 'Mengirim...';
            btn.disabled  = true;

            try {
                const formData = new FormData(contactForm);
                formData.append('ajax', '1');

                const res  = await fetch('index.php?action=kirim_pesan', { method: 'POST', body: formData });
                const data = await res.json();

                if (alertBox) {
                    alertBox.className = 'form-alert ' + (data.success ? 'success' : 'error');
                    alertBox.textContent = data.message;
                }

                if (data.success) contactForm.reset();
            } catch {
                if (alertBox) {
                    alertBox.className = 'form-alert error';
                    alertBox.textContent = 'Terjadi kesalahan. Coba lagi.';
                }
            }

            btn.innerHTML = original;
            btn.disabled  = false;
        });
    }

    // --------------------------------------------------------
    // SMOOTH SCROLL for anchor links
    // --------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                navMenu?.classList.remove('open');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --------------------------------------------------------
    // ADMIN: Confirm delete
    // --------------------------------------------------------
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!confirm('Yakin ingin menghapus data ini?')) e.preventDefault();
        });
    });

    // --------------------------------------------------------
    // ADMIN: Mark message as read
    // --------------------------------------------------------
    document.querySelectorAll('.btn-read-msg').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            if (row) row.style.opacity = '0.5';
        });
    });

    // --------------------------------------------------------
    // TYPING EFFECT on hero tagline
    // --------------------------------------------------------
    const typeTarget = document.getElementById('typingText');
    if (typeTarget) {
        const texts  = ['Full Stack Developer', 'PHP Developer', 'Web Enthusiast'];
        let tIdx = 0, cIdx = 0, deleting = false;

        function type() {
            const current = texts[tIdx];
            typeTarget.textContent = deleting
                ? current.substring(0, cIdx--)
                : current.substring(0, cIdx++);

            let delay = deleting ? 60 : 100;

            if (!deleting && cIdx === current.length + 1) {
                delay = 2000;
                deleting = true;
            } else if (deleting && cIdx === 0) {
                deleting = false;
                tIdx = (tIdx + 1) % texts.length;
                delay = 400;
            }

            setTimeout(type, delay);
        }
        type();
    }

});