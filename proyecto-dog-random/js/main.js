const API_URL_RANDOM =
  "https://api.thedogapi.com/v1/images/search?limit=2&api_key=live_kQ8qbO0k5JISXH0gFhPDxyAanhQNOZ83UTVgYycOxf2WA0GDdWqunpc48zUsZ74d";

const API_URL_FAVORITES =
    "https://api.thedogapi.com/v1/favourites?&api_key=live_kQ8qbO0k5JISXH0gFhPDxyAanhQNOZ83UTVgYycOxf2WA0GDdWqunpc48zUsZ74d&order=DESC";

const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}?api_key=live_kQ8qbO0k5JISXH0gFhPDxyAanhQNOZ83UTVgYycOxf2WA0GDdWqunpc48zUsZ74d`;

function showMessage(type,text){
  const messageDiv = document.getElementById("message");
  if (!messageDiv) {
    console.warn("⚠️ Element with ID 'message' not found.");
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
  closeBtn.setAttribute("data-bs-dismiss", "alert");
  closeBtn.setAttribute("aria-label", "Close");

  alert.appendChild(closeBtn);
  messageDiv.appendChild(alert);

  setTimeout(() => {
    const alertElement = messageDiv.querySelector(".alert");
    if (alertElement) {
      const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
      alert.close();
    }
  }, 4000);
}

async function loadRandomDogs() {
  try {
    const response = await fetch(API_URL_RANDOM);
    const data     = await response.json();
    if (!response.ok){
        showMessage("danger", `There was an error: ${response.status} ${data.message}`);
    }else{
        const dogImage1        = document.getElementById("dogImage1");
        const dogImage2        = document.getElementById("dogImage2");

        const dogButtonRandom1 = document.getElementById("dogButtonRandom1");
        const dogButtonRandom2 = document.getElementById("dogButtonRandom2");

        dogImage1.src = data[0].url;
        dogImage2.src = data[1].url;

        dogButtonRandom1.onclick = () => saveFavoriteDog(data[0].id);       
        dogButtonRandom2.onclick = () => saveFavoriteDog(data[1].id);
    }
    
  } catch (error) {
    showMessage("danger", `Failed to fetch dog image: ${error}`);
  }
}

function createFavoriteDogCard(dog){
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
  
  const article = document.createElement("article");
  article.className = "card h-100";

  const img = document.createElement("img");
  img.src = dog.image.url;
  img.alt = "Favorite dog";
  img.className = "card-img-top"

  const cardBody = document.createElement("div");
  cardBody.className = "card-body text-center";

  const btn = document.createElement("button");
  btn.innerHTML = '<i class="bi bi-trash3"></i> Remove dog from favorites';
  btn.className = "btn btn-outline-danger w-100 mt-2";
  btn.onclick = () => deleteFavoriteDog(dog.id);

  cardBody.appendChild(btn);
  article.appendChild(img);
  article.appendChild(cardBody);
  col.appendChild(article);
  
  return col;
}
async function loadFavoriteDogs() {
  try {
    const response = await fetch(API_URL_FAVORITES);
    //   "https://api.thecatapi.com/v1/favourites?limit=2",
    //   {
    //     headers: {
    //       "content-type": "application/json",
    //       "x-api-key":
    //         "live_yIwxanfCOOGUH7jMAqvbpFdr9nqlpq6npXLEL642gyNZZcrjUZRJteVpAHqO7mKE",
    //     },
    //   }
    // );
    const data     = await response.json();
    if (!response.ok) {
      showMessage("danger", `There was an error in favorites: " ${response.status} - ${data.message}`);
    }else{
      const section = document.getElementById("favoritesContainer");
      section.innerHTML = "";

      data.forEach(dog => { 
        const card = createFavoriteDogCard(dog);
        section.appendChild(card);
      });
    }
  } catch (error) {
    showMessage("danger", "An unexpected error ocurred on loadFavoriteDogs");

  }
}

async function saveFavoriteDog(id) {
  try {
    const response = await fetch(API_URL_FAVORITES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_id: id,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage("danger",`There was an error in save: " ${response.status}  - ${data.message}`);
    } else {
      showMessage("success", "Dog saved into favorites");
      loadFavoriteDogs();
    }
  } catch (error) {
    showMessage("danger", "An unexpected error ocurred on saveFavoriteDog");
  }
}

async function deleteFavoriteDog(id) {
  try {
    const response = await fetch(API_URL_FAVORITES_DELETE(id), {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage("danger",`There was an error in delete: " ${response.status}  ${data.message}`);
    } else {
      showMessage("success", "Dog deleted into favorites");
      loadFavoriteDogs();
    }
  } catch (error) {
    showMessage("danger", "An unexpected error ocurred on deleteFavoriteDog");
  }
}

loadRandomDogs();
loadFavoriteDogs();