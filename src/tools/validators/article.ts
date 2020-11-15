import Joi from "joi";
import { IArticle } from "../../interfaces/IArticle";
import { ICustomError } from "../../interfaces/ICustomError";
import { INVALID_ARTICLE_DETAILS } from "../../utils/errors";

const articleSchema = {
  title: Joi.string().required().trim(),
  markdown: Joi.string().min(10).required().trim()
};

interface ValidationResponse {
  error?: ICustomError;
  value?: IArticle;
}

export const is_valid_article = (article: any): ValidationResponse => {
  const { error, value } = Joi.object(articleSchema).validate(article);

  return error ? { error: humanizeError(error) } : { value: value };
};

const humanizeError = (error: Joi.ValidationError): ICustomError => {
  return {
    name: INVALID_ARTICLE_DETAILS,
    message: error.details[0].message,
    isCustomError: true
  };
};
