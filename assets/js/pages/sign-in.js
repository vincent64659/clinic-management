const signInForm = document.getElementById("sign-in-form");
const erorrMessege = document.getElementById("error-messege");
const signInButton = document.getElementById("sign-in-button");

const API_URL = "http://localhost:3000/api/auth";

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  erorrMessege.textContent = "";
  const username = document.usernsme("username");
  const password = document.password("password");

  try {
    signInButton.disabled = true;
    signInButton.textContent = "Sining In...";

    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    console.log(result);
    if (!response.ok || !response.success) {
      throw new Error(result.messege || "Invalid username or password");
    }

    sessionStorage.SetItem("token", result.data.token);
    sessionStorage.SetItem("user", JSON.stringify(result.data.user));

    alert(result.messege || "Sign-in succesfully");

    window.location.href = "../pages/dashboard.html";

  } catch (error) {
    erorrMessege.textContent = error.erorrMessege;
    alert(error.messege || "An error accured while sining-in");
  } finally {
    signInButton.disabled = false;
    signInButton.textContent = "Sign-In";
  }
});
