import { serve } from "@hono/node-server";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import { createTransport, SendMailOptions } from "nodemailer";
import ejs from "ejs";

import "dotenv/config";

const app = new Hono();
const isDev = process.env.NODE_ENV === "development";

app.use("*", prettyJSON());
app.use("*", cors());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.use("/*", bearerAuth({ token: process.env.TOKEN! }));

const transporter = createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.get("/", (c) => {
  console.log(
    process.env.EMAIL_ADDRESS,
    process.env.EMAIL_PASSWORD,
    process.env.TOKEN
  );
  return c.json({ message: "Welcome to my API" });
});

app.post("/sendemail", async (c) => {
  const { name, email, subject, message } = await c.req.json();
  const mailOptions: SendMailOptions = {
    from: {
      name,
      address: process.env.EMAIL_ADDRESS!,
    },
    to: email,
    cc: process.env.EMAIL_ADDRESS,
    subject,
    html: await ejs.renderFile("./templates/email.ejs", { message }),
  };

  // Send email using the primary SMTP server
  try {
    await transporter.sendMail(mailOptions);
    return c.json({ success: true, message: "Email sent successfully" }, 200);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        success: false,
        message: "Error sending Email",
      },
      500
    );
  }
});

const port = parseInt(process.env.PORT!) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
