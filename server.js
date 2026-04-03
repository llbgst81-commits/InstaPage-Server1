const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ناخذ التوكن و chat_id من Render Environment Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors());
app.use(express.json());

// مهم جدًا لـ Render حتى يعتبر السيرفر "حي"
app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

app.post("/send", async (req, res) => {
    const { username } = req.body;

    if (!username || !username.trim()) {
        return res.status(400).json({ ok: false, error: "Username is required" });
    }

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ ok: false, error: "Server env vars missing" });
    }

    const message = `
📥 مشاركة حساب Instagram جديدة

👤 Username: ${username}
🕒 Time: ${new Date().toLocaleString()}
💻 Source: Website
  `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.json({ ok: true });
        } else {
            console.error("Telegram Error:", data);
            return res.status(500).json({ ok: false, error: "Telegram send failed" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ ok: false, error: "Server failed" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});