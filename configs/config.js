module.exports = {
    PORT: process.env.PORT || 8080,
    DB_CONNECT_URL: process.env.DB_CONNECT_URL || "mongodb://localhost:27017/database", 

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "word",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "text"
}