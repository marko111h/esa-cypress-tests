// cypress/support/e2e.js
// Loaded before every spec file. Use it to import commands.

import "./commands";

// Hide fetch/XHR requests in the command log (cleaner output)
const app = window.top;
if (
  app &&
  !app.document.head.querySelector("[data-hide-command-log-request]")
) {
  const style = app.document.createElement("style");
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }";
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}

// Globally suppress uncaught exceptions from the app under test
// (the demo site occasionally throws non-fatal client errors)
Cypress.on("uncaught:exception", () => false);
