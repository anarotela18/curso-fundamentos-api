const API_KEY = "live_kQ8qbO0k5JISXH0gFhPDxyAanhQNOZ83UTVgYycOxf2WA0GDdWqunpc48zUsZ74d";

const API_URL_RANDOM = "https://api.thedogapi.com/v1/images/search?limit=2";

const API_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites?&order=DESC";

const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}?`;

const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

function showMessage(type,text){
  const messageDiv = document.getElementById("message");
  if(!messageDiv){
    console.log("Element Div message not found");
    return;
  }
  messageDiv.innerHTML = "";

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.textContent = text;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn-close";
  closeBtn.setAttribute("data-bs-dismiss","alert");
  closeBtn.setAttribute("aria-label","Close");

  alert.appendChild(closeBtn);
  messageDiv.appendChild(alert);
}
async function loadRandomDogs() {
   try {
    const response = await axios.get(API_URL_RANDOM, {headers: { "X-API-KEY": API_KEY }});
    const data     = response.data;
    if(data.length >=2){
        const dogImage1 = document.getElementById("dogImage1");
        const dogImage2 = document.getElementById("dogImage2");

        const dogButtonRandom1 = document.getElementById("dogButtonRandom1");
        const dogButtonRandom2 = document.getElementById("dogButtonRandom2");

        dogImage1.src = data[0].url;
        dogImage2.src = data[1].url;

        const dogBreed1 = document.getElementById("dogBreed1");
        const dogBreed2 = document.getElementById("dogBreed2");

        dogBreed1.textContent = data[0].breeds?.[0]?.name ?? "Unkown breed";
        dogBreed2.textContent = data[1].breeds?.[0]?.name ?? "Unkown breed";

        dogButtonRandom1.onclick = () => saveFavoriteDog(data[0].id);
        dogButtonRandom2.onclick = () => saveFavoriteDog(data[1].id);
 
    }
   } catch (error) {
    if(error.response){
      const message =
        error.response.data?.message ||
        error.response.data?.error?.message ||
        JSON.stringify(error.response.data);
      const errorMessage = `There was an error: ${error.response.status} - ${message}`;
      showMessage("danger", errorMessage);
    }else{
      showMessage("danger", `Failed to fetch dog image: ${error.message}`);
   }
  }
}
function createFavoriteDogCard(dog){
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  const article = document.createElement("article");
  article.className = "card h-100";

  const img = document.createElement("img");
  img.src = dog.image.url;
  img.alt = "favorite dog";
  img.className = "card-img-top mb-2";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body text-center";

  const btn = document.createElement("button");
  btn.innerHTML = '<i class="bi bi-trash3"></i> Remove dog from favorites';
  btn.className = "btn btn-outline-danger w-100";
  btn.onclick = () => deleteFavoriteDog(dog.id);

  cardBody.appendChild(btn);
  article.appendChild(img);
  article.appendChild(cardBody);
  col.appendChild(article);

  return col;
}
async function loadFavoriteDogs() {
  try{
    const response = await axios.get(API_URL_FAVORITES,{ headers: {"X-API-KEY": API_KEY}});
    const data     = response.data;
    const section = document.getElementById("favoritesContainer");
    section.innerHTML = "";

    if(Array.isArray(data)){
      data.forEach((dog) => {
        const card = createFavoriteDogCard(dog);
        section.appendChild(card);
      });
    }else{
      showMessage("danger", "Unexpected response format from favorites API.");
    } 

  }catch(error){
    if(error.response){
      const message =
        error.response.data?.message ||
        error.response.data?.error?.message ||
        JSON.stringify(error.response.data);
          
      const errorMessage = `There was an error in favorites: ${error.response.status} - ${message}`;
      showMessage("danger", errorMessage);
    }else{
      showMessage("danger", `An unexpected error occurred on loadFavoriteDogs ${error.message}`);
    }
  }
}
async function saveFavoriteDog(id) {
  try {
    const response = await fetch(API_URL_FAVORITES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        image_id: id,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `There was an error in save: ${response.status} - ${text}`;
      showMessage("danger", errorMessage);
      return;
    }
    showMessage("success", "Dog added to favorites");
    loadFavoriteDogs();
  } catch (error) {
    showMessage("danger", "An unexpected error ocurred on saveFavoriteDog");
  }
}
async function deleteFavoriteDog(id){
  try {
    const response = await fetch(API_URL_FAVORITES_DELETE(id), {
      method: "DELETE",
      headers: { "X-API-KEY": API_KEY },
    });
    if (!response.ok) {
      const text = await response.text();
      const errorMessage = `There was an error in delete: ${response.status} - ${text}`;
      showMessage("danger", errorMessage);
      return;
    }
    showMessage("success", "Dog removed from favorites");
    loadFavoriteDogs();
  } catch (error) {
    showMessage("danger", "An unexpected error ocurred on deleteFavoriteDog");
  }
}
async function uploadDogPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  const file = formData.get("file");

  if(!file || file.size === 0){
    showMessage("danger", "Please select a file before uploading");
    return;
  }

  const button = document.querySelector("#uploadingForm button");
  button.disabled = true;
  button.innerHTML = '<i class="bi bi-upload"> Uploading ...</i>';

  try {
    const response = await fetch(API_URL_UPLOAD, {
      method: "POST",
      headers: { "X-API-KEY": API_KEY },
      body: formData,
    });
    if (!response.ok) {
      const text = await response.text();
      const errorMessage = `There was an error in upload: ${response.status} - ${text}`;
      showMessage("danger", errorMessage);
      return;
    }
    const data = await response.json();
    showMessage("success", "Successfully uploaded dog photo");
    console.log("Uploaded image info: ", data);
    console.log(data.url); // https://cdn2.thedogapi.com/images/bHyWzkvt_.jpg
    saveFavoriteDog(data.id);
    form.reset();
  } catch (error) {
    showMessage("danger", `Unexpected error during upload: ${error}`);
  } finally {
    button.disabled = false;
    button.innerHTML = '<i class="bi bi-upload"> Upload photo</i>';
  }

}
loadRandomDogs();
loadFavoriteDogs();