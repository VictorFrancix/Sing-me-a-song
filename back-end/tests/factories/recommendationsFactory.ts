import { faker } from '@faker-js/faker';
import { func } from 'joi';
import { prisma } from '../../src/database.js';


interface Recommendation {
    name: string;
    youtubeLink: string;
    score?: number;
}

export function createRecommendation() {
    const recommendation = {
        name: faker.music.songName(),
        youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric()}`,
    }
    return recommendation;
}

export async function insertRecommendation(recommendation: Recommendation) {
    const recommendationCreated = await prisma.recommendation.create({
        data: {
            ...recommendation,
        }
    });
    return recommendationCreated;
}

export async function inserManyRecommendations(number : number) {
    const recommendations = [];
    for (let i = 0; i < number; i++) {
        const recommendation = createRecommendation();
        recommendations.push(recommendation);
    }

    const recommendationsCreated = await prisma.recommendation.createMany({
        data: recommendations
    });
}

export async function updateScore(id:number){
    const score = Math.floor(Math.random() * 100);
    const recommendation = await prisma.recommendation.update({
        where: {
            id
        },
        data: {
            score
        }
    });
    return recommendation;
}

export async function getRecommendation(name: string){
    const recommendation = await prisma.recommendation.findFirst({
        where: {
            name
        }
    });

    return recommendation;
}
