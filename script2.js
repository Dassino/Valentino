let current = 1;
const container = document.getElementById("photo-container");
const continueBtn = document.getElementById("continueBtn");
const bgMusic = document.getElementById("bgMusic");
const chapterMusic = document.getElementById("chapterMusic");
const startScreen = document.querySelector(".startScreen");

const photos = [
  "photos/1.jpeg", "photos/2.jpeg", "photos/3.jpeg", "photos/4.jpeg",
  "photos/5.jpeg", "photos/6.jpeg", "photos/7.jpeg", "photos/8.jpeg",
  "photos/9.jpeg", "photos/10.jpeg", "photos/11.jpeg", "photos/12.jpeg",
  "photos/13.jpeg", "photos/14.jpeg", "photos/15.jpeg"
];

let index = 0;
let flowerInterval;
let heartInterval;

// Next scene function
function nextScene() {
  document.getElementById(`scene${current}`).classList.remove("active");
  current++;

  // Special handling for scene 2 -> 3 transition (Chapter One button)
  if (current === 2) {
    // Show closed book (scene 2) and stop first music
    stopMusic(bgMusic);
    document.getElementById("scene2").classList.add("active");
    return;
  }

  document.getElementById(`scene${current}`).classList.add("active");
}

// IMPROVED Page flip animation function - works like a real book
function flipToNextPage(nextScene) {
  const currentSceneEl = document.getElementById(`scene${current}`);
  const nextSceneEl = document.getElementById(`scene${nextScene}`);

  const currentRightPage = currentSceneEl.querySelector(".page.right");
  const newLeftPage = nextSceneEl.querySelector(".page-flip-in");

  if (!currentRightPage || !newLeftPage) {
    currentSceneEl.classList.remove("active");
    current = nextScene;
    nextSceneEl.classList.add("active");
    return;
  }

  // Show next scene IMMEDIATELY (both pages visible during flip)
  nextSceneEl.classList.add("active");
  
  // Start the flip animation
  requestAnimationFrame(() => {
    currentRightPage.classList.add("flipping-out");
    newLeftPage.classList.add("flip-in-active");
  });

  // Hide the old scene after animation completes
  setTimeout(() => {
    currentSceneEl.classList.remove("active");
    current = nextScene;
  }, 800); // Match animation duration
}


// Open book function (when user taps the closed book)
function openBook() {
  console.log("Book tapped - starting music");
  
  // Hide scene 2 (closed book)
  document.getElementById("scene2").classList.remove("active");
  
  // Start chapter music immediately
  chapterMusic.currentTime = 0;
  chapterMusic.volume = 1;
  chapterMusic.play().then(() => {
    console.log("Chapter music playing");
  }).catch(err => {
    console.error("Music play error:", err);
  });
  
  // Show scene 3 (open book with flowers)
  current = 3;
  document.getElementById("scene3").classList.add("active");
  
  // Start falling flowers
  startFallingFlowers();
}

// YES button - go to celebration
function yes() {
  document.getElementById(`scene${current}`).classList.remove("active");
  stopFallingFlowers();
  
  // Stop chapter music and start celebration music
  stopMusic(chapterMusic);
  const celebrationMusic = document.getElementById("celebrationMusic");
  startMusic(celebrationMusic);
  
  current = 6;
  document.getElementById("scene6").classList.add("active");
  
  // Start celebration effects
  startFireworks();
  startFallingHearts();
}

// Restart function
function restart() {
  document.getElementById("scene6").classList.remove("active");
  
  // Stop all effects
  stopFallingHearts();
  stopFireworks();
  
  // Stop celebration music
  const celebrationMusic = document.getElementById("celebrationMusic");
  stopMusic(celebrationMusic);
  
  // Reset to scene 1
  current = 1;
  document.getElementById("scene1").classList.add("active");
  container.className = "";
  
  // Clean up all page flip classes
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("flipping-out", "flip-in-active");
  });

  // Restart music
  stopMusic(chapterMusic);
  startMusic(bgMusic);
  
  // Restart slideshow
  startSlideshow();
}

