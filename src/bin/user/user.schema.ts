import Joi from "joi"

export class userSchema {
  static readonly login = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  static readonly registerUser = Joi.object({
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .required()
      .messages({
        "string.empty": "Username tidak boleh kosong",
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),

    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.min": "Password minimal 8 karakter",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),
    image: Joi.string().required().messages({
      "string.base": "Link gambar harus berupa teks",
      "string.uri": "Format URL gambar tidak valid",
      "string.empty": "Gambar tidak boleh kosong",
    }),
  })

  static readonly updateUser = Joi.object({
    id: Joi.string().required(),
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        "string.empty": "Username tidak boleh kosong",
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      }),
    email: Joi.string().email().optional().messages({
      "string.email": "Format email tidak valid",
      "string.empty": "Email tidak boleh kosong",
    }),
    password: Joi.string()
      .min(8)
      .optional()
      .messages({
        "string.min": "Password minimal 8 karakter",
      }),
    image: Joi.string().optional().messages({
      "string.base": "Link gambar harus berupa teks",
      "string.uri": "Format URL gambar tidak valid"
    }),
  })

  static readonly Request_Otp = Joi.object({
    email: Joi.string().email(),
    username: Joi.string()
      .min(5)
      .max(100)
      .pattern(/^[a-z0-9._-]+$/)
      .messages({
        "string.min": "Username minimal harus 5 karakter",
        "string.max": "Username terlalu panjang (maksimal 100 karakter)",
        "string.pattern.base":
          "Username hanya boleh huruf kecil, angka, titik, minus, atau underscore",
      })
  });

  static readonly Confirm_Otp = Joi.object({
    otp: Joi.string().length(6).required(),
  });

  static readonly Get_User_Profile = Joi.object({
    id: Joi.string().optional()
  })

  static readonly Delete_User = Joi.object({
    id: Joi.string().required(),
  });

}