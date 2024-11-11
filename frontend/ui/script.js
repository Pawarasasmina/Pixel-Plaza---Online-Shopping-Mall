document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const loginButton = document.getElementById("login");
  const registerButton = document.getElementById("register");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }

  if (registerButton) {
    registerButton.addEventListener("click", () => {
      container.classList.add("active");
    });
  }
});
