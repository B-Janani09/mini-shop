
const products = [
  {
    id: "p101",
    name: "Cloud Headphones",
    category: "Electronics",
    description: "Wireless sound for your everyday adventures.",
    price: 2499,
    emoji: "🎧",
    background: "#eee8ff",
    tag: "BESTSELLER"
  },
  {
    id: "p102",
    name: "Everyday Backpack",
    category: "Accessories",
    description: "A comfy, roomy bag for wherever you go.",
    price: 1899,
    emoji: "🎒",
    background: "#fce9df",
    tag: "POPULAR"
  },
  {
    id: "p103",
    name: "Ceramic Mug",
    category: "Home",
    description: "Your favourite coffee deserves a lovely mug.",
    price: 499,
    emoji: "☕",
    background: "#e3f1e9",
    tag: "NEW"
  },
  {
    id: "p104",
    name: "Classic Sneakers",
    category: "Footwear",
    description: "Lightweight comfort for all-day movement.",
    price: 2299,
    emoji: "👟",
    background: "#e5edff",
    tag: "TRENDING"
  },
  {
    id: "p105",
    name: "Soft Desk Lamp",
    category: "Home",
    description: "A warm glow for your study or work space.",
    price: 999,
    emoji: "💡",
    background: "#fff1cf",
    tag: "NEW"
  },
  {
    id: "p106",
    name: "Mini Plant",
    category: "Lifestyle",
    description: "A little green friend for your desk.",
    price: 349,
    emoji: "🪴",
    background: "#e1f1dc",
    tag: "FAVOURITE"
  }
];

const productGrid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartItemsElement = document.getElementById("cart-items");
const summaryCount = document.getElementById("summary-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

const modal = document.getElementById("checkout-modal");
const closeModalButton = document.getElementById("close-modal");
const continueShoppingButton = document.getElementById("continue-shopping");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

const cart = new Map();

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);

function renderProducts() {
  productCount.textContent = `${products.length} items`;

  productGrid.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "product-art";
    art.style.setProperty("--product-bg", product.background);

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = product.tag;

    const emoji = document.createElement("span");
    emoji.className = "product-emoji";
    emoji.textContent = product.emoji;
    emoji.setAttribute("role", "img");
    emoji.setAttribute("aria-label", product.name);

    art.append(tag, emoji);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-button";
    addButton.textContent = "＋ Add to cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, addButton);
    info.append(category, name, description, bottom);
    card.append(art, info);
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const existing = cart.get(productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(productId, { productId, quantity: 1 });
  }

  renderCart();
}

function changeQuantity(productId, amount) {
  const item = cart.get(productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.delete(productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

function getCartDetails() {
  const items = [];

  for (const [productId, cartItem] of cart) {
    const product = products.find((item) => item.id === productId);

    if (!product || cartItem.quantity <= 0) continue;

    items.push({
      ...product,
      quantity: cartItem.quantity,
      lineTotal: product.price * cartItem.quantity
    });
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return { items, count, total };
}

function renderCart() {
  const { items, count, total } = getCartDetails();

  cartCount.textContent = count;
  summaryCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = items.length === 0;

  cartItemsElement.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-cart";
    emptyMessage.textContent =
      "Your cart is waiting for something lovely.";
    cartItemsElement.appendChild(emptyMessage);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const art = document.createElement("div");
    art.className = "cart-item-art";
    art.textContent = item.emoji;
    art.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");

    const name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent =
      `${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.lineTotal)}`;

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);
    decreaseButton.addEventListener("click", () =>
      changeQuantity(item.id, -1)
    );

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;
    quantity.setAttribute("aria-label", "Quantity");

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);
    increaseButton.addEventListener("click", () =>
      changeQuantity(item.id, 1)
    );

    quantityControls.append(decreaseButton, quantity, increaseButton);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFromCart(item.id));

    controls.append(quantityControls, removeButton);
    content.append(name, price, controls);
    row.append(art, content);
    cartItemsElement.appendChild(row);
  });
}

function openCheckout() {
  const { items, total } = getCartDetails();

  if (items.length === 0) return;

  checkoutItems.replaceChildren();

  items.forEach((item) => {
    const line = document.createElement("div");
    line.className = "checkout-line";

    const description = document.createElement("span");
    description.textContent = `${item.emoji} ${item.name} × ${item.quantity}`;

    const amount = document.createElement("span");
    amount.textContent = formatPrice(item.lineTotal);

    line.append(description, amount);
    checkoutItems.appendChild(line);
  });

  checkoutTotal.textContent = formatPrice(total);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeModalButton.focus();
}

function closeCheckout() {
  modal.hidden = true;
  document.body.style.overflow = "";
  checkoutButton.focus();
}

checkoutButton.addEventListener("click", openCheckout);
cartButton.addEventListener("click", () => {
  document.querySelector(".cart-panel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

closeModalButton.addEventListener("click", closeCheckout);
continueShoppingButton.addEventListener("click", closeCheckout);

modal.querySelector("[data-close-modal]").addEventListener(
  "click",
  closeCheckout
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeCheckout();
  }
});

renderProducts();
renderCart();
