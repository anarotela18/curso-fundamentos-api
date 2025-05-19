const URL = "https://api.thedogapi.com/v1/images/search";
const dogImage = document.querySelector("#dogImage");
const reloadButton = document.querySelector("#reloadButton");
// With Promises
function getDogImagePromises() {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      dogImage.src = data[0].url;
    });
}
// With async await
async function getDogImageAsync() {
    try{
        const response = await fetch(URL);
        const data = await response.json();
        dogImage.src = data[0].url;
    }catch(error){
        console.error("Failed to fetch dog image: ",error);
    }
}

//reloadButton.addEventListener('click',getDogImagePromises);
reloadButton.addEventListener("click", getDogImageAsync);
getDogImageAsync();