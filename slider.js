var repoURL = "https://api.github.com/repos/h1tran/Slideshow/git/trees/master?recursive=1"
var imagePaths = [];
var firstContainer = document.getElementById("first-img-container");
var secondContainer = document.getElementById("second-img-container");
var imageIndex = -1;
var imageSource;

var cycleTime = 4500;

const fetchData = async () => {
  // Type guard
  if (!repoURL) return;
  const response = await fetch(repoURL);
  const data = await response.json();
  return data;
}

init();

function init() {
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

    firstContainer.style.animation = `slide_animation ${cycleTime}ms ease-in-out infinite`;
    setInterval(() => {
      // When starting to move off screen
      if (firstContainer.getBoundingClientRect().right < window.innerWidth) {
        secondContainer.style.animationPlayState = "running";
      }
      if (secondContainer.getBoundingClientRect().right < window.innerWidth) {
        firstContainer.style.animationPlayState = "running";
      }
    }, 100);
    secondContainer.style.animation = `slide_animation ${cycleTime}ms ease-in-out infinite`;
    secondContainer.style.animationPlayState = "paused";

    firstContainer.addEventListener("animationiteration", function () {
      firstContainer.style.animationPlayState = "paused";
      setImage(true);
    });
    secondContainer.addEventListener("animationiteration", function () {
      secondContainer.style.animationPlayState = "paused";
      setImage(false);
    }, 750);
  }

  // Wait for fetched data to resolve first
  resolveData();
}

function setImage(isFirstContainer) {
  if (!firstContainer || !secondContainer) return;
  setIndex();
  let image = document.createElement("img");
  if (imagePaths[imageIndex]) imageSource = imagePaths[imageIndex];
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
  if (imageIndex > imagePaths.length - 2) {
    imageIndex = 0;
    return;
  }
  imageIndex++;
}