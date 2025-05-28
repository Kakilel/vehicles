const infoPage = document.querySelector(".info");
const searchSection = document.querySelector(".search-section");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".search-btn");
const startBtn = document.querySelector(".alert-btn");
const carContainer = document.querySelector("#car-list");



infoPage.classList.add("active");




startBtn.addEventListener("click", () => {
    infoPage.classList.remove("active");
    searchSection.classList.add("active");
    alert("WELCOME!!\n\nPlease search for your car make below.");
});



searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

searchBtn.addEventListener("click", async () => {
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        alert("Please enter a car make to search.");
        return;
    }

    carContainer.innerHTML = "Searching...";

    try {
        // Save search to localStorage
        let history = JSON.parse(localStorage.getItem("carSearchHistory")) || [];
        if (!history.includes(searchValue)) {
    history.push(searchValue);
    localStorage.setItem("carSearchHistory", JSON.stringify(history));
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem("carSearchHistory")) || [];
    const container = document.getElementById("search-history");
    container.innerHTML = "<h4>Recent Searches:</h4>" + history.map(item => `<span class="history-item">${item}</span>`).join(", ");
}
document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem("carSearchHistory");
    displaySearchHistory();
    alert("Search history cleared.");
});

displaySearchHistory(); 

        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${searchValue}?format=json`);
        const data = await res.json();

        if (!data.Results.length) {
            carContainer.innerHTML = "No matching models found.";
            return;
        }
        
        carContainer.innerHTML = "";

     async function fetchCarImage(make, model) {
         try {
             const apiUrl = `https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${make}+${model}`;
             const response = await fetch(`${apiUrl}`);
             const text = await response.text();
             const parser = new DOMParser();
             const xmlDoc = parser.parseFromString(text, "text/xml");
             const imageUrl = xmlDoc.getElementsByTagName("string")[0].textContent;
             
    
             if (!imageUrl || imageUrl.includes("noimage") || imageUrl.length < 10) {
                 return "fallback.jpg";
        }

        return imageUrl;
    } catch (err) {
        console.error("Image fetch error:", err);
        return "fallback.jpg";
    }
}

// Display up to 25 cars
for (const car of data.Results.slice(0, 4)) {
    const imageUrl = await fetchCarImage(car.Make_Name, car.Model_Name);
       setTimeout(() => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.style.animationDelay = `${Math.random() * 0.5}s`;
       




            card.innerHTML = `
                <h3>${car.Make_Name} ${car.Model_Name}</h3>
                <img src="${imageUrl}" alt="${car.Model_Name}" width="250" height="100"onerror="this.src='fallback.jpg'">
                <p><strong>Make ID:</strong> ${car.Make_ID}</p>
                <p><strong>Model ID:</strong> ${car.Model_ID}</p>
                 <button class="wishlist-btn" data-make="${car.Make_Name}" data-model="${car.Model_Name}"> Add to Wishlist</button>
            `;
            carContainer.appendChild(card);
        }
    )}
} catch (error) {
    console.error(error);
    carContainer.innerHTML = "An error occurred. Please try again.";
}
});

const wishlistToggle = document.getElementById("wishlist-toggle");
const wishlistSection = document.getElementById("wishlist");
const wishlistItems = document.getElementById("wishlist-items");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

wishlistToggle.addEventListener("click", (e) => {
    e.preventDefault();
    wishlistSection.classList.toggle("hidden");
});

 updateWishlistUI = () => {
    wishlistItems.innerHTML = "";
    if (!wishlist.length) {
        wishlistItems.innerHTML = "<p>No cars in wishlist.</p>";
        return;
    }
    wishlist.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.make} ${item.model}
            <button onclick="removeFromWishlist(${index})">❌</button>`;
        wishlistItems.appendChild(li);
    });
}

saveToWishlist = (make, model) => {
    wishlist.push({ make, model });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistUI();
}

window.removeFromWishlist = function(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistUI();
};

carContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("wishlist-btn")) {
        const make = e.target.getAttribute("data-make");
        const model = e.target.getAttribute("data-model");
        saveToWishlist(make, model);
    }
});

updateWishlistUI();



