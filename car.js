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
        let history = JSON.parse(localStorage.getItem("carSearchHistory")) || [];
        if (!history.includes(searchValue)) {
            history.push(searchValue);
            localStorage.setItem("carSearchHistory", JSON.stringify(history));
        }

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
                const response = await fetch(apiUrl);
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                const imageUrl = xmlDoc.getElementsByTagName("string")[0].textContent;
                return (!imageUrl || imageUrl.includes("noimage")) ? "fallback.jpg" : imageUrl;
            } catch {
                return "fallback.jpg";
            }
        }

        for (const car of data.Results.slice(0, 8)) {
            const imageUrl = await fetchCarImage(car.Make_Name, car.Model_Name);
            const card = document.createElement("div");
            card.className = "car-card";
            card.style.animationDelay = `${Math.random() * 0.5}s`;

            card.innerHTML = `
                <h3>${car.Make_Name} ${car.Model_Name}</h3>
                <img src="${imageUrl}" alt="${car.Model_Name}" width="250" height="100" onerror="this.src='fallback.jpg'">
                <p><strong>Make ID:</strong> ${car.Make_ID}</p>
                <p><strong>Model ID:</strong> ${car.Model_ID}</p>
                <button class="wishlist-btn" data-make="${car.Make_Name}" data-model="${car.Model_Name}" data-image="${imageUrl}">
                    Add to Wishlist
                </button>
            `;
            carContainer.appendChild(card);
        }
    } catch (error) {
        console.error(error);
        carContainer.innerHTML = "An error occurred. Please try again.";
    }
});

 displaySearchHistory = () => {
    const history = JSON.parse(localStorage.getItem("carSearchHistory")) || [];
    const container = document.getElementById("search-history");
    container.innerHTML = "<h4>Recent Searches:</h4>" + history.map(item => `<span class="history-item">${item}</span>`).join(", ");
}

document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem("carSearchHistory");
    displaySearchHistory();
    alert("Search history cleared.");
});

saveToWishlist = (make, model, image) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some(item => item.make === make && item.model === model);
    if (exists) {
        alert(`${make} ${model} is already in your wishlist.`);
        return;
    }

    wishlist.push({ make, model, image });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${make} ${model} added to wishlist!`);
}

carContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("wishlist-btn")) {
        const make = e.target.getAttribute("data-make");
        const model = e.target.getAttribute("data-model");
        const image = e.target.getAttribute("data-image");
        saveToWishlist(make, model, image);
    }
});

displaySearchHistory();
