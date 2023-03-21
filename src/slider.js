var repoURL = "https://api.github.com/repos/h1tran/Slideshow/git/trees/master?recursive=1"
var imagePaths = [];
var firstContainer = document.getElementById("first-img-container");
var secondContainer = document.getElementById("second-img-container");
var imageIndex = -1;
var imageSource;

const fetchData = async () => {
  // Type guard
  if (!repoURL) return;
  const response = await fetch(repoURL);
  const data = await response.json();
  return data;
}

init();

function init() {
  let isFirstPaused = false;
  let isSecondPaused = false;

  resolveData = async () => {
    await fetchData().then(data => {
      for (filePath in data.tree) {
        let filename = data.tree[filePath].path;
        if (filename.includes("images/") && filename) {
          imagePaths.push(filename);
        }
      }
    });
    // Initialize first two images
    setImage(true);
    setImage(false);

    firstContainer.addEventListener("animationiteration", function () {
      firstContainer.style.animationPlayState = "paused";
      isFirstPaused = true;
    });
    secondContainer.addEventListener("animationiteration", function () {
      secondContainer.style.animationPlayState = "paused";
      isSecondPaused = true;
    });

    // Timing function
    window.setInterval(() => {
      if (isFirstPaused && isSecondPaused) {
        setImage(true);
        setImage(false);
        isFirstPaused = false;
        isSecondPaused = false;
      }
    }, 800);
  }

  // Wait for fetched data to resolve first
  resolveData();
}

function setImage(isFirstContainer) {
  if (!firstContainer || !secondContainer) return;
  setIndex();
  let image = document.createElement("img");
  if (imagePaths[imageIndex]) imageSource = "../" + imagePaths[imageIndex];
  if (imageSource) image.src = imageSource;

  if (isFirstContainer) {
    firstContainer.innerHTML = "";
    firstContainer.appendChild(image);
  } else {
    secondContainer.innerHTML = "";
    secondContainer.appendChild(image);
  }
}

function setIndex() {
  // Type guard
  if (imageIndex < imagePaths.length - 1) {
    imageIndex++;
    return;
  }
  imageIndex = 0;
}