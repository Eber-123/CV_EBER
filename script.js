(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(opened));
      menuButton.setAttribute("aria-label", opened ? "Cerrar menú" : "Abrir menú");
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }


  // Resalta en el menú la sección visible mientras se desplaza la página.
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const navSections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && navSections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    navSections.forEach(section => sectionObserver.observe(section));
  }

  // Animated neural network background; automatically pauses for reduced-motion preferences.
  const canvas = document.getElementById("neural-network");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext("2d");
  let width = 0, height = 0, nodes = [], raf = 0;
  const spacing = 115;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(22, Math.min(75, Math.floor((width * height) / 19000)));
    nodes = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: 1 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2
    }));
  };
  const draw = time => {
    ctx.clearRect(0, 0, width, height);
    nodes.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.phase += .012;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j], dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < spacing) {
          ctx.strokeStyle = `rgba(101,229,224,${(1 - dist / spacing) * .16})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const glow = .5 + Math.sin(p.phase) * .25;
      ctx.fillStyle = `rgba(125,231,225,${glow})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };
  resize();
  raf = requestAnimationFrame(draw);
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); raf = requestAnimationFrame(draw); }, {passive:true});
})();
