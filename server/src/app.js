const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
// Cors is a package that allows you to enable Cross-Origin Resource Sharing (CORS) with various options.
// This is useful for allowing your frontend to communicate with your backend.
// Implemented to temporarily allow all origins to access the server.
app.use(cookieParser());
// Allow json and urlencoded data to be accepted by the server.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using helmet to prevent certain headers from being sent in the response
app.use(helmet());
app.use(
  helmet({
    hsts: {
      // site only runs for 24 hours
      maxAge: 86400000, // 24 hours in milliseconds
    },
    xssFilter: true, // Enable XSS filter
    noSniff: true, // Prevent MIME type sniffing
  })
);
app.disable("x-powered-by");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://authinc.onrender.com",
    "https://authinc.site",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "site-api-key",
    "Set-Cookie",
  ],
  credentials: true,
  maxAge: 600,
};

app.use(cors(corsOptions));

// Global rate limiter for all routes
// allow up to 100 requests per 15 minutes from the same IP address
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication routes (login and registration)
// allow up to 15 requests per 15 minutes from the same IP address
const authenticationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 15 requests per windowMs
  message: "Too many registration/login attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the global rate limiter to all routes
app.use(globalRateLimiter);

// Apply the stricter rate limiter to authentication routes
app.use("/api/user/login", authenticationRateLimiter);
app.use("/api/user/register", authenticationRateLimiter);

const mainRoutes = require("./routes/mainRoute");
app.use("/api", mainRoutes);

module.exports = app;
