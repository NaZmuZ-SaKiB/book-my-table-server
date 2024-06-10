import { Router } from "express";
import { RestaurantRoutes } from "../modules/Restaurant/restaurant.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { BookingRoutes } from "../modules/Booking/booking.route";
import { CuisineRoutes } from "../modules/Cuisine/cuisine.route";
import { ItemRoutes } from "../modules/Item/item.route";
import { LocationRoutes } from "../modules/Location/location.route";
import { ReviewRoutes } from "../modules/Review/review.route";

const router = Router();

type TRoute = {
  path: string;
  route: Router;
};

const routes: TRoute[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/restaurant",
    route: RestaurantRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/cuisine",
    route: CuisineRoutes,
  },
  {
    path: "/location",
    route: LocationRoutes,
  },
  {
    path: "/item",
    route: ItemRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
