const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const password = form.password.value;

  try {
    const res = await api.post("/auth/signup", {
      name,
      email,
      phone,
      password,
    });

    alert("Signup successful");

    // save token
    localStorage.setItem("token", res.data.token);

    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
});
