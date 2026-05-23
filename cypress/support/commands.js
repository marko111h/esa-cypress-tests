// cypress/support/commands.js
// Reusable commands shared across all test specs.

/**
 * Login through the UI.
 * Usage: cy.login() or cy.login('email@x.com', 'password')
 */
Cypress.Commands.add("login", (email, password) => {
  const userEmail = email || Cypress.env("CUSTOMER_EMAIL");
  const userPassword = password || Cypress.env("CUSTOMER_PASSWORD");

  cy.visit("/auth/login");
  cy.get('[data-test="email"]').type(userEmail);
  cy.get('[data-test="password"]').type(userPassword, { log: false });
  cy.get('[data-test="login-submit"]').click();

  // After successful login, the user menu shows the customer name
  cy.get('[data-test="nav-menu"]', { timeout: 10000 }).should("be.visible");
});

/**
 * Add the first product on the home page to the cart.
 * Returns (via alias '@addedProduct') the product name and price.
 */
Cypress.Commands.add("addFirstProductToCart", () => {
  cy.visit("/");
  cy.get('[data-test="product-name"]').first().invoke("text").as("productName");
  cy.get('[data-test="product-price"]').first().invoke("text").as("productPrice");
  cy.get('[data-test="product-name"]').first().click();
  cy.get('[data-test="add-to-cart"]').click();
  cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should("be.visible");
});

/**
 * Add a specific product (by visible name) to the cart from the home page.
 */
Cypress.Commands.add("addProductByName", (productName) => {
  cy.visit("/");
  cy.contains('[data-test="product-name"]', productName).click();
  cy.get('[data-test="add-to-cart"]').click();
  cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should("be.visible");
});

/**
 * Filter products by a category checkbox label (e.g. "Hammer").
 */
Cypress.Commands.add("filterByCategory", (categoryName) => {
  cy.visit("/");
  cy.contains("label", categoryName).find('input[type="checkbox"]').check();
});

/**
 * Open the cart page.
 */
Cypress.Commands.add("openCart", () => {
  cy.get('[data-test="nav-cart"]').click();
  cy.url().should("include", "/checkout");
});
