// Header State Management
// Handles scroll behavior and state transitions for the header

(function () {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const header = document.getElementById("main-header");
    if (!header) return;

    // Scroll tracking variables
    let lastScrollY = window.scrollY;
    let scrollAccumulator = 0;
    let ticking = false;

    // Programmatic scroll tracking
    let isProgrammaticScroll = false;
    let scrollEndTimeout = null;

    function startProgrammaticScroll() {
      isProgrammaticScroll = true;
      clearTimeout(scrollEndTimeout);
      // Fallback timeout in case scrollend doesn't fire (older browsers)
      scrollEndTimeout = setTimeout(() => {
        isProgrammaticScroll = false;
      }, 2000);
    }

    function endProgrammaticScroll() {
      isProgrammaticScroll = false;
      clearTimeout(scrollEndTimeout);
      // Reset accumulator to prevent immediate hiding after programmatic scroll
      scrollAccumulator = 0;
      // Reset lastScrollY to prevent spurious state changes from residual scroll events
      lastScrollY = window.scrollY;
    }

    // Update header visibility and state based on scroll
    function updateHeader() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (scrollDelta > 0) {
        // Scrolling down - accumulate distance
        scrollAccumulator += scrollDelta;

        // Only hide header if NOT during programmatic scroll
        if (scrollAccumulator >= 100 && !isProgrammaticScroll) {
          // Hide header after 100px of downward scroll
          header.style.transform = "translateY(-100%)";
        }
      } else if (scrollDelta < 0) {
        // Scrolling up - show header immediately and reset
        header.style.transform = "translateY(0)";
        scrollAccumulator = 0;

        // Only update state if NOT during programmatic scroll
        if (!isProgrammaticScroll) {
          // Set scrolled-up state when past 100px (applies to both mobile and desktop)
          if (currentScrollY > 100) {
            header.setAttribute("data-header-state", "scrolled-up");
          } else if (currentScrollY <= 100) {
            // At top of page, return to default
            header.setAttribute("data-header-state", "default");
          }
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    // Throttle scroll events with requestAnimationFrame
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    // Setup scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Detect when smooth scroll completes
    window.addEventListener("scrollend", endProgrammaticScroll, { passive: true });

    // Detect manual scroll initiation - user interrupted programmatic scroll
    function onManualScrollStart() {
      if (isProgrammaticScroll) {
        endProgrammaticScroll();
      }
    }

    window.addEventListener("wheel", onManualScrollStart, { passive: true });
    window.addEventListener("touchstart", onManualScrollStart, { passive: true });

    // Initialize state on load based on current scroll position
    if (window.scrollY <= 100) {
      header.setAttribute("data-header-state", "default");
    } else {
      header.setAttribute("data-header-state", "scrolled-up");
    }

    // Click handlers for desktop navigation
    const desktopNavLinks = document.querySelectorAll(".desktop-nav-link");
    const contactLink = document.querySelector(".contact-link");

    // Non-contact nav links - return to default state and make header visible
    desktopNavLinks.forEach((link) => {
      if (!link.classList.contains("contact-link")) {
        link.addEventListener("click", () => {
          header.setAttribute("data-header-state", "default");
          header.style.transform = "translateY(0)";
          scrollAccumulator = 0;
          startProgrammaticScroll();
        });
      }
    });

    // Contact link - set contact-active state and make header visible
    if (contactLink) {
      contactLink.addEventListener("click", () => {
        header.setAttribute("data-header-state", "contact-active");
        header.style.transform = "translateY(0)";
        scrollAccumulator = 0;
        startProgrammaticScroll();
      });
    }
  }
})();
