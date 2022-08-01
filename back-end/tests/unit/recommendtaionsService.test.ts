import { jest } from '@jest/globals';

import { recommendationService } from './../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import * as recommendationsFactory from '../factories/recommendationsFactory.js';

jest.mock("../../src/repositories/recommendationRepository.js");

beforeEach(async () => {
    jest.clearAllMocks();
})

describe("Create recommendation tests suites", () => {
    it("Should create a new recommendation", async () => {

        jest.spyOn(
            recommendationRepository,
            "findByName"
        ).mockResolvedValueOnce(null);

        jest.spyOn(
            recommendationRepository, 
            "create").mockResolvedValueOnce(null);

        const recommendation = recommendationsFactory.createRecommendation();
        await recommendationService.insert(recommendation);

        expect(recommendationRepository.create).toHaveBeenCalledWith(recommendation);
        expect(recommendationRepository.create).toHaveBeenCalledTimes(1)
    }
    );
    it("Should return an error if the recommendation is invalid", async () => {
        
        const recommendation = recommendationsFactory.createRecommendation();
        
        jest.spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce((): any => true)

        expect(recommendationService.insert(recommendation)).rejects.toEqual(
            { message: "Recommendations names must be unique", type: "conflict" }
        
        );
        expect(recommendationRepository.findByName).toHaveBeenCalledWith(recommendation.name);
        expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1)
}
);
})