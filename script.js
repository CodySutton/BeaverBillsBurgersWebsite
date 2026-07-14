'use strict';

/////////////////////////////////////////////////////////////////////////////
// Show Cart
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.closeBtn');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.container-menu');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let addToCartButtons = document.querySelectorAll('.add-cart');
let cartTab = document.querySelector('.cartTab');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

//// Show Menu using JSON
// const addDataToHTML = () => {
//   listProductHTML.innerHTML = '';
//   if (listProducts.length > 0) {
//     listProducts.forEach(product => {
//       let newProduct = document.createElement('div');
//       newProduct.classList.add('item');
//       newProduct.innerHTML = `
//                   <li id="${product.id}">
//                   <div class="food-title-area">
//                     <h3 class="food-item">${product.foodItem}</h3>
//                     <button class="add-cart">+</button>
//                   </div>
//                   <p class="description">
//                     ${product.description}
//                   </p>
//                   <p class="price">${product.price}</p>
//                   <p class="kcal">${product.kcal}</p>
//                   </li>
//       `;
//       listProductHTML.appendChild(newProduct);
//     });
//   }
// };

// Adds item to cart array
const addToCart = itemId => {
  let positionThisProductInCart = carts.findIndex(
    value => value.itemId == itemId
  );
  if (carts.length <= 0) {
    carts = [
      {
        itemId: itemId,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      itemId: itemId,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCarToMemory();
};

// Save cart to memory
const addCarToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
};

// This adds to the Shopping Cart
const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.dataset.id = cart.itemId;
      let positionProduct = listProducts.findIndex(
        value => value.id == cart.itemId
      );
      let infoItem = listProducts[positionProduct];
      newCart.innerHTML = `
                              <div class="cartItem">
                                <div class="name">
                                  ${infoItem.foodItem}
                                </div>
                                <div class="totalPrice">
                                  £${infoItem.price * cart.quantity}
                                </div>
                                <div class="quantity">
                                  <span class="minus"><</span>
                                  <span>${cart.quantity}</span>
                                  <span class="plus">></span>
                                </div>
                              </div>`;
      listCartHTML.appendChild(newCart);
    });
  }
  iconCartSpan.innerHTML = totalQuantity;
};

// Add to Cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', function (event) {
    let itemClicked = event.target;
    let itemId = itemClicked.parentElement.parentElement.id;
    addToCart(itemId);
  });
});

// Checks of Plus or Minus is clicked
listCartHTML.addEventListener('click', function (event) {
  let itemClicked = event.target;
  if (
    itemClicked.classList.contains('minus') ||
    itemClicked.classList.contains('plus')
  ) {
    let itemId =
      itemClicked.parentElement.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if (itemClicked.classList.contains('plus')) {
      type = 'plus';
    }
    changeQuantity(itemId, type);
  }
});

