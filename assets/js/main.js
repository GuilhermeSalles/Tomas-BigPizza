/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  this.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};
window.addEventListener("scroll", shadowHeader);

/*=============== SHOW SCROLL UP ===============*/
// const scrollUp = () => {
//   const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
//   this.scrollY >= 350
//     ? scrollUp.classList.add("show-scroll")
//     : scrollUp.classList.remove("show-scroll");
// };
// window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]"
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 300,
  //reset: true, //Animations repeat
});

sr.reveal(".home__data, .footer");
sr.reveal(".home__dish", { delay: 500, distance: "100px", origin: "bottom" });
sr.reveal(".home__burger", { delay: 1200, distance: "100px", duration: 1500 });
sr.reveal(".home__ingredient", { delay: 1600, interval: 100 });
sr.reveal(".recipe__img,.delivery__img, .contact__image", { origin: "left" });
sr.reveal(".recipe__data, .delivery__data, .contact__data", {
  origin: "right",
});
sr.reveal(".popular__card", { interval: 100 });

/*=============== SACOLA E MODAL ===============*/
let cart = [];
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Função para adicionar item ao carrinho
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCartCount();
  updateCartModal();
}

// Atualizar contador de itens no ícone da sacola
function updateCartCount() {
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = itemCount;
}

// Atualizar o conteúdo do modal
function updateCartModal() {
  cartItemsContainer.innerHTML = ""; // Limpar itens anteriores
  let total = 0;

  cart.forEach((item) => {
    total += item.quantity * item.price;
    cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Atualizar quantidade de itens no carrinho
function updateQuantity(name, change) {
  const item = cart.find((cartItem) => cartItem.name === name);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.name !== name);
    }

    updateCartCount();
    updateCartModal();
  }
}

// Exibir modal
cartIcon.addEventListener("click", () => {
  cartModal.style.display = "block";
});

// Fechar modal
closeModal.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Adicionar evento nos botões de adicionar ao carrinho
document.querySelectorAll(".popular__button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".popular__card");
    const name = card.querySelector(".popular__title").textContent.trim();
    const price = parseFloat(
      card.querySelector(".popular__price").textContent.replace("$", "")
    );
    const image = card.querySelector("img").src;

    addToCart({ name, price, image });
  });
});

