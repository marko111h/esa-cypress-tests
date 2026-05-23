// cypress/e2e/02-search.cy.js
// Tests for Search & Filter
// Covers Task 2 area #2.

import HomePage from "../pages/HomePage";

describe("Search & Filter", () => {
  beforeEach(() => {
    HomePage.visit();
  });

  describe("Search", () => {
    it("TC-13: should display empty state when search has no matches", () => {
      HomePage.search("xyz123nothing");
      HomePage.noResultsMessage().should("be.visible");
    });

    it("TC-14: should be case-insensitive (HAMMER vs hammer)", () => {
      HomePage.search("hammer");
      cy.wait(1000);
      HomePage.productNames()
        .then(($lowerResults) => $lowerResults.length)
        .as("lowerCount");

      HomePage.searchResetButton().click();
      HomePage.search("HAMMER");
      cy.wait(1000);

      cy.get("@lowerCount").then((lowerCount) => {
        HomePage.productNames().should("have.length", lowerCount);
      });
    });

    it("TC-15 / BUG-001: search 'hammer' should return ALL products containing 'hammer' (incl. Sledgehammer)", () => {
      // This test is expected to FAIL — it documents BUG-001:
      // search by name does not perform substring matching, so 'Sledgehammer' is missed.
      HomePage.search("hammer");

      cy.get('[data-test="product-name"]').then(($names) => {
        const productNames = [...$names].map((el) => el.textContent.trim());

        // Assertion: Sledgehammer SHOULD be in results since it contains 'hammer'
        expect(
          productNames.some((name) => name.toLowerCase().includes("sledgehammer")),
          "Search for 'hammer' should include 'Sledgehammer' (substring match)"
        ).to.be.true;
      });
    });
  });

  describe("Filter & Sort", () => {
    it("TC-16: should sort A → Z alphabetically", () => {
      HomePage.sortBy("name,asc");
      cy.wait(1000);

      HomePage.productNames().then(($names) => {
        const names = [...$names].map((el) => el.textContent.trim());
        const sorted = [...names].sort();
        expect(names).to.deep.equal(sorted);
      });
    });

    it("TC-17: should sort by Price (High → Low)", () => {
      HomePage.sortBy("price,desc");
      cy.wait(1000);

      HomePage.productPrices().then(($prices) => {
        const prices = [...$prices].map((el) =>
          parseFloat(el.textContent.replace(/[^0-9.]/g, ""))
        );
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).to.deep.equal(sorted);
      });
    });

    it("TC-19: should filter products by category 'Hammer'", () => {
      HomePage.filterByCategory("Hammer");
      cy.wait(1000);

      HomePage.productNames().each(($name) => {
        // All names in the Hammer category contain 'Hammer' (case-insensitive)
        expect($name.text().toLowerCase()).to.contain("hammer");
      });
    });

    it("TC-20: should combine search + category filter", () => {
      HomePage.filterByCategory("Hammer");
      HomePage.search("claw");
      cy.wait(1000);

      HomePage.productNames().each(($name) => {
        expect($name.text().toLowerCase()).to.contain("claw");
      });
    });
  });

  describe("BUG-003 reproduction", () => {
    it("should reset pagination to page 1 when sort order is changed", () => {
      // Documents BUG-003. Currently the user remains on the page they were on.
      cy.visit("/?page=3");
      cy.wait(1000);

      HomePage.sortBy("price,desc");
      cy.wait(1000);

      // Expected behaviour: pagination resets to page 1
      // Actual behaviour (current): user stays on page 3
      cy.get(".pagination .active").should("contain.text", "1");
    });
  });
});
