const toggleSwitch = document.querySelector("#toggle");
const lightMode = () => {
  document.body.style.backgroundColor = "#fafafa";
  document.body.style.color = "#333";
};
const darkMode = () => {
  document.body.style.backgroundColor = "#2d2d2d";
  document.body.style.color = "#fafafa";
};

toggleSwitch.addEventListener("change", (e) => {
  if (e.target.checked) {
    darkMode();
  } else {
    lightMode();
  }
});
