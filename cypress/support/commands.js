// cypress/support/commands.js
// Reusable commands shared across all test specs.

Cypress.Commands.add("login", (email, password) => {
  const userEmail = email || Cypress.env("CUSTOMER_EMAIL");
  const userPassword = password || Cypress.env("CUSTOMER_PASSWORD");

  cy.visit("/auth/login");
  cy.get('[data-test="email"]').type(userEmail, { delay: 100 });
  cy.get('[data-test="password"]').type(userPassword, { delay: 100, log: false });
  cy.get('[data-test="login-submit"]').click();
  cy.wait(2000);
  cy.get('[data-test="nav-menu"]', { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("addFirstProductToCart", () => {
  cy.visit("/");
  cy.get('[data-test="product-name"]').first().invoke("text").as("productName");
  cy.get('[data-test="product-price"]').first().invoke("text").as("productPrice");
  cy.get('[data-test="product-name"]').first().click();
  cy.wait(1500);
  cy.get('[data-test="add-to-cart"]').click();
  cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("addProductByName", (productName) => {
  cy.visit("/");
  cy.contains('[data-test="product-name"]', productName).click();
  cy.wait(1500);
  cy.get('[data-test="add-to-cart"]').click();
  cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("filterByCategory", (categoryName) => {
  cy.visit("/");
  cy.contains("label", categoryName).find('input[type="checkbox"]').check();
  cy.wait(1500);
});

Cypress.Commands.add("openCart", () => {
  cy.get('[data-test="nav-cart"]').click();
  cy.url().should("include", "/checkout");
});