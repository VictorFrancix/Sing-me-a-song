import { faker } from "@faker-js/faker";

export function createRecommendationData(){
    return {
        name: faker.random.words(),
        youtubeLink: "https://www.youtube.com/watch?v=bXDuPFzm-hQ",
    }
}