// Enivo pedido
// Função para enviar o pedido para o WhatsApp
document.getElementById("submit-order").addEventListener("click", function () {
  const name = document.getElementById("customer-name").value;
  const address = document.getElementById("customer-address").value;
  const serviceType = document.getElementById("service-type").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const observation = document.getElementById("customer-observation").value;

  if (!name || !address || cart.length === 0) {
    alert(
      "Please fill out all required fields and make sure you have items in your cart."
    );
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Formatando os itens do carrinho
  const cartItemsText = cart
    .map((item) => `${item.name}: £${item.price} x ${item.quantity}`)
    .join("\n");

  // Mensagem formatada
  let message = `🗓️ ${currentDate}\n\n🚚 *Service type:* ${serviceType}\n-------------------------------------------\nHello, my name is ${name}, I'd like to place an order.\n📍 *Address:* ${address}\n\n📝 *Products:*\n${cartItemsText}\n\n📝 *Observation:* ${observation}\n\n🧾 *Summary*\n\nSubtotal: £${cartTotal.textContent}\nDelivery: £ 0.00\nTotal: £${cartTotal.textContent}\n\n💲 *Payments:* ${paymentMethod}`;

  // Adiciona os dados da conta bancária se o método de pagamento for "Bank Transfer"
  if (paymentMethod === "Bank Transfer") {
    message += `\n\n🏦 *Here are my Nationwide account details:*\n\n*Name:* MR Tomas Recchia\n*Sort code:* 07-04-36\n*Account number:* 26000636`;
  }

  // Substituir espaços por %20 para conformidade com a URL
  const whatsappMessage = encodeURIComponent(message);

  // Número do WhatsApp para envio (alterar conforme necessário)
  const whatsappNumber = "5519983223688"; // Número fictício para exemplo
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Abrir o WhatsApp com a mensagem formatada
  window.open(whatsappUrl, "_blank");
});
// Dados dos itens com suas descrições, ajustando os caminhos das imagens
const itemInfo = {
  "Chicken Burger": {
    img: "assets/img/popular-burger-chicken.png",
    description:
      "A delicious chicken burger made with a crispy chicken fillet, lettuce, tomato, and mayonnaise on a toasted bun.",
  },
  "Meat Burger": {
    img: "assets/img/popular-burger-meat.png",
    description:
      "Juicy meat burger with cheddar cheese, lettuce, tomato, pickles, onions, and our signature sauce.",
  },
  "Grill Burger": {
    img: "assets/img/popular-burger-grill.png",
    description:
      "A grilled burger with smoked bacon, cheddar cheese, barbecue sauce, lettuce, and tomato.",
  },
  "Classic Burger": {
    img: "assets/img/popular-burger-classic.png",
    description:
      "Classic burger with a beef patty, cheddar cheese, lettuce, tomato, and ketchup, served on a toasted bun.",
  },
  "Big Burger": {
    img: "assets/img/popular-burger-big.png",
    description:
      "Our biggest burger yet, featuring two beef patties, bacon, cheese, lettuce, tomato, onions, and our secret sauce.",
  },
};

// Função para abrir o modal com as informações do item
function openInfoModal(title) {
  const modal = document.getElementById("info-modal");
  const modalImg = document.getElementById("info-modal-img");
  const modalTitle = document.getElementById("info-modal-title");
  const modalDescription = document.getElementById("info-modal-description");

  // Verificar se o item existe no objeto itemInfo
  if (itemInfo[title]) {
    // Ajusta o caminho da imagem e o conteúdo do modal
    modalImg.src = itemInfo[title].img;
    modalTitle.textContent = title;
    modalDescription.textContent = itemInfo[title].description;
  } else {
    // Caso o item não seja encontrado, exibe uma mensagem de erro no modal
    modalTitle.textContent = "Item not found";
    modalImg.src = ""; // Não exibe nenhuma imagem
    modalDescription.textContent =
      "Sorry, no description available for this item.";
  }

  // Exibe o modal
  modal.style.display = "block";
}

// Seleciona todos os botões de informações e adiciona evento de clique
document.querySelectorAll(".info__button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = button.closest(".popular__card");
    const title = card.querySelector(".popular__title").textContent.trim();
    openInfoModal(title);
  });
});

// Fecha o modal ao clicar no botão de fechar
document.getElementById("close-info-modal").addEventListener("click", () => {
  document.getElementById("info-modal").style.display = "none";
});

// Definir horários de abertura e fechamento
const openingTime = 9; // 9:00 AM
const closingTime = 22; // 10:00 PM

// Verificar horário atual da Irlanda do Norte
function isWithinOperatingHours() {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset(); // Diferença do UTC em minutos
    const currentTime = new Date(now.getTime() + utcOffset * 60 * 1000); // Convertendo para UTC
    
    // Converter o fuso horário da Irlanda do Norte (atualmente segue o BST no horário de verão ou GMT no inverno)
    const irelandTime = new Date(currentTime.getTime() + (60 * 60 * 1000)); // Adiciona 1 hora ao UTC

    const currentHour = irelandTime.getHours();
    
    // Verificar se está entre o horário de abertura e fechamento
    return currentHour >= openingTime && currentHour < closingTime;
}

// Função para habilitar/desabilitar botões e sacola
function updateButtonAndCartState() {
    const cartIcon = document.getElementById('cart-icon');
    const buttons = document.querySelectorAll('.popular__button');
    const statusModal = document.getElementById('status-modal');
    const closeModal = document.getElementById('close-status-modal');

    if (isWithinOperatingHours()) {
        // Habilitar sacola e botões
        cartIcon.classList.remove('disabled');
        buttons.forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });

        // Esconder modal de status
        statusModal.style.display = "none";
    } else {
        // Desabilitar sacola e botões
        cartIcon.classList.add('disabled');
        buttons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });

        // Mostrar modal com horário de funcionamento
        statusModal.style.display = "block";
    }

    // Fecha o modal ao clicar no botão de fechar
    closeModal.addEventListener("click", () => {
        statusModal.style.display = "none";
    });
}

// Verificar o estado no carregamento da página
window.onload = updateButtonAndCartState;
