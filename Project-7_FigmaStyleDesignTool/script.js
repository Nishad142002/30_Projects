const main = document.querySelector("main");
const themeToggleBtn = document.querySelector(".theamBtn-container");
const canvas = document.getElementById("canvas");
const layersList = document.getElementById("layers-list");
const inputDivs = document.querySelectorAll(".input");
const inputs = document.querySelectorAll(".input input");
const propsElem = document.querySelector(".props-elem");
const deleteElm = document.getElementById("delete-btn");
const expJson = document.getElementById("exp-json");
const expHtml = document.getElementById("exp-html");

let state = {
  elements: [],
  selectedId: null,
};

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let isResizing = false;
let isRotating = false;
let currentHandle = null;

// Adding Element to canvas
function renderCanvas() {
  let rec = 0;
  let text = 0;
  // Clear the canvas to avoid duplicates
  canvas.innerHTML = "";
  layersList.innerHTML = "";

  // Loop through state and create DOM elements
  state.elements.forEach((data) => {
    const el = document.createElement("div");

    el.id = data.id;
    el.className = "canvas-element";

    el.style.width = data.width + "px";
    el.style.height = data.height + "px";
    el.style.left = data.x + "px";
    el.style.top = data.y + "px";
    el.style.backgroundColor = data.bg;
    el.style.position = "absolute";
    el.style.zIndex = data.zIndex;

    if (data.rotation) {
      el.style.transform = `rotate(${data.rotation}deg)`;
    }

    if (data.type === "text") {
      el.innerText = data.text;
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = data.textClr;
    }

    if (!data.visible) {
      el.style.display = "none";
    }

    const layer = document.createElement("div");
    layer.className = "elem";
    layer.id = data.id;
    if (data.type === "text") {
      text = text + 1;
      layer.innerHTML = `<p>Text ${text}</p> <div class="layer-btns"><span>${data.visible ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-close-fill"></i>'}</span> <div class="z-btns"><button class="z-btn" id="z-up"><i class="ri-arrow-up-s-line"></i></button><button class="z-btn" id="z-down"><i class="ri-arrow-down-s-line"></i></button></div></div>`;
    } else {
      rec = rec + 1;
      layer.innerHTML = `<p>Rectangle ${rec}</p> <div class="layer-btns"><span>${data.visible ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-close-fill"></i>'}</span> <div class="z-btns"><button class="z-btn" id="z-up"><i class="ri-arrow-up-s-line"></i></button><button class="z-btn" id="z-down"><i class="ri-arrow-down-s-line"></i></button></div></div>`;
    }

    layer.addEventListener("click", () => {
      state.selectedId = layer.id;
      renderCanvas();
    });

    // Add Selection Indicator
    if (state.selectedId === data.id) {
      el.classList.add("selected");
      el.classList.add("handle");
      layer.classList.add("selected");
      slectedElemInfo(data);
      createCornerHandlers(el);
    }

    layersList.appendChild(layer);
    canvas.appendChild(el);
  });

  if (!state.selectedId) {
    slectedElemInfo();
  }
  const eyeBtns = document.querySelectorAll(".layer-btns span");

  eyeBtns.forEach((eyeBtn) => {
    eyeBtn.addEventListener("click", (e) => {
      const id = e.target.parentElement.parentElement.parentElement.id;
      state.elements.forEach((data) => {
        if (data.id === id) {
          data.visible = !data.visible;
          renderCanvas();
        }
      });
    });
  });
  zIndexHandler();
}

// Z-Index Handler
function zIndexHandler() {
  const zBtns = document.querySelectorAll(".z-btn");
  zBtns.forEach((zbtn) => {
    zbtn.addEventListener("click", (e) => {
      const elData = state.elements.find((el) => el.id === state.selectedId);
      const domEl = document.getElementById(elData.id);
      console.log(elData.id);
      zIdx = elData.zIndex;
      console.log(zIdx);

      if (e.target.parentElement.id === "z-up") {
        console.log("up");

        if (zIdx < state.elements.length) {
          elData.zIndex = zIdx + 1;
          domEl.style.zIndex = elData.zIndex;
        }
      } else {
        console.log("down");
        if (zIdx > 0) {
          elData.zIndex = zIdx - 1;
          domEl.style.zIndex = elData.zIndex;
        }
      }
    });
  });
}

