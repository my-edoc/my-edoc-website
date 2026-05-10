
/* =========================
   AI AGENCY SCRIPT CORE
========================= */

/* -------------------------
   CONFIG (UPDATE LATER)
--------------------------*/

// Cloudflare Worker endpoint (you will create this later)
const API_ENDPOINT = "https://my-edoc-contact-api.myedocadmin.workers.dev";

/* -------------------------
   FORM HANDLER
--------------------------*/

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("leadForm");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Prevent multiple clicks
    const button = form.querySelector("button");
    button.disabled = true;
    button.innerText = "Sending...";

    // Collect form data
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      service: formData.get("service"),
      message: formData.get("message"),
      website: formData.get("website") // honeypot
    };

    /* =========================
       🛑 SPAM PROTECTION
    ========================= */

    // Honeypot check (bots usually fill hidden fields)
    if (data.website && data.website.length > 0) {
      console.log("Spam detected - blocked");
      button.innerText = "Blocked";
      return;
    }

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      alert("Please fill in all required fields.");
      button.disabled = false;
      button.innerText = "Send Request";
      return;
    }

    try {

      /* =========================
         SEND TO BACKEND (CLOUDFLARE WORKER)
      ========================= */

      // NOTE: This will work once Worker is created
      await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      /* =========================
         SUCCESS UI
      ========================= */

      form.reset();
      button.innerText = "Message Sent ✔";

      setTimeout(() => {
        button.disabled = false;
        button.innerText = "Send Request";
      }, 3000);

      /* =========================
         AUTO WHATSAPP REDIRECT OPTION
      ========================= */

      const whatsappMessage =
        `Hi, my name is ${data.name}. I need ${data.service}. ` +
        `My message: ${data.message}`;

      const whatsappURL =
        `https://wa.me/34613946227?text=${encodeURIComponent(whatsappMessage)}`;

      // Optional: open WhatsApp after submission
      setTimeout(() => {
        window.open(whatsappURL, "_blank");
      }, 1500);

    } catch (error) {

      console.error("Submission error:", error);

      alert("Something went wrong. Please try again later.");

      button.disabled = false;
      button.innerText = "Send Request";
    }

  });

});