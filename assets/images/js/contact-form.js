// assets/js/contact-form.js

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

(() => {
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

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector("button[type='submit']");

      const formData = {
        name: document.getElementById("contactName").value.trim(),
        email: document.getElementById("contactEmail").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        intent: document.getElementById("contactIntent").value,
        message: document.getElementById("contactMessage").value.trim(),
        sourceSite: window.location.hostname || "pinnaclerealty.vercel.app",
        destinationEmail: "jag@pinnaclerealty.ca",
        type: "contact_inquiry",
        status: "new",
        createdAt: serverTimestamp()
      };

      if (!formData.name || !formData.email || !formData.phone) {
        alert("Please enter your name, email, and phone number.");
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        await addDoc(collection(db, "contactSubmissions"), formData);

        contactForm.reset();
        contactSuccessState?.classList.add("is-visible");
      } catch (error) {
        console.error("Contact form submission error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Inquiry";
      }
    });
  }

  contactReset?.addEventListener("click", () => {
    window.setTimeout(() => {
      contactSuccessState?.classList.remove("is-visible");
    }, 0);
  });
})();