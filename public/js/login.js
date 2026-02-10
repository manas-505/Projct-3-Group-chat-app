const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = form.identifier.value;
  const password = form.password.value;

  try {
    const res = await api.post("/auth/login", {
      identifier,
      password,
    });

    alert("Login successful");

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.user.name);


    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
});
