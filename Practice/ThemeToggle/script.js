let main = document.querySelector(".main");

function setTheme(theme) {
  if (theme === "light") {
    main.classList.remove("dark");
    main.classList.add("light");
  } else {
    main.classList.remove("light");
    main.classList.add("dark");
  }

  localStorage.setItem("theme", theme);
}

function setDefaultTheme() {
  let theme = localStorage.getItem("theme");
  if (theme) {
    setTheme(theme);
    return;
  }

  const isLightMode = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  if (isLightMode) {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}
setDefaultTheme();

function toggleTheme() {
  if (main.classList.contains("light")) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

document.querySelector(".toggle-btn").addEventListener("click", toggleTheme);

function progressBar() {
  let progressBar = document.querySelector(".progress-bar");
  let progressPer = document.querySelector(".progress");
  let progressBtn = document.querySelector(".donwload-btn");
  let count = 0;
  let progress = setInterval(function () {
    if (count <= 100) {
      progressBar.style.width = `${count}%`;
      progressPer.textContent = `${count}%`;
      progressBtn.textContent = `Downloading ${count}%`;
      count++;
    } else {
      progressBtn.textContent = "Downloaded !";
      clearInterval(progress);
      setTimeout(() => {
        progressBtn.textContent = "Download";
        progressBar.style.width = "0%";
        progressPer.textContent = "0%";
      }, 3000);
    }
  }, 40);
}

document.querySelector(".donwload-btn").addEventListener("click", progressBar);
