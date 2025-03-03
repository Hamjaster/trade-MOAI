import dotenv from "dotenv";

dotenv.config();

export const Config = {
  MONGODB : {
    url : 'mongodb://127.0.0.1:27017/trading-dashboard',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  STRIPE_SECRET_KEY: 
      "sk_test_51Np9cXBPe3BolaZexfeCQ9YUvuriLxrVd6z3QsreLyhcSvp9iggu06ZGy2FKln8CE6wJfuRyQBo23JQMoTOcG1gD00eY9slGQi"
  ,
  JWT_SECRET: "verySecret",
  EMAIL_CONFIG: {
    host: "smtp.gmail.email",
    service: "gmail",
    auth: {
      user: "hamzasepal@gmail.com",
      pass: "nqrh yfkh vjdf bbsh",
    },

    // from: envVars.EMAIL_FROM,
    secure: false,
    tls: { rejectUnauthorized: false },
  },
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  COMMON_RATE_LIMIT_MAX_REQUESTS: Number(process.env.COMMON_RATE_LIMIT_MAX_REQUESTS),
  COMMON_RATE_LIMIT_WINDOW_MS: Number(process.env.COMMON_RATE_LIMIT_WINDOW_MS),
}

