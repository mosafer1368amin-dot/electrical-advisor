import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Sparkles, Camera, RotateCw, ZoomIn, ZoomOut, Box, Info, Check, 
  HelpCircle, Eye, Sliders, Play, Award, Layers, Minimize2, Video,
  MapPin, ShieldAlert, Zap, Compass, RefreshCw, Scissors, Anchor
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- TYPES ---
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  indices: number[];
  color: string;
  outlineColor?: string;
  label?: string;
  explodeDir?: Point3D; // direction this face floats in exploded view
  partName?: string;
}

interface Line3D {
  p1: number;
  p2: number;
  color: string;
  width?: number;
  explodeDir?: Point3D;
}

interface Annotation {
  pointIndex: number;
  title: string;
  desc: string;
  offset: { x: number; y: number };
}

interface EquipmentModel {
  id: string;
  name: string;
  englishName: string;
  mabhath13Ref: string;
  description: string;
  vertices: Point3D[];
  faces: Face3D[];
  lines: Line3D[];
  annotations: Annotation[];
}

// --- 3D MATHEMATICAL MODEL GENERATOR ---
// Generate detailed 3D models programmatically
function generateModels(): EquipmentModel[] {
  return [
    // 1. MINIATURE CIRCUIT BREAKER (MCB - کلید مینیاتوری)
    {
      id: "mcb",
      name: "کلید حفاظتی مینیاتوری (MCB)",
      englishName: "Miniature Circuit Breaker",
      mabhath13Ref: "بند ۱۳-۴-۴ مقررات ملی ساختمان - تجهیزات حفاظتی",
      description: "کلید مینیاتوری وسیله‌ای حفاظتی است که مدار را در برابر اضافه‌بار (با مکانیزم حرارتی بی‌متال) و اتصال کوتاه (با مکانیزم مغناطیسی بوبین) قطع می‌کند.",
      vertices: [
        // Outer Casing Box (Vertices 0-7)
        { x: -30, y: -60, z: -20 }, // 0
        { x: 30, y: -60, z: -20 },  // 1
        { x: 30, y: 60, z: -20 },   // 2
        { x: -30, y: 60, z: -20 },  // 3
        { x: -30, y: -60, z: 20 },  // 4
        { x: 30, y: -60, z: 20 },   // 5
        { x: 30, y: 60, z: 20 },    // 6
        { x: -30, y: 60, z: 20 },   // 7

        // MCB Switch Toggle (Vertices 8-11)
        { x: -10, y: 20, z: 20 },   // 8 (Toggle Base Left)
        { x: 10, y: 20, z: 20 },    // 9 (Toggle Base Right)
        { x: -10, y: 35, z: 40 },   // 10 (Toggle Tip Left - ON position)
        { x: 10, y: 35, z: 40 },    // 11 (Toggle Tip Right - ON position)

        // Internal Parts (Only shown in Exploded View)
        // Electromagnetic Coil/Solenoid (Vertices 12-19)
        { x: -15, y: -10, z: -5 },  // 12 (Coil base center)
        { x: 15, y: -10, z: -5 },   // 13
        { x: -15, y: -30, z: -5 },  // 14
        { x: 15, y: -30, z: -5 },   // 15
        { x: -15, y: -10, z: 5 },   // 16
        { x: 15, y: -10, z: 5 },    // 17
        { x: -15, y: -30, z: 5 },   // 18
        { x: 15, y: -30, z: 5 },    // 19

        // Bi-metal Overload Strip (Vertices 20-23)
        { x: 15, y: 10, z: -5 },    // 20 (Strip base)
        { x: 22, y: 10, z: -5 },    // 21
        { x: 15, y: 40, z: -5 },    // 22 (Strip top)
        { x: 22, y: 40, z: -5 },    // 23

        // Arc Chute / De-ion Grid (Vertices 24-31)
        { x: -25, y: -45, z: -10 }, // 24
        { x: -5, y: -45, z: -10 },  // 25
        { x: -25, y: -15, z: -10 }, // 26
        { x: -5, y: -15, z: -10 },  // 27
        { x: -25, y: -45, z: 10 },  // 28
        { x: -5, y: -45, z: 10 },   // 29
        { x: -25, y: -15, z: 10 },  // 30
        { x: -5, y: -15, z: 10 },   // 31
      ],
      faces: [
        // Outer Casing back & sides
        { indices: [0, 1, 2, 3], color: "rgba(51, 65, 85, 0.9)", outlineColor: "#475569", partName: "پوسته عایق پشت" },
        { indices: [4, 5, 1, 0], color: "rgba(30, 41, 59, 0.85)", outlineColor: "#475569", partName: "پوسته عایق کف" },
        { indices: [2, 6, 7, 3], color: "rgba(30, 41, 59, 0.85)", outlineColor: "#475569", partName: "پوسته عایق سقف" },
        { indices: [0, 4, 7, 3], color: "rgba(15, 23, 42, 0.5)", outlineColor: "#334155", explodeDir: { x: -40, y: 0, z: 0 }, partName: "پوسته جانبی چپ (شفاف شده)" },
        { indices: [1, 5, 6, 2], color: "rgba(15, 23, 42, 0.5)", outlineColor: "#334155", explodeDir: { x: 40, y: 0, z: 0 }, partName: "پوسته جانبی راست (شفاف شده)" },
        
        // Toggle Switch Face
        { indices: [8, 9, 11, 10], color: "rgba(239, 68, 68, 0.9)", outlineColor: "#ef4444", explodeDir: { x: 0, y: 15, z: 30 }, partName: "شستی اهرم قطع و وصل" },

        // Coil solid box representation in exploded mode
        { indices: [12, 13, 15, 14], color: "rgba(245, 158, 11, 0.8)", outlineColor: "#d97706", explodeDir: { x: -10, y: -20, z: 0 }, partName: "سیم‌پیچ رله مغناطیسی (حفاظت اتصال کوتاه)" },
        { indices: [16, 17, 19, 18], color: "rgba(245, 158, 11, 0.8)", outlineColor: "#d97706", explodeDir: { x: -10, y: -20, z: 0 }, partName: "سیم‌پیچ رله مغناطیسی (حفاظت اتصال کوتاه)" },

        // Bi-metal strip representation
        { indices: [20, 21, 23, 22], color: "rgba(56, 189, 248, 0.9)", outlineColor: "#0284c7", explodeDir: { x: 20, y: 10, z: 0 }, partName: "تیغه دو فلزی بی‌متال (حفاظت اضافه‌بار)" },

        // Arc chute block
        { indices: [24, 25, 27, 26], color: "rgba(148, 163, 184, 0.85)", outlineColor: "#94a3b8", explodeDir: { x: -20, y: -30, z: 0 }, partName: "محفظه جرقه‌گیر (خاموش‌کننده قوس)" },
        { indices: [28, 29, 31, 30], color: "rgba(148, 163, 184, 0.85)", outlineColor: "#94a3b8", explodeDir: { x: -20, y: -30, z: 0 }, partName: "محفظه جرقه‌گیر (خاموش‌کننده قوس)" },
      ],
      lines: [
        // Casing Edges
        { p1: 0, p2: 1, color: "#64748b" }, { p1: 1, p2: 2, color: "#64748b" },
        { p1: 2, p2: 3, color: "#64748b" }, { p1: 3, p2: 0, color: "#64748b" },
        { p1: 4, p2: 5, color: "#64748b" }, { p1: 5, p2: 6, color: "#64748b" },
        { p1: 6, p2: 7, color: "#64748b" }, { p1: 7, p2: 4, color: "#64748b" },
        { p1: 0, p2: 4, color: "#64748b" }, { p1: 1, p2: 5, color: "#64748b" },
        { p1: 2, p2: 6, color: "#64748b" }, { p1: 3, p2: 7, color: "#64748b" },

        // Toggle Switch Edges
        { p1: 8, p2: 10, color: "#f87171", width: 2, explodeDir: { x: 0, y: 15, z: 30 } },
        { p1: 9, p2: 11, color: "#f87171", width: 2, explodeDir: { x: 0, y: 15, z: 30 } },
        { p1: 10, p2: 11, color: "#f87171", width: 2, explodeDir: { x: 0, y: 15, z: 30 } },

        // Electromagnetic Coil representation (wound lines)
        { p1: 12, p2: 17, color: "#f59e0b", width: 2, explodeDir: { x: -10, y: -20, z: 0 } },
        { p1: 17, p2: 14, color: "#f59e0b", width: 2, explodeDir: { x: -10, y: -20, z: 0 } },
        { p1: 14, p2: 19, color: "#f59e0b", width: 2, explodeDir: { x: -10, y: -20, z: 0 } },
        { p1: 19, p2: 16, color: "#f59e0b", width: 2, explodeDir: { x: -10, y: -20, z: 0 } },

        // Arc chute internal plates
        { p1: 24, p2: 28, color: "#e2e8f0", width: 1.5, explodeDir: { x: -20, y: -30, z: 0 } },
        { p1: 25, p2: 29, color: "#e2e8f0", width: 1.5, explodeDir: { x: -20, y: -30, z: 0 } },
        { p1: 26, p2: 30, color: "#e2e8f0", width: 1.5, explodeDir: { x: -20, y: -30, z: 0 } },
        { p1: 27, p2: 31, color: "#e2e8f0", width: 1.5, explodeDir: { x: -20, y: -30, z: 0 } },
      ],
      annotations: [
        { pointIndex: 10, title: "اهرم قطع و وصل دستی", desc: "کنترل مکانیکی وضعیت قطع و وصل مدار که توسط تکنسین برق تحریک می‌گردد.", offset: { x: 70, y: -50 } },
        { pointIndex: 12, title: "بوبین مغناطیسی حفاظتی", desc: "در صورت ایجاد اتصال کوتاه به علت ایجاد میدان مغناطیسی قوی، ضامن کلید را فوراً در زمان کمتر از چند میلی‌ثانیه می‌کشد.", offset: { x: -140, y: -20 } },
        { pointIndex: 22, title: "تیغه حرارتی بی‌متال", desc: "از دو فلز با ضریب انبساط حرارتی متفاوت ساخته شده که بر اثر اضافه‌بار داغ، خم شده و کلید را قطع می‌کند.", offset: { x: 120, y: 10 } },
        { pointIndex: 26, title: "محفظه جرقه‌گیر (Arc Chute)", desc: "قوس‌های الکتریکی ناشی از باز شدن کنتاکت‌ها را به صفحات موازی خرد نموده و جرقه‌ها را خاموش می‌کند تا از ذوب شدن کلید ممانعت گردد.", offset: { x: -140, y: 60 } }
      ]
    },

    // 2. RESIDUAL CURRENT DEVICE (RCD - کلید محافظ جان)
    {
      id: "rcd",
      name: "کلید محافظ جان نشت جریان (RCD)",
      englishName: "Residual Current Device",
      mabhath13Ref: "بند ۱۳-۵-۲-۱ مقررات ملی ساختمان - هم‌ولتاژ کردن و حفاظت کمکی",
      description: "کلید محافظ جان به طور دائم جریان رفت (فاز) و برگشت (نول) را مقایسه می‌کند و به محض وقوع جریان نشتی بیش از ۳۰ میلی‌آمپر برق را در صدم ثانیه قطع می‌نماید.",
      vertices: [
        // Outer Housing Block (Vertices 0-7)
        { x: -40, y: -60, z: -20 }, // 0
        { x: 40, y: -60, z: -20 },  // 1
        { x: 40, y: 60, z: -20 },   // 2
        { x: -40, y: 60, z: -20 },  // 3
        { x: -40, y: -60, z: 20 },  // 4
        { x: 40, y: -60, z: 20 },   // 5
        { x: 40, y: 60, z: 20 },    // 6
        { x: -40, y: 60, z: 20 },   // 7

        // RCD Toggle Lever (Vertices 8-11)
        { x: -8, y: 15, z: 20 },    // 8
        { x: 8, y: 15, z: 20 },     // 9
        { x: -8, y: 30, z: 40 },    // 10
        { x: 8, y: 30, z: 40 },     // 11

        // Test Button (Vertices 12-15)
        { x: 15, y: 35, z: 20 },    // 12
        { x: 27, y: 35, z: 20 },    // 13
        { x: 15, y: 47, z: 25 },    // 14
        { x: 27, y: 47, z: 25 },    // 15

        // Toroidal Core CT Ring (Vertices 16-23) - internal
        { x: -20, y: -20, z: -5 },  // 16
        { x: 20, y: -20, z: -5 },   // 17
        { x: -20, y: -35, z: -5 },  // 18
        { x: 20, y: -35, z: -5 },   // 19
        { x: -20, y: -20, z: 5 },   // 20
        { x: 20, y: -20, z: 5 },    // 21
        { x: -20, y: -35, z: 5 },   // 22
        { x: 20, y: -35, z: 5 }     // 23
      ],
      faces: [
        // Casing Base and top
        { indices: [0, 1, 2, 3], color: "rgba(226, 232, 240, 0.95)", outlineColor: "#94a3b8", partName: "پوسته عایق سفید کرم" },
        { indices: [4, 5, 1, 0], color: "rgba(203, 213, 225, 0.9)", outlineColor: "#94a3b8", partName: "کف فیوز داکت" },
        { indices: [2, 6, 7, 3], color: "rgba(203, 213, 225, 0.9)", outlineColor: "#94a3b8", partName: "سقف فیوز داکت" },
        { indices: [0, 4, 7, 3], color: "rgba(100, 116, 139, 0.4)", outlineColor: "#475569", explodeDir: { x: -45, y: 0, z: 0 }, partName: "قاب تاشو چپ (نمای شفاف)" },
        { indices: [1, 5, 6, 2], color: "rgba(100, 116, 139, 0.4)", outlineColor: "#475569", explodeDir: { x: 45, y: 0, z: 0 }, partName: "قاب تاشو راست (نمای شفاف)" },

        // Toggle Switch Face
        { indices: [8, 9, 11, 10], color: "rgba(30, 41, 59, 0.95)", outlineColor: "#0f172a", explodeDir: { x: 0, y: 10, z: 25 }, partName: "اهرم مشکی ریست کلید" },

        // Test Button Blue Face
        { indices: [12, 13, 15, 14], color: "rgba(37, 99, 235, 0.9)", outlineColor: "#1d4ed8", explodeDir: { x: 15, y: 20, z: 20 }, partName: "دکمه تست ماهانه (Test Button)" },

        // Toroidal ring CT
        { indices: [16, 17, 19, 18], color: "rgba(107, 114, 128, 0.85)", outlineColor: "#374151", explodeDir: { x: 0, y: -25, z: 0 }, partName: "هسته مغناطیسی حلقوی حسگر تفاضلی جریان" },
        { indices: [20, 21, 23, 22], color: "rgba(107, 114, 128, 0.85)", outlineColor: "#374151", explodeDir: { x: 0, y: -25, z: 0 }, partName: "هسته مغناطیسی حلقوی حسگر تفاضلی جریان" }
      ],
      lines: [
        { p1: 0, p2: 1, color: "#475569" }, { p1: 1, p2: 2, color: "#475569" },
        { p1: 2, p2: 3, color: "#475569" }, { p1: 3, p2: 0, color: "#475569" },
        { p1: 4, p2: 5, color: "#475569" }, { p1: 5, p2: 6, color: "#475569" },
        { p1: 6, p2: 7, color: "#475569" }, { p1: 7, p2: 4, color: "#475569" },
        { p1: 0, p2: 4, color: "#475569" }, { p1: 1, p2: 5, color: "#475569" },
        { p1: 2, p2: 6, color: "#475569" }, { p1: 3, p2: 7, color: "#475569" },

        // Toroid wraps (coils of wire going through toroid representing phase and neutral)
        { p1: 16, p2: 20, color: "#ef4444", width: 2, explodeDir: { x: 0, y: -25, z: 0 } }, // Live wire
        { p1: 17, p2: 21, color: "#3b82f6", width: 2, explodeDir: { x: 0, y: -25, z: 0 } }  // Neutral wire
      ],
      annotations: [
        { pointIndex: 10, title: "اهرم قطع دستی و وصل", desc: "برای راه‌اندازی و برق‌دار کردن مجدد سیستم بعد از برطرف کردن عیب نشت جریان استفاده می‌شود.", offset: { x: -110, y: -30 } },
        { pointIndex: 12, title: "شستی تست مکانیکی (T)", desc: "ایجاد عدم تعادل شبیه‌سازی‌شده مصنوعی بین فاز و نول جهت اطمینان از سلامت مکانیکی و رله محافظ جان (باید ماهی یک بار فشرده شود).", offset: { x: 130, y: -20 } },
        { pointIndex: 16, title: "هسته حلقوی ترانسفورماتور جریان (CT)", desc: "مجموع جریان‌های عبوری و بازگشتی مدار فاز و نول را به عنوان تراز تفاضلی دائما رصد می‌کند. در حالت نرمال مجموع صفر است.", offset: { x: -150, y: 50 } },
        { pointIndex: 17, title: "رله قطع مکانیکی حساس", desc: "به محض القای پتانسیل ناشی از اختلاف فاز و نول در هسته، سیم‌پیچ ثانویه این رله کوچک را تحریک کرده و ضامن کلید در کسری از ثانیه قطع می‌شود.", offset: { x: 140, y: 65 } }
      ]
    },

    // 3. EARTH CHAMBER & GROUND ROD (سیستم چاه ارت و میله زمین)
    {
      id: "earth",
      name: "سیستم اتصال زمین و الکترود چاه ارت",
      englishName: "Earthing Chamber & Ground Electrode",
      mabhath13Ref: "بند ۱۳-۸ مقررات ملی ساختمان - سیستم‌های اتصال زمین",
      description: "سیستم زمین برای هدایت بی‌خطر جریان‌های خطا، صاعقه، و بارهای القایی به درون زمین جهت تضمین ایمنی ساکنان و جلوگیری از برق‌گرفتگی نصب می‌شود.",
      vertices: [
        // Underground Ground Soil Shaft (Vertices 0-7)
        { x: -50, y: -70, z: -50 }, // 0
        { x: 50, y: -70, z: -50 },  // 1
        { x: 50, y: 10, z: -50 },   // 2
        { x: -50, y: 10, z: -50 },  // 3
        { x: -50, y: -70, z: 50 },  // 4
        { x: 50, y: -70, z: 50 },   // 5
        { x: 50, y: 10, z: 50 },    // 6
        { x: -50, y: 10, z: 50 },   // 7

        // Copper Clad Earth Rod (Vertices 8-11)
        { x: 0, y: -65, z: 0 },     // 8 (Rod bottom point)
        { x: 0, y: 35, z: 0 },      // 9 (Rod top point)
        { x: -5, y: 35, z: 0 },     // 10 (Clamp point)
        { x: 15, y: 45, z: 5 },     // 11 (Earthing Wire leading out)

        // Bentonite backfill layer (concentric rings/cylinder) (Vertices 12-15)
        { x: -20, y: -50, z: -20 }, // 12
        { x: 20, y: -50, z: -20 },  // 13
        { x: -20, y: 0, z: 20 },    // 14
        { x: 20, y: 0, z: 20 }      // 15
      ],
      faces: [
        // Outer shaft representation
        { indices: [0, 1, 2, 3], color: "rgba(120, 113, 108, 0.4)", outlineColor: "#78716c", partName: "دیواره طبیعی خاک زمین" },
        { indices: [4, 5, 1, 0], color: "rgba(120, 113, 108, 0.4)", outlineColor: "#78716c", partName: "کف طبیعی چاه ارت" },
        { indices: [2, 6, 7, 3], color: "rgba(120, 113, 108, 0.1)", outlineColor: "#78716c", partName: "دهانه رویی چاه" },
        { indices: [0, 4, 7, 3], color: "rgba(120, 113, 108, 0.3)", outlineColor: "#78716c", partName: "دیواره طبیعی چاه" },

        // Bentonite chemical fill block (middle layer)
        { indices: [12, 13, 15, 14], color: "rgba(74, 222, 128, 0.2)", outlineColor: "#4ade80", explodeDir: { x: 0, y: 0, z: -25 }, partName: "بنتونیت هیدروفیلی (مواد کاهنده مقاومت چاه)" }
      ],
      lines: [
        // Earth Copper Rod line
        { p1: 8, p2: 9, color: "#ea580c", width: 5, explodeDir: { x: 0, y: 15, z: 0 } }, // Copper rod
        { p1: 9, p2: 11, color: "#10b981", width: 3, explodeDir: { x: 10, y: 10, z: 0 } }, // Earth conductor cable

        // Soil layers indicators
        { p1: 0, p2: 4, color: "#a8a29e" },
        { p1: 1, p2: 5, color: "#a8a29e" },
        { p1: 2, p2: 6, color: "#a8a29e" },
        { p1: 3, p2: 7, color: "#a8a29e" }
      ],
      annotations: [
        { pointIndex: 9, title: "الکترود مسی زمین (Copper Rod)", desc: "میله فولادی با روکش مس فشرده با قطر و طول مشخص که در دل خاک زمین کوبیده می‌شود.", offset: { x: -130, y: -40 } },
        { pointIndex: 11, title: "کابل مسی هادی همبندی ارت", desc: "سیم مسی بدون عایق (لخت) با سایز مقطع حداقل ۲۵ یا ۳۵ میلی‌متر مربع جهت اتصال شینه ارت ساختمان به میله چاه.", offset: { x: 120, y: -20 } },
        { pointIndex: 12, title: "بنتونیت سدیم و بنتونیت ذغال", desc: "ترکیب مواد جاذب رطوبت خاک دور الکترود که با کاهش بسیار زیاد مقاومت مخصوص خاک، امپدانس نهایی چاه ارت را به زیر ۲ اهم می‌رسانند.", offset: { x: 130, y: 35 } },
        { pointIndex: 8, title: "انتهای دفن شده میله", desc: "برای عملکرد عالی، باید در لایه‌های مرطوب و همیشگی زیر زمین کوبیده شده تا جریان خطا بدون مانع پخش گردد.", offset: { x: -140, y: 40 } }
      ]
    },

    // 4. EARTHED OUTLET SOCKET (پریز ارت‌دار دیواری)
    {
      id: "socket",
      name: "پریز ارت‌دار برق خانگی استاندارد",
      englishName: "Earthed Wall Socket Outlet",
      mabhath13Ref: "بند ۱۳-۵-۳ مقررات ملی ساختمان - الزامات کلید و پریز",
      description: "پریز ارت‌دار خانگی دارای یک مسیر متصل مستقیم به هادی حفاظتی ارت (PE) است که هرگونه جریان اتصالی فاز به بدنه لوازم برقی را بلافاصله به سیستم زمین هدایت می‌کند.",
      vertices: [
        // Socket Faceplate Plate (Vertices 0-7)
        { x: -45, y: -45, z: 5 },  // 0
        { x: 45, y: -45, z: 5 },   // 1
        { x: 45, y: 45, z: 5 },    // 2
        { x: -45, y: 45, z: 5 },   // 3
        { x: -45, y: -45, z: -10 }, // 4
        { x: 45, y: -45, z: -10 },  // 5
        { x: 45, y: 45, z: -10 },   // 6
        { x: -45, y: 45, z: -10 },  // 7

        // Socket plug holes (Vertices 8-11)
        { x: -15, y: 0, z: 5 },     // 8 (Left socket hole - Phase)
        { x: 15, y: 0, z: 5 },      // 9 (Right socket hole - Neutral)
        
        // Earth Clip spring clips (Vertices 10-13)
        { x: 0, y: 22, z: 8 },      // 10 (Top earth clip tip)
        { x: 0, y: 15, z: 0 },      // 11 (Top earth clip base)
        { x: 0, y: -22, z: 8 },     // 12 (Bottom earth clip tip)
        { x: 0, y: -15, z: 0 }      // 13 (Bottom earth clip base)
      ],
      faces: [
        // Faceplate outer
        { indices: [0, 1, 2, 3], color: "rgba(241, 245, 249, 0.95)", outlineColor: "#cbd5e1", partName: "روکش عایق پلاستیکی سفید آنتی استاتیک" },
        { indices: [4, 5, 1, 0], color: "rgba(226, 232, 240, 0.9)", outlineColor: "#94a3b8", partName: "مکانیزم سرامیکی داخلی" },
        { indices: [2, 6, 7, 3], color: "rgba(226, 232, 240, 0.9)", outlineColor: "#94a3b8", partName: "مکانیزم سرامیکی داخلی" }
      ],
      lines: [
        // Socket Hole outline circular mock-ups
        { p1: 8, p2: 8, color: "#1e293b", width: 4 }, // Left hole
        { p1: 9, p2: 9, color: "#1e293b", width: 4 }, // Right hole

        // Earth metal spring clip
        { p1: 10, p2: 11, color: "#ea580c", width: 3.5, explodeDir: { x: 0, y: 15, z: 15 } },
        { p1: 12, p2: 13, color: "#ea580c", width: 3.5, explodeDir: { x: 0, y: -15, z: 15 } }
      ],
      annotations: [
        { pointIndex: 8, title: "کنتاکت فاز (شاخک برنجی)", desc: "محل ورود شاخه فاز دوشاخه لوازم برقی که باید مستقیم به فیوز مینیاتوری مربوطه در تابلو وصل شود.", offset: { x: -130, y: -30 } },
        { pointIndex: 9, title: "کنتاکت نول (شاخک برنجی)", desc: "محل ورود شاخه برگشت جریان خروجی مصرف‌کننده که مستقیم به شینه نول تابلوی توزیع وصل می‌گردد.", offset: { x: 130, y: -10 } },
        { pointIndex: 10, title: "شاخک فلزی همبندی ارت", desc: "شاخک فنری برنجی بالا و پایین پریز که با بدنه فلزی دوشاخه ارت‌دار چفت شده و قبل از برقراری فاز، بدنه را به سیستم زمین وصل می‌کند.", offset: { x: -110, y: 50 } },
        { pointIndex: 4, title: "قاب سرامیکی مغزی نسوز", desc: "پایه مرکزی نگهدارنده پلاتین‌ها که از جنس سرامیک مقاوم به حرارت ساخته شده تا در جریان‌های بالا یا اتصالات گرمایی ذوب نگردد.", offset: { x: 120, y: 40 } }
      ]
    }
  ];
}

