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
