var URL = "https://api.github.com/repos/h1tran/Kii-Slideshow/git/trees/master?recursive=1"
var imagePaths = [];
var imageContainer = document.getElementById("img-container");
var image = document.getElementById("img");
var imageIndex = 0;
var imageSource;

var imageLeftSet = true;

// Make sure that everything is rendered before wasting API calls
if (imageContainer && image) {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      for (filePath in data.tree) {
        let filename = data.tree[filePath].path;
        if (filename.includes("images/")) imagePaths.push(filename);
      }
    });
  setImage();
  imageContainer.addEventListener("animationiteration", fetchNextImage);
}

function setImage() {
  if (imagePaths[imageIndex]) imageSource = "../" + imagePaths[imageIndex];
  if (imageSource) image.src = imageSource;
}

function fetchNextImage() {
  setImage();
  // Type guard
  if (imageIndex < imagePaths.length - 1) {
    imageIndex++;
    return;
  }
  imageIndex = 0;
}
