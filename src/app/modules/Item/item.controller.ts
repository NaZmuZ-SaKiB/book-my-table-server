import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ItemService } from "./item.service";

const createItem = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.params;

  const item = await ItemService.createItem(slug, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Item created successfully.",
    data: item,
  });
});

export const ItemController = {
  createItem,
};
