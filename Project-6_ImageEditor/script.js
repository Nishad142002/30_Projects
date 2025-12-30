let filters = {
  brightness: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  contrast: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  saturation: {
    value: 100,
    min: 0,
    max: 200,
    unit: "%",
  },
  hueRotation: {
    value: 0,
    min: 0,
    max: 360,
    unit: "deg",
  },
  blur: {
    value: 0,
    min: 0,
    max: 20,
    unit: "px",
  },
  grayscale: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
  sepia: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
  opacity: {
    value: 100,
    min: 0,
    max: 100,
    unit: "%",
  },
  invert: {
    value: 0,
    min: 0,
    max: 100,
    unit: "%",
  },
};

const presets = {
  drama: {
    brightness: 90,
    contrast: 130,
    saturation: 120,
    hueRotation: 0,
    blur: 0,
    grayscale: 0,
    sepia: 10,
    opacity: 100,
    invert: 0,
  },
  vintage: {
    brightness: 110,
    contrast: 90,
    saturation: 80,
    hueRotation: 15,
    blur: 0,
    grayscale: 20,
    sepia: 40,
    opacity: 100,
    invert: 0,
  },
  oldSchool: {
    brightness: 95,
    contrast: 85,
    saturation: 60,
    hueRotation: -10,
    blur: 0,
    grayscale: 50,
    sepia: 20,
    opacity: 100,
    invert: 0,
  },
  cyberpunk: {
    brightness: 105,
    contrast: 140,
    saturation: 180,
    hueRotation: 220,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    opacity: 100,
    invert: 5,
  },
  warmPortrait: {
    brightness: 108,
    contrast: 115,
    saturation: 120,
    hueRotation: 10,
    blur: 0,
    grayscale: 0,
    sepia: 15,
    opacity: 100,
    invert: 0,
  },
  coldFilm: {
    brightness: 95,
    contrast: 110,
    saturation: 85,
    hueRotation: 190,
    blur: 0,
    grayscale: 10,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },
  matteFade: {
    brightness: 110,
    contrast: 80,
    saturation: 70,
    hueRotation: 0,
    blur: 0,
    grayscale: 20,
    sepia: 15,
    opacity: 100,
    invert: 0,
  },
  dreamyGlow: {
    brightness: 120,
    contrast: 95,
    saturation: 130,
    hueRotation: 0,
    blur: 2,
    grayscale: 0,
    sepia: 10,
    opacity: 100,
    invert: 0,
  },
  harshMono: {
    brightness: 100,
    contrast: 150,
    saturation: 0,
    hueRotation: 0,
    blur: 0,
    grayscale: 100,
    sepia: 0,
    opacity: 100,
    invert: 0,
  },
  washedRetro: {
    brightness: 115,
    contrast: 85,
    saturation: 75,
    hueRotation: 30,
    blur: 0,
    grayscale: 10,
    sepia: 25,
    opacity: 100,
    invert: 0,
  },
};

const imageCanvas = document.querySelector("#image-canvas");
const canvasCtx = imageCanvas.getContext("2d");
const imgInput = document.querySelector("#image-input");
const presetsContainer = document.querySelector(".presets");

const filtersContainer = document.querySelector(".filters");
const resetButton = document.querySelector("#rest-btn");
const downloadButton = document.querySelector("#download-btn");

let file = null;
let image = null;

function createFilterElement(name, unit = "%", value, min, max) {
  const div = document.createElement("div");
  div.classList.add("filter");

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = value;
  input.id = name;

  const p = document.createElement("p");
  p.innerText = name;

  div.appendChild(p);
  div.appendChild(input);

  input.addEventListener("input", (e) => {
    filters[name].value = input.value;
    applyFilter();
  });

  return div;
}

function createFilter() {
  Object.keys(filters).forEach((key) => {
    const filterElement = createFilterElement(
      key,
      filters[key].unit,
      filters[key].value,
      filters[key].min,
      filters[key].max
    );

    filtersContainer.appendChild(filterElement);
  });
}

imgInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const imagePlaceholder = document.querySelector(".placeholder");
  imageCanvas.style.display = "block";
  imagePlaceholder.style.display = "none";

  const img = new Image();
  img.src = URL.createObjectURL(file);
  image = img;
  img.onload = () => {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    canvasCtx.drawImage(img, 0, 0);
  };
});

function applyFilter() {
  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  canvasCtx.filter = `
  brightness(${filters.brightness.value}${filters.brightness.unit})
  contrast(${filters.contrast.value}${filters.contrast.unit})
  saturate(${filters.saturation.value}${filters.saturation.unit})
  hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
  blur(${filters.blur.value}${filters.blur.unit})
  grayscale(${filters.grayscale.value}${filters.grayscale.unit})
  sepia(${filters.sepia.value}${filters.sepia.unit})
  opacity(${filters.opacity.value}${filters.opacity.unit})
  invert(${filters.invert.value}${filters.invert.unit})
  `.trim();

  canvasCtx.drawImage(image, 0, 0);
}

resetButton.addEventListener("click", () => {
  filters = {
    brightness: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },
    contrast: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },
    saturation: {
      value: 100,
      min: 0,
      max: 200,
      unit: "%",
    },
    hueRotation: {
      value: 0,
      min: 0,
      max: 360,
      unit: "deg",
    },
    blur: {
      value: 0,
      min: 0,
      max: 20,
      unit: "px",
    },
    grayscale: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
    sepia: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
    opacity: {
      value: 100,
      min: 0,
      max: 100,
      unit: "%",
    },
    invert: {
      value: 0,
      min: 0,
      max: 100,
      unit: "%",
    },
  };

  applyFilter();

  filtersContainer.innerHTML = "";
  createFilter();
});

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = imageCanvas.toDataURL();
  link.click();
});

Object.keys(presets).forEach((presetName) => {
  const presetButton = document.createElement("button");
  presetButton.classList.add("preset-btn");
  presetButton.innerText = presetName;
  presetsContainer.appendChild(presetButton);

  presetButton.addEventListener("click", () => {
    const preset = presets[presetName];

    Object.keys(preset).forEach((filterName) => {
      filters[filterName].value = preset[filterName];
    });

    applyFilter();
    filtersContainer.innerHTML = "";
    createFilter();
  });
});

createFilter();
