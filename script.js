document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================================
       1. NAVBAR SCROLL EFFECT
       ========================================================================= */
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* =========================================================================
       2. MOBILE MENU TOGGLE
       ========================================================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Create mobile menu based on existing nav links if needed,
  // but right now flex rules hide nav-links on mobile.
  // We'll toggle an active class on nav-links.
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      // For a production site, we would build out a full mobile overlay here.
      // For this design, we'll just toggle display or basic classes.
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.background = "rgba(10, 10, 16, 0.95)";
      navLinks.style.padding = "2rem";
      navLinks.style.backdropFilter = "blur(20px)";
      navLinks.style.borderBottom = "1px solid var(--border-glass)";
      navLinks.style.gap = "1.5rem";
    });
  }

  /* =========================================================================
       3. SMOOTH SCROLLING FOR HASH LINKS
       ========================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Close mobile menu if open
        if (window.innerWidth <= 768 && navLinks) {
          navLinks.style.display = "none";
        }

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =========================================================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================= */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* =========================================================================
       5. ANIMATED NUMBER COUNTERS
       ========================================================================= */
  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimatedStats = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;

          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                stat.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else {
                stat.innerText = target;
              }
            };

            updateCounter();
          });
        }
      });
    },
    { threshold: 0.5 },
  );

  const resultsSection = document.querySelector(".results-section");
  if (resultsSection) {
    statsObserver.observe(resultsSection);
  }

  /* =========================================================================
       6. TESTIMONIAL SLIDER (TRACK-BASED)
       ========================================================================= */
  const track = document.querySelector(".testimonial-slider-track");
  const slides = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (track && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function getVisibleCards() {
      if (window.innerWidth > 1024) return 3;
      if (window.innerWidth > 768) return 2;
      return 1;
    }

    function updateSlider() {
      const visibleCards = getVisibleCards();
      const cardWidth = slides[0].offsetWidth + 32; // card width + margin (2*1rem = 32px)

      // Calculate max slide index to prevent empty space at the end
      const maxIndex = totalSlides - visibleCards;
      if (currentSlide > maxIndex) currentSlide = maxIndex;
      if (currentSlide < 0) currentSlide = 0;

      // Move track
      const offset = -currentSlide * cardWidth;
      track.style.transform = `translateX(${offset}px)`;

      // Update active classes
      slides.forEach((slide, index) => {
        slide.classList.remove("active");
        if (index >= currentSlide && index < currentSlide + visibleCards) {
          slide.classList.add("active");
        }
      });

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.remove("active");
        if (index === currentSlide) {
          dot.classList.add("active");
        }
      });
    }

    function nextSlide() {
      const visibleCards = getVisibleCards();
      if (currentSlide >= totalSlides - visibleCards) {
        currentSlide = 0;
      } else {
        currentSlide++;
      }
      updateSlider();
    }

    function prevSlide() {
      if (currentSlide <= 0) {
        currentSlide = totalSlides - getVisibleCards();
      } else {
        currentSlide--;
      }
      updateSlider();
    }

    prevBtn?.addEventListener("click", prevSlide);
    nextBtn?.addEventListener("click", nextSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
      });
    });

    // Auto slide
    let autoSlideInterval = setInterval(nextSlide, 6000);

    // Pause on hover
    const sliderWrapper = document.querySelector(".testimonial-slider-wrapper");
    sliderWrapper?.addEventListener("mouseenter", () =>
      clearInterval(autoSlideInterval),
    );
    sliderWrapper?.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
    });

    // Initial call & Resize handler
    updateSlider();
    window.addEventListener("resize", updateSlider);
  }

  /* =========================================================================
       7. WORKFLOW TIMELINE ANIMATION
       ========================================================================= */
  const processSection = document.querySelector(".process-section");
  const progressLine = document.querySelector(".progress-line");
  const processStepsNodes = document.querySelectorAll(".process-step");
  let hasAnimatedWorkflow = false;

  if (processSection && progressLine && processStepsNodes.length > 0) {
    const workflowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedWorkflow) {
            hasAnimatedWorkflow = true;

            // Animate line based on screen width
            if (window.innerWidth > 992) {
              progressLine.style.width = "100%";
            } else {
              progressLine.style.height = "100%";
            }

            // Highlight steps with precise intervals (approx 0.6s)
            const stepActivationInterval = 600; // 0.6 seconds per step

            processStepsNodes.forEach((step, index) => {
              setTimeout(
                () => {
                  step.classList.add("active-step");
                },
                (index + 1) * stepActivationInterval,
              ); // Start after first segment fills
            });

            workflowObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    workflowObserver.observe(processSection);
  }

  /* =========================================================================
       8. HERO TYPEWRITER ANIMATION
       ========================================================================= */
  const typewriterText = document.querySelector(".typewriter-text");
  const typewriterCursor = document.querySelector(".typewriter-cursor");
  
  if (typewriterText && typewriterCursor) {
    const words = [
      "Channel", "Content", "Audience", "Community", "Authority", "Growth", "Revenue"
    ];
    let wordIndex = 0;
    let charIndex = words[wordIndex].length;
    let isDeleting = false;
    
    function typeEffect() {
      const currentWord = words[wordIndex];
      let typeSpeed;

      if (isDeleting) {
        typeSpeed = 30 + Math.random() * 20;
        charIndex--;
      } else {
        typeSpeed = 60 + Math.random() * 40;
        charIndex++;
      }

      typewriterText.textContent = currentWord.substring(0, charIndex);

      if (charIndex > 0 && charIndex < currentWord.length) {
          typewriterCursor.classList.remove("blink");
      } else {
          typewriterCursor.classList.add("blink");
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1000 + Math.random() * 500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 200;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(() => {
        isDeleting = true;
        typeEffect();
    }, 1500);
  }

  /* =========================================================================
       9. CONTACT FORM SUBMISSION
       ========================================================================= */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const formError = document.getElementById("formError");
  const submitBtn = contactForm ? contactForm.querySelector(".submit-btn") : null;

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", () => {
      // Toggle loading state while the page redirects
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Redirecting...</span><i class="fa-solid fa-circle-notch fa-spin"></i>';
      // Do not disable button or preventDefault so standard form POST executes
    });
  }
});
