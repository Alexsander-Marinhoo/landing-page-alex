import Lenis from 'lenis';

// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// Animation loop for Lenis
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Anchor Links Smooth Scrolling using Lenis scrollTo
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        lenis.scrollTo(target, {
          offset: -80, // Offset for sticky header
          duration: 1.2,
          immediate: false
        });
      }
    }
  });
});

// 3. Entry Animations via IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters fully
  threshold: 0.1, // Trigger when 10% visible
};

const animationObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add the visibility trigger class
      entry.target.classList.add('reveal-visible');
      // Stop observing after animating once to prevent repeats on scroll up/down
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all element entries matching animation classes
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((element) => {
  animationObserver.observe(element);
});

// 4. Hero Atmosphere mouse hover parallax effect
const heroSection = document.querySelector('section');
if (heroSection) {
  const glow = heroSection.querySelector('.bg-primary\\/10');
  if (glow) {
    heroSection.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
      (glow as HTMLElement).style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }
}

// 5. Portfolio Stack Carousel
const cards = document.querySelectorAll('.portfolio-card') as NodeListOf<HTMLElement>;
const nextBtns = document.querySelectorAll('.next-card-btn');
const prevBtns = document.querySelectorAll('.prev-card-btn');

let isAnimating = false;
let cardOrder = [0, 1, 2, 3, 4];

function updateStack() {
  const width = window.innerWidth;
  const isMobile = width < 768;
  
  let scaleX = 1.0;
  if (width < 1600) {
    scaleX = 0.3 + (width - 360) * (0.7 / 1240);
  }
  scaleX = Math.min(1.0, Math.max(0.3, scaleX));

  const scaleY = scaleX;
  const scaleZ = scaleX;
  const scaleR = isMobile ? 0.55 : 1.0;

  cards.forEach((card) => {
    const idx = parseInt(card.getAttribute('data-index') || '0', 10);
    const posInOrder = cardOrder.indexOf(idx);

    let pos = 0;
    if (posInOrder === 0) pos = 0;
    else if (posInOrder === 1) pos = 1;
    else if (posInOrder === 2) pos = 2;
    else if (posInOrder === 3) pos = -2;
    else if (posInOrder === 4) pos = -1;

    let tx = 0;
    let ty = 0;
    let tz = 0;
    let ry = 0;
    let rz = 0;
    let zIndex = 10;
    let opacity = 1;

    if (pos === 0) {
      tx = 0;
      ty = isMobile ? -20 : -50;
      tz = 60 * scaleZ;
      ry = 0;
      rz = 0;
      zIndex = 40;
      opacity = 1;
      card.style.pointerEvents = 'auto';
    } else if (pos === 1) {
      tx = 300 * scaleX;
      ty = isMobile ? 25 * scaleY : 60;
      tz = -80 * scaleZ;
      ry = -15 * scaleR;
      rz = 6 * scaleR;
      zIndex = 30;
      opacity = 0.95;
      card.style.pointerEvents = 'none';
    } else if (pos === -1) {
      tx = -300 * scaleX;
      ty = isMobile ? 25 * scaleY : 60;
      tz = -80 * scaleZ;
      ry = 15 * scaleR;
      rz = -6 * scaleR;
      zIndex = 30;
      opacity = 0.95;
      card.style.pointerEvents = 'none';
    } else if (pos === 2) {
      tx = 580 * scaleX;
      ty = isMobile ? 65 * scaleY : 140;
      tz = -200 * scaleZ;
      ry = -30 * scaleR;
      rz = 12 * scaleR;
      zIndex = 20;
      opacity = 0.65;
      card.style.pointerEvents = 'none';
    } else if (pos === -2) {
      tx = -580 * scaleX;
      ty = isMobile ? 65 * scaleY : 140;
      tz = -200 * scaleZ;
      ry = 30 * scaleR;
      rz = -12 * scaleR;
      zIndex = 20;
      opacity = 0.65;
      card.style.pointerEvents = 'none';
    }

    card.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    card.style.zIndex = zIndex.toString();
    card.style.opacity = opacity.toString();
  });
}

