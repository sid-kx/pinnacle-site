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
      destination_email: "marketing@pinnaclerealty.ca",
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

      const { error: emailError, data: emailData } = await supabase.functions.invoke("send-contact-email", {
        body: submission
      });

      console.log("Email function response:", emailData);
      console.log("Email function error:", emailError);

      if (emailError) {
        console.error("Email notification error:", emailError);
      }

      try {
        const zapierResponse = await fetch("https://hooks.zapier.com/hooks/catch/27658537/4odf62l/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            intent: submission.intent,
            message: submission.message,
            source_site: submission.source_site,
            lead_source: "Pinnacle Realty Website",
            type: submission.type,
            status: submission.status,
            submitted_at: new Date().toISOString()
          })
        });

        console.log("Zapier webhook response:", zapierResponse.status);
      } catch (zapierError) {
        console.error("Zapier webhook error:", zapierError);
      }

      contactForm.reset();
      contactSuccessState?.classList.add("is-visible");

      console.log("Contact submission saved to Supabase and email notification requested.");
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