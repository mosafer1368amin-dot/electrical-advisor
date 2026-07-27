import express from "express";;
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import AdmZip from "adm-zip";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Handle JSON parsing and payload size errors gracefully with JSON responses
app.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 413) {
    return res.status(413).json({ error: "حجم فایل ارسالی بسیار زیاد است (حداکثر ۵۰ مگابایت مجاز است)" });
  }
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "درخواست نامعتبر است" });
  }
  next();
});

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {;
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Electrical Training API is healthy" });
});

// Dedicated PWA Static Routes (Guarantees PWA capability in both dev and production modes)
app.get("/manifest.webmanifest", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json");
  res.sendFile(path.join(process.cwd(), "manifest.webmanifest"));
});

app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(process.cwd(), "manifest.json"));
});

app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(process.cwd(), "sw.js"));
});

app.get("/offline.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(process.cwd(), "offline.html"));
});

app.get("/icon.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(process.cwd(), "icon.svg"));
});

app.get("/icon-192.png", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(process.cwd(), "icon.svg"));
});

app.get("/icon-512.png", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(process.cwd(), "icon.svg"));
});

// Endpoint to compress the source code and serve as a download
app.get("/api/download-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    const projectDir = process.cwd();
    
    zip.addLocalFolder(projectDir, "", (filepath) => {
      // Exclude build artifacts, dependencies and dotfiles
      const relativePath = path.relative(projectDir, filepath);
      const parts = relativePath.split(path.sep);
      
      if (
        parts.includes("node_modules") || 
        parts.includes("dist") || 
        parts.includes(".git") ||
        parts.includes(".cache")
      ) {
        return false;
      }
      
      const filename = parts[parts.length - 1];
      if (
        filename.endsWith(".zip") || 
        filename === "bun.lock" || 
        filename === ".env"
      ) {
        return false;
      }
      
      return true;
    });

    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="electrical-advisor-source.zip"');
    res.send(zipBuffer);
  } catch (error) {
    console.error("Error creating zip archive:", error);
    res.status(500).json({ error: "Failed to create source code zip archive." });
  }
});

