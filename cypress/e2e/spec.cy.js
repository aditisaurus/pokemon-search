describe("API TESTING", () => {
  it("API TESTING VALIDATION", () => {
    cy.request("https://pokeapi.co/api/v2/pokemon?limit=500&offset=0").as(
      "pokemon"
    );
    cy.get("@pokemon")
      .its("headers")
      .its("content-type")
      .should("include", "application/json; charset=utf-8");
  });

  it("API TESTING Result ", () => {
    cy.request("https://pokeapi.co/api/v2/pokemon?limit=500&offset=0").as(
      "pokemon"
    );
    cy.get("@pokemon").its("status").should("equal", 200);
  });

  it("API TESTING Body ", () => {
    cy.request("https://pokeapi.co/api/v2/pokemon?limit=500&offset=0").as(
      "pokemon"
    );
    cy.get("@pokemon").its("body").should("include", {
      next: "https://pokeapi.co/api/v2/pokemon?offset=500&limit=500",
    });
  });

  it("API TESTING-404 Negative Result ", () => {
    cy.request({
      method: "GET",
      url: "https://pokeapi.co/api/v2/pokemon/1000",
      failOnStatusCode: false,
    }).as("pokemon");
    cy.get("@pokemon").its("status").should("equal", 404);
  });
});

describe("SEARCH INPUT", () => {
  it("displays on the page", () => {
    cy.visit("http://localhost:3002/?");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3002/?");
  });

  it("renders the list of pokemons", () => {
    cy.get("[data-cy='pokemon-list']").should("have.length", 1154);
  });

  it("allows users to search for the pokemon", () => {
    cy.get("[data-cy='pokemon-search-input']").type("metapod").submit();
    cy.get("[data-cy='pokemon-list']").should("have.length", 1);
    cy.contains("metapod");
  });

  it("auto suggestion loads while typing", () => {
    cy.get("[data-cy='pokemon-search-input']").type("char");
    cy.wait(4000);
    cy.get("[data-cy='pokemon-autosuggestion-list']").should("have.length", 3);
    cy.contains("charmander");
    cy.contains("charmeleon");
    cy.contains("charizard").click();
    cy.wait(4000);
    cy.get("[data-cy='pokemon-list']").should("have.length", 1);
  });
});
