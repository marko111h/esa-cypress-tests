// cypress/e2e/04-checkout.cy.js
// Tests for Checkout & Payment
// Covers Task 2 area #4.

import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";

describe("Checkout & Payment", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });

  it("TC-38: should block checkout when cart is empty", () => {
    HomePage.visit();
    cy.get('[data-test="nav-cart"]').click();

    CartPage.emptyCartMessage().should("be.visible");
    // 'Proceed to checkout' should not lead anywhere meaningful with empty cart
    cy.get("body").should("contain.text", "The cart is empty");
  });

  it("TC-30: should require login when proceeding to checkout", () => {
    // Add a product to the cart without being logged in
    HomePage.visit();
    HomePage.productNames().first().click();
    ProductDetailPage.addToCart();

    CartPage.visit();
    CartPage.proceedToCheckout();

    // Sign In step should be shown
    cy.contains("SIGN IN").should("be.visible");
    cy.get('[data-test="email"]').should("be.visible");
    cy.get('[data-test="password"]').should("be.visible");
  });

  it("TC-31: should complete checkout end-to-end with Bank Transfer", () => {
    // 1. Add product
    HomePage.visit();
    HomePage.productNames().first().click();
    ProductDetailPage.addToCart();

    // 2. Open cart and proceed
    CartPage.visit();
    CartPage.proceedToCheckout();

    // 3. Sign In step — login as existing customer
    CheckoutPage.signInEmail().type(users.validUser.email);
    CheckoutPage.signInPassword().type(users.validUser.password, { log: false });
    CheckoutPage.signInSubmit().click();

    cy.wait(1500);

    // 4. Proceed to Billing Address step
    CheckoutPage.proceed2Button().click();

    // 5. Verify billing address is pre-filled or fill it
    CheckoutPage.street().should("not.have.value", "");
    CheckoutPage.proceed3Button().click();

    // 6. Payment step — Bank Transfer
    CheckoutPage.paymentMethod().select("bank-transfer");
    CheckoutPage.bankName().type(users.bankTransfer || "OTP bank");
    CheckoutPage.accountName().type("Marko Djordjevic");
    CheckoutPage.accountNumber().type("1234567890");
    CheckoutPage.confirmButton().click();

    // 7. Verify success
    CheckoutPage.paymentSuccessMessage().should("be.visible");
  });

  describe("Payment field validations", () => {
    beforeEach(() => {
      // Bring cart to Payment step
      HomePage.visit();
      HomePage.productNames().first().click();
      ProductDetailPage.addToCart();

      CartPage.visit();
      CartPage.proceedToCheckout();

      CheckoutPage.signInEmail().type(users.validUser.email);
      CheckoutPage.signInPassword().type(users.validUser.password, { log: false });
      CheckoutPage.signInSubmit().click();
      cy.wait(1500);

      CheckoutPage.proceed2Button().click();
      CheckoutPage.proceed3Button().click();

      CheckoutPage.paymentMethod().select("credit-card");
    });

    it("TC-32: should reject credit card with invalid number (too short)", () => {
      CheckoutPage.creditCardNumber().type("1234");
      CheckoutPage.expirationDate().type("12/2030");
      CheckoutPage.cvv().type("123");
      CheckoutPage.cardHolder().type("Marko Djordjevic");
      CheckoutPage.confirmButton().click();

      // Validation prevents submission — verify by checking that 'Payment was successful' is NOT shown
      cy.contains("Payment was successful").should("not.exist");
    });

    it("TC-33: should reject credit card with expired date", () => {
      CheckoutPage.creditCardNumber().type("4111-1111-1111-1111");
      CheckoutPage.expirationDate().type("01/2020");
      CheckoutPage.cvv().type("123");
      CheckoutPage.cardHolder().type("Marko Djordjevic");
      CheckoutPage.confirmButton().click();

      cy.contains("Payment was successful").should("not.exist");
    });

    it("TC-34: should reject CVV with letters", () => {
      CheckoutPage.creditCardNumber().type("4111-1111-1111-1111");
      CheckoutPage.expirationDate().type("12/2030");
      CheckoutPage.cvv().type("abc");
      // CVV input typically restricts non-numeric — verify value is empty or only digits remained
      CheckoutPage.cvv()
        .invoke("val")
        .then((val) => {
          expect(/^\d*$/.test(val), `CVV should only contain digits, got "${val}"`).to.be.true;
        });
    });
  });
});
