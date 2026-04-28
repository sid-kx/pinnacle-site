import { supabase } from "./supabase-config.js";

(() => {
  console.log("contact-form.js loaded with Supabase");

  const revealItems = document.querySelectorAll(".reveal-on-scroll");

  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 30}ms`;
      observer.observe(item);
    });
  }

  const contactForm = document.getElementById("contactInquiryForm");
  const contactSuccessState = document.getElementById("contactSuccessState");
  const contactReset = document.getElementById("contactReset");

  if (!contactForm) {
    console.error("contactInquiryForm not found");
    return;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");

    const submission = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      intent: document.getElementById("contactIntent").value,
      message: document.getElementById("contactMessage").value.trim(),
      source_site: window.location.hostname || "pinnaclerealty.ca",
      destination_email: "jag@pinnaclerealty.ca",
      type: "contact_inquiry",
      status: "new"
    };

    if (!submission.name || !submission.email || !submission.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const { error } = await supabase
        .from("contact_submissions")
        .insert([submission]);

      if (error) throw error;

      contactForm.reset();
      contactSuccessState?.classList.add("is-visible");

      console.log("Contact submission saved to Supabase.");
    } catch (error) {
      console.error("Supabase contact form error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Inquiry";
    }
  });

  contactReset?.addEventListener("click", () => {
    window.setTimeout(() => {
      contactSuccessState?.classList.remove("is-visible");
    }, 0);
  });
})();