// === Cursor-Web Dots Background ===
const canvas = document.getElementById("dots-bg");
const ctx = canvas.getContext("2d");

const dotDensity = 0.001;
const minRadius = 1;
const maxRadius = 3;
const connectionDistance = 100;

const dotColors = [
  "rgba(255, 255, 255, 0.2)",   // soft white
  "rgba(91, 149, 255, 0.15)"    // soft blue
];

let dots = [];
let mouse = { x: -1000, y: -1000 };

// Detect if device is touch-based
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Wandering motion variables
let wanderTarget = { x: canvas.width / 2, y: canvas.height / 2 };
let wanderActive = isTouchDevice;
let wanderTimer = 0;
let nextTarget = generateWanderTarget();
let pause = false;

function generateDots() {
  dots = [];
  const area = canvas.width * canvas.height;
  const dotCount = Math.floor(area * dotDensity);

  for (let i = 0; i < dotCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const color = dotColors[Math.floor(Math.random() * dotColors.length)];

    dots.push({ x, y, radius, color });
  }
}

function brightenColor(rgba, brightnessMultiplier = 2.5) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d?.?\d*)?\)/);
  if (!match) return rgba;

  let [_, r, g, b, a] = match;
  r = Math.min(255, parseInt(r));
  g = Math.min(255, parseInt(g));
  b = Math.min(255, parseInt(b));
  a = a === undefined || a === "" ? 1 : Math.min(1, parseFloat(a) * brightnessMultiplier);

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Wander motion logic
  if (wanderActive) {
    if (!pause) {
      let dx = nextTarget.x - wanderTarget.x;
      let dy = nextTarget.y - wanderTarget.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2) {
        pause = true;
        setTimeout(() => {
          nextTarget = generateWanderTarget();
          pause = false;
        }, 800 + Math.random() * 1200); // Pause 0.8–2s
      } else {
        wanderTarget.x += dx * 0.02;
        wanderTarget.y += dy * 0.02;
      }
    }

    mouse.x = wanderTarget.x;
    mouse.y = wanderTarget.y;
  }

  for (let dot of dots) {
    const dx = mouse.x - dot.x;
    const dy = mouse.y - dot.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < connectionDistance) {
      const glowColor = brightenColor(dot.color, 3.5);
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius + 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
      ctx.fillStyle = dot.color;
      ctx.shadowBlur = 0;
      ctx.fill();
    }
  }

  requestAnimationFrame(drawScene);
}

function generateWanderTarget() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
}

function resizeCanvas() {
  const section = document.querySelector(".about-section");
  const rect = section.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  generateDots(); // or your equivalent dot setup
}



window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
  resizeCanvas();
  drawScene();
});

if (!isTouchDevice) {
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
}


// === Stats Counter Animation ===
const counters = document.querySelectorAll('.count');
let started = false;

function animateCounters() {
  if (started) return;
  started = true;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let current = 0;
    const increment = Math.ceil(target / 100);

    const updateCount = () => {
      current += increment;
      if (current < target) {
        counter.innerText = formatNumber(current);
        setTimeout(updateCount, 100);
      } else {
        counter.innerText = formatNumber(target);
      }
    };

    updateCount();
  });
}

function formatNumber(num) {
  return num >= 1000 ? (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k' : num;
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) animateCounters();
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('#stats'));


// === SVG Arc Animation ===
const svg = document.getElementById('animatedBorder');
const cx = 135, cy = 135, r = 130;
const totalArcs = 30;

for (let i = 0; i < totalArcs; i++) {
  const startAngle = Math.random() * 360;
  const arcLength = 20 + Math.random() * 20;

  const x1 = cx + r * Math.cos((Math.PI / 180) * startAngle);
  const y1 = cy + r * Math.sin((Math.PI / 180) * startAngle);

  const x2 = cx + r * Math.cos((Math.PI / 180) * (startAngle + arcLength));
  const y2 = cy + r * Math.sin((Math.PI / 180) * (startAngle + arcLength));

  const largeArcFlag = arcLength > 180 ? 1 : 0;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  path.setAttribute("d", d);
  path.setAttribute("class", "arc");

  const totalLength = path.getTotalLength();
  path.style.strokeDasharray = `0 ${totalLength}`;
  path.style.strokeDashoffset = `${totalLength / 2}`;

  path.animate([
    { strokeDasharray: `0 ${totalLength}`, strokeDashoffset: `${totalLength/2}` },
    { strokeDasharray: `${totalLength} 0`, strokeDashoffset: `0` },
    { strokeDasharray: `0 ${totalLength}`, strokeDashoffset: `${totalLength/2}` }
  ], {
    duration: 3000 + Math.random() * 4000,
    iterations: Infinity,
    direction: "alternate",
    delay: Math.random() * 1000,
    easing: "ease-in-out"
  });

  svg.appendChild(path);
}


// === Age Calculation ===
const birthDate = new Date(2008, 1, 21);
const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();
const hasHadBirthday =
  today.getMonth() > birthDate.getMonth() ||
  (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

if (!hasHadBirthday) {
  age--;
}

document.getElementById("age").textContent = age;


// === Wiggle Path Animation ===
function generateRandomWigglePath({
  startX = 5,
  endX = 195,
  segments = 6,
  baseY = 20,
  amplitude = 5
} = {}) {
  const segmentLength = (endX - startX) / segments;
  let d = `M${startX} ${baseY} `;
  let x = startX;

  for (let i = 0; i < segments; i++) {
    const cp1y = baseY + (Math.random() * 2 - 1) * amplitude;
    const cp2y = baseY + (Math.random() * 2 - 1) * amplitude;
    const nextX = x + segmentLength;
    d += `C${x + segmentLength / 3} ${cp1y.toFixed(1)}, ${x + 2 * segmentLength / 3} ${cp2y.toFixed(1)}, ${nextX} ${baseY} `;
    x = nextX;
  }

  return d.trim();
}

function updatePath() {
  const path = document.querySelector(".underline-svg path");
  const newD = generateRandomWigglePath();
  path.setAttribute("d", newD);
}

updatePath();

const pathElement = document.querySelector(".underline-svg path");
pathElement.addEventListener("animationiteration", updatePath);


// === Dynamic Typing Text ===
const words = [
  "Tech Enthusiast.",
  "Developer.",
  "Designer.",
  "Embedded System Dev",
  "3D Artist.",
  "Video Editor.",
  "Blender Creator.",
  "VibeCoder.",
  "Electronics Tinkerer.",
  "Drone Pilot."
];

const dynamicText = document.querySelector(".dynamic-text");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let pauseBetweenWords = 1500;

function typeEffect() {
  const currentWord = words[wordIndex];
  const visibleText = currentWord.slice(0, charIndex);
  dynamicText.textContent = visibleText;

  if (!isDeleting) {
    if (charIndex < currentWord.length) {
      charIndex++;
    } else {
      isDeleting = true;
      setTimeout(typeEffect, pauseBetweenWords);
      return;
    }
  } else {
    if (charIndex > 0) {
      charIndex--;
    } else {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 50 : typingSpeed);
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelector(".page-content").style.opacity = 1;
    typeEffect();
  }, 1000);
});