export default function ThreeDAndAr() {
  const models = useMemo(() => generateModels(), []);
  const [selectedModelId, setSelectedModelId] = useState<string>("mcb");
  const [viewMode, setViewMode] = useState<"3d" | "ar">("3d");
  const [explodeProgress, setExplodeProgress] = useState<number>(0);
  const [isTripped, setIsTripped] = useState<boolean>(false);
  const [isSimulatingLeakage, setIsSimulatingLeakage] = useState<boolean>(false);
  const [tripProgress, setTripProgress] = useState<number>(0);
  
  // 3D Rotations and scale
  const [rotation, setRotation] = useState<Point3D>({ x: -0.5, y: 0.6, z: 0 });
  const [scale, setScale] = useState<number>(3.5);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // AR states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  // AR Fallback background selection
  const [arBgType, setArBgType] = useState<"concrete" | "plaster" | "cabinet" | "brick">("cabinet");

  // AR Placed Elements
  const [placedItems, setPlacedItems] = useState<Array<{
    id: string;
    modelId: string;
    x: number; // percent from left
    y: number; // percent from top
    scale: number;
    rotation: number; // radians
  }>>([]);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);
  const [arScale, setArScale] = useState<number>(1);
  const [arRotation, setArRotation] = useState<number>(0);

  const activeModel = useMemo(() => {
    return models.find(m => m.id === selectedModelId) || models[0];
  }, [models, selectedModelId]);

  // RESET trip states when changing model
  useEffect(() => {
    setIsTripped(false);
    setIsSimulatingLeakage(false);
    setTripProgress(0);
    setExplodeProgress(0);
  }, [selectedModelId]);

  // --- CAMERA ACCESS ENABLER ---
  const enableCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasCameraAccess(true);
          setIsCameraActive(true);
        }
      } else {
        setCameraError("مرورگر شما از وب‌کم پشتیبانی نمی‌کند یا دسترسی امن HTTPS برقرار نیست.");
      }
    } catch (err: any) {
      console.error("Camera error: ", err);
      setCameraError("دسترسی به دوربین توسط مرورگر مسدود شده است. حالت شبیه‌ساز پس‌زمینه فعال گردید.");
      setHasCameraAccess(false);
      setIsCameraActive(false);
    }
  };

  const disableCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (viewMode === "ar") {
      enableCamera();
    } else {
      disableCamera();
    }
    return () => disableCamera();
  }, [viewMode]);

  // --- TRIP ACTION MECHANICS ---
  const handleTripAction = () => {
    if (isTripped) {
      // RESET
      setIsTripped(false);
      setIsSimulatingLeakage(false);
      setTripProgress(0);
      return;
    }

    if (selectedModelId === "mcb") {
      setIsTripped(true);
      let step = 0;
      const interval = setInterval(() => {
        step += 0.05;
        if (step >= 1) {
          setTripProgress(1);
          clearInterval(interval);
        } else {
          setTripProgress(step);
        }
      }, 30);
    } else if (selectedModelId === "rcd") {
      setIsSimulatingLeakage(true);
      setTimeout(() => {
        setIsTripped(true);
        let step = 0;
        const interval = setInterval(() => {
          step += 0.1;
          if (step >= 1) {
            setTripProgress(1);
            clearInterval(interval);
          } else {
            setTripProgress(step);
          }
        }, 15);
      }, 800); // delay to show leakage current flow
    } else if (selectedModelId === "earth") {
      // simulate fault dissipation
      setIsTripped(true);
      let step = 0;
      const interval = setInterval(() => {
        step += 0.02;
        if (step >= 1) {
          setTripProgress(1);
          clearInterval(interval);
        } else {
          setTripProgress(step);
        }
      }, 40);
    }
  };

  // --- 3D CANVAS RENDERING ENGINE (Pure custom projection with flat shading) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    const { vertices, faces, lines, id } = activeModel;

    // 1. Transform Vertices (Rotation, Scale, Zoom, Trip Animations, Explode Progress)
    const transformed: Point3D[] = vertices.map((v, idx) => {
      let { x, y, z } = v;

      // Handle custom mechanical trip modifications in MCB
      if (id === "mcb" && isTripped) {
        // Toggle Switch rotates down (Idx 10 & 11)
        if (idx === 10 || idx === 11) {
          y -= tripProgress * 15;
          z -= tripProgress * 15;
        }
        // Bi-metal bends (Idx 22 & 23)
        if (idx === 22 || idx === 23) {
          x -= tripProgress * 6; // bend to left
        }
      }

      // Handle residual leakage in RCD
      if (id === "rcd" && isTripped) {
        // Toggle Switch rotates down (Idx 10 & 11)
        if (idx === 10 || idx === 11) {
          y -= tripProgress * 12;
          z -= tripProgress * 15;
        }
      }

      // Handle Fault Dissipation waves in Earth well
      if (id === "earth" && isTripped) {
        // We will add expanding wave lines rather than changing rod mesh
      }

      // Apply Explode View floating vectors
      let ex = 0, ey = 0, ez = 0;
      // Find matching faces or lines to get explode directions
      const faceMatch = faces.find(f => f.indices.includes(idx));
      const lineMatch = lines.find(l => l.p1 === idx || l.p2 === idx);
      
      if (faceMatch?.explodeDir) {
        ex = faceMatch.explodeDir.x;
        ey = faceMatch.explodeDir.y;
        ez = faceMatch.explodeDir.z;
      } else if (lineMatch?.explodeDir) {
        ex = lineMatch.explodeDir.x;
        ey = lineMatch.explodeDir.y;
        ez = lineMatch.explodeDir.z;
      }

      x += ex * explodeProgress;
      y += ey * explodeProgress;
      z += ez * explodeProgress;

      // Rotate around Y-axis (Yaw)
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X-axis (Pitch)
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    });

    // Perspective Projection helper
    const project = (pt: Point3D) => {
      const dist = 320; // camera distance
      const projScale = dist / (dist + pt.z);
      const finalScale = scale * projScale;
      return {
        x: cx + pt.x * finalScale,
        y: cy - pt.y * finalScale,
        z: pt.z
      };
    };

    const projected = transformed.map(project);

    // 2. Sort Faces by average Z depth (Painter's Algorithm for solid rendering)
    const sortedFaces = faces
      .map((face, index) => {
        const sumZ = face.indices.reduce((sum, idx) => sum + transformed[idx].z, 0);
        const avgZ = sumZ / face.indices.length;
        return { face, avgZ, index };
      })
      .sort((a, b) => b.avgZ - a.avgZ); // draw deepest first

    // 3. Render Faces
    sortedFaces.forEach(({ face }) => {
      if (face.indices.length < 3) return;

      // Highlight specific parts during trip/overload
      let faceColor = face.color;
      if (id === "mcb" && isTripped) {
        if (face.partName?.includes("بی‌متال")) {
          // Heat up to glowing orange-red
          const red = Math.round(56 + (239 - 56) * tripProgress);
          const green = Math.round(189 - (189 - 68) * tripProgress);
          const blue = Math.round(248 - (248 - 68) * tripProgress);
          faceColor = `rgba(${red}, ${green}, ${blue}, 0.95)`;
        }
        if (face.partName?.includes("سیم‌پیچ") && tripProgress < 0.6) {
          // Short circuit spark color
          faceColor = "rgba(251, 146, 60, 0.95)";
        }
      }

      if (id === "rcd" && isSimulatingLeakage && !isTripped) {
        if (face.partName?.includes("حسگر تفاضلی")) {
          // Ring glows red
          faceColor = "rgba(239, 68, 68, 0.85)";
        }
      }

      ctx.beginPath();
      const p0 = projected[face.indices[0]];
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < face.indices.length; i++) {
        const pt = projected[face.indices[i]];
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      ctx.fillStyle = faceColor;
      ctx.fill();

      if (face.outlineColor) {
        ctx.strokeStyle = face.outlineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // 4. Render Lines
    lines.forEach(line => {
      const p1 = projected[line.p1];
      const p2 = projected[line.p2];
      
      let lineColor = line.color;
      if (id === "earth" && isTripped && line.color === "#10b981") {
        // fault electricity glowing green flowing through
        lineColor = "#34d399";
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = line.width || 1;
      ctx.stroke();
    });

    // 5. Draw Special Animated Waves / Particle Effects
    if (id === "earth" && isTripped) {
      // draw concentric green arcs going down into soil (dissipating fault energy)
      ctx.save();
      const rodBottom = projected[8];
      const radiusStep = 15;
      ctx.strokeStyle = "rgba(16, 185, 129, " + (1 - tripProgress) * 0.8 + ")";
      ctx.lineWidth = 2;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(rodBottom.x, rodBottom.y, r * radiusStep * (1 + tripProgress), 0, Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (id === "mcb" && isTripped && tripProgress > 0.1 && tripProgress < 0.6) {
      // Draw small electric arc sparks near arc chute (around index 26)
      const chutePt = projected[26];
      ctx.save();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const dx = (Math.random() - 0.5) * 40;
        const dy = (Math.random() - 0.5) * 40;
        ctx.moveTo(chutePt.x, chutePt.y);
        ctx.lineTo(chutePt.x + dx, chutePt.y + dy);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (id === "rcd" && isSimulatingLeakage && !isTripped) {
      // draw yellow dots circulating the CT ring
      const ringPt1 = projected[16];
      const ringPt2 = projected[17];
      ctx.save();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(ringPt1.x + (ringPt2.x - ringPt1.x) * Math.sin(Date.now() / 150), ringPt1.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Draw Annotations / Info lines
    activeModel.annotations.forEach(ann => {
      const pt = projected[ann.pointIndex];
      if (!pt) return;

      // Draw anchor point circle
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Only draw descriptions and lead lines if exploded or 3D rotation is stable
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      const lineEndX = pt.x + ann.offset.x;
      const lineEndY = pt.y + ann.offset.y;
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw horizontal sub-line
      ctx.beginPath();
      ctx.moveTo(lineEndX, lineEndY);
      ctx.lineTo(lineEndX + (ann.offset.x > 0 ? 30 : -30), lineEndY);
      ctx.stroke();
    });

  }, [activeModel, rotation, scale, explodeProgress, isTripped, tripProgress, isSimulatingLeakage]);

  // --- DRAG TO ROTATE LOGIC ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setRotation(prev => ({
      x: prev.x + dy * 0.007,
      y: prev.y + dx * 0.007,
      z: prev.z
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // --- AR CANVAS ACTION: PLACING ITEMS ---
  const handlePlaceInAr = (modelId: string) => {
    const newItem = {
      id: `placed-${Date.now()}`,
      modelId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedPlacedId(newItem.id);
  };

  const handleArDrag = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // only left click
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setPlacedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, x: Math.max(5, Math.min(95, clickX)), y: Math.max(5, Math.min(95, clickY)) };
      }
      return item;
    }));
  };

  return (
    <div className="bg-[#111318] border border-[#232730] rounded-2xl p-6 shadow-xl text-right" dir="rtl">
      
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 mb-6 gap-4">
        <div>
          <span className="text-amber-500 font-black text-xs uppercase tracking-wider block mb-1">مکانیزم‌های فنی و مدل‌سازی مجازی</span>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            آموزش ۳بعدی و واقعیت افزوده (AR) تجهیزات
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بررسی اجزای درونی، شبیه‌سازی حوادث قطع فیوز و قراردهی مجازی کاندوئیت‌ها بر روی تصویر دوربین محیط کارگاه واقعی
          </p>
        </div>

        {/* Navigation Selector */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-900 gap-1.5 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode("3d")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "3d" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Box className="h-4 w-4" />
            کنکاش و دیسکورس ۳بعدی
          </button>
          <button
            onClick={() => setViewMode("ar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "ar" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            واقعیت افزوده کارگاهی (AR)
          </button>
        </div>
      </div>

      {viewMode === "3d" ? (
        // --- 3D INTERACTIVE EXPLORER TAB ---
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lateral Selector */}
          <div className="lg:col-span-3 space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-900/60 h-fit">
            <span className="text-[10px] font-black text-slate-500 block pb-2 border-b border-slate-900 uppercase">انتخاب تجهیز الکتریکی</span>
            
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`w-full flex flex-col p-3 rounded-xl text-right transition-all border ${
                  selectedModelId === model.id 
                    ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                    : "bg-slate-900/40 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <span className="text-xs font-black block">{model.name}</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1">{model.englishName}</span>
              </button>
            ))}

            <div className="bg-[#111318] p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1.5">
              <span className="text-amber-500 font-extrabold flex items-center gap-1">
                <Info className="h-3 w-3" />راهنمای تعامل:
              </span>
              <p className="leading-relaxed">
                با کشیدن ماوس روی کادر شبیه‌ساز، مدل را بچرخانید. از کنترل‌های زیرین برای نمای متلاشی‌شده استفاده کنید.
              </p>
            </div>
          </div>

          {/* Canvas display frame */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl h-[420px] group">
              
              {/* Overlay Grid lines for schematic technical blueprint feel */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
              
              {/* Interactive Info overlays */}
              <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-[10px] space-y-1">
                <span className="text-slate-500 block font-bold">بخش فعال:</span>
                <span className="text-white font-extrabold">{activeModel.name}</span>
                <span className="text-amber-500 block font-mono">{activeModel.mabhath13Ref}</span>
              </div>

              <div className="absolute bottom-4 left-4 flex gap-1.5">
                <button
                  onClick={() => setRotation({ x: -0.5, y: 0.6, z: 0 })}
                  className="p-2 bg-slate-900/90 border border-slate-800 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="بازنشانی زاویه دید"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setScale(prev => Math.min(6, prev + 0.3))}
                  className="p-2 bg-slate-900/90 border border-slate-800 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="بزرگنمایی"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setScale(prev => Math.max(1.5, prev - 0.3))}
                  className="p-2 bg-slate-900/90 border border-slate-800 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="کوچکنمایی"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>

              {/* Core 3D Canvas element */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />

              {/* Exploded parts text lookup */}
              {explodeProgress > 0.1 && (
                <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl max-w-xs text-right">
                  <span className="text-amber-500 text-[10px] font-black block mb-1">🔧 نمای انفجاری (متلاشی‌شده) فعال است</span>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    در این حالت، پوسته خارجی به طرفین کشیده شده تا قطعات درونی کلید شامل سیم‌پیچ مغناطیسی، تیغه بی‌متال و خاموش‌کننده قوس جرقه آشکار شوند.
                  </p>
                </div>
              )}
            </div>

            {/* Slider Controller bento bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300">نمای انفجاری اجزا (Explode Model)</span>
                  <span className="text-[10px] font-mono font-bold text-amber-500">{Math.round(explodeProgress * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodeProgress}
                  onChange={e => setExplodeProgress(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-900 h-1 rounded-lg outline-none cursor-pointer"
                />
              </div>

              {/* Model specific action button */}
              <div className="flex items-center justify-end gap-2">
                {selectedModelId === "mcb" && (
                  <button
                    onClick={handleTripAction}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      isTripped 
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" 
                        : "bg-red-500 text-white hover:bg-red-400"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    {isTripped ? "شبیه‌سازی مجدد کلید (Reset MCB)" : "تحریک خطای اتصال کوتاه (Trip MCB)"}
                  </button>
                )}
                {selectedModelId === "rcd" && (
                  <button
                    onClick={handleTripAction}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      isTripped 
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" 
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    <Sliders className="h-4 w-4" />
                    {isTripped ? "وصل مجدد کلید محافظ جان" : "شبیه‌سازی نشتی جریان (Test RCD)"}
                  </button>
                )}
                {selectedModelId === "earth" && (
                  <button
                    onClick={handleTripAction}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      isTripped 
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" 
                        : "bg-amber-600 text-white hover:bg-amber-500"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    {isTripped ? "توقف تست اتصال" : "شبیه‌سازی برخورد صاعقه"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Model Description & Detailed Breakdown block */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3.5">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">تشریح و آنالیز مهندسی</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {activeModel.description}
              </p>

              {/* List of Annotations for easy reading */}
              <div className="space-y-3 pt-3 border-t border-slate-900">
                <span className="text-[9px] font-black text-amber-500 block">مشخصات ساختاری تجهیز:</span>
                {activeModel.annotations.map((ann, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850/80 text-right space-y-1">
                    <span className="text-[10px] font-black text-white block">📍 {ann.title}</span>
                    <p className="text-[9px] text-slate-400 leading-relaxed">{ann.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        // --- AUGMENTED REALITY (AR) VISUALIZER TAB ---
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left controller: list of items to place */}
            <div className="lg:col-span-3 space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-900/60 h-fit">
              <div>
                <span className="text-[10px] font-black text-amber-500 block mb-1">گام اول:</span>
                <h3 className="text-xs font-black text-white">افزودن قطعات به نقشه کارگاه</h3>
                <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                  بر روی هر قطعه کلیک کنید تا وارد کادر شبیه‌ساز کارگاه واقعی شود. سپس می‌توانید آن را جابجا کنید.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handlePlaceInAr(m.id)}
                    className="flex items-center justify-between p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-right transition-all group"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-400 block">{m.name}</span>
                      <span className="text-[8px] text-slate-500 font-mono block mt-0.5">{m.englishName}</span>
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded-lg font-black group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">+ درج</span>
                  </button>
                ))}
              </div>

              {placedItems.length > 0 && (
                <div className="pt-3 border-t border-slate-900 space-y-3">
                  <span className="text-[10px] font-black text-slate-400 block">تنظیم المان انتخاب شده:</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">اندازه (Scale):</span>
                      <span className="text-white font-mono">{arScale}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2"
                      step="0.05"
                      value={arScale}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setArScale(val);
                        if (selectedPlacedId) {
                          setPlacedItems(prev => prev.map(item => item.id === selectedPlacedId ? { ...item, scale: val } : item));
                        }
                      }}
                      className="w-full accent-amber-500 bg-slate-900 h-1 rounded outline-none"
                    />

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">زاویه چرخش (Rotate):</span>
                      <span className="text-white font-mono">{Math.round((arRotation * 180) / Math.PI)}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.PI * 2}
                      step="0.05"
                      value={arRotation}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setArRotation(val);
                        if (selectedPlacedId) {
                          setPlacedItems(prev => prev.map(item => item.id === selectedPlacedId ? { ...item, rotation: val } : item));
                        }
                      }}
                      className="w-full accent-amber-500 bg-slate-900 h-1 rounded outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPlacedItems(placedItems.filter(item => item.id !== selectedPlacedId));
                      setSelectedPlacedId(null);
                    }}
                    className="w-full py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                  >
                    حذف المان انتخابی
                  </button>
                </div>
              )}
            </div>

            {/* Main view block: Video camera overlay or Fallback backdrop */}
            <div className="lg:col-span-9 space-y-4">
              <div className="relative w-full h-[500px] bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-inner group">
                
                {isCameraActive ? (
                  // REAL WEB-CAMERA STREAM
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  // FALLBACK BACKGROUNDS
                  <div className="absolute inset-0 w-full h-full transition-all duration-300 pointer-events-none">
                    {arBgType === "cabinet" && (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
                        {/* Cabinet grid */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "24px 24px" }}></div>
                        <div className="w-80 h-[400px] border-4 border-slate-800 rounded-2xl bg-slate-950/80 p-6 shadow-inner flex flex-col justify-between">
                          <span className="text-[10px] text-slate-600 font-mono text-center">تابلوی توزیع فرضی کارگاه</span>
                          <div className="border border-dashed border-slate-800 flex-1 my-4 rounded flex items-center justify-center">
                            <span className="text-[9px] text-slate-700">محل نصب ریل مینیاتوری</span>
                          </div>
                          <span className="text-[9px] text-slate-600 font-black text-center">رعایت حریم مبحث ۱۳</span>
                        </div>
                      </div>
                    )}
                    {arBgType === "concrete" && (
                      <div className="w-full h-full bg-stone-800 relative">
                        <div className="absolute inset-0 bg-stone-700/40 opacity-30 pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, #1c1917 25%, transparent 25%), linear-gradient(-45deg, #1c1917 25%, transparent 25%)", backgroundSize: "60px 60px" }}></div>
                        <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-stone-500 font-mono">پس‌زمینه دیواره بتنی کارگاه برق</div>
                      </div>
                    )}
                    {arBgType === "brick" && (
                      <div className="w-full h-full bg-amber-950/60 relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(180deg, transparent 49%, #3b1102 50%, #3b1102 52%, transparent 53%), linear-gradient(90deg, transparent 49%, #3b1102 50%, #3b1102 52%, transparent 53%)", backgroundSize: "80px 40px" }}></div>
                        <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-amber-900 font-mono">پس‌زمینه آجری شیارزنی کلید و پریز</div>
                      </div>
                    )}
                    {arBgType === "plaster" && (
                      <div className="w-full h-full bg-slate-100 relative">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 0)", backgroundSize: "12px 12px" }}></div>
                        <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-slate-400 font-mono">پس‌زمینه گچ‌کاری نازک‌کاری اتاق مسکونی</div>
                      </div>
                    )}
                  </div>
                )}

                {/* AR Graphics overlays (Blue tracking HUD) */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-bold flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 animate-spin" />
                        سیستم ردیابی فعال (HUD)
                      </span>
                      {isCameraActive && (
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-bold flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          دوربین واقعی زنده
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl text-[9px] text-slate-400 font-mono text-left">
                      <span>FPS: 60.00</span><br />
                      <span>TRACKING: OK</span>
                    </div>
                  </div>

                  {/* Reticle guide in center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30">
                    <div className="w-12 h-12 border-2 border-dashed border-blue-400 rounded-full animate-spin"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full absolute"></div>
                  </div>

                  {/* Horizontal and vertical coordinate axes */}
                  <div className="absolute bottom-6 right-6 text-right space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                    <span className="text-white block font-black">ابزارهای کنترل موقعیت:</span>
                    <p className="leading-tight text-[9px]">
                      المان‌های جای‌گذاری شده را می‌توانید مستقیماً با ماوس در صفحه بکشید و موقعیت نصب آن‌ها را تنظیم کنید.
                    </p>
                  </div>
                </div>

                {/* RENDER PLACED 3D ITEMS OVER THE BACKDROP */}
                {placedItems.map(item => {
                  const model = models.find(m => m.id === item.modelId) || models[0];
                  const isSelected = item.id === selectedPlacedId;
                  
                  return (
                    <div
                      key={item.id}
                      style={{
                        position: "absolute",
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}rad) scale(${item.scale})`,
                        transition: "border 0.2s"
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setSelectedPlacedId(item.id);
                        setArScale(item.scale);
                        setArRotation(item.rotation);
                      }}
                      onMouseMove={(e) => handleArDrag(item.id, e)}
                      className={`cursor-move p-2 rounded-xl bg-slate-950/90 shadow-2xl border ${
                        isSelected ? "border-amber-500 shadow-amber-500/20" : "border-slate-800"
                      }`}
                    >
                      {/* Render miniature SVG representing the projected 3D item */}
                      <div className="w-28 h-28 flex flex-col items-center justify-center relative">
                        <Box className={`h-12 w-12 ${isSelected ? "text-amber-500" : "text-slate-400"}`} />
                        <span className="text-[10px] font-black text-white text-center block mt-1.5">{model.name}</span>
                        <span className="text-[8px] text-slate-500 text-center block mt-0.5">{model.mabhath13Ref.split(" - ")[0]}</span>
                      </div>
                    </div>
                  );
                })}

                {placedItems.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-950/40 backdrop-blur-[1px]">
                    <span className="text-amber-500 text-sm font-black mb-1">کادر خالی واقعیت افزوده</span>
                    <p className="text-xs text-slate-400 text-center max-w-sm leading-relaxed">
                      لطفاً از پنل سمت راست، تجهیزات برقی دلخواه را به صفحه کارگاه بکشید تا بر روی محیط تراز شوند.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom backdrop selectors */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400">تغییر شبیه‌ساز پس‌زمینه کارگاهی:</span>
                  <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl">
                    <button
                      onClick={() => { setArBgType("cabinet"); disableCamera(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        arBgType === "cabinet" && !isCameraActive ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      باکس تابلو برق
                    </button>
                    <button
                      onClick={() => { setArBgType("concrete"); disableCamera(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        arBgType === "concrete" && !isCameraActive ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      دیواره بتنی
                    </button>
                    <button
                      onClick={() => { setArBgType("brick"); disableCamera(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        arBgType === "brick" && !isCameraActive ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      دیواره آجری
                    </button>
                    <button
                      onClick={() => { setArBgType("plaster"); disableCamera(); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        arBgType === "plaster" && !isCameraActive ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      دیوار گچی مسکونی
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={enableCamera}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <Video className="h-4 w-4" />
                    فعال‌سازی دوربین زنده کارگاه
                  </button>
                  <button
                    onClick={() => {
                      setPlacedItems([]);
                      setSelectedPlacedId(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all"
                  >
                    پاکسازی صفحه
                  </button>
                </div>
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] rounded-xl flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>نکته مربوط به مجوز دوربین:</strong> {cameraError}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
