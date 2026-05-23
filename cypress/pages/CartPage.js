// cypress/pages/CartPage.js

class CartPage {
  visit() {
    cy.get('[data-test="nav-cart"]').click();
    return this;
  }

  cartItems() {
    // Each row in the cart table is a <tr> inside the cart <tbody>
    return cy.get('app-cart tbody tr');
  }

  itemNameAt(index) {
    return cy.get('app-cart tbody tr').eq(index).find('td.col-md-4');
  }

  itemQuantityAt(index) {
    return cy.get('[data-test="product-quantity"]').eq(index);
  }

  itemLinePriceAt(index) {
    // Line total is the last td.col-md-2 in the row (the "Total" column)
    return cy.get('app-cart tbody tr').eq(index).find('td.col-md-2').last();
  }

  removeButtonAt(index) {
    // The remove (X) button is an <a> with class "btn-danger" inside each row
    return cy.get('a.btn.btn-danger').eq(index);
  }

  cartTotal() {
    // Total appears as $XX.XX in the cart footer
    return cy.contains("Total").parent().find("td").last();
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