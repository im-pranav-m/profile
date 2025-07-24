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
