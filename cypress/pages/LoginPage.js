// cypress/pages/LoginPage.js
// Page Object for /auth/login

class LoginPage {
  visit() {
    cy.visit("/auth/login");
    return this;
  }

  emailInput() {
    return cy.get('[data-test="email"]');
  }

  passwordInput() {
    return cy.get('[data-test="password"]');
  }

  submitButton() {
    return cy.get('[data-test="login-submit"]');
  }

  errorMessage() {
    return cy.get('[data-test="login-error"]');
  }

  emailFormatError() {
    return cy.contains("Email format is invalid");
  }

  login(email, password) {
    this.emailInput().clear().type(email);
    this.passwordInput().clear().type(password, { log: false });
    this.submitButton().click();
    return this;
  }
}

export default new LoginPage();
