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
const scrollUp = () => {
  const scrollUp = document.getElementById('scroll-up')
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
    : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
  const scrollDown = window.scrollY

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute('id'),
      sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add('active-link')
    } else {
      sectionsClass.classList.remove('active-link')
    }
  })
}
window.addEventListener('scroll', scrollActive)
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 300,
  //reset: true, //Animations repeat
});

sr.reveal('.home__data, .footer')
sr.reveal('.home__dish', { delay: 500, distance: '100px', origin: 'bottom' })
sr.reveal('.home__burger', { delay: 1200, distance: '100px', duration: 1500 })
sr.reveal('.home__ingredient', { delay: 1600, interval: 100 })
sr.reveal('.recipe__img,.delivery__img, .contact__image', { origin: 'left' })
sr.reveal('.recipe__data, .delivery__data, .contact__data', { origin: 'right' })
sr.reveal('.popular__card', { interval: 100 })



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
  const existingItem = cart.find(cartItem => cartItem.name === item.name);

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
  cartItemsContainer.innerHTML = ''; // Limpar itens anteriores
  let total = 0;

  cart.forEach(item => {
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
  const item = cart.find(cartItem => cartItem.name === name);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.name !== name);
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
document.querySelectorAll('.popular__button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.popular__card');
    const name = card.querySelector('.popular__title').textContent.trim();
    const price = parseFloat(card.querySelector('.popular__price').textContent.replace('$', ''));
    const image = card.querySelector('img').src;

    addToCart({ name, price, image });
  });
});