window.addEventListener('resize', () => {
  if (cards.length > 0) {
    updateStack();
  }
});

function nextCard() {
  if (isAnimating) return;
  isAnimating = true;

  const width = window.innerWidth;
  let scaleX = 1.0;
  if (width < 1600) {
    scaleX = 0.3 + (width - 360) * (0.7 / 1240);
  }
  scaleX = Math.min(1.0, Math.max(0.3, scaleX));
  const scaleY = scaleX;

  const activeCardIndex = cardOrder[0];
  const activeCard = Array.from(cards).find(
    (c) => parseInt(c.getAttribute('data-index') || '0', 10) === activeCardIndex
  );

  if (activeCard) {
    activeCard.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
    activeCard.style.transform = `translate3d(${-350 * scaleX}px, ${-120 * scaleY}px, 80px) rotateY(35deg) rotateZ(-20deg)`;
    activeCard.style.opacity = '0';
    activeCard.style.zIndex = '50';
  }

  const thrown = cardOrder.shift();
  if (thrown !== undefined) {
    cardOrder.push(thrown);
  }

  setTimeout(() => {
    cards.forEach((card) => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      if (idx !== activeCardIndex) {
        card.style.transition = 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.75s ease';
      }
    });
    updateStack();
  }, 80);

  setTimeout(() => {
    if (activeCard) {
      activeCard.style.transition = 'none';
      updateStack();
    }
    isAnimating = false;
  }, 600);
}

function prevCard() {
  if (isAnimating) return;
  isAnimating = true;

  const width = window.innerWidth;
  let scaleX = 1.0;
  if (width < 1600) {
    scaleX = 0.3 + (width - 360) * (0.7 / 1240);
  }
  scaleX = Math.min(1.0, Math.max(0.3, scaleX));
  const scaleY = scaleX;

  const activeCardIndex = cardOrder[0];
  const activeCard = Array.from(cards).find(
    (c) => parseInt(c.getAttribute('data-index') || '0', 10) === activeCardIndex
  );

  if (activeCard) {
    activeCard.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
    activeCard.style.transform = `translate3d(${350 * scaleX}px, ${-120 * scaleY}px, 80px) rotateY(-35deg) rotateZ(20deg)`;
    activeCard.style.opacity = '0';
    activeCard.style.zIndex = '50';
  }

  const last = cardOrder.pop();
  if (last !== undefined) {
    cardOrder.unshift(last);
  }

  setTimeout(() => {
    cards.forEach((card) => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      if (idx !== activeCardIndex) {
        card.style.transition = 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.75s ease';
      }
    });
    updateStack();
  }, 80);

  setTimeout(() => {
    if (activeCard) {
      activeCard.style.transition = 'none';
      updateStack();
    }
    isAnimating = false;
  }, 600);
}

// Bind Click on fanned cards to navigate directly
cards.forEach((card) => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.getAttribute('data-index') || '0', 10);
    const posInOrder = cardOrder.indexOf(idx);
    
    let pos = 0;
    if (posInOrder === 0) pos = 0;
    else if (posInOrder === 1) pos = 1;
    else if (posInOrder === 2) pos = 2;
    else if (posInOrder === 3) pos = -2;
    else if (posInOrder === 4) pos = -1;

    if (pos === 1) {
      nextCard();
    } else if (pos === 2) {
      nextCard();
      setTimeout(nextCard, 200);
    } else if (pos === -1) {
      prevCard();
    } else if (pos === -2) {
      prevCard();
      setTimeout(prevCard, 200);
    }
  });
});

// Initialize stack positions
if (cards.length > 0) {
  updateStack();
}

nextBtns.forEach((btn) => {
  btn.addEventListener('click', nextCard);
});
prevBtns.forEach((btn) => {
  btn.addEventListener('click', prevCard);
});


