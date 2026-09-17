/* =========================================================
   NEXORA AI — SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
  ======================================================= */

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  const openStudio = document.getElementById("openStudio");
  const heroStudio = document.getElementById("heroStudio");
  const finalStudio = document.getElementById("finalStudio");
  const mobileStudio = document.getElementById("mobileStudio");

  const studioModal = document.getElementById("studioModal");
  const closeStudio = document.getElementById("closeStudio");

  const promptInput = document.getElementById("promptInput");
  const sendPrompt = document.getElementById("sendPrompt");
  const terminalResult = document.getElementById("terminalResult");

  const studioInput = document.getElementById("studioInput");
  const studioSend = document.getElementById("studioSend");
  const studioOutput = document.getElementById("studioOutput");

  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  if (menuButton) {

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

  }

  document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });

  });


  /* =======================================================
     STUDIO MODAL
  ======================================================= */

  function openStudioModal() {

    studioModal.classList.add("open");

    document.body.style.overflow = "hidden";

    setTimeout(() => {

      if (studioInput) {
        studioInput.focus();
      }

    }, 300);

  }


  function closeStudioModal() {

    studioModal.classList.remove("open");

    document.body.style.overflow = "";

  }


  [openStudio, heroStudio, finalStudio, mobileStudio]
    .filter(Boolean)
    .forEach(button => {

      button.addEventListener("click", () => {

        mobileMenu?.classList.remove("open");

        openStudioModal();

      });

    });


  closeStudio?.addEventListener("click", closeStudioModal);


  /* Click outside modal */

  studioModal?.addEventListener("click", event => {

    if (event.target === studioModal) {
      closeStudioModal();
    }

  });


  /* ESC */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      if (studioModal?.classList.contains("open")) {
        closeStudioModal();
      }

      mobileMenu?.classList.remove("open");

    }

  });


  /* =======================================================
     TERMINAL PLAYGROUND
  ======================================================= */

  function runTerminalPrompt() {

    const prompt = promptInput.value.trim();

    if (!prompt) {

      terminalResult.classList.add("show");

      terminalResult.innerHTML =
        "Please enter a command first.";

      return;

    }


    terminalResult.classList.add("show");

    terminalResult.innerHTML = `
      <span style="color:#00e5ff;">
        NEXORA //
      </span>
      Processing request...
    `;


    setTimeout(() => {

      terminalResult.innerHTML = `
        <span style="color:#00e5ff;">
          NEXORA //
        </span>
        <br><br>

        Request received:
        <strong>"${escapeHTML(prompt)}"</strong>

        <br><br>

        <span style="color:#8d8d99;">
          Neural processing complete.
        </span>

        <br><br>

        This is the NEXORA prototype.
        The real AI engine can be connected later.
      `;

    }, 1200);

  }


  sendPrompt?.addEventListener(
    "click",
    runTerminalPrompt
  );


  promptInput?.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      event.preventDefault();

      runTerminalPrompt();

    }

  });


  /* =======================================================
     STUDIO AI SIMULATION
  ======================================================= */

  function runStudioPrompt() {

    const prompt = studioInput.value.trim();

    if (!prompt) {

      studioOutput.innerHTML = `
        <span class="output-label">
          NEXORA OUTPUT
        </span>

        <p>
          Enter a command to begin.
        </p>
      `;

      return;

    }


    studioOutput.innerHTML = `
      <span class="output-label">
        NEXORA OUTPUT
      </span>

      <p>
        <span style="color:#00e5ff;">
          Processing...
        </span>
      </p>
    `;


    setTimeout(() => {

      studioOutput.innerHTML = `
        <span class="output-label">
          NEXORA OUTPUT
        </span>

        <p>
          Command received successfully.
        </p>

        <p style="margin-top:10px;">
          <strong>Input:</strong>
          ${escapeHTML(prompt)}
        </p>

        <p style="margin-top:15px;color:#8d8d99;">
          Prototype response generated.
          Connect an AI API later to turn this
          workspace into a real AI assistant.
        </p>
      `;

    }, 1200);

  }


  studioSend?.addEventListener(
    "click",
    runStudioPrompt
  );


  studioInput?.addEventListener("keydown", event => {

    if (event.key === "Enter" && event.ctrlKey) {

      runStudioPrompt();

    }

  });


  /* =======================================================
     TOOL CARDS
  ======================================================= */

  const toolCards =
    document.querySelectorAll(".tool-card");


  toolCards.forEach(card => {

    const launch =
      card.querySelector(".tool-launch");


    launch?.addEventListener("click", () => {

      openStudioModal();

      const title =
        card.querySelector("h3")?.textContent || "AI";


      if (studioInput) {

        studioInput.value =
          `Activate ${title} AI`;

      }

    });


    /* Subtle mouse movement */

    card.addEventListener("mousemove", event => {

      if (window.innerWidth <= 900) return;


      const rect =
        card.getBoundingClientRect();


      const x =
        event.clientX - rect.left;


      const y =
        event.clientY - rect.top;


      const rotateX =
        ((y / rect.height) - 0.5) * -5;


      const rotateY =
        ((x / rect.width) - 0.5) * 5;


      card.style.transform =
        `perspective(800px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-8px)`;

    });


    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });


  /* =======================================================
     CUSTOM CURSOR
  ======================================================= */

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let cursorX = mouseX;
  let cursorY = mouseY;


  document.addEventListener("mousemove", event => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (cursorDot) {

      cursorDot.style.left =
        `${mouseX}px`;

      cursorDot.style.top =
        `${mouseY}px`;

    }

  });


  function animateCursor() {

    cursorX +=
      (mouseX - cursorX) * 0.15;

    cursorY +=
      (mouseY - cursorY) * 0.15;


    if (cursor) {

      cursor.style.left =
        `${cursorX}px`;

      cursor.style.top =
        `${cursorY}px`;

    }


    requestAnimationFrame(animateCursor);

  }


  if (window.innerWidth > 600) {
    animateCursor();
  }


  /* Cursor interaction */

  document
    .querySelectorAll("button, a, input, textarea")
    .forEach(element => {

      element.addEventListener("mouseenter", () => {

        if (!cursor) return;

        cursor.style.width = "46px";
        cursor.style.height = "46px";

      });


      element.addEventListener("mouseleave", () => {

        if (!cursor) return;

        cursor.style.width = "30px";
        cursor.style.height = "30px";

      });

    });


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements = document.querySelectorAll(
    ".intro-content, .tool-card, .playground-copy, .terminal, .about-content, .final-cta"
  );


  revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(25px)";

    element.style.transition =
      "opacity 0.8s ease, transform 0.8s ease";

  });


  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform =
              "translateY(0)";

            revealObserver.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(element => {

    revealObserver.observe(element);

  });


  /* =======================================================
     NAVIGATION ACTIVE STATE
  ======================================================= */

  const sections =
    document.querySelectorAll("section[id]");


  const navLinks =
    document.querySelectorAll(".nav-links a");


  const sectionObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          navLinks.forEach(link => {

            link.classList.remove("active");

          });


          const activeLink =
            document.querySelector(
              `.nav-links a[href="#${entry.target.id}"]`
            );


          activeLink?.classList.add("active");

        });

      },
      {
        threshold: 0.45
      }
    );


  sections.forEach(section => {

    sectionObserver.observe(section);

  });


  /* =======================================================
     KEYBOARD SHORTCUT
     CTRL + K / CMD + K
  ======================================================= */

  document.addEventListener("keydown", event => {

    const modifier =
      event.ctrlKey || event.metaKey;


    if (modifier && event.key.toLowerCase() === "k") {

      event.preventDefault();

      openStudioModal();

    }

  });


  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHTML(value) {

    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     STARTUP
  ======================================================= */

  console.log(
    "%c NEXORA AI ",
    "background:#00e5ff;color:#050507;font-weight:bold;padding:8px;"
  );

  console.log(
    "NEXORA system initialized."
  );

});