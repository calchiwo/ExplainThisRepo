// Theme Toggle - WORKING VERSION
        (function() {
            'use strict';
            
            function initTheme() {
                const themeToggle = document.getElementById('themeToggle');
                const html = document.documentElement;
                const sunIcon = document.querySelector('.sun-icon');
                const moonIcon = document.querySelector('.moon-icon');
                
                if (!themeToggle || !sunIcon || !moonIcon) {
                    console.error('Theme toggle elements not found');
                    return;
                }
                
                // Get saved theme or default to light
                let currentTheme = localStorage.getItem('theme') || 'light';
                
                // Function to update UI based on theme
                function updateTheme(theme) {
                    html.setAttribute('data-theme', theme);
                    
                    if (theme === 'dark') {
                        sunIcon.style.display = 'none';
                        moonIcon.style.display = 'block';
                    } else {
                        sunIcon.style.display = 'block';
                        moonIcon.style.display = 'none';
                    }
                }
                
                // Apply initial theme
                updateTheme(currentTheme);
                
                // Toggle theme on click
                themeToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
                    localStorage.setItem('theme', currentTheme);
                    updateTheme(currentTheme);
                });
            }
            
            // Initialize when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initTheme);
            } else {
                initTheme();
            }
        })();

        // Copy to clipboard functionality
        function copyToClipboard(button, text) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }

        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

        function highlightNav() {
            if (!sections.length || !navLinks.length) return;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', highlightNav);
        window.addEventListener('load', highlightNav);