// cypress/pages/HomePage.js
// Page Object for the product catalog / home page.

class HomePage {
  visit() {
    cy.visit("/");
    return this;
  }

  searchInput() {
    return cy.get('[data-test="search-query"]');
  }

  searchButton() {
    return cy.get('[data-test="search-submit"]');
  }

  searchResetButton() {
    return cy.get('[data-test="search-reset"]');
  }

  sortDropdown() {
    return cy.get('[data-test="sort"]');
  }

  productCards() {
    return cy.get('[data-test^="product-"]').filter('[data-test*="product-0"], [data-test*="product-1"]');
  }

  productNames() {
    return cy.get('[data-test="product-name"]');
  }

  productPrices() {
    return cy.get('[data-test="product-price"]');
  }

  paginationPage(pageNumber) {
    return cy.get(".pagination").contains("a", String(pageNumber));
  }

  activePage() {
    return cy.get(".pagination .active");
  }

  noResultsMessage() {
    return cy.contains("There are no products found");
  }

  search(term) {
    this.searchInput().clear().type(term);
    this.searchButton().click();
    return this;
  }

  sortBy(value) {
    // values: 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc'
    this.sortDropdown().select(value);
    return this;
  }

  filterByCategory(categoryName) {
    cy.contains("label", categoryName).find('input[type="checkbox"]').check();
    return this;
  }

  clickProductByName(name) {
    cy.contains('[data-test="product-name"]', name).click();
    return this;
  }
}

export default new HomePage();
