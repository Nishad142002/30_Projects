const circle = document.querySelector(".circle");

window.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--top", `${e.clientY - 10}px`);
  document.documentElement.style.setProperty("--left", `${e.clientX - 10}px`);
});
