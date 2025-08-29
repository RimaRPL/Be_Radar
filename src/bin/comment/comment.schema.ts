import Joi from 'joi';

export class CommentSchema {
    // Create Comment
    static readonly comment = Joi.object({
        newsId: Joi.string().length(24).required().messages({
            "string.base": "News ID harus berupa string",
            "string.length": "News ID harus 24 karakter",
            "any.required": "News ID wajib diisi"
        }),
        content: Joi.string().required().messages({
            "string.base": "Content harus berupa string",
            "any.required": "Content wajib diisi"
        }),
    });

    // Update Comment
    static readonly updateComment = Joi.object({
        id: Joi.string().length(24).required().messages({
            "string.base": "Comment ID harus berupa string",
            "string.length": "Comment ID harus 24 karakter",
            "any.required": "Comment ID wajib diisi"
        }),
        newsId: Joi.string().length(24).optional().messages({
            "string.base": "News ID harus berupa string",
            "string.length": "News ID harus 24 karakter",
        }),
        content: Joi.string().optional().messages({
            "string.base": "Content harus berupa string",
        }),
    });

    // Delete Comment
    static readonly deleteComment = Joi.object({
        id: Joi.string().length(24).required().messages({
            "string.base": "Comment ID harus berupa string",
            "string.length": "Comment ID harus 24 karakter",
            "any.required": "Comment ID wajib diisi"
        }),
    });

    // Get Comment (filter)
    static readonly getcomment = Joi.object({
        search: Joi.string().allow("", null),
        periode: Joi.number().integer().required().messages({
            "any.required": "Periode wajib diisi",
        }),
        page: Joi.number().integer().min(1).required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
        newsId: Joi.string().length(24).optional().messages({
            "string.length": "News ID harus 24 karakter",
        }),
    });

    // Delete News
    static readonly deletenews = Joi.object({
        id: Joi.string().length(24).required().messages({
            "string.length": "ID news harus 24 karakter (ObjectId)",
            "any.required": "ID news wajib diisi",
        })
    });
}