// Change quantity of item in cart
const changeQuantity = (itemId, type) => {
  let positionItemInCart = carts.findIndex(value => value.itemId == itemId);
  if (positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;

      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCarToMemory();
  addCartToHTML();
};
// Get data from json file
const initApp = () => {
  fetch('menu.json')
    .then(response => response.json())
    .then(data => {
      listProducts = data;
      // addDataToHTML();

      // Gets cart from memory
      if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
    });
};
initApp();

// Function to handle cartTab visibility based on scroll position
const updateCartTabVisibility = () => {
  if (window.scrollY > 800 && window.scrollY < 2280) {
    cartTab.classList.add('cartTab-scroll');
    body.classList.add('showCart');
    body.classList.remove('showCartStart');
  } else {
    cartTab.classList.remove('cartTab-scroll');
    body.classList.remove('showCart');
  }
};

// Ensure initial state of cartTab on page load
document.addEventListener('DOMContentLoaded', function () {
  updateCartTabVisibility();
});

// Update cartTab visibility on scroll
window.addEventListener('scroll', updateCartTabVisibility);

// const fixedBox = document.querySelector('.cartTab');
// const section = document.querySelector('.menu');

// window.addEventListener('scroll', () => {
//   const sectionTop = section.offsetTop;
//   const sectionBottom = sectionTop + section.offsetHeight;
//   const scrollY = window.scrollY;

//   if (
//     scrollY >= sectionTop &&
//     scrollY <= sectionBottom - fixedBox.offsetHeight
//   ) {
//     fixedBox.style.position = 'fixed';
//     fixedBox.style.top = '20px';
//   } else {
//     fixedBox.style.position = 'absolute';
//     fixedBox.style.top =
//       scrollY > sectionBottom
//         ? `${sectionBottom - sectionTop - fixedBox.offsetHeight}px`
//         : `0px`;
//   }
// });

// ai method to have cart remain only on menu page
// document.addEventListener('scroll', function () {
//   const menuSection = document.querySelector('#menu');
//   const cartTab = document.querySelector('.cartTab');

//   const menuRect = menuSection.getBoundingClientRect();

//   // Check if the #menu section is in the viewport
//   if (menuRect.top <= 0 && menuRect.bottom >= 0) {
//     cartTab.style.visibility = 'visible'; // Show the cartTab
//     cartTab.style.opacity = '1'; // Smoothly fade in
//   } else {
//     cartTab.style.visibility = 'hidden'; // Hide the cartTab
//     cartTab.style.opacity = '0'; // Smoothly fade out
//   }
// });

/////////////////////////////////////////////////////////////////////////////
// Food of Day Reveal
const mains = document.querySelectorAll('.food-main');
const sides = document.querySelectorAll('.food-side');
const dips = document.querySelectorAll('.food-dip');
const drinks = document.querySelectorAll('.food-drink');
//
const mainPrices = document.querySelectorAll('.price-main');
const sidePrices = document.querySelectorAll('.price-side');
const dipPrices = document.querySelectorAll('.price-dip');
const drinkPrices = document.querySelectorAll('.price-drink');
//
const mainKcals = document.querySelectorAll('.kcal-main');
const sideKcals = document.querySelectorAll('.kcal-side');
const dipKcals = document.querySelectorAll('.kcal-dip');
const drinkKcals = document.querySelectorAll('.kcal-drink');
//
const drinkItems = document.querySelectorAll('.description-drink');
// drinkPriceArray & drinkKcalArray to be redone so not hardcoded
const drinkPriceArray = [
  '£4.49',
  '£4.49',
  '£4.99',
  '£1.99',
  '£1.99',
  '£1.99',
  '£1.99',
  '£1.99',
];
const drinkKcalArray = ['750', '700', '800', '140', '140', '140', '140', '140'];

// Function to handle the reveal logic
function revealItem(category, prices, className) {
  const itemsArray = Array.from(category, item => item.textContent);
  const randomNumber = Math.floor(Math.random() * itemsArray.length);
  document.getElementsByClassName(`food-day-${className}`)[0].textContent =
    itemsArray[randomNumber];
  const priceArray = Array.from(prices, price => price.textContent);
  document.getElementsByClassName(
    `food-day-price-${className}`
  )[0].textContent = priceArray[randomNumber];
}

// Drinks
const drinksArray = Array.from(drinks, drink => drink.textContent);
const softDrinks = Array.from(drinkItems, drink => drink.textContent).join(',');
const softDrinksNew = softDrinks.split(',');

const allDrinks = drinksArray.slice(2);
const allNewDrinks = allDrinks.concat(softDrinksNew);

// Reveal button
const revealButton = document.querySelector('.reveal-button');
revealButton.addEventListener('click', function () {
  // Mains
  revealItem(mains, mainPrices, 'main');

  // Sides
  revealItem(sides, sidePrices, 'side');

  // Dips
  revealItem(dips, dipPrices, 'dip');

  // Drinks
  // revealItem(drinks, drinkPrices, 'drink');
  const drinksRandomNumber = Math.floor(Math.random() * allNewDrinks.length);
  document.getElementsByClassName('food-day-drink')[0].textContent =
    allNewDrinks[drinksRandomNumber];
  document.getElementsByClassName(
    'food-day-price-drink'
  )[0].textContent = `${drinkPriceArray[drinksRandomNumber]} | ${drinkKcalArray[drinksRandomNumber]} kcal`;
});

/////////////////////////////////////////////////////////////////////////////
// Locations Scroll
document.addEventListener('DOMContentLoaded', function () {
  const horizontalScrollSection = document.querySelector(
    '.horizontal-scroll-section'
  );

  horizontalScrollSection.addEventListener('wheel', function (event) {
    if (event.deltaY !== 0) {
      horizontalScrollSection.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  });
});
