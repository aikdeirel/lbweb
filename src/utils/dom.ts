/**
 * DOM Utilities - Common JavaScript functionality for the site
 */

// Mobile menu functionality
export function initializeMobileMenu() {
    const menuToggle = document.querySelector('.btn--menu');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    menuToggle?.addEventListener('click', () => {
        nav?.classList.toggle('menu-open');
        navLinks?.classList.toggle('nav-links--active');
    });
}

// Fullscreen image functionality
export function initializeFullscreenImages() {
    const imageLinks = document.querySelectorAll('.image-link');

    imageLinks.forEach(link => {
        // Remove any existing listeners to prevent duplicates
        link.removeEventListener('click', handleImageClick);
        link.addEventListener('click', handleImageClick);
    });
}

function handleImageClick(e: Event) {
    e.preventDefault();
    const link = e.currentTarget as HTMLAnchorElement;
    const url = link.getAttribute('href');
    if (!url) return;

    // Update browser history
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('image', url);
    history.pushState({}, '', currentUrl.toString());

    // Create fullscreen container
    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.className = 'fullscreen-overlay';
    fullscreenContainer.innerHTML = `
        <img src="${url}" alt="" class="image-contain" />
        <button class="btn btn--close absolute" style="top: 20px; right: 20px;" aria-label="Close fullscreen image">&times;</button>
    `;

    document.body.appendChild(fullscreenContainer);
    document.body.style.overflow = 'hidden';

    // Add close functionality
    const closeButton = fullscreenContainer.querySelector('.btn--close');
    closeButton?.addEventListener('click', closeFullscreen);

    // Close on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close on background click
    fullscreenContainer.addEventListener('click', (e) => {
        if (e.target === fullscreenContainer) {
            closeFullscreen();
        }
    });
}

function closeFullscreen() {
    // Remove image parameter from URL
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('image');
    history.replaceState({}, '', currentUrl.toString());

    // Remove fullscreen container
    const container = document.querySelector('.fullscreen-overlay');
    if (container) {
        container.remove();
        document.body.style.overflow = '';
    }

    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
}

// Handle browser back/forward for fullscreen images
export function initializeHistoryHandling() {
    window.addEventListener('popstate', () => {
        const container = document.querySelector('.fullscreen-overlay');
        if (container) {
            container.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscapeKey);
        }
    });
}

// Initialize all functionality
export function initializeApp() {
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        initializeMobileMenu();
        initializeFullscreenImages();
        initializeHistoryHandling();
    });

    // Note: Re-initialization can be called manually via window.initializeFullscreenImages if needed

    // Export for manual initialization if needed
    (window as any).initializeFullscreenImages = initializeFullscreenImages;
} 