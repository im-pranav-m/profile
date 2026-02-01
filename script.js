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
const birthDate = new Date(2008, 0, 21);
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
  "Image Designer.",
  "Embedded System Dev",
  "Game Dev.",
  "3D Artist.",
  "Video Editor.",
  "Blender Creator.",
  "Learning Coder.",
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

const terminal = document.getElementById("terminal");
const terminalBody = document.getElementById("terminalBody");
const openBtn = document.getElementById("openTerminal");
const closeBtn = document.getElementById("closeTerminal");
const header = document.getElementById("terminalHeader");
let terminalState = "BOOT"; // BOOT | INPUT | BUSY

/* =====================
   OPEN / CLOSE
===================== */

openBtn.onclick = () => {
  terminal.style.display = "block";

  // reset terminal
  terminalBody.innerHTML = "";
  lineIndex = 0;
  charPos = 0;

  typeLine();
};

closeBtn.onclick = () => {
  terminal.style.display = "none";
};

/* =====================
   DRAG LOGIC
===================== */

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - terminal.offsetLeft;
  offsetY = e.clientY - terminal.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  terminal.style.left = e.clientX - offsetX + "px";
  terminal.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

/* =====================
   TERMINAL CONTENT
===================== */

const lines = [
  { text: "", speed: 1, pause: 80 },

  // ASCII → FAST
  { text: "   ██████╗  ██████╗  ███████╗███╗   ███╗██╗ ██████╗", speed: 2, pause: 40 },
  { text: "  ██╔════╝ ██╔═══██╗ ██╔════╝████╗ ████║██║██╔════╝", speed: 2, pause: 40 },
  { text: "  ██║      ██║   ██║ ███████╗██╔████╔██║██║██║", speed: 2, pause: 40 },
  { text: "  ██║      ██║   ██║ ╚════██║██║╚██╔╝██║██║██║", speed: 2, pause: 40 },
  { text: "  ╚██████╗ ╚██████╔╝ ███████║██║ ╚═╝ ██║██║╚██████╗", speed: 2, pause: 40 },
  { text: "   ╚═════╝  ╚═════╝  ╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝", speed: 2, pause: 120 },

  { text: "", speed: 1, pause: 120 },

  // Logs → normal
  { text: "> Booting CosmicOS v2.0...", speed: 18, pause: 300 },
  { text: "> Initializing neural modules...", speed: 16, pause: 300 },
  { text: "> Syncing portfolio data...", speed: 16, pause: 300 },
  { text: "[success] Loading HTML templates...", speed: 0, pause: 1 },
  { text: "[success] Compiling CSS...", speed: 0, pause: 1 },
  { text: "[success] Minifying JS...", speed: 0, pause: 1 },
  { text: "[success] Fetching API data...", speed: 0, pause: 1 },
  { text: "[success] Connecting to WebSocket...", speed: 0, pause: 1 },
  { text: "[success] Initializing React components...", speed: 0, pause: 1 },
  { text: "[success] Hydrating DOM...", speed: 0, pause: 1 },
  { text: "[success] Loading fonts...", speed: 0, pause: 1 },
  { text: "[success] Rendering hero section...", speed: 0, pause: 1 },
  { text: "[success] Applying animations...", speed: 0, pause: 1 },
  { text: "[success] Fetching user session...", speed: 0, pause: 1 },
  { text: "[success] Authenticating OAuth tokens...", speed: 0, pause: 1 },
  { text: "[success] Caching static assets...", speed: 0, pause: 1 },
  { text: "[success] Loading images...", speed: 0, pause: 1 },
  { text: "[success] Initializing sliders...", speed: 0, pause: 1 },
  { text: "[success] Checking responsive layout...", speed: 0, pause: 1 },
  { text: "[success] Setting theme variables...", speed: 0, pause: 1 },
  { text: "[success] Applying dark mode...", speed: 0, pause: 1 },
  { text: "[success] Connecting analytics...", speed: 0, pause: 1 },
  { text: "[success] Loading footer...", speed: 0, pause: 1 },
  { text: "[success] Starting service worker...", speed: 0, pause: 1 },
  { text: "[success] Preloading scripts...", speed: 0, pause: 1 },
  { text: "[success] Mounting modals...", speed: 0, pause: 1 },
  { text: "[success] Checking browser support...", speed: 0, pause: 1 },
  { text: "[success] Initializing notifications...", speed: 0, pause: 1 },
  { text: "[success] Fetching user preferences...", speed: 0, pause: 1 },
  { text: "[success] Connecting CDN...", speed: 0, pause: 1 },
  { text: "[success] Building navigation bar...", speed: 0, pause: 1 },
  { text: "[success] Rendering blog posts...", speed: 0, pause: 1 },
  { text: "[success] Launching website v2.0...", speed: 0, pause: 1 },
  { text: "[success] Initializing API endpoints...", speed: 0, pause: 1 },
  { text: "[success] Loading theme assets...", speed: 0, pause: 1 },
  { text: "[success] Rendering modals...", speed: 0, pause: 1 },
  { text: "[success] Starting background sync...", speed: 0, pause: 1 },
  { text: "[success] Applying cache rules...", speed: 0, pause: 1 },
  { text: "[success] Updating service worker...", speed: 0, pause: 1 },
  { text: "[success] Optimizing images...", speed: 0, pause: 1 },
  { text: "[success] Loading web fonts...", speed: 0, pause: 1 },
  { text: "[success] Initializing analytics dashboard...", speed: 0, pause: 1 },
  { text: "[success] Mounting sidebar components...", speed: 0, pause: 1 },
  { text: "[success] Loading SVG icons...", speed: 0, pause: 1 },
  { text: "[success] Preloading hero images...", speed: 0, pause: 1 },
  { text: "[success] Checking API health...", speed: 0, pause: 1 },
  { text: "[success] Applying JS polyfills...", speed: 0, pause: 1 },
  { text: "[success] Compiling SASS variables...", speed: 0, pause: 1 },
  { text: "[success] Generating sitemap...", speed: 0, pause: 1 },
  { text: "[success] Starting dev server...", speed: 0, pause: 1 },
  { text: "[success] Injecting environment variables...", speed: 0, pause: 1 },
  { text: "[success] Loading favicon...", speed: 0, pause: 1 },
  { text: "[success] Mounting header components...", speed: 0, pause: 1 },
  { text: "[success] Running unit tests...", speed: 0, pause: 1 },
  { text: "[failed] Booting", speed: 0, pause: 1 },
  { text: "[failed] GIT Failed to Tag V2.0", speed: 0, pause: 1 },
  { text: "[error] pathspec 'someNonExistentBranch'", speed: 0, pause: 1 },

  // Dramatic
  { text: "> type 'help' to view all the command", speed: 40, pause: 0 },
  { text: "", speed: 1, pause: 0 }
];


