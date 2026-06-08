const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("messageError").textContent = "";
    document.getElementById("successMessage").textContent = "";

    let isValid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "") {
        document.getElementById("nameError").textContent =
            "Name is required";
        isValid = false;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        document.getElementById("emailError").textContent =
            "Email is required";
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent =
            "Enter a valid email";
        isValid = false;
    }

    if (message === "") {
        document.getElementById("messageError").textContent =
            "Message is required";
        isValid = false;
    }

    if (isValid) {
        document.getElementById("successMessage").textContent =
            "Form submitted successfully!";
        form.reset();
    }
});