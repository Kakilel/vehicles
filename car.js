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
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${searchValue}?format=json`);
        const data = await res.json();

        if (!data.Results.length) {
            carContainer.innerHTML = "No matching models found.";
            return;
        }

        carContainer.innerHTML = "";

        // Helper function to get image from Car Imagery API
     async function fetchCarImage(make, model) {
    try {
        const apiUrl = `https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${make}+${model}`;
        const response = await fetch(`${apiUrl}`);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const imageUrl = xmlDoc.getElementsByTagName("string")[0].textContent;

        // Basic validation
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
        for (const car of data.Results.slice(0, 25)) {
            const card = document.createElement("div");
            card.className = "car-card";

            const imageUrl = await fetchCarImage(car.Make_Name, car.Model_Name);

            card.innerHTML = `
                <h3>${car.Make_Name} ${car.Model_Name}</h3>
                <img src="${imageUrl}" alt="${car.Model_Name}" width="250" height="100"onerror="this.src='fallback.jpg'">
                <p><strong>Make ID:</strong> ${car.Make_ID}</p>
                <p><strong>Model ID:</strong> ${car.Model_ID}</p>
            `;
            carContainer.appendChild(card);
        }
    } catch (error) {
        console.error(error);
        carContainer.innerHTML = "An error occurred. Please try again.";
    }
});