let lineIndex = 0;
let charPos = 0;

/* =====================
   WORD HIGHLIGHTING
===================== */

// Define words you want to color
// Key = word, Value = color
const highlightWords = {
  "success": "rgba(21, 255, 21, 0.62)", // green
  "CosmicOS": "rgba(253, 253, 253, 0.76)", // cyan, for example
  "failed" : "rgba(255, 58, 58, 0.76)",
  "error" : "rgba(255, 134, 28, 0.76)"
  // add more words here as needed
};

/* =====================
   TYPEWRITER
===================== */

function typeLine() {
  if (lineIndex >= lines.length) {
    terminalState = "INPUT";
    showPrompt();
    return;
  }

  const lineData = lines[lineIndex];
  const text = lineData.text;

  if (!terminalBody.children[lineIndex]) {
    const line = document.createElement("div");
    line.style.whiteSpace = "pre";
    terminalBody.appendChild(line);
  }

  const currentLine = terminalBody.children[lineIndex];

  // Add next character
  const nextChar = text[charPos] || "";
  currentLine.innerHTML += nextChar;
  charPos++;

  terminalBody.scrollTop = terminalBody.scrollHeight;

  // Highlight words dynamically
  for (const word in highlightWords) {
    const color = highlightWords[word];
    const regex = new RegExp(`\\b${word}\\b`, "g");
    currentLine.innerHTML = currentLine.innerHTML.replace(
      regex,
      `<span style="color: ${color};">${word}</span>`
    );
  }

  if (charPos >= text.length) {
    charPos = 0;
    lineIndex++;
    setTimeout(typeLine, lineData.pause);
  } else {
    setTimeout(typeLine, lineData.speed);
  }
}


/* =====================
   TERMINAL INPUT
===================== */

