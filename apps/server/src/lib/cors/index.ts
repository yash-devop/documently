import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // reflect request origin
  },
  credentials: true,
};