// NO button runs away on hover - constrained to book area
const noBtn = document.getElementById("no");
if (noBtn) {
  noBtn.addEventListener("mouseover", () => {
    // Get the book/page boundaries
    const page = noBtn.closest('.page.right');
    if (page) {
      const pageRect = page.getBoundingClientRect();

      const pageWidth = page.clientWidth;
      const pageHeight = page.clientHeight;
      
      const btnWidth = noBtn.offsetWidth;
      const btnHeight = noBtn.offsetHeight;
      
      // Calculate random position within the page bounds
      const randomX = Math.random() * (pageWidth - btnWidth - 20);
      const randomY = Math.random() * (pageHeight - btnHeight - 20);
      
      noBtn.style.position = "absolute";
      noBtn.style.left = randomX + "px";
      noBtn.style.top = randomY + "px";
    }
  });
  
  // Make NO button unclickable
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}

// Start experience
startScreen.addEventListener("click", () => {
  startScreen.style.opacity = "0";
  setTimeout(() => {
    startScreen.style.display = "none";
  }, 500);
  
  document.getElementById("scene1").classList.add("active");
  
  // Start background music
  startMusic(bgMusic);
  
  // Properly preload chapter music
  chapterMusic.volume = 1;
  chapterMusic.load();
  
  startSlideshow();
});

// Music control functions
function startMusic(audio) {
  audio.currentTime = 0;
  audio.volume = 0;
  audio.play();
  
  // Fade in
  let vol = 0;
  const fadeIn = setInterval(() => {
    vol += 0.05;
    audio.volume = Math.min(vol, 1);
    
    if (vol >= 1) {
      clearInterval(fadeIn);
    }
  }, 50);
}

function stopMusic(audio) {
  let vol = audio.volume;
  
  const fadeOut = setInterval(() => {
    vol -= 0.05;
    audio.volume = Math.max(vol, 0);
    
    if (vol <= 0) {
      clearInterval(fadeOut);
      audio.pause();
      audio.currentTime = 0;
    }
  }, 50);
}

// Slideshow functions
function startSlideshow() {
  index = 0;
  container.innerHTML = "";
  showPhoto();
}

function showPhoto() {
  if (index >= photos.length) {
    arrangeAndDance();
    continueBtn.style.display = "block";
    return;
  }

  const img = document.createElement("img");
  img.src = photos[index];
  img.className = "memory";
  container.appendChild(img);

  setTimeout(() => {
    img.remove();
    index++;
    showPhoto();
  }, 4000);
}

// Dance mode
function arrangeAndDance() {
  container.innerHTML = "";
  container.className = "dance-container";

  photos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "dance-photo";
    container.appendChild(img);
  });
}

// Falling flowers
function startFallingFlowers() {
  if (flowerInterval) return;

  flowerInterval = setInterval(() => {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = ["🌸", "🌺", "💮", "🏵️"][Math.floor(Math.random() * 4)];

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 24 + Math.random() * 20 + "px";
    petal.style.animationDuration = 6 + Math.random() * 6 + "s";

    document.body.appendChild(petal);

    setTimeout(() => petal.remove(), 12000);
  }, 400);
}

function stopFallingFlowers() {
  if (flowerInterval) {
    clearInterval(flowerInterval);
    flowerInterval = null;
  }
  
  // Remove existing petals
  document.querySelectorAll(".petal").forEach(petal => petal.remove());
}

// Falling hearts for celebration
function startFallingHearts() {
  if (heartInterval) return;

  heartInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = ["❤️", "💕", "💖", "💗", "💓"][Math.floor(Math.random() * 5)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 28 + Math.random() * 24 + "px";
    heart.style.animationDuration = 4 + Math.random() * 4 + "s";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 8000);
  }, 300);
}

function stopFallingHearts() {
  if (heartInterval) {
    clearInterval(heartInterval);
    heartInterval = null;
  }
  
  // Remove existing hearts
  document.querySelectorAll(".heart").forEach(heart => heart.remove());
}

// Fireworks effect
function startFireworks() {
  const colors = ['#ff6b9d', '#ffa07a', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  
  const createFirework = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.5);
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "firework";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 100 + Math.random() * 100;
      const xVel = Math.cos(angle) * velocity;
      const yVel = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--x', xVel + 'px');
      particle.style.setProperty('--y', yVel + 'px');
      particle.style.animation = 'fireworkExplode 1s ease-out forwards';
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  };
  
  // Create initial burst
  for (let i = 0; i < 3; i++) {
    setTimeout(createFirework, i * 200);
  }
  
  // Continue creating fireworks
  window.fireworkInterval = setInterval(createFirework, 1500);
}

function stopFireworks() {
  if (window.fireworkInterval) {
    clearInterval(window.fireworkInterval);
    window.fireworkInterval = null;
  }
  
  // Remove existing fireworks
  document.querySelectorAll(".firework").forEach(fw => fw.remove());
}