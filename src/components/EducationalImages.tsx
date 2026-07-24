import React, { useState, useMemo } from "react";
import { 
  Image, Search, Layers, ShieldCheck, Tag, Info, AlertTriangle, 
  Settings, ZoomIn, ZoomOut, Download, Copy, Check, ChevronLeft, 
  ChevronRight, ArrowLeft, RefreshCw, Bookmark, Sliders, ExternalLink, Sparkles
} from "lucide-react";
import { generate500Images, EducationalImage } from "../data/imagesGenerator";

export default function EducationalImages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها");
  const [selectedDifficulty, setSelectedDifficulty] = useState("همه سطوح");
  const [activeImageId, setActiveImageId] = useState("img-1");
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [scale, setScale] = useState(1);

  // Generate the 500 high-quality educational images programmatically
  const allImages = useMemo(() => {
    const base = generate500Images();
    const storedCustom = localStorage.getItem("custom_educational_images");
    let customList: any[] = [];
    if (storedCustom) {
      try {
        customList = JSON.parse(storedCustom);
      } catch (e) {
        console.error(e);
      }
    }
    const formattedCustom = customList.map(img => ({
      id: img.id,
      title: img.title,
      category: img.category,
      difficulty: "مقدماتی",
      illustrationType: "custom",
      description: img.description,
      mabhath13Ref: "بندهای الحاقی مبحث ۱۳",
      imageUrl: img.url,
      cableSize: "۱.۵",
      voltage: "۲۲۰"
    }));
    return [...formattedCustom, ...base];
  }, []);

  // Unique categories list
  const categories = useMemo(() => {
    return ["همه دسته‌ها", ...Array.from(new Set(allImages.map(img => img.category)))];
  }, [allImages]);

  // Filtered list of images
  const filteredImages = useMemo(() => {
    return allImages.filter(img => {
      const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            img.mabhath13Ref.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "همه دسته‌ها" || img.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "همه سطوح" || img.difficulty === selectedDifficulty;
      const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.includes(img.id);
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesBookmark;
    });
  }, [allImages, searchQuery, selectedCategory, selectedDifficulty, bookmarkedIds, showOnlyBookmarks]);

  const activeImage = allImages.find(img => img.id === activeImageId) || allImages[0];

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleCopyCode = () => {
    const codeText = `// مشخصات فنی دیاگرام آموزشی مبحث ۱۳\n// شناسه: ${activeImage.id}\n// عنوان: ${activeImage.title}\n// مرجع قانونی: ${activeImage.mabhath13Ref}\n// سطح مقطع پیشنهادی: ${activeImage.cableSize || "متناسب با مدار"}\n// ولتاژ کاری: ${activeImage.voltage || "۲۲۰ ولت"}`;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Renderer depending on image category/illustrationType
  const renderSVGIllustration = (type: string, title: string, cableSize: string = "۱.۵", voltage: string = "۲۲۰") => {
    if (type === "custom" && activeImage.imageUrl) {
      return (
        <img 
          src={activeImage.imageUrl} 
          alt={title} 
          className="w-full h-full object-cover rounded-xl"
          referrerPolicy="no-referrer"
        />
      );
    }

    const animatedCircleStyle = {
      animation: "dash 4s linear infinite"
    };

    switch (type) {
      case "circuit_wiring":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: -40; }
              }
            `}</style>
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            <grid width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </grid>
            
            {/* Title Legend */}
            <text x="360" y="45" fill="#f59e0b" textAnchor="end" className="text-[10px] font-black font-sans">دیاگرام مداری سیم‌کشی روشنایی</text>
            <text x="360" y="60" fill="#94a3b8" textAnchor="end" className="text-[8px] font-medium font-sans">ابعاد سیم: {cableSize} | ولتاژ: {voltage}</text>

            {/* Wire paths */}
            <path d="M 50 140 L 150 140" stroke="#f59e0b" strokeWidth="3" fill="none" />
            <path d="M 150 140 L 150 100 L 250 100" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeDasharray="6,4" style={animatedCircleStyle} />
            <path d="M 250 140 L 350 140" stroke="#3b82f6" strokeWidth="2.5" fill="none" />

            {/* Light Bulb */}
            <circle cx="250" cy="120" r="18" fill="#fbbf24" fillOpacity="0.15" stroke="#fbbf24" strokeWidth="2" />
            <path d="M 244 135 L 256 135 L 253 140 L 247 140 Z" fill="#64748b" />
            <circle cx="250" cy="120" r="8" fill="#fbbf24" className="animate-pulse" />

            {/* Switch */}
            <rect x="135" y="125" width="30" height="30" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <line x1="145" y1="140" x2="160" y2="130" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="145" cy="140" r="2.5" fill="#ef4444" />
            <circle cx="160" cy="130" r="2.5" fill="#10b981" />

            <text x="150" y="172" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold">کلید کنترل تک‌پل</text>
            <text x="250" y="172" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold">چراغ مصرفی ال‌ای‌دی</text>
            <text x="50" y="128" fill="#f59e0b" className="text-[8px] font-mono">PHASE</text>
            <text x="310" y="128" fill="#3b82f6" className="text-[8px] font-mono">NEUTRAL</text>
          </svg>
        );

      case "symbol_design":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Grid pattern */}
            <line x1="15" y1="75" x2="385" y2="75" stroke="#162238" strokeWidth="1" />
            <line x1="15" y1="135" x2="385" y2="135" stroke="#162238" strokeWidth="1" />
            <line x1="15" y1="195" x2="385" y2="195" stroke="#162238" strokeWidth="1" />
            <line x1="200" y1="15" x2="200" y2="225" stroke="#162238" strokeWidth="1" />

            {/* Cell 1: Bulb */}
            <g transform="translate(150, 45)">
              <circle cx="0" cy="0" r="12" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <line x1="-8" y1="-8" x2="8" y2="8" stroke="#38bdf8" strokeWidth="2" />
              <line x1="8" y1="-8" x2="-8" y2="8" stroke="#38bdf8" strokeWidth="2" />
              <text x="-130" y="4" fill="#94a3b8" className="text-[9px] font-bold text-right">سمبل چراغ روشنایی سقفی</text>
            </g>

            {/* Cell 2: Socket Outlet */}
            <g transform="translate(150, 105)">
              <circle cx="0" cy="0" r="10" fill="none" stroke="#f43f5e" strokeWidth="2" />
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#f43f5e" strokeWidth="2" />
              <line x1="-15" y1="-10" x2="-15" y2="10" stroke="#f43f5e" strokeWidth="2" />
              <line x1="15" y1="-10" x2="15" y2="10" stroke="#f43f5e" strokeWidth="2" />
              <text x="-130" y="4" fill="#94a3b8" className="text-[9px] font-bold text-right">پریز برق با تماس حفاظتی (ارت)</text>
            </g>

            {/* Cell 3: Earth Connection */}
            <g transform="translate(150, 165)">
              <line x1="0" y1="-12" x2="0" y2="5" stroke="#10b981" strokeWidth="2.5" />
              <line x1="-12" y1="5" x2="12" y2="5" stroke="#10b981" strokeWidth="3" />
              <line x1="-8" y1="10" x2="8" y2="10" stroke="#10b981" strokeWidth="2.5" />
              <line x1="-4" y1="15" x2="4" y2="15" stroke="#10b981" strokeWidth="2" />
              <text x="-130" y="4" fill="#94a3b8" className="text-[9px] font-bold text-right">اتصال زمین حفاظتی (Earth)</text>
            </g>

            {/* Right column labels / notes */}
            <g transform="translate(220, 30)">
              <text x="150" y="25" fill="#f59e0b" textAnchor="end" className="text-[10px] font-black">علائم نقشه‌کشی استاندارد</text>
              <text x="150" y="45" fill="#cbd5e1" textAnchor="end" className="text-[8px] leading-relaxed">بر اساس الحاقیات و پیوست اول مبحث ۱۳ مقررات ملی ساختمان ایران و راهنماهای ترسیمی IEC.</text>
              <rect x="15" y="70" width="135" height="100" rx="6" fill="#111827" stroke="#1f2937" strokeWidth="1" />
              <text x="82" y="95" fill="#f59e0b" textAnchor="middle" className="text-[8px] font-mono font-bold">IEC 60617 SYMBOLS</text>
              <text x="82" y="120" fill="#34d399" textAnchor="middle" className="text-[7px] font-bold">مقیاس استاندارد: ۱:۵۰</text>
              <text x="82" y="140" fill="#94a3b8" textAnchor="middle" className="text-[7px] font-medium">مورد تایید سازمان نظام مهندسی</text>
            </g>
          </svg>
        );

      case "breaker_layout":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Breaker Body */}
            <rect x="150" y="35" width="100" height="170" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <rect x="180" y="80" width="40" height="60" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            
            {/* Switch Handle */}
            <rect x="188" y="90" width="24" height="20" rx="2" fill="#ef4444" />
            <text x="200" y="103" textAnchor="middle" fill="#ffffff" className="text-[7px] font-bold font-mono">ON</text>
            
            {/* Terminals */}
            <circle cx="200" cy="50" r="10" fill="#475569" />
            <text x="200" y="53" textAnchor="middle" fill="#ffffff" className="text-[8px] font-black font-mono">L IN</text>
            
            <circle cx="200" cy="190" r="10" fill="#475569" />
            <text x="200" y="193" textAnchor="middle" fill="#ffffff" className="text-[8px] font-black font-mono">OUT</text>

            {/* Features callouts */}
            <path d="M 120 50 L 190 50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="110" y="53" textAnchor="end" fill="#f59e0b" className="text-[8px] font-bold">ورودی فاز اصلی</text>

            <path d="M 230 100 L 290 100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="300" y="103" textAnchor="start" fill="#ef4444" className="text-[8px] font-bold">کلید اهرم مکانیکی قطع اضطراری</text>

            <path d="M 120 190 L 190 190" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="110" y="193" textAnchor="end" fill="#10b981" className="text-[8px] font-bold">خروجی به مصرف‌کننده</text>

            <text x="200" y="165" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold">مینیاتوری تیپ B (تندکار روشنایی)</text>
            <text x="360" y="180" fill="#3b82f6" textAnchor="end" className="text-[8px] font-mono">C25 Breaker</text>
          </svg>
        );

      case "tool_measure":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Digital Multimeter */}
            <rect x="60" y="40" width="100" height="160" rx="10" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
            <rect x="70" y="50" width="80" height="148" rx="8" fill="#1e293b" />
            
            {/* Display screen */}
            <rect x="78" y="60" width="64" height="35" rx="3" fill="#34d399" fillOpacity="0.8" />
            <text x="110" y="85" textAnchor="middle" fill="#064e3b" className="text-sm font-mono font-black">۲۱۹.۸ V</text>
            
            {/* Rotary dial knob */}
            <circle cx="110" cy="125" r="20" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <line x1="110" y1="125" x2="110" y2="110" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <text x="110" y="157" textAnchor="middle" fill="#f59e0b" className="text-[6px] font-bold">V ~ AC SELECT</text>

            {/* Test Probes and cables */}
            <path d="M 95 185 C 95 220 230 220 230 140" stroke="#ef4444" strokeWidth="2" fill="none" />
            <path d="M 125 185 C 125 240 280 230 280 120" stroke="#000000" strokeWidth="2" fill="none" />

            {/* Red Probe */}
            <g transform="translate(230, 140) rotate(-30)">
              <rect x="-3" y="0" width="6" height="40" fill="#ef4444" rx="1" />
              <line x1="0" y1="0" x2="0" y2="-15" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="0" cy="40" r="2" fill="#ef4444" />
            </g>

            {/* Black Probe */}
            <g transform="translate(280, 120) rotate(15)">
              <rect x="-3" y="0" width="6" height="40" fill="#111827" rx="1" />
              <line x1="0" y1="0" x2="0" y2="-15" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="0" cy="40" r="2" fill="#111827" />
            </g>

            {/* Target lines representing test terminals */}
            <line x1="210" y1="115" x2="310" y2="115" stroke="#64748b" strokeWidth="3" />
            <circle cx="230" cy="115" r="4" fill="#fbbf24" className="animate-ping" />
            
            <text x="350" y="60" fill="#f59e0b" textAnchor="end" className="text-[10px] font-black">روش اندازه‌گیری ولتاژ خط فاز</text>
            <text x="350" y="80" fill="#cbd5e1" textAnchor="end" className="text-[7px] leading-relaxed">پروب قرمز رنگ به ترمینال ولتاژ مولتی‌متر و پروب مشکی رنگ به شینه ارت یا نول ساختمان متصل می‌گردد.</text>
          </svg>
        );

      case "safety_sign":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Warning Triangle */}
            <polygon points="200,45 130,175 270,175" fill="#fbbf24" stroke="#d97706" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Lightning bolt inside triangle */}
            <path d="M 205 75 L 185 120 L 205 120 L 195 160 L 220 110 L 200 110 Z" fill="#000000" />
            
            {/* Persian warnings */}
            <text x="200" y="195" textAnchor="middle" fill="#ef4444" className="text-[11px] font-black font-sans">خطر برق‌گرفتگی - ولتاژ کار بالا</text>
            <text x="200" y="210" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold font-sans">قبل از باز کردن درب تابلو، کلید مینیاتوری اصلی را قطع کنید</text>

            {/* Shock wave lines */}
            <circle cx="200" cy="115" r="60" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,6" className="animate-ping" />
          </svg>
        );

      case "grounding_mesh":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Earth soil layers */}
            <rect x="40" y="110" width="320" height="90" fill="#1e293b" fillOpacity="0.4" rx="4" />
            <line x1="40" y1="110" x2="360" y2="110" stroke="#475569" strokeWidth="2" />
            
            {/* Ground Rod (میله ارت) */}
            <rect x="195" y="80" width="10" height="110" fill="#b45309" rx="1" />
            <polygon points="195,190 200,200 205,190" fill="#b45309" />
            
            {/* Ground copper cable */}
            <path d="M 80 50 L 198 80" stroke="#10b981" strokeWidth="3.5" fill="none" />
            <circle cx="198" cy="80" r="5" fill="#f59e0b" stroke="#10b981" strokeWidth="1.5" />

            {/* Labels and tags */}
            <text x="80" y="40" fill="#10b981" className="text-[8px] font-bold">هادی اتصال زمین (سیم مسی نمره ۲۵)</text>
            <text x="215" y="95" fill="#cbd5e1" className="text-[8px] font-bold">بست فولادی یا آلیاژ مس مخصوص</text>
            <text x="215" y="140" fill="#b45309" className="text-[8px] font-bold">الکترود ارت مسی (میله ارت ۳ متری)</text>
            
            {/* Charcoal & salt moisture zone representation */}
            <circle cx="200" cy="150" r="25" fill="#34d399" fillOpacity="0.08" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />
            <text x="200" y="153" textAnchor="middle" fill="#34d399" className="text-[7px] font-bold">بنتونیت یا پودر کاهنده مقاومت</text>

            <text x="350" y="45" fill="#f59e0b" textAnchor="end" className="text-[9px] font-black">جزئیات اجرایی اتصال کابل به الکترود زمین</text>
            <text x="350" y="60" fill="#94a3b8" textAnchor="end" className="text-[7px]">مقاومت نهایی الکترود باید کمتر از ۲ اهم باشد.</text>
          </svg>
        );

      case "low_voltage":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Intercom device */}
            <rect x="50" y="50" width="90" height="140" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="60" y="60" width="70" height="50" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <circle cx="95" cy="85" r="8" fill="#38bdf8" fillOpacity="0.3" />
            <path d="M 87 95 C 87 95 90 90 95 90 C 100 90 103 95 103 95" stroke="#38bdf8" strokeWidth="1" fill="none" />
            
            {/* Buttons */}
            <rect x="65" y="125" width="60" height="12" rx="2" fill="#334155" />
            <circle cx="75" cy="131" r="2" fill="#10b981" />
            <text x="115" y="133" textAnchor="end" fill="#94a3b8" className="text-[6px] font-sans">درب‌بازکن</text>
            
            <rect x="65" y="145" width="60" height="12" rx="2" fill="#334155" />
            <circle cx="75" cy="151" r="2" fill="#38bdf8" />
            <text x="115" y="153" textAnchor="end" fill="#94a3b8" className="text-[6px] font-sans">تماس داخلی</text>

            {/* Wiring block */}
            <path d="M 140 120 L 230 120" stroke="#f43f5e" strokeWidth="2" fill="none" />
            <path d="M 140 130 L 230 130" stroke="#3b82f6" strokeWidth="2" fill="none" />
            <path d="M 140 140 L 230 140" stroke="#10b981" strokeWidth="2" fill="none" />
            <path d="M 140 150 L 230 150" stroke="#fbbf24" strokeWidth="2" fill="none" />

            {/* Junction block / terminal switcher */}
            <rect x="230" y="105" width="100" height="65" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <text x="280" y="120" textAnchor="middle" fill="#fbbf24" className="text-[7px] font-mono font-bold">DISTRIBUTOR</text>
            <text x="280" y="135" textAnchor="middle" fill="#94a3b8" className="text-[6px] font-sans">سوئیچر طبقات آیفون تصویری</text>
            <text x="280" y="150" textAnchor="middle" fill="#10b981" className="text-[7px] font-mono font-black">۴-WIRE BUS</text>

            <text x="350" y="45" fill="#f59e0b" textAnchor="end" className="text-[9px] font-black">سیم‌کشی ۴ رشته موازی آیفون تصویری</text>
            <text x="350" y="60" fill="#cbd5e1" textAnchor="end" className="text-[7px] leading-relaxed">قرمز (صدا)، آبی (منفی)، زرد (مثبت)، سفید (ویدیو/تصویر)</text>
          </svg>
        );

      case "conduit_path":
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Wall brick cutout background */}
            <rect x="40" y="40" width="320" height="160" fill="#334155" fillOpacity="0.2" rx="6" stroke="#1e293b" strokeWidth="1.5" />
            
            {/* PVC Pipe Conduit lines */}
            <path d="M 80 40 L 80 120" stroke="#cbd5e1" strokeWidth="10" fill="none" />
            <path d="M 80 120 L 240 120" stroke="#cbd5e1" strokeWidth="10" fill="none" />
            <path d="M 240 120 L 240 200" stroke="#cbd5e1" strokeWidth="10" fill="none" />

            {/* Inside wires representation */}
            <path d="M 80 40 L 80 120 L 240 120 L 240 200" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeDasharray="4,6" style={animatedCircleStyle} />

            {/* Junction box or outlet box */}
            <rect x="65" y="105" width="30" height="30" rx="2" fill="#111827" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="80" cy="120" r="4" fill="#fbbf24" />

            {/* Annotation text */}
            <text x="120" y="70" fill="#f59e0b" className="text-[8px] font-bold">لوله کاندوئیت پی‌وی‌سی سخت</text>
            <text x="120" y="145" fill="#10b981" className="text-[8px] font-bold">هادی‌های عبوری فاز، نول و ارت در داخل لوله</text>
            <text x="260" y="170" fill="#cbd5e1" className="text-[8px] font-bold">قوطی کلید توکار دیواری</text>

            <text x="350" y="45" fill="#f59e0b" textAnchor="end" className="text-[9px] font-black">روش اجرای خم لوله برق با فنر سرد</text>
            <text x="350" y="60" fill="#94a3b8" textAnchor="end" className="text-[7px]">شعاع خم حداقل باید ۶ برابر قطر خارجی لوله باشد.</text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="15" y="15" width="370" height="210" rx="12" fill="#0b0f19" stroke="#1e293b" strokeWidth="2" />
            <circle cx="200" cy="110" r="30" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 200 95 L 200 125 M 185 110 L 215 110" stroke="#f59e0b" strokeWidth="3" />
            <text x="200" y="160" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold font-sans">{title}</text>
            <text x="200" y="175" textAnchor="middle" fill="#64748b" className="text-[8px] font-sans">دیاگرام مهندسی مبحث ۱۳</text>
          </svg>
        );
    }
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-900 rounded-2xl p-4 md:p-6 text-right select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-5">
        <div>
          <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2">
            <Image className="h-5 w-5 text-amber-500 shrink-0" />
            بانک ۵۰۰ تصویر و دیاگرام آموزشی مبحث ۱۳
          </h2>
          <p className="text-[10px] text-slate-400 mt-1">
            یک گنجینه بی‌نظیر از نقشه‌های کابل‌کشی، علائم مهندسی، زون‌بندی‌های ایمنی و شبیه‌ساز تصویری کارگاهی
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
            ۵۰۰ تصویر تخصصی کاملاً آفلاین و به روز
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIGHT SIDEBAR: Images List and Filters */}
        <div className="lg:col-span-1 space-y-3.5 order-2 lg:order-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-1">
            <Sliders className="h-4 w-4 text-amber-500" />
            فیلتر و کاتالوگ تصاویر ({filteredImages.length} تصویر)
          </span>

          {/* Search Input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="جستجو در بین ۵۰۰ تصویر فنی..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all font-bold text-right"
            />
            <Search className="h-4 w-4 text-slate-600 absolute left-3 top-3.5" />
          </div>

          {/* Filter Row 1: Categories */}
          <div className="w-full">
            <label className="text-[10px] text-slate-500 font-bold block mb-1">دسته‌بندی فنی:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 transition-all font-bold cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-950 text-slate-300 font-bold">{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter Row 2: Difficulty & Bookmarks Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">سطح دشواری:</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 transition-all font-bold cursor-pointer"
              >
                <option value="همه سطوح" className="font-bold">همه سطوح</option>
                <option value="مقدماتی" className="font-bold">مقدماتی</option>
                <option value="متوسط" className="font-bold">متوسط</option>
                <option value="پیشرفته" className="font-bold">پیشرفته</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">نشان‌گذاری‌ها:</label>
              <button 
                onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                className={`w-full h-[38px] rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  showOnlyBookmarks 
                    ? "bg-amber-500/10 border-amber-500 text-amber-400"
                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300"
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${showOnlyBookmarks ? "fill-amber-400" : ""}`} />
                نشان‌شده ({bookmarkedIds.length})
              </button>
            </div>
          </div>

          {/* Clear Filters helper */}
          {(searchQuery || selectedCategory !== "همه دسته‌ها" || selectedDifficulty !== "همه سطوح" || showOnlyBookmarks) && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("همه دسته‌ها");
                setSelectedDifficulty("همه سطوح");
                setShowOnlyBookmarks(false);
              }}
              className="w-full text-center py-1.5 text-[10px] text-amber-500 hover:text-amber-400 transition-all font-bold bg-amber-500/5 rounded-lg border border-amber-500/10"
            >
              پاک کردن تمامی فیلترهای جستجو
            </button>
          )}

          {/* Scrollable image items list */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredImages.length > 0 ? (
              filteredImages.map((img) => {
                const isActive = activeImageId === img.id;
                const isBookmarked = bookmarkedIds.includes(img.id);
                
                return (
                  <div
                    key={img.id}
                    onClick={() => {
                      setActiveImageId(img.id);
                      setIsZoomed(false);
                      setScale(1);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-right flex flex-col gap-1.5 ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5"
                        : "bg-slate-950 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800 font-bold font-mono">
                        {img.id.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                          img.difficulty === "مقدماتی" ? "bg-emerald-500/15 text-emerald-400" :
                          img.difficulty === "متوسط" ? "bg-amber-500/15 text-amber-400" :
                          "bg-rose-500/15 text-rose-400"
                        }`}>
                          {img.difficulty}
                        </span>
                        {isBookmarked && <Bookmark className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />}
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-200 leading-relaxed line-clamp-1">{img.title}</h3>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-900/50 pt-1.5">
                      <span>{img.category}</span>
                      <span className="text-amber-500 font-bold">{img.mabhath13Ref}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-600 font-bold bg-slate-950 rounded-xl border border-slate-900">
                تصویری منطبق با فیلترهای بالا یافت نشد.
              </div>
            )}
          </div>
        </div>

        {/* LEFT / CENTER STAGE: Active Image Showcase and Info */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          
          {/* Main Visual Board Panel */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-4 min-h-[320px] md:min-h-[380px]">
            
            {/* Grid style background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
            
            {/* Interactive Image Frame */}
            <div 
              className="w-full max-w-lg aspect-[4/3] rounded-xl overflow-hidden bg-[#070a10] border border-slate-900 relative shadow-inner flex items-center justify-center transition-all duration-300"
              style={{ transform: `scale(${scale})` }}
            >
              {renderSVGIllustration(activeImage.illustrationType, activeImage.title, activeImage.cableSize, activeImage.voltage)}
            </div>

            {/* Float Toolbar buttons */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-lg shadow-xl z-10">
              <button 
                onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                title="بزرگ‌نمایی"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setScale(prev => Math.max(prev - 0.2, 0.6))}
                title="کوچک‌نمایی"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setScale(1)}
                title="تنظیم مجدد"
                className="p-1 text-[9px] font-mono text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors px-1"
              >
                1x
              </button>
              <span className="h-3 w-[1px] bg-slate-800"></span>
              <button 
                onClick={() => toggleBookmark(activeImage.id)}
                title="نشان‌گذاری"
                className="p-1 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded transition-all"
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedIds.includes(activeImage.id) ? "fill-amber-500 text-amber-500" : ""}`} />
              </button>
            </div>

            {/* Quick stats floating bar */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/85 backdrop-blur border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-amber-500" /> {activeImage.id.toUpperCase()}</span>
              <span>|</span>
              <span className="text-emerald-400">{activeImage.mabhath13Ref}</span>
            </div>
          </div>

          {/* Details Content Box */}
          <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/50 pb-4">
              <div>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold inline-block mb-2">
                  {activeImage.category}
                </span>
                <h3 className="text-sm md:text-base font-black text-white leading-relaxed">{activeImage.title}</h3>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <button 
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg text-[10px] font-bold text-slate-300 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-bounce" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "کپی شد" : "کپی مشخصات"}
                </button>
                <button 
                  onClick={() => {
                    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">${activeImage.title}</svg>`;
                    const blob = new Blob([svgString], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${activeImage.id}_diagram.svg`;
                    a.click();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg text-[10px] font-black transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  دانلود فایل SVG
                </button>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeImage.description}
                </p>
              </div>
              
              {/* Additional parameters table info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/40">
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">مرجع مبحث ۱۳:</span>
                  <span className="text-xs text-amber-400 font-bold">{activeImage.mabhath13Ref}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">ضخامت کابل پیشنهادی:</span>
                  <span className="text-xs text-slate-300 font-bold font-mono">{activeImage.cableSize || "متغیر"}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">ولتاژ نامی کارکرد:</span>
                  <span className="text-xs text-slate-300 font-bold font-mono">{activeImage.voltage || "۲۲۰V"}</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40">
                  <span className="text-[9px] text-slate-500 block">دشواری پیاده‌سازی:</span>
                  <span className={`text-xs font-bold ${
                    activeImage.difficulty === "مقدماتی" ? "text-emerald-400" :
                    activeImage.difficulty === "متوسط" ? "text-amber-400" :
                    "text-rose-400"
                  }`}>{activeImage.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] font-black text-amber-400 block mb-0.5">توصیه فنی مهندسی ناظر:</span>
                <span className="text-[9.5px] text-slate-300 leading-normal">
                  طبق پیوست‌های نقشه‌کشی نظام مهندسی، کلیه دتکتورها و کلیدهای حفاظتی باید دارای کاتالوگ سازنده تایید شده و نشان معتبر استاندارد ملی ایران باشند. رعایت زون‌بندی لوله‌ها در هنگام کناف‌کاری سقف کاذب الزامی است.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
