import "allure-cypress/commands";

Cypress.Commands.add("getFreshCookies", () => {
  cy.getCookies()
    .should("exist")
    .then((cookies) => {
      window.freshCookies = cookies;
      cookies.forEach((cookie) => {
        cy.log(JSON.stringify(cookie));
      });
    });
});

Cypress.Commands.add("validateSuccessResponse", (response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('isSuccess', true);
  expect(response.body).to.have.property('errorCode', 0);
  expect(response.body).to.have.property('errorMessage', null);
  expect(response.headers).to.have.property('content-type').and.include('application/json;charset=UTF-8');
  expect(response.duration).to.be.lessThan(5000);
});

Cypress.Commands.add("validateErrorResponse", (response) => {
  expect(response.status).to.eq(400);
  expect(response.headers).to.have.property('content-type').and.include('application/json;charset=UTF-8');
  expect(response.duration).to.be.lessThan(5000);
});

