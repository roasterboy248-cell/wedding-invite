// Audio Control
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

audioBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        audioBtn.classList.add('muted');
        audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        isMusicPlaying = false;
    } else {
        bgMusic.play();
        audioBtn.classList.remove('muted');
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isMusicPlaying = true;
    }
});

// Entry Gate - Tap to Reveal
const entryGate = document.getElementById('entry-gate');
const mainContent = document.getElementById('main-content');

entryGate.addEventListener('click', () => {
    entryGate.style.opacity = '0';
    entryGate.style.pointerEvents = 'none';
    setTimeout(() => {
        entryGate.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Auto-play music on reveal
        if (!isMusicPlaying) {
            bgMusic.play();
            audioBtn.classList.remove('muted');
            audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMusicPlaying = true;
        }
    }, 500);
});

// Countdown Timer
function updateCountdown() {
    // Set your wedding date here (Format: "Month Day, Year Hour:Minute:Second")
    const weddingDate = new Date("April 28, 2026 00:00:00").getTime();
    
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    // If countdown is finished
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvp-form');
const successMessage = document.getElementById('success-message');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const attending = document.getElementById('attending').value;
    const guests = document.getElementById('guests').value;
    const dietary = document.getElementById('dietary').value;
    
    // Here you can send the data to your backend or email service
    console.log({
        name,
        email,
        attending,
        guests,
        dietary,
        timestamp: new Date().toISOString()
    });
    
    // Show success message
    rsvpForm.style.display = 'none';
    successMessage.classList.remove('hidden');
    
    // Reset form
    rsvpForm.reset();
    
    // Optional: Hide success message after 5 seconds and show form again
    setTimeout(() => {
        successMessage.classList.add('hidden');
        rsvpForm.style.display = 'block';
    }, 5000);
});

// Smooth scroll for navigation
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

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Mobile menu toggle (if needed)
document.addEventListener('DOMContentLoaded', () => {
    // Preload images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
    });
});
