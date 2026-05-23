// cypress/pages/ProductDetailPage.js

class ProductDetailPage {
  productTitle() {
    return cy.get('[data-test="product-name"]');
  }

  productPrice() {
    return cy.get('[data-test="unit-price"]');
  }

  quantityInput() {
    return cy.get('[data-test="quantity"]');
  }

  addToCartButton() {
    return cy.get('[data-test="add-to-cart-button"]');
  }

  toast() {
    return cy.get('[data-test="add-to-cart-message"], #toast-container');
  }

  setQuantity(qty) {
    this.quantityInput().clear().type(String(qty));
    return this;
  }

  addToCart() {
    this.addToCartButton().click();
    // Confirm the cart counter updated
    cy.get('[data-test="cart-quantity"]', { timeout: 10000 }).should("be.visible");
    return this;
  }
}

export default new ProductDetailPage();
