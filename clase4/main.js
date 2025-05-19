const API_URL  = "https://api.thedogapi.com/v1/images/search?limit=3";
// With async await
async function reload() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const dogImage1 = document.getElementById("dogImage1");
    const dogImage2 = document.getElementById("dogImage2");
    const dogImage3 = document.getElementById("dogImage3");
    
    dogImage1.src = data[0].url;
    dogImage2.src = data[1].url;
    dogImage3.src = data[2].url;
  } catch (error) {
    console.error("Failed to fetch dog image: ", error);
  }
}

reload();
