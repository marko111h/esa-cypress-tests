// cypress/pages/CheckoutPage.js
// Covers Guest Checkout flow: Sign In step → Billing → Payment

class CheckoutPage {
  // ----- Sign In step (Guest mode) -----
  guestEmail() {
    return cy.get('[data-test="guest-email"]');
  }
  guestFirstName() {
    return cy.get('[data-test="guest-first-name"]');
  }
  guestLastName() {
    return cy.get('[data-test="guest-last-name"]');
  }
  continueAsGuestButton() {
    return cy.get('[data-test="guest-submit"]');
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
  houseNumber() {
    return cy.get('[data-test="house_number"]');
  }
  proceed3Button() {
    return cy.get('[data-test="proceed-3"]');
  }

  // ----- Payment step -----
  paymentMethod() {
    return cy.get('[data-test="payment-method"]');
  }

  // Bank Transfer fields
  bankName() {
    return cy.get('[data-test="bank_name"]');
  }
  accountName() {
    return cy.get('[data-test="account_name"]');
  }
  accountNumber() {
    return cy.get('[data-test="account_number"]');
  }

  // Credit Card fields
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

  // Buy Now Pay Later fields
  monthlyInstallments() {
    return cy.get('[data-test="monthly_installments"]');
  }

  // Gift Card fields
  giftCardNumber() {
    return cy.get('[data-test="gift_card_number"]');
  }
  validationCode() {
    return cy.get('[data-test="validation_code"]');
  }

  // Confirm & success
  confirmButton() {
    return cy.get('[data-test="finish"]');
  }
  paymentSuccessMessage() {
    return cy.contains("Payment was successful");
  }
}

export default new CheckoutPage();