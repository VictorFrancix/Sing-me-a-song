import * as testRepository from "../repositories/testRepository.js";

export async function reset(){
    await testRepository.reset();
}