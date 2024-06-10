import prisma from "../../lib/prisma";

const getAllLocations = async () => {
  const location = await prisma.location.findMany();
  return location;
};

export const LocationService = {
  getAllLocations,
};
