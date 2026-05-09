console.log("my-edoc.com loaded successfully");

// Contact form notification
const contactForm = document.querySelector(".contact-form");

if(contactForm){

  contactForm.addEventListener("submit", function(e){

    e.preventDefault();

    alert("Thank you! Your message has been sent.");

  });

}