// Adding Corner Reasize Handler
function createCornerHandlers(elem) {
  const corHand1 = document.createElement("div");
  const corHand2 = document.createElement("div");
  const corHand3 = document.createElement("div");
  const corHand4 = document.createElement("div");
  const rotetHand = document.createElement("div");

  corHand1.className = "corner-handler tl";
  corHand2.className = "corner-handler tr";
  corHand3.className = "corner-handler bl";
  corHand4.className = "corner-handler br";
  rotetHand.className = "rotet-handler";

  rotetHand.innerHTML = `<i class="ri-issues-reopen-line"></i>`;
  corHand1.style.top = "-5px";
  corHand1.style.left = "-5px";

  corHand2.style.top = "-5px";
  corHand2.style.right = "-5px";

  corHand3.style.bottom = "-5px";
  corHand3.style.left = "-5px";

  corHand4.style.bottom = "-5px";
  corHand4.style.right = "-5px";

  elem.appendChild(corHand1);
  elem.appendChild(corHand2);
  elem.appendChild(corHand3);
  elem.appendChild(corHand4);
  elem.appendChild(rotetHand);
}

// Updating Size of Element
function handleResize(e) {
  if (!isResizing || !state.selectedId) return;

  const elData = state.elements.find((el) => el.id === state.selectedId);
  const domEl = document.getElementById(elData.id);
  const canvasRect = canvas.getBoundingClientRect();

  const minSize = 20;

  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  const rightEdge = elData.x + elData.width;
  const bottomEdge = elData.y + elData.height;

  // Corner Logic
  if (currentHandle.contains("br")) {
    elData.width = Math.max(minSize, mouseX - elData.x);
    elData.height = Math.max(minSize, mouseY - elData.y);
  } else if (currentHandle.contains("tr")) {
    elData.width = Math.max(minSize, mouseX - elData.x);
    const newHeight = bottomEdge - mouseY;
    if (newHeight > minSize) {
      elData.height = newHeight;
      elData.y = mouseY;
    }
  } else if (currentHandle.contains("bl")) {
    const newWidth = rightEdge - mouseX;
    if (newWidth > minSize) {
      elData.width = newWidth;
      elData.x = mouseX;
    }
    elData.height = Math.max(minSize, mouseY - elData.y);
  } else if (currentHandle.contains("tl")) {
    const newWidth = rightEdge - mouseX;
    const newHeight = bottomEdge - mouseY;

    if (newWidth > minSize) {
      elData.width = newWidth;
      elData.x = mouseX;
    }
    if (newHeight > minSize) {
      elData.height = newHeight;
      elData.y = mouseY;
    }
  }

  domEl.style.width = elData.width + "px";
  domEl.style.height = elData.height + "px";
  domEl.style.left = elData.x + "px";
  domEl.style.top = elData.y + "px";

  slectedElemInfo(elData);
}

// Rotation of Element
function handleRotation(e) {
  if (!isRotating || !state.selectedId) return;
  e.stopPropagation();
  const elData = state.elements.find((el) => el.id === state.selectedId);
  const domEl = document.getElementById(elData.id);
  const rect = domEl.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const radians = Math.atan2(mouseX - centerX, centerY - mouseY);
  const degrees = radians * (180 / Math.PI);

  elData.rotation = degrees;

  domEl.style.transform = `rotate(${degrees}deg)`;
}

// Properties Panel handler
function handlePropertiesPanelInput(e) {
  if (!state.selectedId) return;
  const elData = state.elements.find((el) => el.id === state.selectedId);
  const domEl = document.getElementById(state.selectedId);

  const val = e.target.value;

  if (e.target.id === "elem-width") {
    elData.width = Number(val);
    domEl.style.width = val + "px";
  } else if (e.target.id === "elem-height") {
    elData.height = Number(val);
    domEl.style.height = val + "px";
  } else if (e.target.id === "elem-bgColor") {
    elData.bg = val;
    domEl.style.backgroundColor = val;
  } else if (e.target.id === "elem-text") {
    elData.text = val;

    if (elData.type === "text") {
      domEl.innerText = val;
    }
  } else if (e.target.id === "elem-textColor" && elData.type === "text") {
    elData.textClr = val;
    domEl.style.color = val;
  }
}

