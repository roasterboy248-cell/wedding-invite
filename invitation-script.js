// Get client ID from URL
const urlParams = new URLSearchParams(window.location.search);
const clientId = parseInt(urlParams.get('id'));

// Load client data
let clientData = null;

function loadClientData() {
    const clients = JSON.parse(localStorage.getItem('wedding-clients')) || [];
    clientData = clients.find(c => c.id === clientId);

    if (!clientData) {
        alert('Client not found. Using demo data.');
        return;
    }

    // Update page title
    document.title = `${clientData.groomName} & ${clientData.brideName} - Wedding Invitation`;

    // Update seal initials
    const groomInitial = clientData.groomName.charAt(0);
    const brideInitial = clientData.brideName.charAt(0);
    document.getElementById('seal-initials').textContent = `${groomInitial}${brideInitial}`;

    // Update names
    document.getElementById('groom-name').textContent = clientData.groomName;
    document.getElementById('bride-name').textContent = clientData.brideName;

    // Update parents
    const groomParents = clientData.groomFather && clientData.groomMother 
        ? `Son of ${clientData.groomFather} & ${clientData.groomMother}`
        : 'Son of Mr. & Mrs.';
    const brideParents = clientData.brideFather && clientData.brideMother
        ? `Daughter of ${clientData.brideFather} & ${clientData.brideMother}`
        : 'Daughter of Mr. & Mrs.';

    document.getElementById('groom-parents').textContent = groomParents;
    document.getElementById('bride-parents').textContent = brideParents;

    // Update wedding date
    const weddingDate = new Date(clientData.weddingDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[weddingDate.getMonth()];
    const day = weddingDate.getDate();
    const year = weddingDate.getFullYear();

    document.getElementById('date-month').textContent = month;
    document.getElementById('date-day').textContent = day;
    document.getElementById('date-year').textContent = year;

    // Update event dates
    const haldi = new Date(weddingDate);
    haldi.setDate(haldi.getDate() - 3);
    document.getElementById('haldi-date').textContent = haldi.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const mehendi = new Date(weddingDate);
    mehendi.setDate(mehendi.getDate() - 2);
    document.getElementById('mehendi-date').textContent = mehendi.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const sangeet = new Date(weddingDate);
    sangeet.setDate(sangeet.getDate() - 1);
    document.getElementById('sangeet-date').textContent = sangeet.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('wedding-date').textContent = weddingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Update time
    if (clientData.weddingTime) {
        document.getElementById('wedding-time').textContent = clientData.weddingTime + ' Onwards';
    }

    // Update photos
    if (clientData.photo1) document.getElementById('photo-1').src = clientData.photo1;
    if (clientData.photo2) document.getElementById('photo-2').src = clientData.photo2;
    if (clientData.photo3) document.getElementById('photo-3').src = clientData.photo3;

    // Update music
    if (clientData.musicUrl) {
        const audio = document.getElementById('bg-music');
        audio.src = clientData.musicUrl;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadClientData();
    setupTapToReveal();
    setupScratchCards();
    setupAudio();
});

// Audio Control
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

function setupAudio() {
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
}

// Envelope Tap to Reveal
const envelope = document.querySelector('.envelope');
const scene1 = document.querySelector('.scene-1');
const scene2 = document.querySelector('.scene-2');
let isRevealed = false;

function setupTapToReveal() {
    envelope.addEventListener('click', () => {
        if (!isRevealed) {
            isRevealed = true;
            
            // Show reveal animation
            scene2.classList.add('active');
            
            // Play reveal sound effect
            playRevealSound();
            
            // Auto-play music
            if (!isMusicPlaying) {
                bgMusic.play();
                audioBtn.classList.remove('muted');
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                isMusicPlaying = true;
            }
            
            // Hide reveal after animation
            setTimeout(() => {
                scene2.classList.remove('active');
                scene1.style.display = 'none';
            }, 1500);
        }
    });
}

// Scratch Card Reveal
function setupScratchCards() {
    const scratchCards = document.querySelectorAll('.scratch-card');

    scratchCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('revealed')) {
                card.classList.add('revealed');
                playRevealSound();
                
                // Trigger confetti when all cards are revealed
                setTimeout(() => {
                    const allRevealed = Array.from(scratchCards).every(c => c.classList.contains('revealed'));
                    if (allRevealed) {
                        triggerConfetti();
                    }
                }, 300);
            }
        });
    });
}

// Confetti Animation
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#d4af37', '#c41e3a', '#f5f1e8', '#ffd700', '#ff69b4'];
    
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 3,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    
    let animationId;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.y += p.vy;
            p.x += p.vx;
            p.vy += 0.1; // gravity
            p.rotation += p.rotationSpeed;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
            
            // Remove particle if off screen
            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            canvas.style.display = 'none';
        }
    }
    
    canvas.style.display = 'block';
    animate();
    
    // Play celebration sound
    playCelebrationSound();
}

// Sound Effects
function playRevealSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Sound not available');
    }
}

function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create a celebratory chord
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            
            oscillator.start(now);
            oscillator.stop(now + 0.5);
        });
    } catch (e) {
        console.log('Sound not available');
    }
}

// Scroll Animations
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

// Observe all scenes
document.querySelectorAll('.scene').forEach((scene, index) => {
    if (index > 0) { // Skip first scene
        scene.style.opacity = '0';
        scene.style.transform = 'translateY(20px)';
        scene.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(scene);
    }
});

// Handle window resize for confetti canvas
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Smooth scroll behavior
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
