import React, { useState, useEffect, useMemo } from "react";
import { 
  Play, Pause, RotateCcw, Video, List, CheckCircle, Volume2, ShieldCheck, 
  HelpCircle, Sun, Moon, Flame, Zap, ShieldAlert, Power, Star, Eye, Layers, Search
} from "lucide-react";
import { generate250Lessons, CourseChapter } from "../data/lessonsGenerator";

export default function VideoTutorials() {
  const [activeCourseId, setActiveCourseId] = useState<string>("lesson-1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // Percentage 0 - 100
  const [subtitleText, setSubtitleText] = useState<string>("برای شروع یادگیری، دکمه پخش ویدیو را کلیک کنید.");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);

  // New states for search and category filtering of 250 lessons
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("همه سرفصل‌ها");

  // Generate the 250 lessons programmatically
  const courses = useMemo(() => {
    const base = generate250Lessons();
    const storedCustom = localStorage.getItem("custom_video_lessons");
    let customList: any[] = [];
    if (storedCustom) {
      try {
        customList = JSON.parse(storedCustom);
      } catch (e) {
        console.error(e);
      }
    }
    return [...customList, ...base];
  }, []);

  // Filtered courses based on user selection
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = selectedCategory === "همه سرفصل‌ها" || c.category === selectedCategory;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Unique categories list
  const categories = useMemo(() => {
    const list = ["همه سرفصل‌ها"];
    courses.forEach(c => {
      if (!list.includes(c.category)) {
        list.push(c.category);
      }
    });
    return list;
  }, [courses]);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  // Video progress simulator effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + (0.5 * playbackSpeed);
          const clamped = next > 100 ? 100 : next;
          
          // Match subtitles dynamically depending on the current simulated "time" (relative to progress)
          const simulatedSeconds = (clamped / 100) * 100; // normalized to 100 seconds
          const matchedSubtitle = activeCourse.subtitles
            .slice()
            .reverse()
            .find((sub) => simulatedSeconds >= sub.time);
          
          if (matchedSubtitle) {
            setSubtitleText(matchedSubtitle.text);
          }

          return clamped;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeCourseId, activeCourse, playbackSpeed]);

  const restartVideo = () => {
    setProgress(0);
    setIsPlaying(false);
    setSubtitleText("برای شروع مجدد، دکمه پخش ویدیو را کلیک کنید.");
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max((clickX / width) * 100, 0), 100);
    setProgress(percentage);
    
    // Instantly update subtitle
    const simulatedSeconds = (percentage / 100) * 100;
    const matchedSubtitle = activeCourse.subtitles
      .slice()
      .reverse()
      .find((sub) => simulatedSeconds >= sub.time);
    
    if (matchedSubtitle) {
      setSubtitleText(matchedSubtitle.text);
    }
  };

  // Helper renderer for dynamic vector/image simulations inside the video player based on course progress
  const renderInteractiveDiagram = () => {
    switch (activeCourseId) {
      case "course-1": // جعبه مینیاتوری
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            {/* Board box */}
            <rect x="40" y="30" width="320" height="180" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <rect x="50" y="40" width="300" height="160" rx="6" fill="#0f172a" />
            <text x="200" y="25" textAnchor="middle" fill="#94a3b8" className="text-[10px] font-bold">شبیه‌ساز تابلوی فرعی مینیاتوری</text>

            {/* Subtitle stage highlights */}
            {progress < 15 && (
              <g className="opacity-80">
                <text x="200" y="110" textAnchor="middle" fill="#64748b" className="text-xs font-bold animate-pulse">در انتظار ورود کابل اصلی واحد...</text>
              </g>
            )}

            {progress >= 15 && (
              <g>
                {/* Main Incoming cable */}
                <path d="M 60 10 L 60 70" stroke="#f59e0b" strokeWidth="4" fill="none" className="animate-pulse" />
                <path d="M 75 10 L 75 110" stroke="#3b82f6" strokeWidth="4" fill="none" />
                <path d="M 90 10 L 90 140" stroke="#10b981" strokeWidth="4" strokeDasharray="3,3" fill="none" />
                <text x="110" y="25" fill="#f59e0b" className="text-[8px] font-bold">فاز اصلی ورودی</text>
                <text x="110" y="37" fill="#3b82f6" className="text-[8px] font-bold">نول ورودی</text>
                <text x="110" y="49" fill="#10b981" className="text-[8px] font-bold">ارت هم‌بندی</text>
              </g>
            )}

            {progress >= 40 && (
              <g>
                {/* Main double pole Breaker */}
                <rect x="150" y="60" width="60" height="80" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="180" y="100" textAnchor="middle" fill="#ffffff" className="text-[9px] font-bold">فیوز کل ۳۲A</text>
                {/* Connection Line */}
                <line x1="60" y1="70" x2="150" y2="70" stroke="#f59e0b" strokeWidth="3" />
                <circle cx="150" cy="70" r="4" fill="#f59e0b" />
                {/* Neutral bar */}
                <rect x="270" y="110" width="60" height="12" rx="2" fill="#3b82f6" />
                <text x="300" y="119" textAnchor="middle" fill="#ffffff" className="text-[7px] font-mono font-bold">NEUTRAL BAR</text>
                <line x1="75" y1="110" x2="270" y2="110" stroke="#3b82f6" strokeWidth="3" />
              </g>
            )}

            {progress >= 65 && (
              <g>
                {/* Miniature Circuit Breakers */}
                <rect x="220" y="60" width="30" height="80" rx="3" fill="#334155" stroke="#ef4444" strokeWidth="1" />
                <text x="235" y="100" textAnchor="middle" fill="#ef4444" className="text-[8px] font-bold">۱۰A</text>
                <text x="235" y="115" textAnchor="middle" fill="#94a3b8" className="text-[6px] font-bold">روشنایی</text>

                <rect x="255" y="60" width="30" height="80" rx="3" fill="#334155" stroke="#10b981" strokeWidth="1" />
                <text x="270" y="100" textAnchor="middle" fill="#10b981" className="text-[8px] font-bold">۱۶A</text>
                <text x="270" y="115" textAnchor="middle" fill="#94a3b8" className="text-[6px] font-bold">پریز</text>

                {/* Copper busbar */}
                <path d="M 180 140 L 235 140 L 270 140" stroke="#f59e0b" strokeWidth="3" fill="none" />
                <text x="240" y="152" fill="#f59e0b" className="text-[7px] font-bold">شینه مسی موازی</text>
              </g>
            )}

            {progress >= 85 && (
              <g>
                {/* Outgoing wires with flying electrons */}
                <path d="M 235 60 L 235 45 L 340 45" stroke="#ef4444" strokeWidth="2" fill="none" />
                <path d="M 270 60 L 270 45 L 340 45" stroke="#10b981" strokeWidth="2" fill="none" />
                
                {/* Flying electron dots */}
                <circle cx="310" cy="45" r="3" fill="#f59e0b" className="animate-ping" />
                <text x="350" y="52" fill="#ef4444" className="text-[8px] font-bold">مصرف‌کننده</text>
              </g>
            )}
          </svg>
        );

      case "course-2": // کلید تبدیل
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="20" y="20" width="360" height="200" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            
            {/* Two Switches */}
            <rect x="50" y="80" width="60" height="90" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <text x="80" y="115" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold">کلید تبدیل ۱</text>
            
            <rect x="290" y="80" width="60" height="90" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <text x="320" y="115" textAnchor="middle" fill="#ffffff" className="text-[10px] font-bold">کلید تبدیل ۲</text>

            {/* Light Bulb */}
            <circle cx="200" cy="70" r="18" fill={progress >= 85 ? "#f59e0b" : "#334155"} stroke="#475569" strokeWidth="2" />
            <line x1="200" y1="88" x2="200" y2="105" stroke="#64748b" strokeWidth="2" />
            <text x="200" y="50" textAnchor="middle" fill={progress >= 85 ? "#fbbf24" : "#94a3b8"} className="text-[9px] font-bold">چراغ راه‌پله</text>

            {/* Subtitle stage highlights */}
            {progress >= 20 && (
              <g>
                {/* 3 Terminals details */}
                <circle cx="80" cy="140" r="3" fill="#fbbf24" />
                <circle cx="65" cy="155" r="3" fill="#ffffff" />
                <circle cx="95" cy="155" r="3" fill="#ffffff" />

                <circle cx="320" cy="140" r="3" fill="#fbbf24" />
                <circle cx="305" cy="155" r="3" fill="#ffffff" />
                <circle cx="335" cy="155" r="3" fill="#ffffff" />
                <text x="200" y="180" textAnchor="middle" fill="#94a3b8" className="text-[8px] font-bold">ترمینال پیچ طلایی (مشترک) و نقره‌ای (غیرمشترک)</text>
              </g>
            )}

            {progress >= 45 && (
              <g>
                {/* Traveler wires */}
                <path d="M 65 155 Q 192.5 130 305 155" stroke="#c084fc" strokeWidth="2" fill="none" />
                <path d="M 95 155 Q 192.5 160 335 155" stroke="#c084fc" strokeWidth="2" fill="none" />
                <text x="192" y="145" fill="#c084fc" textAnchor="middle" className="text-[8px] font-bold bg-slate-900 px-1">سیم‌های مسافر (مکاتبه‌ای)</text>
              </g>
            )}

            {progress >= 70 && (
              <g>
                {/* Phase line */}
                <path d="M 10 140 L 80 140" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <text x="30" y="132" fill="#f59e0b" className="text-[7px] font-bold">فاز ورودی</text>

                {/* Return wire */}
                <path d="M 320 140 L 320 170 L 210 170 L 200 88" stroke="#ef4444" strokeWidth="2" fill="none" />
                {/* Neutral line to Bulb */}
                <path d="M 200 52 L 200 35 L 380 35" stroke="#3b82f6" strokeWidth="2" fill="none" />
                <text x="350" y="30" fill="#3b82f6" className="text-[7px] font-bold">نول مشترک</text>
              </g>
            )}

            {progress >= 85 && (
              <g>
                {/* Light Rays */}
                <line x1="175" y1="60" x2="160" y2="55" stroke="#f59e0b" strokeWidth="2" />
                <line x1="225" y1="60" x2="240" y2="55" stroke="#f59e0b" strokeWidth="2" />
                <line x1="200" y1="45" x2="200" y2="30" stroke="#f59e0b" strokeWidth="2" />
                <text x="200" y="105" textAnchor="middle" fill="#10b981" className="text-[9px] font-bold animate-bounce">مدار کامل و با موفقیت روشن شد!</text>
              </g>
            )}
          </svg>
        );

      case "course-3": // هم‌بندی ارت
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="20" y="20" width="360" height="200" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            
            {/* Steel pillars and ground line */}
            <line x1="50" y1="30" x2="50" y2="210" stroke="#475569" strokeWidth="6" />
            <line x1="350" y1="30" x2="350" y2="210" stroke="#475569" strokeWidth="6" />
            <text x="50" y="45" fill="#94a3b8" className="text-[7px] font-bold rotate-90">اسکلت فلزی</text>

            {/* Utility metal pipes */}
            <rect x="130" y="30" width="16" height="180" fill="#64748b" stroke="#475569" strokeWidth="1" />
            <text x="138" y="120" textAnchor="middle" fill="#cbd5e1" className="text-[8px] font-bold rotate-90">لوله گاز ورودی</text>

            <rect x="170" y="30" width="12" height="180" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            <text x="176" y="120" textAnchor="middle" fill="#cbd5e1" className="text-[8px] font-bold rotate-90">لوله آب ورودی</text>

            {/* Potential Difference Danger Indicator */}
            {progress >= 15 && progress < 40 && (
              <g className="animate-pulse">
                <circle cx="150" cy="80" r="15" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
                <text x="150" y="83" textAnchor="middle" fill="#ef4444" className="text-[8px] font-black">! ۵۰V</text>
                <text x="150" y="110" textAnchor="middle" fill="#f87171" className="text-[7px] font-bold">خطر برق گرفتگی در تماس بدنه</text>
              </g>
            )}

            {/* Bonding connection bar */}
            {progress >= 40 && (
              <g>
                {/* Copper ground bar */}
                <rect x="110" y="170" width="180" height="15" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="200" y="181" textAnchor="middle" fill="#ffffff" className="text-[8px] font-bold">شینه هم‌بندی اصلی ساختمان</text>

                {/* Copper bonding conductor wires */}
                <path d="M 50 177 L 110 177" stroke="#10b981" strokeWidth="3" fill="none" />
                <path d="M 138 177 L 138 170" stroke="#10b981" strokeWidth="3" fill="none" />
                <path d="M 176 177 L 176 170" stroke="#10b981" strokeWidth="3" fill="none" />
                <circle cx="50" cy="177" r="4" fill="#10b981" />
                <circle cx="138" cy="170" r="3" fill="#10b981" />
                <circle cx="176" cy="170" r="3" fill="#10b981" />
              </g>
            )}

            {/* Earth Rod / Earth Well path */}
            {progress >= 65 && (
              <g>
                <path d="M 290 177 L 290 220" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="3,3" />
                <rect x="270" y="200" width="40" height="20" rx="3" fill="#047857" />
                <text x="290" y="213" textAnchor="middle" fill="#ffffff" className="text-[7px] font-bold">چاه ارت</text>
              </g>
            )}

            {progress >= 85 && (
              <g>
                <circle cx="150" cy="80" r="12" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
                <text x="150" y="83" textAnchor="middle" fill="#34d399" className="text-[8px] font-black">✓ ۰V</text>
                <text x="250" y="85" textAnchor="middle" fill="#34d399" className="text-[9px] font-bold">پتانسیل متعادل و کاملاً ایمن</text>
              </g>
            )}
          </svg>
        );

      case "course-4": // اعلام حریق
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="20" y="20" width="360" height="200" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            
            {/* Panel */}
            <rect x="40" y="80" width="70" height="90" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
            <text x="75" y="105" textAnchor="middle" fill="#ffffff" className="text-[9px] font-black">پنل مرکزی</text>
            <rect x="50" y="115" width="50" height="20" fill="#020617" rx="3" />
            <text x="75" y="128" textAnchor="middle" fill={progress >= 90 ? "#ef4444" : "#10b981"} className="text-[8px] font-mono animate-pulse">
              {progress >= 90 ? "FIRE !!!" : "NORMAL"}
            </text>

            {/* Smoke Detector */}
            <rect x="180" y="80" width="60" height="40" rx="12" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="210" y="105" textAnchor="middle" fill="#ffffff" className="text-[8px] font-bold">دتکتور دود</text>

            {/* Manual Call Point (شستی) */}
            <rect x="290" y="80" width="60" height="60" rx="4" fill="#991b1b" stroke="#ef4444" strokeWidth="2" />
            <rect x="305" y="95" width="30" height="20" fill="#ffffff" />
            <text x="320" y="110" textAnchor="middle" fill="#000000" className="text-[8px] font-black">شستی</text>

            {/* Loop connections */}
            {progress >= 20 && (
              <g>
                {/* Plus & Minus loops */}
                <path d="M 110 120 L 180 100" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                <path d="M 110 130 L 180 110" stroke="#475569" strokeWidth="2.5" fill="none" />
                <text x="145" y="92" fill="#f43f5e" className="text-[7px] font-bold">لوپ رفت (+)</text>
              </g>
            )}

            {progress >= 50 && (
              <g>
                <path d="M 240 100 L 290 105" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                <path d="M 240 110 L 290 115" stroke="#475569" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {progress >= 70 && (
              <g>
                {/* End of Line Resistor */}
                <line x1="335" y1="120" x2="335" y2="135" stroke="#f59e0b" strokeWidth="3" />
                <text x="340" y="150" fill="#f59e0b" className="text-[7px] font-bold text-left">EOLR مقاومت</text>
              </g>
            )}

            {progress >= 90 && (
              <g>
                {/* Alarm smoke animation */}
                <ellipse cx="210" cy="50" rx="15" ry="10" fill="#94a3b8" fillOpacity="0.4" className="animate-ping" />
                <circle cx="210" cy="100" r="6" fill="#ef4444" className="animate-pulse" />
                <text x="210" y="137" textAnchor="middle" fill="#ef4444" className="text-[8px] font-black">آژیر حریق فعال شد</text>
              </g>
            )}
          </svg>
        );

      case "course-5": // کلید محافظ جان
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            <rect x="20" y="20" width="360" height="200" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            
            {/* RCD Body Frame */}
            <rect x="130" y="35" width="140" height="170" rx="10" fill="#1e293b" stroke="#cbd5e1" strokeWidth="3" />
            <text x="200" y="55" textAnchor="middle" fill="#ffffff" className="text-[10px] font-black">کلید محافظ جان RCD</text>

            {/* Test button */}
            <rect x="230" y="80" width="20" height="20" rx="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" className="cursor-pointer" />
            <text x="240" y="93" textAnchor="middle" fill="#ffffff" className="text-[8px] font-bold">T</text>

            {/* Internal Toroidal ring */}
            {progress >= 20 && (
              <g>
                <circle cx="200" cy="130" r="30" fill="none" stroke="#64748b" strokeWidth="12" />
                <text x="200" y="133" textAnchor="middle" fill="#ffffff" className="text-[7px] font-mono font-bold">TOROID</text>
              </g>
            )}

            {/* Normal current flow comparison */}
            {progress >= 45 && progress < 70 && (
              <g>
                {/* Arrows showing standard flow and balance */}
                <path d="M 170 30 L 170 210" stroke="#f59e0b" strokeWidth="3.5" fill="none" />
                <path d="M 220 210 L 220 30" stroke="#3b82f6" strokeWidth="3.5" fill="none" />
                <text x="170" y="180" fill="#f59e0b" className="text-[7px] font-bold">I رفت</text>
                <text x="220" y="180" fill="#3b82f6" className="text-[7px] font-bold">I برگشت</text>
                <text x="200" y="195" textAnchor="middle" fill="#10b981" className="text-[8px] font-bold">جریان رفت = برگشت (تعادل)</text>
              </g>
            )}

            {progress >= 70 && (
              <g>
                {/* Person touch / Leakage hazard */}
                <path d="M 170 30 L 170 120 L 140 120" stroke="#ef4444" strokeWidth="3.5" fill="none" className="animate-pulse" />
                <circle cx="140" cy="120" r="8" fill="#ef4444" className="animate-ping" />
                <text x="110" y="124" fill="#ef4444" className="text-[8px] font-black">نشتی ۳۰mA</text>
                
                {progress >= 90 ? (
                  <g>
                    <text x="200" y="190" textAnchor="middle" fill="#ef4444" className="text-[10px] font-black animate-bounce">قطع مدار در ۲۰ میلی‌ثانیه!</text>
                    {/* Disconnect indicator */}
                    <line x1="130" y1="35" x2="270" y2="205" stroke="#ef4444" strokeWidth="4" />
                  </g>
                ) : (
                  <text x="200" y="190" textAnchor="middle" fill="#f59e0b" className="text-[8px] font-bold">سنسور ناترازی مغناطیسی را کشف کرد</text>
                )}
              </g>
            )}
          </svg>
        );

      case "course-6": // فتوسل معابر
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full text-slate-300">
            {/* Ambient background sky depending on time */}
            <rect x="20" y="20" width="360" height="200" rx="10" fill={progress >= 45 ? "#0b0f19" : "#38bdf8"} stroke="#1e293b" strokeWidth="2" />
            
            {/* Street Light Post */}
            <path d="M 280 210 L 280 80 Q 280 50 320 50 L 330 50" stroke="#64748b" strokeWidth="6" fill="none" />
            <circle cx="330" cy="65" r="16" fill={progress >= 70 ? "#fbbf24" : "#475569"} className={progress >= 70 ? "animate-pulse" : ""} />
            
            {/* Photocell Device */}
            <rect x="70" y="60" width="45" height="55" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="92" cy="72" r="6" fill="#38bdf8" />
            <text x="92" y="100" textAnchor="middle" fill="#0f172a" className="text-[8px] font-black">فتوسل</text>

            {/* Sun or Moon depending on progress */}
            {progress < 45 ? (
              <g className="animate-spin" style={{ transformOrigin: "200px 70px" }}>
                <circle cx="200" cy="70" r="14" fill="#fbbf24" />
                <line x1="200" y1="50" x2="200" y2="40" stroke="#fbbf24" strokeWidth="2" />
                <text x="200" y="98" textAnchor="middle" fill="#0f172a" className="text-[8px] font-bold">روز (غیرفعال)</text>
              </g>
            ) : (
              <g>
                <path d="M 200 55 A 15 15 0 1 0 215 80 A 12 12 0 1 1 200 55" fill="#fef08a" />
                <text x="200" y="98" textAnchor="middle" fill="#ffffff" className="text-[8px] font-bold">شب (روشنایی خودکار)</text>
              </g>
            )}

            {/* Wires */}
            {progress >= 20 && (
              <g>
                {/* Black Line wire */}
                <path d="M 10 130 L 70 85" stroke="#000000" strokeWidth="2" fill="none" />
                <text x="35" y="115" fill="#000000" className="text-[7px] font-bold">فاز مشکی</text>

                {/* White Neutral wire */}
                <path d="M 10 150 L 85 115" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                <text x="35" y="162" fill="#ffffff" className="text-[7px] font-bold">نول سفید</text>

                {/* Red Lamp wire */}
                <path d="M 115 85 L 330 65" stroke="#ef4444" strokeWidth="2" fill="none" />
                <text x="200" y="125" fill="#ef4444" className="text-[8px] font-bold">برگشتی قرمز به لامپ</text>
              </g>
            )}

            {progress >= 70 && (
              <g>
                {/* Light rays shining onto ground */}
                <polygon points="314,81 260,220 380,220 346,81" fill="#fef08a" fillOpacity="0.15" />
                <text x="330" y="140" textAnchor="middle" fill="#fef08a" className="text-[8px] font-bold animate-bounce">چراغ معبر روشن شد</text>
              </g>
            )}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div id="video-tutorials-section" className="bg-[#111318] border border-[#232730] rounded-2xl p-6 text-white" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-[#232730] gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Video className="h-6 w-6 text-amber-500" />
            ویدیوهای کارگاهی و دوره‌های آموزشی تعاملی با زیرنویس فارسی
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مجموعه کلیپ‌های شبیه‌ساز مصور تعاملی به همراه توضیحات، زیرنویس فارسی و دکمه‌های کنترل هوشمند سرعت و نمایش
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">مجموعه ۲۵۰ درس تخصصی و کارگاه تعاملی</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar List with Advanced Filter and Search */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 px-1">
            <List className="h-4 w-4 text-amber-500" />
            لیست سرفصل‌های کارگاه ویدیویی ({courses.length} درس)
          </span>

          {/* Search Box */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="جستجو در بین ۲۵۰ درس..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all font-bold text-right"
            />
            <Search className="h-4 w-4 text-slate-600 absolute left-3 top-3.5" />
          </div>

          {/* Category Dropdown */}
          <div className="w-full">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 focus:outline-none focus:border-amber-500 transition-all font-bold cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-950 text-slate-300 font-bold">{cat}</option>
              ))}
            </select>
          </div>

          {/* Filters Status */}
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-bold">
            <span>یافت شده: {filteredCourses.length} درس</span>
            {(searchQuery || selectedCategory !== "همه سرفصل‌ها") && (
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("همه سرفصل‌ها"); }}
                className="text-amber-500 hover:text-amber-400 transition-all"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    setActiveCourseId(course.id);
                    setProgress(0);
                    setIsPlaying(false);
                    setSubtitleText("دکمه پخش را برای نمایش این جلسه بزنید.");
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-right flex flex-col gap-2 ${
                    activeCourseId === course.id
                      ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5"
                      : "bg-slate-950 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800 font-bold">زیرنویس فارسی</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{course.duration} دقیقه</span>
                  </div>
                  <span className="text-[9px] text-amber-500/80 font-bold">{course.category}</span>
                  <h3 className="text-xs font-bold text-slate-200 leading-relaxed">{course.title}</h3>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold border-t border-slate-900/50 pt-1.5">
                    <span className="flex items-center gap-1"><Layers className="h-3 w-3 text-slate-500" /> گام‌به‌گام مصور</span>
                    <span className="text-amber-500 font-black">جلسه کارگاه</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-600 font-bold">
                درسی با مشخصات وارد شده یافت نشد.
              </div>
            )}
          </div>
        </div>

        {/* Video Screen & Subtitles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black aspect-video rounded-xl border border-slate-800 relative flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Interactive Simulation / Image Diagram Display in player */}
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
              {/* Dynamic rendering */}
              <div className="w-full h-full p-6 flex items-center justify-center relative">
                {renderInteractiveDiagram()}
              </div>
              
              {/* Overlay Subtitles on Video itself */}
              {showSubtitles && (
                <div className="absolute bottom-16 left-4 right-4 text-center z-30 pointer-events-none">
                  <span className="bg-black/85 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-800/80 text-[11px] font-bold leading-relaxed inline-block max-w-[90%] shadow-lg">
                    {subtitleText}
                  </span>
                </div>
              )}
            </div>

            {/* Video Control bar bottom */}
            <div className="z-20 w-full bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-12 mt-auto">
              {/* Drag/Click Progress Bar */}
              <div 
                onClick={handleProgressChange}
                className="w-full bg-slate-800 hover:bg-slate-700 h-2 rounded-full mb-3 cursor-pointer relative overflow-hidden transition-all group"
                title="برای عقب/جلو بردن ویدیو کلیک کنید"
              >
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                <div className="absolute top-0 bottom-0 w-1 bg-white left-0 group-hover:block hidden" style={{ transform: `translateX(${progress}%)` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-amber-500 text-slate-950 rounded-full hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                    title={isPlaying ? "توقف" : "پخش"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950" />}
                  </button>
                  <button
                    onClick={restartVideo}
                    className="p-2 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-full transition-colors border border-slate-800"
                    title="شروع مجدد"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  
                  {/* Playback speed switcher */}
                  <div className="flex items-center bg-slate-900 rounded-full p-0.5 border border-slate-800">
                    {[1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
                          playbackSpeed === speed 
                            ? "bg-amber-500 text-slate-950" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Subtitle Visibility Toggle button */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${
                      showSubtitles 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {showSubtitles ? "زیرنویس روشن" : "زیرنویس خاموش"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 font-mono bg-slate-900 py-1 px-2.5 rounded border border-slate-800 font-bold">
                    گوینده: هوش مصنوعی دوبله فارسی
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-900 py-1 px-2.5 rounded border border-slate-800">
                    {Math.round(progress)}% پخش شده
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Voiceover Subtitle Container */}
          <div className="bg-[#161920] border border-[#232730] p-4 rounded-xl flex items-start gap-3 shadow-md">
            <Volume2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-1">متن گفتار صوتی به زبان فارسی:</span>
              <p className="text-xs text-slate-200 leading-relaxed font-bold">{subtitleText}</p>
            </div>
          </div>

          {/* Quick summary check points */}
          <div className="bg-[#111318] border border-[#232730] p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              چک‌لیست مهم اجرایی کارگاهی (مورد تایید سازمان نظام مهندسی)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeCourse.summarySteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-900">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