// Updating Properties
function slectedElemInfo(data) {
  if (!state.selectedId) {
    inputs[0].value = 0;
    inputs[1].value = 0;
    inputs[2].value = "";
    inputs[3].value = "";

    inputs.forEach((input) => {
      input.disabled = true;
    });

    propsElem.style.opacity = 0.5;

    deleteElm.style.opacity = 0.5;
    deleteElm.disabled = true;

    inputDivs[3].style.opacity = 1;
    inputDivs[4].style.opacity = 1;
  } else {
    inputs.forEach((input) => {
      input.disabled = false;
    });
    propsElem.style.opacity = 1;
    inputs[0].value = data.width;
    inputs[1].value = data.height;
    inputs[2].value = data.bg;
    if (data.type === "text") {
      inputs[3].value = data.text;
      inputs[4].value = data.textClr;
      inputDivs[3].style.opacity = 1;
      inputDivs[4].style.opacity = 1;
    } else {
      inputs[3].disabled = true;
      inputs[4].disabled = true;
      inputs[4].value = "";
      inputDivs[3].style.opacity = 0.5;
      inputDivs[4].style.opacity = 0.5;
    }

    deleteElm.style.opacity = 1;
    deleteElm.disabled = false;
  }
}

// Deleting Element
function deleteSelectedElement() {
  if (!state.selectedId) {
    alert("Please select an element first!");
    return;
  }

  state.elements = state.elements.filter((el) => el.id !== state.selectedId);

  const domEls = document.querySelectorAll(`#${state.selectedId}`);
  domEls.forEach((domEl) => {
    if (domEl) {
      domEl.remove();
    }
  });

  state.selectedId = null;

  slectedElemInfo();
}

// Changing Theme (Dark/Light)
function changeTheme(e) {
  console.log("step 1");

  if (main.classList[0] === "light") {
    main.classList.replace("light", "dark");
    themeToggleBtn.childNodes[1].style.left = "";
    themeToggleBtn.childNodes[1].style.right = "0px";
    themeToggleBtn.childNodes[1].innerHTML = `<i class="ri-moon-line"></i>`;
  } else {
    main.classList.replace("dark", "light");
    themeToggleBtn.childNodes[1].style.right = "";
    themeToggleBtn.childNodes[1].style.left = "0px";
    themeToggleBtn.childNodes[1].innerHTML = `<i class="ri-sun-line"></i>`;
  }
}

// Save Layout Function
function saveLayout() {
  const layoutString = JSON.stringify(state.elements);

  localStorage.setItem("canvas_design_studio_save", layoutString);

  if (state.elements.length === 0) {
    alert("Nothing to save!");
  } else {
    alert("Layout saved successfully!");
  }
}

// Load Layout Function
function loadLayout() {
  const savedData = localStorage.getItem("canvas_design_studio_save");

  if (savedData) {
    state.elements = JSON.parse(savedData);

    renderCanvas();

    // console.log("Layout loaded from storage.");
  }
}

