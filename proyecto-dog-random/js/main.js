const API_KEY =
  "live_kQ8qbO0k5JISXH0gFhPDxyAanhQNOZ83UTVgYycOxf2WA0GDdWqunpc48zUsZ74d";

const API_URL_RANDOM = "https://api.thedogapi.com/v1/images/search?limit=2";

const API_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites?&order=DESC";

const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thedogapi.com/v1/favourites/${id}?`;

function showMessage(type, text) {
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
}

async function loadRandomDogs() {
  try {
    const response = await fetch(API_URL_RANDOM, {
      method: "GET",
      headers: { "X-API-KEY": API_KEY },
    });
    if (!response.ok) {
      const text = await response.text();
      const errorMessage = `There was an error: ${response.status} ${text}`;
      showMessage("danger", errorMessage);
      return;
    }
    const data = await response.json();
    if (data.length >= 2) {
      const dogImage1 = document.getElementById("dogImage1");
      const dogImage2 = document.getElementById("dogImage2");
      
      const dogBreed1 = document.getElementById("dogBreed1");
      const dogBreed2 = document.getElementById("dogBreed2");

      const dogButtonRandom1 = document.getElementById("dogButtonRandom1");
      const dogButtonRandom2 = document.getElementById("dogButtonRandom2");

      dogImage1.src = data[0].url;
      dogImage2.src = data[1].url;

      dogBreed1.textContent = data[0].breeds?.[0]?.name ?? "Unknown breed";
      dogBreed2.textContent = data[1].breeds?.[0]?.name ?? "Unknown breed";

      dogButtonRandom1.onclick = () => saveFavoriteDog(data[0].id);
      dogButtonRandom2.onclick = () => saveFavoriteDog(data[1].id);
    }
  } catch (error) {
    showMessage("danger", `Failed to fetch dog image: ${error}`);
  }
}

function createFavoriteDogCard(dog) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  const article = document.createElement("article");
  article.className = "card h-100";

  const img = document.createElement("img");
  img.src = dog.image.url;
  img.alt = "Favorite dog";
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
  try {
    const response = await fetch(API_URL_FAVORITES, {
      method: "GET",
      headers: { "X-API-KEY": API_KEY },
    });

    if (!response.ok) {
      const text = await response.text();
      const errorMessage = `There was an error in favorites: ${response.status} - ${text}`;
      showMessage("danger", errorMessage);
      return;
    }

    const data = await response.json();
    const section = document.getElementById("favoritesContainer");
    section.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach((dog) => {
        const card = createFavoriteDogCard(dog);
        section.appendChild(card);
      });
    } else {
      showMessage("danger", "Unexpected response format from favorites API.");
    }
  } catch (error) {
    showMessage("danger", `An unexpected error ocurred on loadFavoriteDogs ${error}`);
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

async function deleteFavoriteDog(id) {
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

loadRandomDogs();
loadFavoriteDogs();