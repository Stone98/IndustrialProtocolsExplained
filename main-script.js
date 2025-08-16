// Main JavaScript for Industrial Protocols Explained

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Navbar background on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Intersection Observer for fade-in animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .protocol-card, .feature-card, .path-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Protocol card hover effects
function initializeProtocolCards() {
    const protocolCards = document.querySelectorAll('.protocol-card');
    
    protocolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Network diagram animation
function animateNetworkDiagram() {
    const connections = document.querySelectorAll('.connection-line');
    
    connections.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
        line.classList.add('connection-animate');
    });
}

// Add pulsing animation to network nodes
function initializeNetworkAnimation() {
    const masterNode = document.querySelector('.network-node.master');
    const slaveNodes = document.querySelectorAll('.network-node.slave');
    
    if (masterNode) {
        setInterval(() => {
            masterNode.style.transform = 'scale(1.05)';
            setTimeout(() => {
                masterNode.style.transform = 'scale(1)';
            }, 300);
            
            // Animate slave nodes after a delay
            setTimeout(() => {
                slaveNodes.forEach((node, index) => {
                    setTimeout(() => {
                        node.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            node.style.transform = 'scale(1)';
                        }, 300);
                    }, index * 100);
                });
            }, 500);
        }, 3000);
    }
}

// Mobile menu toggle (for future mobile optimization)
function initializeMobileMenu() {
    // Placeholder for mobile menu functionality
    // Can be expanded later for hamburger menu on mobile
    
    // Add touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Loading performance optimization
function optimizeLoadingPerformance() {
    // Lazy load images when they come into view
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Statistics counter animation
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                let currentValue = 0;
                const increment = finalValue / 30; // Animate over 30 frames
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.ceil(currentValue);
                    }
                }, 50);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Keyboard navigation improvements
function enhanceKeyboardNavigation() {
    // Add focus styles and improve keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Error handling for external links
function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add analytics tracking or error handling here if needed
            link.setAttribute('rel', 'noopener noreferrer');
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Industrial Protocols Explained - Main Page Loaded');
    
    // Initialize all functionality
    initializeSmoothScrolling();
    handleNavbarScroll();
    initializeAnimations();
    initializeProtocolCards();
    animateNetworkDiagram();
    initializeNetworkAnimation();
    initializeMobileMenu();
    optimizeLoadingPerformance();
    animateCounters();
    enhanceKeyboardNavigation();
    handleExternalLinks();
    
    // Set up scroll listener for active nav updates
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
    
    console.log('All features initialized successfully');
});

// Add CSS for connection animation
const style = document.createElement('style');
style.textContent = `
    .connection-animate {
        animation: pulseConnection 2s infinite;
    }
    
    @keyframes pulseConnection {
        0%, 100% {
            opacity: 0.8;
            transform: scaleY(1);
        }
        50% {
            opacity: 1;
            transform: scaleY(1.1);
        }
    }
    
    .keyboard-navigation :focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
    
    .touch-device .btn:hover {
        transform: none;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Export functions for potential use in other scripts
window.IndustrialProtocols = {
    initializeSmoothScrolling,
    updateActiveNavLink,
    initializeAnimations,
    animateCounters
};