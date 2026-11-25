(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector("#site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      menuCards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        const show = filter === "all" || category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index % 4, 3) * 80 + "ms";
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  const form = document.querySelector("#contact-form");
  if (!form) return;

  const fields = {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    message: document.querySelector("#message"),
  };

  const errors = {
    name: document.querySelector("#name-error"),
    email: document.querySelector("#email-error"),
    phone: document.querySelector("#phone-error"),
    message: document.querySelector("#message-error"),
  };

  const status = document.querySelector("#form-status");

  function setError(key, message) {
    errors[key].hidden = !message;
    errors[key].textContent = message || "";
    fields[key].setAttribute("aria-invalid", message ? "true" : "false");
  }

  function clearErrors() {
    Object.keys(errors).forEach(function (key) {
      setError(key, "");
    });
    status.textContent = "";
    status.className = "form-status";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();
    const message = fields.message.value.trim();
    let valid = true;

    if (!name) {
      setError("name", "Please enter your full name.");
      valid = false;
    }

    if (!email) {
      setError("email", "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!phone) {
      setError("phone", "Please enter your phone number.");
      valid = false;
    } else if (!/^\d{11}$/.test(phone)) {
      setError("phone", "Phone number must contain exactly 11 digits.");
      valid = false;
    }

    if (!message) {
      setError("message", "Please enter a short message.");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Please fix the errors above and try again.";
      status.classList.add("error");
      return;
    }

    status.textContent =
      "Thanks! Your demo enquiry looks valid. Nothing was emailed or saved — this is a front-end demonstration only.";
    status.classList.add("success");
    form.reset();
  });
})();
