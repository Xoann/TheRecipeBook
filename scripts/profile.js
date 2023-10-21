const urlParams = new URLSearchParams(window.location.search);
const profile = urlParams.get("user");

document.getElementById("name").textContent = profile;
