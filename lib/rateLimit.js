import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 1 * 1000,
    max: 2,
    keyGenerator: function (req) {
      return req.ip;
    },
    headers: true,
    handler: function (req, res, next) {
      return res.status(429).json({ success: false, message: "Terlalu banyak permintaan" });
    },
  });