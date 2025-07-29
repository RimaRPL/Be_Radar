import Joi from "joi";

export class newsSchema {
    static readonly createNews = Joi.object({
        image: Joi.string().required().messages({
            "string.empty": "Cover e-paper wajib diisi",
        }),
        pdfUrl: Joi.string().required().messages({
            "string.empty": "File PDF e-paper wajib diisi",
        }),
        publishedAt: Joi.date().required().messages({
            "date.base": "Tanggal terbit tidak valid",
            "any.required": "Tanggal terbit wajib diisi",
        }),
        region: Joi.string()
            .valid("TULUNGAGUNG", "BLITAR", "TRENGGALEK")
            .required()
            .messages({
                "any.only": "Wilayah tidak valid (TULUNGAGUNG, BLITAR, TRENGGALEK)",
                "any.required": "Wilayah wajib diisi",
            }),
    })

    static readonly updateNews = Joi.object({
        id: Joi.string().required().messages({
            "string.empty": "ID berita wajib diisi",
        }),
        image: Joi.string().messages({
            "string.empty": "Cover e-paper wajib diisi",
        }),
        pdfUrl: Joi.string().messages({
            "string.empty": "File PDF e-paper wajib diisi",
        }),
        publishedAt: Joi.date().messages({
            "date.base": "Tanggal terbit tidak valid",
            "any.required": "Tanggal terbit wajib diisi",
        }),
        region: Joi.string()
            .valid("TULUNGAGUNG", "BLITAR", "TRENGGALEK")
            .optional()
            .messages({
                "any.only": "Wilayah tidak valid (TULUNGAGUNG, BLITAR, TRENGGALEK)",
                "any.required": "Wilayah wajib diisi",
            }),
    })

    static readonly getnewsbyid = Joi.object({
        id: Joi.string().required().messages({
            "string.length": "ID news harus 24 karakter (ObjectId)",
            "any.required": "ID news wajib diisi",
        })
    });

    static readonly getallnews = Joi.object({
        search: Joi.string().allow("", null),
        periode: Joi.number().integer().required().messages({
            "any.required": "Periode wajib diisi",
        }),
        page: Joi.number().integer().min(1).required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
        region: Joi.string()
            .valid("TULUNGAGUNG", "BLITAR", "TRENGGALEK")
            .optional()
            .messages({
                "any.only": "Wilayah hanya bisa TULUNGAGUNG, BLITAR, atau TRENGGALEK",
            }),
    });

    static readonly deletenews = Joi.object({
        id: Joi.string().required().messages({
            "string.length": "ID news harus 24 karakter (ObjectId)",
            "any.required": "ID news wajib diisi",
        })
    });

}