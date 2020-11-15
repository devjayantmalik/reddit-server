import Joi from "joi";
import { ICustomError } from "../../interfaces/ICustomError";
import { IUser } from "../../interfaces/IUser";
import { INVALID_USER_DETAILS } from "../../utils/errors";

const userSchema = {
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).max(20).required().trim(),
  fname: Joi.string().min(3).required().trim(),
  lname: Joi.string().optional()
};

interface ValidationResponse {
  error?: ICustomError;
  value?: IUser | string;
}

export const is_valid_user = (user: any): ValidationResponse => {
  const { error, value } = Joi.object(userSchema).validate(user);

  return error ? { error: humanizeError(error) } : { value: value };
};

export const is_valid_email = (email: string): boolean => {
  const { error } = Joi.string().email().required().trim().validate(email);
  return error ? false : true;
};

export const is_valid_password = (password: string): boolean => {
  const { error } = Joi.string().min(6).max(20).required().trim().validate(password);
  return error ? false : true;
};

const humanizeError = (error: Joi.ValidationError): ICustomError => {
  return {
    name: INVALID_USER_DETAILS,
    message: error.details[0].message,
    isCustomError: true
  };
};
