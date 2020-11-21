import Joi from "joi";
import { ICustomError } from "../../interfaces/ICustomError";
import { INVALID_ARTICLE_DETAILS } from "../../utils/errors";

interface ValidationResponse {
  error?: ICustomError;
  value?: string;
}

export const is_valid_comment = (comment: any): ValidationResponse => {
  const { error, value } = Joi.string().min(3).max(250).required().trim().validate(comment);

  return error ? { error: humanizeError(error) } : { value: value };
};

const humanizeError = (error: Joi.ValidationError): ICustomError => {
  return {
    name: INVALID_ARTICLE_DETAILS,
    message: error.details[0].message,
    isCustomError: true
  };
};
