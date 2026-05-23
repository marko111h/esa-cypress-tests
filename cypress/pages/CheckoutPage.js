// cypress/pages/CheckoutPage.js
// Covers Sign In step, Billing Address step, and Payment step.

class CheckoutPage {
  // ----- Sign In step -----
  signInEmail() {
    return cy.get('[data-test="email"]');
  }
  signInPassword() {
    return cy.get('[data-test="password"]');
  }
  signInSubmit() {
    return cy.get('[data-test="login-submit"]');
  }
  proceed2Button() {
    return cy.get('[data-test="proceed-2"]');
  }

  // ----- Billing Address step -----
  street() {
    return cy.get('[data-test="street"]');
  }
  city() {
    return cy.get('[data-test="city"]');
  }
  state() {
    return cy.get('[data-test="state"]');
  }
  country() {
    return cy.get('[data-test="country"]');
  }
  postcode() {
    return cy.get('[data-test="postal_code"]');
  }
  proceed3Button() {
    return cy.get('[data-test="proceed-3"]');
  }

  // ----- Payment step -----
  paymentMethod() {
    return cy.get('[data-test="payment-method"]');
  }
  bankName() {
    return cy.get('[data-test="bank_name"]');
  }
  accountName() {
    return cy.get('[data-test="account_name"]');
  }
  accountNumber() {
    return cy.get('[data-test="account_number"]');
  }
  creditCardNumber() {
    return cy.get('[data-test="credit_card_number"]');
  }
  expirationDate() {
    return cy.get('[data-test="expiration_date"]');
  }
  cvv() {
    return cy.get('[data-test="cvv"]');
  }
  cardHolder() {
    return cy.get('[data-test="card_holder_name"]');
  }
  confirmButton() {
    return cy.get('[data-test="finish"]');
  }
  paymentSuccessMessage() {
    return cy.contains("Payment was successful");
  }

  fillBillingAddress({ street, city, state, country, postcode }) {
    if (street) this.street().clear().type(street);
    if (city) this.city().clear().type(city);
    if (state) this.state().clear().type(state);
    if (country) this.country().select(country);
    if (postcode) this.postcode().clear().type(postcode);
    return this;
  }

  payWithBankTransfer({ bank, accountName, accountNumber }) {
    this.paymentMethod().select("bank-transfer");
    this.bankName().type(bank);
    this.accountName().type(accountName);
    this.accountNumber().type(accountNumber);
    this.confirmButton().click();
    return this;
  }
}

export default new CheckoutPage();