let currentInput = "";
let promptLine = null;
let inputSpan = null;
let cursorSpan = null;

/* =====================
   SHOW PROMPT
===================== */

function showPrompt() {
  if (terminalState !== "INPUT") return;

  promptLine = document.createElement("div");
  promptLine.className = "prompt-line";

  const promptSpan = document.createElement("span");
  promptSpan.className = "prompt";

  const userSpan = document.createElement("span");
  userSpan.textContent = "cosmic@";

  const hostSpan = document.createElement("span");
  hostSpan.className = "prompt-host";
  hostSpan.textContent = "portfolio";

  const pathSpan = document.createElement("span");
  pathSpan.textContent = ":~/" + cwd.slice(3).join("/") + " $ ";

  promptSpan.appendChild(userSpan);
  promptSpan.appendChild(hostSpan);
  promptSpan.appendChild(pathSpan);


  inputSpan = document.createElement("span");
  inputSpan.className = "input";

  cursorSpan = document.createElement("span");
  cursorSpan.className = "cursor";
  cursorSpan.textContent = "▊";

  promptLine.appendChild(promptSpan);
  promptLine.appendChild(inputSpan);
  promptLine.appendChild(cursorSpan);

  terminalBody.appendChild(promptLine);
  terminalBody.scrollTop = terminalBody.scrollHeight;

  currentInput = "";
}

/* =====================
   KEYBOARD HANDLER
===================== */

document.addEventListener("keydown", (e) => {
  if (terminalState !== "INPUT") return;

  // Prevent page scrolling, etc.
  e.preventDefault();

  // ENTER → submit command
  if (e.key === "Enter") {
    terminalState = "BUSY";
    cursorSpan.remove();

    const command = currentInput.trim();
    currentInput = "";

    handleCommand(command);

    return;
  }


  // BACKSPACE
  if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    inputSpan.textContent = currentInput;
    return;
  }

  // Ignore control keys
  if (e.key.length !== 1) return;

  // Normal character input
  currentInput += e.key;
  inputSpan.textContent = currentInput;
});

function handleXdgOpen(filename) {
  const dir = getCwdObject();

  const output = document.createElement("div");
  output.className = "terminal-output";

  if (!(filename in dir)) {
    output.textContent = `xdg-open: '${filename}' not found`;
    terminalBody.appendChild(output);
    return;
  }

  // IMAGE
  if (filename.endsWith(".jpg")) {
    output.textContent = `Opening ${filename} with Image Viewer...`;
    terminalBody.appendChild(output);

    const imgWrapper = document.createElement("div");
    imgWrapper.style.marginTop = "8px";

    const img = document.createElement("img");
    img.src = fileUrls[filename];
    img.style.maxWidth = "100%";
    img.style.borderRadius = "6px";
    img.style.boxShadow = "0 0 20px rgba(0,0,0,0.6)";

    imgWrapper.appendChild(img);
    terminalBody.appendChild(imgWrapper);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    return;
  }

  output.textContent = `xdg-open: no application registered for '${filename}'`;
  terminalBody.appendChild(output);
}



const fileUrls = {
  "saucecodes.jpg": "https://i.imgflip.com/4j5564.png",
  "miaBioNotes.jpg": "https://media.tenor.com/y4sm38ArtSwAAAAe/sus-cat.png"
};