// Export JSON
function exportToJSON() {
  if (state.elements.length === 0) return alert("Nothing to export!");

  const dataStr = JSON.stringify(state.elements, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas-layout.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Export HTML
function exportToHTML() {
  let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        .container { position: relative; width: 800px; height: 600px; background: #111; overflow: hidden; }
        .element { position: absolute; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>
    <div class="container">`;

  state.elements.forEach((el) => {
    const style = `
            left: ${el.x}px; 
            top: ${el.y}px; 
            width: ${el.width}px; 
            height: ${el.height}px; 
            background-color: ${el.bg}; 
            transform: rotate(${el.rotation || 0}deg);
            z-index: ${el.zIndex || 1};
        `.replace(/\s+/g, " ");

    htmlContent += `\n        <div class="element" style="${style}">${el.text || ""}</div>`;
  });

  htmlContent += `\n    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "design-export.html";
  link.click();
}

// ----------------- Function Calls --------------------

// Creating Rectangle function call
document.getElementById("add-rect").addEventListener("click", () => {
  const newRect = {
    id: "rect-" + Date.now(),
    type: "rectangle",
    visible: true,
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    rotation: 0,
    bg: "#0D2D76",
    text: "",
    textClr: "",
    zIndex: state.elements.length,
  };
  state.elements.push(newRect);
  state.selectedId = newRect.id;
  renderCanvas();
});

// Creating Text Box function call
document.getElementById("add-text").addEventListener("click", () => {
  const newText = {
    id: "text-" + Date.now(),
    type: "text",
    visible: true,
    x: 150,
    y: 150,
    width: 200,
    height: 50,
    rotation: 0,
    bg: "transparent",
    text: "Type here...",
    textClr: "#fff",
    zIndex: state.elements.length,
  };
  state.elements.push(newText);
  state.selectedId = newText.id;
  renderCanvas();
});

// Start Dragging / Resize / Rotation
canvas.addEventListener("mousedown", (e) => {
  if (
    e.target.classList.contains("corner-handler") ||
    e.target.classList.contains("rotet-handler")
  ) {
    e.stopPropagation();

    if (e.target.classList.contains("corner-handler")) {
      isResizing = true;
      currentHandle = e.target.classList;
    } else {
      isRotating = true;
    }
    return;
  }

  const target = e.target.closest(".canvas-element");

  if (target) {
    isDragging = true;
    state.selectedId = target.id;

    const elData = state.elements.find((el) => el.id === target.id);

    dragOffsetX = e.clientX - elData.x;
    dragOffsetY = e.clientY - elData.y;

    renderCanvas();
  } else {
    state.selectedId = null;
    renderCanvas();
  }
});

// Moving the Mouse and call / Draging / Resize / Rotation Function
window.addEventListener("mousemove", (e) => {
  if (isResizing || isRotating) {
    if (isResizing) {
      handleResize(e);
    } else {
      handleRotation(e);
    }
    return;
  }

  if (!isDragging || !state.selectedId) return;
  const elData = state.elements.find((el) => el.id === state.selectedId);

  let newX = e.clientX - dragOffsetX;
  let newY = e.clientY - dragOffsetY;

  const maxX = canvas.offsetWidth - elData.width;
  const maxY = canvas.offsetHeight - elData.height;

  elData.x = Math.max(0, Math.min(newX, maxX));
  elData.y = Math.max(0, Math.min(newY, maxY));

  const domEl = document.getElementById(elData.id);
  if (domEl) {
    domEl.style.left = elData.x + "px";
    domEl.style.top = elData.y + "px";
  }
});

// Stop Dragging / Resizing / Rotation
window.addEventListener("mouseup", () => {
  if (isResizing || isRotating || isDragging) {
    if (isResizing) {
      isResizing = false;
      currentHandle = null;
    } else if (isRotating) {
      isRotating = false;
    } else {
      isDragging = false;
    }
  }
});

// Selection Indicator function Call
canvas.addEventListener("click", (e) => {
  const clickedEl = e.target.closest(".canvas-element");

  if (clickedEl) {
    state.selectedId = clickedEl.id;
  } else {
    state.selectedId = null;
  }

  renderCanvas();
});

// Handle Properties function call
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    handlePropertiesPanelInput(e);
  });
});

// Delete Element Function Calls
deleteElm.addEventListener("click", deleteSelectedElement);
window.addEventListener("keydown", (e) => {
  if (state.selectedId && e.key === "Delete") {
    deleteSelectedElement();
  }
});

// Change theme Function Calls
themeToggleBtn.addEventListener("click", (e) => {
  changeTheme(e);
});

// Save Layout Function Calls
document.getElementById("save-btn").addEventListener("click", saveLayout);

// Exports Function Call
expJson.addEventListener("click", exportToJSON);
expHtml.addEventListener("click", exportToHTML);

// Load layout function call
window.addEventListener("DOMContentLoaded", loadLayout);
