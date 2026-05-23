// cypress/e2e/04-checkout.cy.js
// Tests for Checkout & Payment (Guest mode)

import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";

/**
 * Reusable helper — brings cart to Payment step via guest checkout flow.
 */
function goToPaymentStep() {
  HomePage.visit();
  HomePage.productNames().first().click();
  ProductDetailPage.addToCart();

  CartPage.visit();
  cy.wait(1000);
  CartPage.proceedToCheckout();
  cy.wait(2000);

  // Click "Continue as Guest" tab
  cy.contains("a", "Continue as Guest").click();
  cy.wait(1500);

  // Fill guest fields
  CheckoutPage.guestEmail().type("marko.test@example.com", { delay: 50 });
  CheckoutPage.guestFirstName().type("Marko", { delay: 50 });
  CheckoutPage.guestLastName().type("Djordjevic", { delay: 50 });
  CheckoutPage.continueAsGuestButton().click();
  cy.wait(2000);

  // Click "Proceed to checkout" on guest confirmation step
  cy.get('[data-test="proceed-2-guest"]').click();
  cy.wait(2000);

  // Fill billing
  CheckoutPage.country().select("Serbia");
  cy.wait(500);
  CheckoutPage.postcode().type("11000", { delay: 50 });
  CheckoutPage.houseNumber().type("42", { delay: 50 });
  cy.wait(1500);
  CheckoutPage.proceed3Button().click();
  cy.wait(2000);
}

describe("Checkout & Payment", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });

  it("TC-38: should show empty cart message when cart has no items", () => {
    HomePage.visit();
    HomePage.productNames().first().click();
    ProductDetailPage.addToCart();

    cy.get('[data-test="nav-cart"]').click();
    cy.wait(1000);

    cy.get('a.btn.btn-danger').first().click();
    cy.wait(1500);

    CartPage.emptyCartMessage().should("be.visible");
  });

  it("TC-30: should show sign-in step when proceeding to checkout", () => {
    HomePage.visit();
    HomePage.productNames().first().click();
    ProductDetailPage.addToCart();

    CartPage.visit();
    cy.wait(1000);
    CartPage.proceedToCheckout();
    cy.wait(2000);

    cy.contains("Sign in").should("be.visible");
    cy.contains("Continue as Guest").should("be.visible");
  });

  describe("Payment methods — successful checkout", () => {
    it("TC-31: should complete checkout end-to-end with Bank Transfer", () => {
      goToPaymentStep();

      CheckoutPage.paymentMethod().select("bank-transfer");
      cy.wait(1000);
      CheckoutPage.bankName().type("OTP bank", { delay: 50 });
      CheckoutPage.accountName().type("Marko Djordjevic", { delay: 50 });
      CheckoutPage.accountNumber().type("1234567890", { delay: 50 });
      CheckoutPage.confirmButton().click();
      cy.wait(2000);

      CheckoutPage.paymentSuccessMessage().should("be.visible");
    });

    it("TC-35: should complete checkout with Cash on Delivery", () => {
      goToPaymentStep();

      CheckoutPage.paymentMethod().select("cash-on-delivery");
      cy.wait(1000);
      CheckoutPage.confirmButton().click();
      cy.wait(2000);

      CheckoutPage.paymentSuccessMessage().should("be.visible");
    });

    it("TC-36: should complete checkout with Credit Card", () => {
      goToPaymentStep();

      CheckoutPage.paymentMethod().select("credit-card");
      cy.wait(1000);
      CheckoutPage.creditCardNumber().type("4111-1111-1111-1111", { delay: 50 });
      CheckoutPage.expirationDate().type("12/2030", { delay: 50 });
      CheckoutPage.cvv().type("123", { delay: 50 });
      CheckoutPage.cardHolder().type("Marko Djordjevic", { delay: 50 });
      cy.wait(500);
      CheckoutPage.confirmButton().click();
      cy.wait(2000);

      CheckoutPage.paymentSuccessMessage().should("be.visible");
    });

 // Parameterized test for all installment options (3, 6, 9, 12 months)
    ["3", "6", "9", "12"].forEach((months) => {
      it(`TC-37-${months}m: should complete checkout with Buy Now Pay Later — ${months} Monthly Installments`, () => {
        goToPaymentStep();

        CheckoutPage.paymentMethod().select("buy-now-pay-later");
        cy.wait(1000);
        CheckoutPage.monthlyInstallments().select(`${months} Monthly Installments`);
        cy.wait(500);
        CheckoutPage.confirmButton().click();
        cy.wait(2000);

        CheckoutPage.paymentSuccessMessage().should("be.visible");
      });
    });

    it("TC-39: should complete checkout with Gift Card", () => {
      goToPaymentStep();

      CheckoutPage.paymentMethod().select("gift-card");
      cy.wait(1000);
      CheckoutPage.giftCardNumber().type("GIFT123456789", { delay: 50 });
      CheckoutPage.validationCode().type("ABC123", { delay: 50 });
      CheckoutPage.confirmButton().click();
      cy.wait(2000);

      CheckoutPage.paymentSuccessMessage().should("be.visible");
    });
  });

  describe("Payment field validations (Credit Card)", () => {
    beforeEach(() => {
      goToPaymentStep();
      CheckoutPage.paymentMethod().select("credit-card");
      cy.wait(1000);
    });

    it("TC-32: should reject credit card with invalid number (too short)", () => {
      CheckoutPage.creditCardNumber().type("1234");
      CheckoutPage.expirationDate().type("12/2030");
      CheckoutPage.cvv().type("123");
      CheckoutPage.cardHolder().type("Marko Djordjevic");
      cy.wait(500);

      CheckoutPage.confirmButton().should("be.disabled");
      cy.contains("Invalid card number format").should("be.visible");
    });

    it("TC-33: should reject credit card with expired date", () => {
      CheckoutPage.creditCardNumber().type("4111-1111-1111-1111");
      CheckoutPage.expirationDate().type("01/2020");
      CheckoutPage.cvv().type("123");
      CheckoutPage.cardHolder().type("Marko Djordjevic");
      cy.wait(500);

      CheckoutPage.confirmButton().should("be.disabled");
      cy.contains("Expiration date must be in the future").should("be.visible");
    });

    it("TC-34: should reject CVV with letters", () => {
      CheckoutPage.creditCardNumber().type("4111-1111-1111-1111");
      CheckoutPage.expirationDate().type("12/2030");
      CheckoutPage.cvv().type("abc");
      CheckoutPage.cardHolder().type("Marko Djordjevic");
      cy.wait(500);

      CheckoutPage.confirmButton().should("be.disabled");
      cy.contains("CVV must be 3 or 4 digits").should("be.visible");
    });
  });
});