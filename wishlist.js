document.addEventListener("DOMContentLoaded", () => {
    const wishlistItems = document.getElementById("wishlist-items");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    
    function removeFromWishlist(index) {
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
    }

    function renderWishlist() {
        wishlistItems.innerHTML = "";

        if (wishlist.length === 0) {
            wishlistItems.innerHTML = "<p>No cars in wishlist.</p>";
            return;
        }

        wishlist.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${item.image}" alt="${item.make} ${item.model}" width="100">
                ${item.make} ${item.model}
                <button onclick="removeFromWishlist(${index})">❌</button>
            `;
            wishlistItems.appendChild(li);
        });
    }

    window.removeFromWishlist = removeFromWishlist;

    renderWishlist();
});

