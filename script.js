document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: 1,
      name: "Waffle with Berries",
      price: 6.5,
      imageUrl: "assets/images.waffle jpg",
    },
    {
      id: 2,
      name: "Vanilla Bean Crème Brûlée",
      price: 7.0,
      imageUrl: "path/to/image2.jpg",
    },
    {
      id: 3,
      name: "Macaron Mix of Five",
      price: 8.0,
      imageUrl: "path/to/image3.jpg",
    },
    {
      id: 4,
      name: "Classic Tiramisu",
      price: 5.5,
      imageUrl: "path/to/image4.jpg",
    },
    {
      id: 5,
      name: "Pistachio Baklava",
      price: 4.0,
      imageUrl: "path/to/image5.jpg",
    },
    {
      id: 6,
      name: "Lemon Meringue Pie",
      price: 5.0,
      imageUrl: "path/to/image6.jpg",
    },
    {
      id: 7,
      name: "Red Velvet Cake",
      price: 5.5,
      imageUrl: "path/to/image7.jpg",
    },
    {
      id: 8,
      name: "Salted Caramel Brownie",
      price: 4.5,
      imageUrl: "path/to/image8.jpg",
    },
    {
      id: 9,
      name: "Vanilla Panna Cotta",
      price: 6.5,
      imageUrl: "path/to/image9.jpg",
    },
  ];

  const cart = {};
  const cartItemsList = document.getElementById("cart-items");
  const confirmOrderBtn = document.getElementById("confirm-order");
  const startNewOrderBtn = document.getElementById("start-new-order");
  const modal = document.getElementById("confirmation-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const cartTitle = document.querySelector(".cart h3");

  const productQuantities = {};

  products.forEach((product) => {
    productQuantities[product.id] = 1;
  });

  // Handle quantity change for each product
  document.querySelectorAll(".inline-quantity-controls").forEach((control) => {
    const wrapper = control.closest(".wrapper");
    const id = Number(wrapper.dataset.id);
    const plusBtn = control.querySelector(".plus");
    const minusBtn = control.querySelector(".minus");
    const quantityEl = control.querySelector(".quantity");

    plusBtn.addEventListener("click", () => {
      cart[id].quantity++;
      productQuantities[id] = cart[id].quantity;
      quantityEl.textContent = cart[id].quantity;
      renderCart();
    });

    minusBtn.addEventListener("click", () => {
      cart[id].quantity--;
      if (cart[id].quantity <= 0) {
        delete cart[id];
        productQuantities[id] = 1;

        // Swap UI
        control.style.display = "none";
        wrapper.querySelector(".add-to-cart").style.display = "inline-block";
      } else {
        productQuantities[id] = cart[id].quantity;
        quantityEl.textContent = cart[id].quantity;
      }
      renderCart();
    });
  });

  // Handle image click to activate the Add to Cart button
  document.querySelectorAll(".product-image").forEach((image) => {
    image.addEventListener("click", () => {
      document
        .querySelectorAll(".add-to-cart-overlay")
        .forEach((overlay) => overlay.classList.remove("active"));

      // Füge "selected" zum geklickten Bild hinzu
      image.classList.add("selected");

      // Optional: Aktiviere den Add-to-Cart Button
      const overlay = image
        .closest(".image-container")
        .querySelector(".add-to-cart-overlay");
      overlay.classList.add("active");
    });
  });

  // Handle Add to Cart click (after selecting the quantity)
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest(".wrapper");
      const id = Number(button.dataset.id);
      const product = products.find((p) => p.id === id);

      // Add to cart with quantity 1
      cart[id] = { ...product, quantity: 1 };
      productQuantities[id] = 1;

      renderCart();

      // Swap UI
      button.style.display = "none";
      const quantityControls = wrapper.querySelector(
        ".inline-quantity-controls"
      );
      quantityControls.style.display = "inline-flex";
      quantityControls.querySelector(".quantity").textContent = "1";
    });
  });

  document.querySelectorAll(".wrapper").forEach((wrapper) => {
    const addToCartOverlay = wrapper.querySelector(".add-to-cart-overlay");

    addToCartOverlay.addEventListener("mouseenter", () => {
      addToCartOverlay.classList.add("active");
    });

    addToCartOverlay.addEventListener("mouseleave", () => {
      addToCartOverlay.classList.remove("active");
    });
  });

  // Remove item from cart
  function removeFromCart(id) {
    delete cart[id];
    renderCart();
  }

  // Update cart quantity
  function updateQuantity(id, change) {
    if (!cart[id]) return;
    cart[id].quantity += change;
    if (cart[id].quantity <= 0) removeFromCart(id);
    renderCart();
  }

  // Get total quantity in cart
  function getTotalQuantity() {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get total price in cart
  function getTotalPrice() {
    return Object.values(cart).reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }

  // Render cart UI
  function renderCart() {
    cartItemsList.innerHTML = "";
    const items = Object.values(cart);
    const emptyCartImage = document.getElementById("empty-cart-image");

    if (items.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Your added items will appear here";
      cartItemsList.appendChild(emptyMessage);

      cartTitle.innerHTML = "Your Cart (0)";
      emptyCartImage.style.display = "block";
      return;
    }

    // Wenn Produkte im Cart sind → Bild ausblenden
    if (emptyCartImage) emptyCartImage.style.display = "none";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
        <div class="quantity-controls">
          <button aria-label="Decrease quantity" tabindex="0">−</button>
          <button aria-label="Increase quantity" tabindex="0">+</button>
          <button aria-label="Remove item" tabindex="0">🗑</button>
        </div>
      `;
      const [decreaseBtn, increaseBtn, removeBtn] =
        li.querySelectorAll("button");
      decreaseBtn.addEventListener("click", () => updateQuantity(item.id, -1));
      increaseBtn.addEventListener("click", () => updateQuantity(item.id, 1));
      removeBtn.addEventListener("click", () => removeFromCart(item.id));
      cartItemsList.appendChild(li);
    });

    const total = document.createElement("div");
    total.className = "cart-total";
    total.textContent = `Total: $${getTotalPrice().toFixed(2)}`;
    cartItemsList.appendChild(total);

    cartTitle.innerHTML = `Your Cart (${getTotalQuantity()})`;
  }

  // Confirm Order button handler
  confirmOrderBtn.addEventListener("click", () => {
    if (getTotalQuantity() === 0) return alert("Cart is empty.");

    const orderedItemsList = document.getElementById("order-items-list");
    const orderTotal = document.getElementById("order-total");

    orderedItemsList.innerHTML = "";

    Object.values(cart).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="order-item-image" />
      ${item.name} 
      <div class="price-quantity">
        ${item.quantity}x @ $${item.price.toFixed(2)} 
        <span class="total-price">$${(item.quantity * item.price).toFixed(
          2
        )}</span>
      </div>
    `;
      orderedItemsList.appendChild(li);
    });

    orderTotal.textContent = `Total: $${getTotalPrice().toFixed(2)}`;

    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");

    products.forEach((product) => {
      productQuantities[product.id] = 1;
    });

    /* cart = {}; */
    renderCart();
  });

  cartTitle.innerHTML = `Your Cart (${getTotalQuantity()})`;

  // Close modal button handler
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  startNewOrderBtn.addEventListener("click", () => {
    Object.keys(cart).forEach((id) => delete cart[id]);
    renderCart();

    modal.style.display = "none";

    // Reset UI: show "Add to Cart" buttons, hide quantity controls
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.style.display = "inline-block";
      btn.classList.remove("active");
    });

    document.querySelectorAll(".inline-quantity-controls").forEach((ctrl) => {
      ctrl.style.display = "none";
    });

    // Reset quantities in UI
    products.forEach((product) => {
      productQuantities[product.id] = 1;
      const wrapper = document.querySelector(
        `.wrapper[data-id="${product.id}"]`
      );
      if (wrapper) {
        wrapper.querySelector(".quantity").textContent = "1";
      }
    });
  });

  // Funktion zum Aktualisieren der Menge
  function updateQuantity(productId, action) {
    const quantityElement = document.querySelector(
      `#product-${productId} .quantity`
    );
    let quantity = parseInt(quantityElement.textContent);

    if (action === "increment") {
      quantity++;
    } else if (action === "decrement" && quantity > 0) {
      quantity--;
    }

    // Aktualisiere die Menge in der UI
    quantityElement.textContent = quantity;

    // Wenn die Menge 0 ist, setze den Button zurück auf "Add to Cart"
    const addToCartButton = document.querySelector(
      `#product-${productId} .add-to-cart`
    );

    if (quantity === 0) {
      addToCartButton.classList.remove("active");
      addToCartButton.querySelector(".default-text").style.display = "block"; // Zeige den Text „Add to Cart“ an
      addToCartButton.querySelector(".quantity-selector").style.display =
        "none"; // Verstecke die Mengensteuerung
    } else {
      addToCartButton.classList.add("active");
      addToCartButton.querySelector(".default-text").style.display = "none"; // Verstecke den Text „Add to Cart“
      addToCartButton.querySelector(".quantity-selector").style.display =
        "flex"; // Zeige die Mengensteuerung an
    }
  }

  // Beispiel für Event-Listener für den Minus-Button
  const decrementButton = document.querySelector(".decrement-button"); // Der Minus-Button
  decrementButton.addEventListener("click", function () {
    updateQuantity(productId, "decrement");
  });

  // Beispiel für Event-Listener für den Plus-Button
  const incrementButton = document.querySelector(".increment-button"); // Der Plus-Button
  incrementButton.addEventListener("click", function () {
    updateQuantity(productId, "increment");
  });

  // Render cart UI
  function renderCart() {
    cartItemsList.innerHTML = "";
    const items = Object.values(cart);
    const emptyCartImage = document.getElementById("empty-cart-image");

    if (items.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Your added items will appear here";
      cartItemsList.appendChild(emptyMessage);

      cartTitle.innerHTML = "Your Cart (0)";
      emptyCartImage.style.display = "block";
      return;
    }

    if (emptyCartImage) emptyCartImage.style.display = "none";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
     <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image" />
      ${item.name} 
      <div class="price-quantity">
        ${item.quantity}x @ $${item.price.toFixed(2)} 
        <span class="total-price">$${(item.quantity * item.price).toFixed(
          2
        )}</span>
      </div>
      <div class="quantity-controls">
        <button aria-label="Decrease quantity" tabindex="0">−</button>
        <button aria-label="Increase quantity" tabindex="0">+</button>
        <button aria-label="Remove item" tabindex="0">🗑</button>
      </div>
    `;
      const [decreaseBtn, increaseBtn, removeBtn] =
        li.querySelectorAll("button");
      decreaseBtn.addEventListener("click", () =>
        updateQuantity(item.id, "decrement")
      );
      increaseBtn.addEventListener("click", () =>
        updateQuantity(item.id, "increment")
      );
      removeBtn.addEventListener("click", () => removeFromCart(item.id));
      cartItemsList.appendChild(li);
    });

    const total = document.createElement("div");
    total.className = "cart-total";
    total.textContent = `Total: $${getTotalPrice().toFixed(2)}`;
    cartItemsList.appendChild(total);

    cartTitle.innerHTML = `Your Cart (${getTotalQuantity()})`;
  }

  // Confirm Order button handler
  confirmOrderBtn.addEventListener("click", () => {
    if (getTotalQuantity() === 0) return alert("Cart is empty.");

    const orderedItemsList = document.getElementById("order-items-list");
    const orderTotal = document.getElementById("order-total");

    orderedItemsList.innerHTML = "";

    Object.values(cart).forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="order-item-image" />
      ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
    `;
      orderedItemsList.appendChild(li);
    });

    orderTotal.textContent = `Total: $${getTotalPrice().toFixed(2)}`;

    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("role", "dialog");
  });
});
