import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error.interface";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const message = err.issues
    .map(
      (issue: ZodIssue) =>
        `${issue.path[issue.path.length - 1]}: ${issue.message}`
    )
    .join(`, `);

  return {
    statusCode: 403,
    message,
  };
};

export default handleZodError;
