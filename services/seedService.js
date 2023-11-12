import { prisma } from "../config/prismaClient.js";

export const generateUniqueSeed = async () => {
    let unique = false;
    let seed;

    while (!unique) {
        // Generate a random integer seed
        seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        // Check if the seed already exists
        const existingSeed = await prisma.user_usage_data.findUnique({
            where: { quiz_seed: seed }
        });
        unique = !existingSeed;
    }
    return seed;
};
