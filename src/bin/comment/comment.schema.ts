import Joi from 'joi';

export class CommentSchema {
    static readonly comment = Joi.object({
        newsId: Joi.string().length(24).required().messages({
            "string.base": "Product ID harus berupa string",
            "string.length": "Product ID harus 24 karakter",
            "any.required": "Product ID wajib diisi"
        }),
        userId: Joi.string().length(24).optional().messages({
            "string.base": "User ID harus berupa string",
            "string.length": "User ID harus 24 karakter",
        }),
        content: Joi.string().optional().messages({
            "string.base": "Content harus berupa string",
            "any.required": "Content tidak wajib diisi"
        }),
    })
    static readonly updateComment = Joi.object({
        id: Joi.string().length(24).required().messages({
            "string.base": "Comment ID harus berupa string",
            "string.length": "Comment ID harus 24 karakter",
            "any.required": "Comment ID wajib diisi"
        }),
        newsId: Joi.string().length(24).optional().messages({
            "string.base": "Product ID harus berupa string",
            "string.length": "Product ID harus 24 karakter",
        }),
        content: Joi.string().optional().messages({
            "string.base": "Content harus berupa string",
            "any.required": "Content tidak wajib diisi"
        }),
    });

    static readonly deleteComment = Joi.object({
        id: Joi.string().length(24).required().messages({
            "string.base": "Comment ID harus berupa string",
            "string.length": "Comment ID harus 24 karakter",
            "any.required": "Comment ID wajib diisi"
        }),
    });

        static readonly getcomment = Joi.object({
            search: Joi.string().allow("", null),
            periode: Joi.number().integer().required().messages({
                "any.required": "Periode wajib diisi",
            }),
            page: Joi.number().integer().min(1).required(),
            quantity: Joi.number().integer().min(1).max(100).required(),
        });
    
            static readonly deletenews = Joi.object({
            id: Joi.string().required().messages({
                "string.length": "ID news harus 24 karakter (ObjectId)",
                "any.required": "ID news wajib diisi",
            })
        });
}