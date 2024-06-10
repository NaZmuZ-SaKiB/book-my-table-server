import prisma from "../../lib/prisma";

const getAllCuisine = async () => {
  const cuisine = await prisma.cuisine.findMany();
  return cuisine;
};

export const CuisineService = {
  getAllCuisine,
};
