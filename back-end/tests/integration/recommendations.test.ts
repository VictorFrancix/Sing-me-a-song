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

    it("🪐 422 - should return a error if the recommendation is invalid", async () => {
        const response = await supertest(app)
        .post("/recommendations")
        .send({});

        expect(response.status).toBe(422);
    });

    it("Given a recommendation name already in use, should return 409", async () => {
        const recommendationData =
            recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendation(recommendationData);

        const response = await supertest(app)
            .post("/recommendations")
            .send(recommendationData);

        expect(response.statusCode).toBe(409);
    });
})
