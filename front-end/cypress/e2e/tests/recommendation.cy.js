/* eslint-disable no-undef */
import * as recommendationFactory from "../../factories/recommendationFactory.js";


beforeEach(() => {
    cy.resetDB();
});

describe("Create recommendation", () => {
    it("Should create and show a recommendation", () => {
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.intercept("POST", "/recommendations").as("postRecommendation");
        cy.visit("http://localhost:3000/");
        cy.wait("@getRecommendations");

        const recommendationData =
            recommendationFactory.createRecommendationData();
        cy.get("input[placeholder=Name]").type(recommendationData.name);
        cy.get("input[placeholder='https://youtu.be/...']").type(
            recommendationData.youtubeLink
        );
        cy.get("button").click();
        cy.wait("@postRecommendation");
        cy.wait("@getRecommendations");

        cy.get("article:first div:first").should(
            `contain.text`,
            recommendationData.name
        );
    });
});

describe("Upvote recommendation", () => {
    it("Should upvote a recommendation", () => {
        cy.createRecommendation();
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.intercept("POST", "/recommendations/1/upvote").as(
            "upvoteRecommendation"
        );

        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendations");
        cy.get("article .upvote").click();
        cy.wait("@upvoteRecommendation");
        cy.get("article .score").should("contain.text", "1");
    });
});

describe("Downvote recommendation", () => {
    it("Should downvote a recommendation", () => {
        cy.createRecommendation();
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.intercept("POST", "/recommendations/1/downvote").as(
            "downvoteRecommendation"
        );

        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendations");
        cy.get("article .downvote").click();
        cy.wait("@downvoteRecommendation");
        cy.get("article .score").should("contain.text", -1);
    });

    it("Should remove a recommendation", () => {
        cy.createRecommendation();
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.intercept("POST", "/recommendations/1/downvote").as(
            "downvoteRecommendation"
        );

        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendations");

        for (let i = 0; i < 6; i++) {
            cy.get("article .downvote").click();
            cy.wait("@downvoteRecommendation");
        }

        cy.get("article").should("not.exist");
    });
});

describe("Get top recommendations", () => {
    it("Should show the top recommendations", () => {
        cy.intercept("GET", "/recommendations").as("getRecommendations");
        cy.intercept("POST", "/recommendations/1/upvote").as(
            "upvoteRecommendation"
        );
        cy.intercept("GET", "/recommendations/top/10").as("topRecommendations");

        for(let i = 0; i<10; i++) {
            cy.createRecommendation();
        }

        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendations");
        cy.get("article:first .upvote").click();
        cy.get(".top").click();
        cy.url().should("equal", "http://localhost:3000/top");
        cy.wait("@topRecommendations");
        cy.get("article:first .score").should("contain.text", 1);
    });
});