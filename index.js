require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
    const { username, consent } = req.body;

    if (!username || !consent) {
        return res.status(400).json({ message: "البيانات ناقصة" });
    }

    const message = `
📥 مشاركة حساب Instagram جديدة
👤 Username: ${username}
☑️ Consent: وافق على سياسة الخصوصية
🕒 Time: ${new Date().toLocaleString()}
    `;

    const telegramURL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(telegramURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            res.json({ message: "تم إرسال الحساب بنجاح ✅" });
        } else {
            res.status(500).json({ message: "فشل الإرسال" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "خطأ في الاتصال بالتيليجرام" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});