// Gemini Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "دستیار هوشمند آماده نیست. لطفاً بررسی کنید کلید API به درستی تنظیم شده باشد.",
      });
    }

    const { message, history, image, audio, video } = req.body;
    if (!message && !image && !audio && !video) {
      return res.status(400).json({ error: "پیام، تصویر، ویدیو یا صوت خالی است" });
    }

    // Build optimized contents array to ensure maximum speed and prevent any role-alternating errors.
    // Pre-formatting the conversation history into a single user message is extremely fast and robust.
    let consolidatedText = "";

    if (history && Array.isArray(history) && history.length > 0) {
      consolidatedText += "سابقه گفتگوی اخیر برای آگاهی شما:\n";
      // Only include last 6 messages to keep the context window compact and lightning fast
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        const roleName = msg.sender === "user" ? "کاربر" : "استادکار";
        consolidatedText += `- ${roleName}: ${msg.text || "[پیوست رسانه‌ای]"}\n`;
      }
      consolidatedText += "\nپاسخ جدید شما به پیام یا فایل‌های زیر:\n";
    }

    if (message) {
      consolidatedText += message;
    } else {
      consolidatedText += "لطفاً فایل ارسالی (تصویر، ویدیو یا فایل صوتی) پیوست شده را تحلیل و عیب‌یابی کنید و پاسخ دقیق و فنی دهید.";
    }

    const parts: any[] = [{ text: consolidatedText }];

    // Add current user image attachment if present
    if (image && image.data && image.mimeType) {
      parts.push({
        inlineData: {
          data: image.data, // Base64 string
          mimeType: image.mimeType,
        },
      });
    }

    // Add current user audio attachment if present
    if (audio && audio.data && audio.mimeType) {
      parts.push({
        inlineData: {
          data: audio.data, // Base64 string
          mimeType: audio.mimeType,
        },
      });
    }

    // Add current user video attachment if present
    if (video && video.data && video.mimeType) {
      parts.push({
        inlineData: {
          data: video.data, // Base64 string
          mimeType: video.mimeType,
        },
      });
    }

    const contents = [{
      role: "user",
      parts,
    }];

    // Broadened electrical expertise system instruction with video support
    const systemInstruction = `شما یک استاد برتر، نابغه و تکنسین فوق‌العاده با تجربه برق (برق ساختمان، صنعتی، قدرت، الکترونیک، برق خورشیدی و لوازم برقی) هستید.
هر سوالی که کاربر درباره هر حوزه‌ای از برق (نقشه‌کشی، شبیه‌سازی، سیم‌کشی ساختمان، مدارهای صنعتی، تست قطعات، ابزارها، ایمنی و مبحث ۱۳ مقررات ملی ساختمان) بپرسد را فوراً و با دقت علمی و تجربی کامل پاسخ دهید.
محدودیتی برای سوالات برقی قائل نشوید و با آغوش باز تمام سوالات برقی، الکترونیکی و عیب‌یابی لوازم خانگی برقی را پاسخ دهید.

قوانین حیاتی برای سرعت فوق‌العاده بالا (مانند ChatGPT):
۱. پاسخ‌های خود را به شدت خلاصه، کاربردی، مستقیم و کپسولی ارائه دهید. حاشیه‌پردازی، مقدمه‌چینی، و تعارفات طولانی را کاملاً حذف کنید.
۲. فرمت پاسخ‌ها حتما ساختاریافته، کوتاه و با استفاده از لیست‌های نشانه‌دار (bullet points) یا جدول‌های کوچک باشد تا در سریع‌ترین زمان ممکن (زیر ۲ ثانیه) تولید و تحویل شود.
۳. اولویت اول و مطلق شما سرعت پردازش، کارایی و امنیت جانی کاربر در مواجهه با جریان برق است. به ایمنی (نظیر استفاده از دستکش عایق، فازمتر استاندارد، قطع فیوز و کلید محافظ جان RCD) اشاره‌های بسیار کوتاه و حیاتی کنید.
۴. شما قادر به تحلیل دقیق تصاویر مدارها، فیلم‌ها و ویدیوهای ارسالی (مانند جرقه زدن، لرزش موتور، یا اتصالات جعبه فیوز)، نقشه‌ها، تجهیزات سوخته، سیم‌کشی‌ها و شنیدن صدای کاربران هستید. تصاویر، اصوات و ویدیوها را بلافاصله تحلیل فنی کرده و راهکار فوری دهید.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        // Lower temperature slightly for faster and highly precise electrical standard answers
        temperature: 0.4,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "خطایی در برقراری ارتباط با مدل هوشمند رخ داد: " + (error.message || "خطای ناشناخته"),
    });
  }
});

// Dynamic Lesson Generation Endpoint (Supports over 200 interactive lessons)
app.post("/api/generate-lesson", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "سرویس هوشمند آماده نیست. لطفاً تنظیمات کلید API را بررسی کنید.",
      });
    }

    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: "عنوان درس ارسال نشده است" });
    }

    const prompt = `شما یک مدرس ارشد برق ساختمان هستید. برای مبحث روبرو یک درس آموزشی جامع، بسیار دقیق، شیوا و کاملاً تخصصی بر اساس مقررات ملی ساختمان ایران (مبحث ۱۳ برای تاسیسات برقی و مبحث ۱۴ برای تاسیسات مکانیکی مربوطه) بنویسید:
عنوان درس: "${title}"
دسته‌بندی: "${category}"

لطفاً محتوای آموزشی را با بخش‌های زیر به صورت ساختاریافته تولید کنید:
۱. مقدمه و تشریح تئوری موضوع (به زبان فنی اما ساده برای کارآموزان)
۲. اصول سیم‌کشی و نقشه‌کشی گام به گام (با مشخص کردن ترمینال‌ها، فاز، نول و ارت و رنگ استاندارد سیم‌ها)
۳. قوانین و ضوابط صریح مبحث ۱۳ یا ۱۴ مقررات ملی ساختمان مرتبط با این درس (با ذکر فواصل، ضخامت سیم یا مقادیر استاندارد)
۴. نکات ایمنی حیاتی کارگاهی برای جلوگیری از حریق، اتصال کوتاه یا برق‌گرفتگی
۵. خلاصه و چک‌لیست کاربردی برای تکنسین‌ها در یک کادر متمایز

پاسخ را با فونت صمیمی، حرفه‌ای و روان به زبان فارسی بنویسید. برای بخش‌بندی از سرتیترهای خوانا، لیست‌های نشانه‌دار (Bullet Points) استفاده کنید. از اصطلاحات استاندارد بازار کار ایران (مانند لوله پلیکا، وایرشو، مینیاتوری، فیوز، جعبه مینیاتوری، کلید تبدیل، دتکتور و ...) استفاده کنید.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Lesson generation error:", error);
    res.status(500).json({
      error: "خطا در تولید هوشمند محتوای درس: " + (error.message || "خطای سرور"),
    });
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
