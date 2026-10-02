const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();


// ======================================================
// CONFIG
// ======================================================

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;


// ======================================================
// POSTGRESQL
// ======================================================

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    // Количество одновременных соединений
    max: 10,

    // Сколько ждать свободное соединение
    idleTimeoutMillis: 30000,

    // Сколько ждать подключения
    connectionTimeoutMillis: 5000
});


// Проверка подключения к БД
pool.query("SELECT NOW()")
    .then((result) => {
        console.log("✅ PostgreSQL connected");
        console.log("Database time:", result.rows[0].now);
    })
    .catch((error) => {
        console.error("❌ PostgreSQL connection error:");
        console.error(error.message);
    });


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("dev"));


// ======================================================
// BASIC ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Psychology Platform API is running",
        version: "1.0.0"
    });

});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            server: "OK",
            database: "OK",
            databaseTime: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            server: "OK",
            database: "ERROR"
        });

    }

});


// ======================================================
// USERS
// ======================================================


// Получить пользователей
app.get("/api/users", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                u.id,
                u.email,
                u.is_active,
                u.created_at,
                r.name AS role
            FROM users u
            JOIN roles r ON r.id = u.role_id
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get users"
        });

    }

});


// ======================================================
// REGISTER
// ======================================================

app.post("/api/auth/register", async (req, res) => {

    try {

        const {
            email,
            password,
            first_name,
            last_name,
            phone
        } = req.body;


        // Проверяем обязательные поля

        if (!email || !password || !first_name) {

            return res.status(400).json({
                success: false,
                message: "Email, password and first_name are required"
            });

        }


        // Проверяем существование пользователя

        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE LOWER(email) = LOWER($1)
            `,
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });

        }


        // Получаем роль client

        const roleResult = await pool.query(
            `
            SELECT id
            FROM roles
            WHERE name = 'client'
            `
        );


        if (roleResult.rows.length === 0) {

            return res.status(500).json({
                success: false,
                message: "Client role not found"
            });

        }


        const roleId = roleResult.rows[0].id;


        // Хешируем пароль

        const passwordHash = await bcrypt.hash(password, 12);


        // Создаём пользователя

        const userResult = await pool.query(
            `
            INSERT INTO users (
                role_id,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING id, email, role_id, created_at
            `,
            [
                roleId,
                email,
                passwordHash
            ]
        );


        const user = userResult.rows[0];


        // Создаём профиль

        await pool.query(
            `
            INSERT INTO profiles (
                user_id,
                first_name,
                last_name,
                phone
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                user.id,
                first_name,
                last_name || null,
                phone || null
            ]
        );


        res.status(201).json({
            success: true,
            message: "User successfully registered",

            user: {
                id: user.id,
                email: user.email,
                role_id: user.role_id,
                created_at: user.created_at
            }
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

});


// ======================================================
// LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        // Получаем пользователя

        const result = await pool.query(
            `
            SELECT
                u.id,
                u.email,
                u.password_hash,
                u.is_active,
                r.name AS role
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE LOWER(u.email) = LOWER($1)
            `,
            [email]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        const user = result.rows[0];


        if (!user.is_active) {

            return res.status(403).json({
                success: false,
                message: "User account is inactive"
            });

        }


        // Проверяем пароль

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // Создаём JWT

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.json({

            success: true,

            message: "Login successful",

            token,

            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});


// ======================================================
// PSYCHOLOGISTS
// ======================================================

app.get("/api/psychologists", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.id,
                p.specialization,
                p.experience_years,
                p.education,
                p.rating,
                p.about,
                p.is_verified,

                pr.first_name,
                pr.last_name,
                pr.avatar_url

            FROM psychologists p

            JOIN users u
                ON u.id = p.user_id

            JOIN profiles pr
                ON pr.user_id = u.id

            WHERE u.is_active = TRUE
              AND p.is_verified = TRUE

            ORDER BY p.rating DESC NULLS LAST
        `);


        res.json({
            success: true,
            count: result.rows.length,
            psychologists: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get psychologists"
        });

    }

});


// ======================================================
// ARTICLES
// ======================================================

app.get("/api/articles", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.slug,
                a.content,
                a.image_url,
                a.status,
                a.created_at,

                c.name AS category,

                pr.first_name,
                pr.last_name

            FROM articles a

            LEFT JOIN categories c
                ON c.id = a.category_id

            LEFT JOIN users u
                ON u.id = a.author_id

            LEFT JOIN profiles pr
                ON pr.user_id = u.id

            WHERE a.status = 'published'

            ORDER BY a.created_at DESC
        `);


        res.json({
            success: true,
            count: result.rows.length,
            articles: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get articles"
        });

    }

});


// ======================================================
// LEADS
// ======================================================

app.post("/api/leads", async (req, res) => {

    try {

        const {
            user_id,
            source
        } = req.body;


        const result = await pool.query(
            `
            INSERT INTO leads (
                user_id,
                source
            )
            VALUES ($1, $2)
            RETURNING *
            `,
            [
                user_id || null,
                source || "website"
            ]
        );


        res.status(201).json({
            success: true,
            message: "Lead created",
            lead: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create lead"
        });

    }

});


// ======================================================
// 404
// ======================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log(" Psychology Platform API");
    console.log("======================================");
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    console.log("======================================");
    console.log("");

});