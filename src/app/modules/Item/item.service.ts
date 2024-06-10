import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { z } from "zod";
import { ItemValidation } from "./item.validation";

const createItem = async (
  slug: string,
  userId: number,
  itemData: z.infer<typeof ItemValidation.createItem>
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, owner_id: userId },
    select: { id: true, owner_id: true },
  });

  if (!restaurant) {
    throw new AppError(httpStatus.NOT_FOUND, "Restaurant not found.");
  }

  const item = await prisma.item.create({
    data: {
      ...itemData,
      price: `${itemData.price}`,
      restaurant_id: restaurant.id,
    },
  });

  return item;
};

export const ItemService = {
  createItem,
};
