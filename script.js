/* =============================================
   PORTFOLIO — JAVASCRIPT
   Faisal N | Full Stack Developer
   ============================================= */

"use strict";

/* ================================
   PARTICLE CANVAS
   ================================ */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? "#00e5ff" : "#7c3aed";
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = "#00e5ff";
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ================================
   CURSOR GLOW
   ================================ */
const cursorGlow = document.getElementById("cursorGlow");
let mouseX = -999, mouseY = -999;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.left = mouseX + "px";
  cursorGlow.style.top = mouseY + "px";
});

/* ================================
   NAVBAR — Scroll + Active Link
   ================================ */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active nav link
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) {
      current = s.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* ================================
   HAMBURGER MENU
   ================================ */
const hamburger = document.getElementById("hamburger");
const navLinksMenu = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinksMenu.classList.toggle("open");
});

navLinksMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinksMenu.classList.remove("open");
  });
});

/* ================================
   ROLE CYCLER (Typewriter Effect)
   ================================ */
const roles = [
  "Web Applications",
  "React Frontends",
  "Node.js APIs",
  "MERN Stack Apps",
  "Scalable Systems",
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const roleEl = document.getElementById("roleCycle");

function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    roleEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      setTimeout(() => { deleting = true; typeRole(); }, 2200);
      return;
    }
  } else {
    roleEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 60 : 90);
}
typeRole();

/* ================================
   SCROLL REVEAL
   ================================ */
const revealEls = document.querySelectorAll(
  ".section-header, .section-subtitle, .about-text, .about-details, .stat-card, .bento-card, .skills-marquee-wrapper, .skills-filter-nav, .timeline-item, .project-card, .edu-card, .contact-info, .contact-form"
);

revealEls.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ================================
   SKILLS BENTO — FILTER TABS
   ================================ */
const filterBtns = document.querySelectorAll(".skill-filter-btn");
const bentoCards = document.querySelectorAll(".bento-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    const bentoGrid = document.querySelector(".skills-bento-grid");

    if (bentoGrid) {
      if (filter === "all") {
        bentoGrid.classList.remove("single-view");
      } else {
        bentoGrid.classList.add("single-view");
      }
    }

    bentoCards.forEach((card) => {
      const cat = card.getAttribute("data-category") || "";
      if (filter === "all" || cat.includes(filter)) {
        card.classList.remove("filter-hidden");
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        setTimeout(() => {
          card.style.transition = "all 0.35s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 30);
      } else {
        card.classList.add("filter-hidden");
      }
    });
  });
});

/* ================================
   SKILLS BENTO — CURSOR SPOTLIGHT
   ================================ */
bentoCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", x + "px");
    card.style.setProperty("--mouse-y", y + "px");
  });
});

/* ================================
   RADIAL PROFICIENCY RINGS ANIMATION
   ================================ */
const ringProgressEls = document.querySelectorAll(".ring-progress");
const ringObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // trigger css dashoffset transition
        const dashPct = entry.target.style.getPropertyValue("--dash-pct") || 85;
        const offset = 201 - (201 * dashPct) / 100;
        entry.target.style.strokeDashoffset = offset;
        ringObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
ringProgressEls.forEach((ring) => {
  ring.style.strokeDashoffset = "201";
  ringObserver.observe(ring);
});

/* ================================
   COUNT-UP ANIMATION
   ================================ */
const counters = document.querySelectorAll(".count");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute("data-target");
        let count = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(count);
          }
        }, 16);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => counterObserver.observe(c));

/* ================================
   CONTACT FORM
   ================================ */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const btnText = document.getElementById("btnText");
const btnIcon = document.getElementById("btnIcon");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactFormEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    formNote.textContent = "Please fill in all required fields.";
    formNote.className = "form-note error";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formNote.textContent = "Please enter a valid email address.";
    formNote.className = "form-note error";
    return;
  }

  // Simulate sending
  btnText.textContent = "Sending...";
  btnIcon.style.display = "none";

  await new Promise((r) => setTimeout(r, 1500));

  // Open Gmail web composer directly
  const subject = document.getElementById("contactSubject").value || "Portfolio Inquiry";
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nfaisal712@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  const win = window.open(gmailUrl, "_blank");
  if (!win || win.closed || typeof win.closed === "undefined") {
    // Popup was blocked, fallback to direct location
    window.location.href = gmailUrl;
  }

  btnText.textContent = "Send Message";
  btnIcon.style.display = "";
  formNote.textContent = "Opening Gmail composer with your message pre-filled!";
  formNote.className = "form-note success";
  contactForm.reset();

  setTimeout(() => { formNote.textContent = ""; formNote.className = "form-note"; }, 8000);
});

/* ================================
   SMOOTH SCROLL FOR NAV LINKS
   ================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ================================
   PROJECT CARD — Mouse Tilt Effect
   ================================ */
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 5;
    const ry = ((x - cx) / cx) * -5;
    card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.perspective = "800px";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ================================
   WINDOW RESIZE — REINIT
   ================================ */
window.addEventListener("resize", () => {
  initParticles();
});
