import { jest } from '@jest/globals';

import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import * as recommendationsFactory from '../factories/recommendationsFactory.js';

jest.mock("../../src/repositories/recommendationRepository.js");

beforeEach(async () => {
    jest.clearAllMocks();
});

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

    it("Should not create a duplicate recommendation", async () => {
        
        const recommendation = recommendationsFactory.createRecommendation();
        
        jest.spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce(()=> true)

        expect(recommendationService.insert(recommendation)).rejects.toEqual(
            { message: "Recommendations names must be unique", type: "conflict" }
        
        );
        expect(recommendationRepository.findByName).toHaveBeenCalledWith(recommendation.name);
        expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1)
        }
    );
}
);

describe("Upvote recommendation tests suites", () => {

    it("Should upvote a recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = {...recommendation, id: 1, score:0}
        
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendationData);
        
        jest.spyOn(recommendationRepository, "updateScore").mockImplementation(()=> {});

        await recommendationService.upvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalledTimes(1);
        expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1)
        }
    );
    
    it("Should not upvote a recommendation if it does not exist", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

        expect(recommendationService.upvote(1)).rejects.toEqual(
            {message: "", type: "not_found"}
        );
    }
    )
}
);

describe("Downvote recommendation tests suites", () => {
    it("Should downvote a recommendation", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = {...recommendation, id: 1, score:0}
        
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendationData);
        
        jest.spyOn(recommendationRepository, "updateScore").mockImplementation(()=> {return {...recommendationData, score: -1}});

        await recommendationService.downvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalledTimes(1);
        expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1)
        }
    );

    it("Should remove a recommendation who has a score less than -5", async () => {
        const recommendation = recommendationsFactory.createRecommendation();
        const recommendationData = {...recommendation, id: 1, score: -5}
        
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendationData);
        
        jest.spyOn(recommendationRepository, "updateScore").mockImplementation(()=> {return {...recommendationData, score: -6}});

        jest.spyOn(recommendationRepository, "remove").mockImplementation(()=> {});

        await recommendationService.downvote(recommendationData.id);

        expect(recommendationRepository.find).toBeCalledTimes(1);
        expect(recommendationRepository.updateScore).toBeCalledTimes(1);
        expect(recommendationRepository.remove).toHaveBeenCalledTimes(1)
        }
    );

    it("Should not downvote a recommendation if it does not exist", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

        expect(recommendationService.downvote(1)).rejects.toEqual(
            {message: "", type: "not_found"}
        );
        }
    );
}
);

