// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));

// Get products from localStorage
const products = JSON.parse(localStorage.getItem('products')) || [];
const product = products.find(p => p.id === productId);

// Render product details
function renderProductDetails() {
  if (!product) {
    document.getElementById("productDetails").innerHTML = "<h2>Product not found.</h2>";
    return;
  }

  document.getElementById("productDetails").innerHTML = `
    <div class="product-box">
      <img src="${product.image}" alt="${product.title}" />
      <div class="details">
        <h2>${product.title}</h2>
        <p class="price">Rs. ${parseFloat(product.price).toFixed(2)}</p>
        <p class="desc">${product.description || "No description available."}</p>
        <p>Stock: ${product.stock}</p>
        <p>Status: <span>${product.available}</span></p>
        <div class="button-row">
          <button id="addToCartBtn">Add to Cart</button>
          <button id="addToWishlistBtn">Add to Wishlist</button>
          <button id="BuyNowBtn">Buy Now</button>
        </div>
      </div>
    </div>
  `;

  setupButtons();
}

// Set up cart and wishlist button events
function setupButtons() {
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let exists = cart.find(p => p.id === product.id);

    if (exists) {
      exists.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart!");
  });

  document.getElementById("addToWishlistBtn").addEventListener("click", () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.find(p => p.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("❤️ Added to wishlist!");
    } else {
      alert("Already in wishlist.");
    }
  });

  // ✅ Buy Now: Save selected product and redirect to checkout
  document.getElementById("BuyNowBtn").addEventListener("click", () => {
    const buyNowProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image
    };

    localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));
    window.location.href = "checkout.html";
  });
}

// Render related products (4 others)
function renderRelatedProducts() {
  const container = document.getElementById("relatedProducts");
  if (!container) return;

  const related = products.filter(p => p.id !== product.id).slice(0, 4);
  if (related.length === 0) {
    container.innerHTML = "<p>No related products.</p>";
    return;
  }

  container.innerHTML = related.map(p => `
    <a href="product.html?id=${p.id}" class="related-card">
      <img src="${p.image}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>Rs. ${parseFloat(p.price).toFixed(2)}</p>
    </a>
  `).join('');
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();
  renderRelatedProducts();
});