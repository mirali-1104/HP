// document.getElementById("contactForm").addEventListener("submit", function(event) {
//     event.preventDefault();

//     const name = document.getElementById("name").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const message = document.getElementById("message").value.trim();
//     const errorMessage = document.getElementById("error-message");
//     const successMessage = document.getElementById("success-message");

//     errorMessage.innerHTML = "";
//     successMessage.innerHTML = "";

//     let isValid = true;

//     const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
//     if (!email.match(emailPattern)) {
//         errorMessage.innerHTML += "<p>Please enter a valid email address.</p>";
//         isValid = false;
//     }


//     const phonePattern = /^[0-9]{10,15}$/;
//     if (!phone.match(phonePattern)) {
//         errorMessage.innerHTML += "<p>Please enter a valid phone number (10-15 digits).</p>";
//         isValid = false;
//     }

//     if (!name || !email || !phone || !message) {
//         errorMessage.innerHTML += "<p>Please fill in all fields.</p>";
//         isValid = false;
//     }

//     if (!isValid) return; 


//     successMessage.innerHTML = "<p>Form Submitted Successfully!</p>";

//     setTimeout(() => {
//         document.getElementById("contactForm").reset();
//         successMessage.innerHTML = "";
//     }, 2000);
// });