function handleCommand(cmd) {
  const output = document.createElement("div");
  output.className = "terminal-output";

  const args = cmd.split(" ").filter(Boolean);
  const base = args[0]?.toLowerCase() || "";

  switch (base) {

    case "help":
    output.innerHTML = `
    <pre>
    Available commands:
      help        show this message
      about       about this terminal
      clear       clear the terminal
      ls          list files
      pwd         print working directory
      whoami      current user
      date        current date & time
      echo        print text
      git         use "git help"
      cat         cat <filename> : to show files
      cd          get into a directory
      xdg-open    open images
    </pre>
    `;

      break;

    case "about":
      output.textContent =
        "CosmicOS v2.0 — interactive portfolio terminal (frontend only).";
      break;

    case "cat":
      const file = args[1];
      const dir = getCwdObject();

      if (!file) {
        output.textContent = "usage: cat <file>";
      } else if (typeof dir[file] === "string") {
        output.innerHTML = `<pre>${dir[file]}</pre>`;
      } else {
        output.textContent = `cat: ${file}: No such file`;
      }
      break;

    case "xdg-open": {
      const file = args[1];
      const dir = getCwdObject();

      if (!file) {
        output.textContent = "usage: xdg-open <file>";
      } else if (file in dir) {
        handleXdgOpen(file);
      } else {
        output.textContent = `xdg-open: '${file}' not found`;
      }
      break;
    }

    case "cd":
      const target = args[1];
      const dir1 = getCwdObject();

      if (!target) break;

      if (target === "..") {
        if (cwd.length > 1) cwd.pop();
      } else if (dir1[target] && typeof dir1[target] === "object") {
        cwd.push(target);
      } else {
        output.textContent = `cd: ${target}: No such directory`;
      }
      break;

    case "clear":
      terminalBody.innerHTML = "";
      terminalState = "INPUT";
      showPrompt();
      return;

    case "ls":
      output.textContent = Object.keys(getCwdObject()).join("  ");
      break;


    case "pwd":
      output.textContent = "/" + cwd.join("/");
      break;


    case "whoami":
      output.textContent = "cosmic";
      break;

    case "date":
      output.textContent = new Date().toString();
      break;

    case "echo":
      output.textContent = args.slice(1).join(" ");
      break;

    case "git":
      handleGitCommand(args.slice(1), output);
      break;

    case "":
      terminalState = "INPUT";
      showPrompt();
      return;
      return;

    default:
      output.textContent = `command not found: ${base}`;
  }

  terminalBody.appendChild(output);
  terminalBody.scrollTop = terminalBody.scrollHeight;
  terminalState = "INPUT";
  showPrompt();

}

function handleGitCommand(args, output) {
  const sub = args[0];

  if (!sub) {
    output.textContent = "git: missing subcommand";
    return;
  }

  switch (sub) {
    case "help":
      output.innerHTML = `
<pre>
Git commands available:

  status          Show the working tree status
  checkout [arg]  Switch branches or restore files
                  (e.g., git checkout a3f9c22)
  log             Show commit logs
  help            Show this help message

Usage examples:
  git status
  git checkout [hash]
  git log
</pre>
      `;
      break;

    case "status":
      output.innerHTML = `
On branch main
nothing to commit, working tree clean
`;
      break;

    case "checkout":
      if (!args[1]) {
        output.textContent = "git checkout: missing branch or commit hash";
      } else {
        const commit = args[1];

        if (commit === "a3f9c22") {
          const newFile = "home.html"; // your new HTML file
          output.textContent = `HEAD is now at ${commit} - switched to '${newFile}'`;

          // Navigate to the new HTML file in the same tab
          window.location.href = `${newFile}`;
        } else {
          output.textContent =
            `error: pathspec '${commit}' did not match any file(s) known to git`;
        }
      }
      break;

    case "log":
      output.innerHTML = `
<pre>
commit a3f9c22 (HEAD -> main)
Author: cosmic
Date:   Thu Jan 28 21:02:00 2069

    Portfolio Version 2

commit a3f9c21 (HEAD -> main)
Author: cosmic
Date:   Thu Jan 18 21:00:00 2026

    Initial portfolio commit
</pre>
`;
      break;

    default:
      output.textContent = `git: '${sub}' is not a git command.`;
  }
}


const fsTree = {
  home: {
    cosmic: {
      portfolio: {
        "aboutme.txt": "Hi, I'm Pranav aka Cosmic! 👋 \nI Love Designing , Tinkering , Editing , Learning",
        "love.txt": "Only Keep b/w you n me <3 \nMy crush is RTX5090. \nPleawse spownswer mew sir ._.",
        projects: {
          "cosmic.html": "Cosmic was not here"
        },
        secrets: {
          "miaBioNotes.jpg" : "",
          "saucecodes.jpg" : ""
        }
      }
    }
  }
};

let cwd = ["home", "cosmic", "portfolio"];

function getCwdObject() {
  return cwd.reduce((dir, key) => dir[key], fsTree);
}



const files = {
  "aboutme.txt": `
Hi, I'm Pranav aka Cosmic! 👋
I'm a student, developer, and lifelong learner.
I love coding, making projects, and solving problems.
`,
  "love.txt": `
Only you can read it!
My Crush is RTX5090
Pleawse spownser me :)
`
};
