import supertest from "supertest";
import { prisma } from "../../src/database.js";
import app from "../../src/app.js";
import * as recommendationsFactory from "../factories/recommendationsFactory.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("🚀 - POST /recommendations tests", () => {
    it("🪐 201 - should create a new recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation ();
        const response = await supertest(app)
        .post("/recommendations")
        .send(recommendation);
        
        expect(response.status).toBe(201);
        });

    it("🪐 422 - should return an error if the recommendation is invalid", async () => {
        const response = await supertest(app)
        .post("/recommendations")
        .send({});

        expect(response.status).toBe(422);
    });

    it("🪐 409 - Given a recommendation name already in use, should return conflict error ", async () => {
        const recommendationData =
            recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendation(recommendationData);

        const response = await supertest(app)
            .post("/recommendations")
            .send(recommendationData);

        expect(response.statusCode).toBe(409);
    });
});

describe("🚀 - GET /recommendations tests", () => {
    it("🪐 200 - should return an array with the last 10 recommendations", async () => {
        const recommendationData = recommendationsFactory.inserManyRecommendations(11)

        const response = await supertest(app)
            .get("/recommendations");

        expect(response.body[0].id).toBe(11);
        expect(response.body.length).toBe(10);
        expect(response.status).toBe(200);
    }
    )
}
)

describe ("🚀 - GET /recommendations/:id tests", () => {
    it("🪐 200 - should return the recommendation with the given id", async () => {
        const recommendationData = recommendationsFactory.createRecommendation();
        const recommendationCreated = await recommendationsFactory.insertRecommendation(recommendationData);

        const response = await supertest(app)
            .get(`/recommendations/${recommendationCreated.id}`);

        expect(response.body.id).toBe(recommendationCreated.id);
        expect(response.body.name).toBe(recommendationCreated.name);
        expect(response.body.youtubeLink).toBe(recommendationCreated.youtubeLink);
        expect(response.status).toBe(200);
    }
    )
    it("🪐 404 - should return a not found error if the recommendation does not exist", async () => {
        const response = await supertest(app)
            .get(`/recommendations/1`);

        expect(response.status).toBe(404);
    }
    )
    it("🪐 500 - should return an internal server error if the id is not a number", async () => {
        const response = await supertest(app)
            .get(`/recommendations/a`);

        expect(response.status).toBe(500);
    }
    )
}
)
