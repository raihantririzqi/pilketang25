import Elysia from "elysia";
import { SuccessResponseFactory } from "../utils/response_util";
import { SuccessResponse } from "../types/custom_types";

export class ResponseAfterHandler {
  public static transform = <T>(response: SuccessResponse<T>) =>
    new Elysia().mapResponse(({ set }) => {
      if (response instanceof Response) return response;
      set.headers["content-type"] = "application/json";
      set.status = 200;
      return new Response(
        JSON.stringify(
          SuccessResponseFactory.create({
            code: response.code,
            message: response.message || "Operation successful",
            result: response.result,
          }),
        ),
      );
    });
}
