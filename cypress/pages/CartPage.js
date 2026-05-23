// cypress/pages/CartPage.js

class CartPage {
  visit() {
    cy.get('[data-test="nav-cart"]').click();
    return this;
  }

  cartItems() {
    return cy.get('[data-test="cart-item"]');
  }

  itemNameAt(index) {
    return cy.get('[data-test="product-title"]').eq(index);
  }

  itemQuantityAt(index) {
    return cy.get('[data-test="product-quantity"]').eq(index);
  }

  itemLinePriceAt(index) {
    return cy.get('[data-test="line-price"]').eq(index);
  }

  removeButtonAt(index) {
    return cy.get('[data-test="product-delete"]').eq(index);
  }

  cartTotal() {
    return cy.get('[data-test="cart-total"]');
  }

  proceedToCheckoutButton() {
    return cy.get('[data-test="proceed-1"]');
  }

  emptyCartMessage() {
    return cy.contains("The cart is empty");
  }

  setQuantityAt(index, qty) {
    this.itemQuantityAt(index).clear().type(String(qty)).blur();
    return this;
  }

  removeItemAt(index) {
    this.removeButtonAt(index).click();
    return this;
  }

  proceedToCheckout() {
    this.proceedToCheckoutButton().click();
    return this;
  }
}

export default new CartPage();
