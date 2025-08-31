import Joi from "joi";

export class SavedNewsSchema {
  static readonly CreateSavedNews = Joi.object({
    newsId: Joi.string().length(24).required().messages({
      "string.base": "News ID harus berupa string",
      "string.length": "News ID harus 24 karakter",
      "any.required": "News ID wajib diisi",
    }),
    // userId: Joi.string().length(24).optional().messages({
    //   "string.base": "User ID harus berupa string",
    //   "string.length": "User ID harus 24 karakter",
    // }),
  });
  static readonly GetSavedNews = Joi.object({
    search: Joi.string().allow("", null),
    periode: Joi.number().integer().required().messages({
      "any.required": "Periode wajib diisi",
    }),
    page: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required(),
  });
  static readonly DeleteSavedNews = Joi.object({
    id: Joi.string().required().messages({
      "any.required": "ID news wajib diisi",
    }),
  });
}
