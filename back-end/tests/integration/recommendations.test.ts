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

        const objectKeys = ["id", "name", "youtubeLink", "score"];

        expect(Object.keys(response.body)).toEqual(objectKeys);
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

describe("🚀 - GET /recommendations/random tests", () => {
    it("🪐 200 - should return a random recommendation", async () => {
        const recommendationData = recommendationsFactory.inserManyRecommendations(11)
        
        const response = await supertest(app)
            .get("/recommendations/random");

        const objectKeys = ["id", "name", "youtubeLink", "score"];

        expect(response.status).toBe(200);
        expect(Object.keys(response.body)).toEqual(objectKeys);
    }
    )
}
)

describe("🚀 - GET /recommendations/top/:amount tests", () => {
    it("🪐 200 - should return the top amount of recommendations", async () => {
        await recommendationsFactory.inserManyRecommendations(11)

        for(let i = 1; i <= 11; i++){
            await recommendationsFactory.updateScore(i)
        }

        const response = await supertest(app).get("/recommendations/top/5");

        const top5 = await prisma.recommendation.findMany({
            take: 5,
            orderBy: {
                score: "desc"
            }
        });

        expect(response.body).toEqual(top5);
        expect(response.status).toBe(200);
    }
    )
}
)

describe("🚀 - POST /recommendations/:id/upvote tests", () => {
    it("🪐 200 - should upvote the recommendation with the given id", async () => {
        const recommendationData = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendation(recommendationData);

        const recommendationInfoInitial = await recommendationsFactory.getRecommendation(recommendationData.name);

        const response = await supertest(app).post(`/recommendations/${recommendationInfoInitial.id}/upvote`);

        const recommendationInfoFinal = await recommendationsFactory.getRecommendation(recommendationData.name);
        expect(response.status).toBe(200);
        expect(recommendationInfoFinal.score).toBe(recommendationInfoInitial.score + 1);
        }
    );
    it("🪐 404 - should return a not found error if the recommendation does not exist", async () => {
        const response = await supertest(app).post(`/recommendations/1/upvote`);

        expect(response.status).toBe(404);
        }
    );
    it("🪐 500 - should return an internal server error if the id is not a number", async () => {
        const response = await supertest(app).post(`/recommendations/a/upvote`);

        expect(response.status).toBe(500);
        }
    );
    }
);

describe("🚀 - POST /recommendations/:id/downvote tests", () => {
    it("🪐 200 - should downvote the recommendation with the given id", async () => {
        const recommendationData = recommendationsFactory.createRecommendation();
        await recommendationsFactory.insertRecommendation(recommendationData);

        const recommendationInfoInitial = await recommendationsFactory.getRecommendation(recommendationData.name);

        const response = await supertest(app).post(`/recommendations/${recommendationInfoInitial.id}/downvote`);

        const recommendationInfoFinal = await recommendationsFactory.getRecommendation(recommendationData.name);
        expect(response.status).toBe(200);
        expect(recommendationInfoFinal.score).toBe(recommendationInfoInitial.score - 1);
        }
    );
    it("🪐 200 - If the score is less than -5, should return 200 and delete the recomendation", async () => {
        const recommendationData = recommendationsFactory.createRecommendation();

        const recommendationDataLess = {...recommendationData, score: -5};

        await recommendationsFactory.insertRecommendation(recommendationDataLess);

        const recommendationInfoInitial = await recommendationsFactory.getRecommendation(recommendationDataLess.name);

        const response = await supertest(app).post(`/recommendations/${recommendationInfoInitial.id}/downvote`);

        const recommendationInfoFinal = await recommendationsFactory.getRecommendation(recommendationDataLess.name);

        expect(response.status).toBe(200);
        expect(recommendationInfoFinal).toBe(null);
        }
    );


    
    
        it("🪐 404 - should return a not found error if the recommendation does not exist", async () => {
        const response = await supertest(app).post(`/recommendations/1/downvote`);

        expect(response.status).toBe(404);
        }
    );
    it("🪐 500 - should return an internal server error if the id is not a number", async () => {
        const response = await supertest(app).post(`/recommendations/a/downvote`);

        expect(response.status).toBe(500);
        }
    );

    }
);