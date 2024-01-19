"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const bearer_auth_1 = require("hono/bearer-auth");
const cors_1 = require("hono/cors");
const pretty_json_1 = require("hono/pretty-json");
const hono_1 = require("hono");
const nodemailer_1 = require("nodemailer");
const ejs_1 = __importDefault(require("ejs"));
require("dotenv/config");
const app = new hono_1.Hono();
const isDev = process.env.NODE_ENV === "development";
app.use("*", (0, pretty_json_1.prettyJSON)());
app.use("*", (0, cors_1.cors)());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
app.use("/*", (0, bearer_auth_1.bearerAuth)({ token: process.env.TOKEN }));
const transporter = (0, nodemailer_1.createTransport)({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});
app.get("/", (c) => {
    console.log(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD, process.env.TOKEN);
    return c.json({ message: "Welcome to my API" });
});
app.post("/sendemail", async (c) => {
    const { name, email, subject, message } = await c.req.json();
    const mailOptions = {
        from: {
            name,
            address: process.env.EMAIL_ADDRESS,
        },
        to: email,
        cc: process.env.EMAIL_ADDRESS,
        subject,
        html: await ejs_1.default.renderFile("./templates/email.ejs", { message }),
    };
    // Send email using the primary SMTP server
    try {
        await transporter.sendMail(mailOptions);
        return c.json({ success: true, message: "Email sent successfully" }, 200);
    }
    catch (error) {
        console.log(error);
        return c.json({
            success: false,
            message: "Error sending Email",
        }, 500);
    }
});
const port = parseInt(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
