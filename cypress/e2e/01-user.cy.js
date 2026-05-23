// cypress/e2e/01-user.cy.js
// Tests for User flow: Registration and Login
// Covers Task 2 area #1.

import LoginPage from "../pages/LoginPage";

describe("User — Registration & Login", () => {
  let users;

  before(() => {
    cy.fixture("users").then((data) => {
      users = data;
    });
  });

  describe("Login", () => {
    beforeEach(() => {
      LoginPage.visit();
    });

    it("TC-09: should login with valid credentials", () => {
      LoginPage.login(users.validUser.email, users.validUser.password);

      cy.url().should("include", "/account");
      cy.get('[data-test="nav-menu"]').should("be.visible");
    });

    it("TC-10: should show error with wrong password", () => {
      LoginPage.login(users.validUser.email, "wrongPassword999!");

      cy.contains("Invalid email or password").should("be.visible");
      cy.url().should("include", "/auth/login");
    });

    it("TC-11: should show 'Email format is invalid' for invalid email format", () => {
      LoginPage.emailInput().type("marko.dj");
      LoginPage.passwordInput().type("Test1234!");
      LoginPage.submitButton().click();

      LoginPage.emailFormatError().should("be.visible");
    });

    it("TC-12: should show generic error for non-existing email", () => {
      LoginPage.login(users.invalidUser.email, users.invalidUser.password);

      cy.contains("Invalid email or password").should("be.visible");
    });

    it("should not allow login with empty fields", () => {
      LoginPage.submitButton().click();
      // Browser-native required validation prevents form submission;
      // we just verify we are still on the login page.
      cy.url().should("include", "/auth/login");
    });
  });

  describe("Registration page navigation", () => {
    it("should navigate from Login to Registration page", () => {
      LoginPage.visit();
      cy.contains("Register your account").click();
      cy.url().should("include", "/auth/register");
      cy.contains("Customer registration").should("be.visible");
    });

    it("TC-04 / BUG-002 reproduction: name fields currently accept numbers (expected: rejected)", () => {
      // This test documents BUG-002 — currently the front-end accepts numeric input
      // in First/Last name without validation. Marked as expected-to-fail-once-fixed.
      cy.visit("/auth/register");
      cy.get('[data-test="first-name"]').type("32323");
      cy.get('[data-test="last-name"]').type("232323");

      // Currently passes (bug present). Will fail once name validation is added.
      cy.get('[data-test="first-name"]').should("have.value", "32323");
      cy.get('[data-test="last-name"]').should("have.value", "232323");
    });
  });
});
