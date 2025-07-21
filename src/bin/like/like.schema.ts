import Joi from "joi";

export const LikeSchema = {
  likeNews: Joi.object({
    newsId: Joi.string().required().messages({
      "string.empty": "ID berita tidak boleh kosong",
      "any.required": "ID berita harus diisi"
    }),
  }),
};
