import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, HelpCircle, Video, Image, Zap, BarChart3, Bell, 
  Plus, Trash2, Edit3, Check, X, Search, Award, Activity, TrendingUp, 
  Send, AlertCircle, Info, ShieldAlert, CheckCircle2, Star, Filter,
  Wrench, Phone, MessageSquare, MapPin, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// Default seed data for local storage if not already initialized
const DEFAULT_USERS = [
  { id: "u-1", name: "امین مسافر", email: "mosafer1368amin@gmail.com", role: "admin", joinDate: "1405/02/10", progress: 85, avgScore: 92, lastActive: "هم‌اکنون" },
  { id: "u-2", name: "علی رضایی", email: "rezaei.ali@gmail.com", role: "technician", joinDate: "1405/03/15", progress: 64, avgScore: 78, lastActive: "۲ ساعت پیش" },
  { id: "u-3", name: "سارا احمدی", email: "sara.ahmadi@outlook.com", role: "student", joinDate: "1405/04/01", progress: 32, avgScore: 85, lastActive: "دیروز" },
  { id: "u-4", name: "مهندس کریمی", email: "karimi.mohammad@nemo.ir", role: "inspector", joinDate: "1405/01/20", progress: 100, avgScore: 96, lastActive: "۳ روز پیش" },
  { id: "u-5", name: "فاطمه حسینی", email: "housseini.f@gmail.com", role: "student", joinDate: "1405/04/14", progress: 12, avgScore: 60, lastActive: "۴ ساعت پیش" }
];

const STATS_HISTORY_DATA = [
  { date: "شنه", users: 120, lessons: 340, simulations: 90, quizScores: 82 },
  { date: "یکشنبه", users: 145, lessons: 420, simulations: 110, quizScores: 84 },
  { date: "دوشنبه", users: 190, lessons: 510, simulations: 160, quizScores: 85 },
  { date: "سه‌شنبه", users: 210, lessons: 590, simulations: 190, quizScores: 81 },
  { date: "چهارشنبه", users: 250, lessons: 710, simulations: 230, quizScores: 86 },
  { date: "پنجشنبه", users: 310, lessons: 850, simulations: 280, quizScores: 88 },
  { date: "جمعه", users: 340, lessons: 960, simulations: 310, quizScores: 90 }
];

const PRESET_ANNOUNCEMENTS = [
  { id: "ann-1", title: "وبینار رفع اشکال مبحث ۱۳", category: "مهم", message: "جلسه آنلاین بررسی ضوابط جدید ارتینگ فردا پنجشنبه ساعت ۱۸ با تدریس مهندس مسافر برگزار خواهد شد.", date: "1405/04/15", active: true },
  { id: "ann-2", title: "بروزرسانی شبیه‌ساز مدار", category: "آموزشی", message: "مدار کلید صلیبی تعاملی به کارگاه شبیه‌ساز اضافه شد. هم‌اکنون می‌توانید آن را تست کنید.", date: "1405/04/12", active: false }
];

export default function AdminPanel() {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "users" | "courses" | "quizzes" | "videos" | "images" | "simulations" | "notifications" | "jobs"
  >("overview");

  // State holders loaded from LocalStorage
  const [users, setUsers] = useState<any[]>([]);
  const [customLessons, setCustomLessons] = useState<any[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);
  const [customVideos, setCustomVideos] = useState<any[]>([]);
  const [customImages, setCustomImages] = useState<any[]>([]);
  const [customMissions, setCustomMissions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [clientJobs, setClientJobs] = useState<any[]>([]);

  // Search filter states
  const [searchQuery, setSearchQuery] = useState("");

  // Modals / Form States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student", progress: 0, avgScore: 0 });

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "", category: "basics", difficulty: "مقدماتی", duration: "۱۰ دقیقه", summary: "", content: "",
    standardRef: "", clauses: "", steps: "", safety: "", checklist: ""
  });

  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    question: "", option1: "", option2: "", option3: "", option4: "", correctIndex: 0, explanation: ""
  });

  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "", category: "جعبه مینیاتوری و تابلوها", duration: "۰۵:۰۰", summarySteps: "", subtitleText: ""
  });

  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImage, setNewImage] = useState({ title: "", category: "تجهیزات", url: "", description: "" });

  const [showAddMissionModal, setShowAddMissionModal] = useState(false);
  const [newMission, setNewMission] = useState({
    title: "", description: "", blueprint: "living", requirements: ""
  });

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", category: "مهم", message: "" });

  // Load state on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("admin_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("admin_users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }

    setCustomLessons(JSON.parse(localStorage.getItem("custom_electrical_lessons") || "[]"));
    setCustomQuizzes(JSON.parse(localStorage.getItem("custom_quiz_questions") || "[]"));
    setCustomVideos(JSON.parse(localStorage.getItem("custom_video_lessons") || "[]"));
    setCustomImages(JSON.parse(localStorage.getItem("custom_educational_images") || "[]"));
    setCustomMissions(JSON.parse(localStorage.getItem("custom_sim_missions") || "[]"));

    const storedAnnouncements = localStorage.getItem("admin_broadcast_announcements");
    if (storedAnnouncements) {
      setAnnouncements(JSON.parse(storedAnnouncements));
    } else {
      localStorage.setItem("admin_broadcast_announcements", JSON.stringify(PRESET_ANNOUNCEMENTS));
      setAnnouncements(PRESET_ANNOUNCEMENTS);
    }

    const storedJobs = localStorage.getItem("client_job_requests");
    setClientJobs(storedJobs ? JSON.parse(storedJobs) : []);
  }, []);

  // Helper sync functions
  const saveUsers = (data: any[]) => {
    setUsers(data);
    localStorage.setItem("admin_users", JSON.stringify(data));
  };

  const saveClientJobs = (data: any[]) => {
    setClientJobs(data);
    localStorage.setItem("client_job_requests", JSON.stringify(data));
  };

  const saveCustomLessons = (data: any[]) => {
    setCustomLessons(data);
    localStorage.setItem("custom_electrical_lessons", JSON.stringify(data));
  };

  const saveCustomQuizzes = (data: any[]) => {
    setCustomQuizzes(data);
    localStorage.setItem("custom_quiz_questions", JSON.stringify(data));
  };

  const saveCustomVideos = (data: any[]) => {
    setCustomVideos(data);
    localStorage.setItem("custom_video_lessons", JSON.stringify(data));
  };

  const saveCustomImages = (data: any[]) => {
    setCustomImages(data);
    localStorage.setItem("custom_educational_images", JSON.stringify(data));
  };

  const saveCustomMissions = (data: any[]) => {
    setCustomMissions(data);
    localStorage.setItem("custom_sim_missions", JSON.stringify(data));
  };

  const saveAnnouncements = (data: any[]) => {
    setAnnouncements(data);
    localStorage.setItem("admin_broadcast_announcements", JSON.stringify(data));
  };

  // User Actions
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const added = [
      ...users,
      {
        id: `u-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        joinDate: "1405/04/16",
        progress: Number(newUser.progress) || 0,
        avgScore: Number(newUser.avgScore) || 0,
        lastActive: "چند لحظه پیش"
      }
    ];
    saveUsers(added);
    setNewUser({ name: "", email: "", role: "student", progress: 0, avgScore: 0 });
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      saveUsers(users.filter(u => u.id !== id));
    }
  };

  // Lesson Actions
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.summary) return;
    const added = [
      ...customLessons,
      {
        id: `custom-lesson-${Date.now()}`,
        title: newLesson.title,
        category: newLesson.category,
        difficulty: newLesson.difficulty,
        duration: newLesson.duration,
        summary: newLesson.summary,
        content: newLesson.content || newLesson.summary,
        standardRef: newLesson.standardRef || "مبحث ۱۳ مقررات ملی ساختمان",
        clauses: newLesson.clauses ? newLesson.clauses.split("\n").filter(Boolean) : ["الزامات ایمنی عمومی"],
        steps: newLesson.steps ? newLesson.steps.split("\n").filter(Boolean) : ["مرحله یک کارگاه"],
        safety: newLesson.safety ? newLesson.safety.split("\n").filter(Boolean) : ["قطع فیوز قبل از کار"],
        checklist: newLesson.checklist ? newLesson.checklist.split("\n").filter(Boolean) : ["چک فیزیکی اتصال"]
      }
    ];
    saveCustomLessons(added);
    setNewLesson({
      title: "", category: "basics", difficulty: "مقدماتی", duration: "۱۰ دقیقه", summary: "", content: "",
      standardRef: "", clauses: "", steps: "", safety: "", checklist: ""
    });
    setShowAddLessonModal(false);
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm("آیا از حذف این درس سفارشی اطمینان دارید؟")) {
      saveCustomLessons(customLessons.filter(l => l.id !== id));
    }
  };

  // Quiz Actions
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.question || !newQuiz.option1 || !newQuiz.option2) return;
    const added = [
      ...customQuizzes,
      {
        id: Date.now(),
        question: newQuiz.question,
        options: [newQuiz.option1, newQuiz.option2, newQuiz.option3 || "", newQuiz.option4 || ""].filter(Boolean),
        correctIndex: Number(newQuiz.correctIndex),
        explanation: newQuiz.explanation || "با رعایت مقررات مبحث ۱۳."
      }
    ];
    saveCustomQuizzes(added);
    setNewQuiz({ question: "", option1: "", option2: "", option3: "", option4: "", correctIndex: 0, explanation: "" });
    setShowAddQuizModal(false);
  };

  const handleDeleteQuiz = (id: number) => {
    if (confirm("آیا از حذف این سوال اطمینان دارید؟")) {
      saveCustomQuizzes(customQuizzes.filter(q => q.id !== id));
    }
  };

  // Video Actions
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title) return;
    const added = [
      ...customVideos,
      {
        id: `custom-video-${Date.now()}`,
        category: newVideo.category,
        title: newVideo.title,
        duration: newVideo.duration,
        subtitles: [
          { time: 0, text: newVideo.subtitleText || "آموزش گام به گام صوتی و تصویری مبحث ۱۳ برقکاران." }
        ],
        summarySteps: newVideo.summarySteps ? newVideo.summarySteps.split("\n").filter(Boolean) : ["مرحله یک عملیاتی"],
        visualHint: "course-custom"
      }
    ];
    saveCustomVideos(added);
    setNewVideo({ title: "", category: "جعبه مینیاتوری و تابلوها", duration: "۰۵:۰۰", summarySteps: "", subtitleText: "" });
    setShowAddVideoModal(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("آیا از حذف این ویدیو اطمینان دارید؟")) {
      saveCustomVideos(customVideos.filter(v => v.id !== id));
    }
  };

  // Image Actions
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.title) return;
    const added = [
      ...customImages,
      {
        id: `custom-img-${Date.now()}`,
        title: newImage.title,
        category: newImage.category || "تجهیزات",
        url: newImage.url || "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=400&q=80",
        description: newImage.description || "توضیح تصویر آموزشی بر اساس نظام استاندارد مبحث ۱۳."
      }
    ];
    saveCustomImages(added);
    setNewImage({ title: "", category: "تجهیزات", url: "", description: "" });
    setShowAddImageModal(false);
  };

  const handleDeleteImage = (id: string) => {
    if (confirm("آیا از حذف این تصویر اطمینان دارید؟")) {
      saveCustomImages(customImages.filter(img => img.id !== id));
    }
  };

  // Simulation Actions
  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.title || !newMission.description) return;
    const added = [
      ...customMissions,
      {
        id: `custom-mission-${Date.now()}`,
        title: newMission.title,
        description: newMission.description,
        blueprint: newMission.blueprint,
        requirements: newMission.requirements ? newMission.requirements.split("\n").filter(Boolean) : ["افزودن کلید و چراغ"],
        validateCode: "custom" // simplified check
      }
    ];
    saveCustomMissions(added);
    setNewMission({ title: "", description: "", blueprint: "living", requirements: "" });
    setShowAddMissionModal(false);
  };

  const handleDeleteMission = (id: string) => {
    if (confirm("آیا از حذف این پروژه شبیه‌سازی اطمینان دارید؟")) {
      saveCustomMissions(customMissions.filter(m => m.id !== id));
    }
  };

  // Broadcast Actions
  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) return;
    const added = [
      {
        id: `ann-${Date.now()}`,
        title: newAnnouncement.title,
        category: newAnnouncement.category,
        message: newAnnouncement.message,
        date: "1405/04/16",
        active: true
      },
      ...announcements.map(a => ({ ...a, active: false })) // deactivate old ones
    ];
    saveAnnouncements(added);
    setNewAnnouncement({ title: "", category: "مهم", message: "" });
    alert("اعلان با موفقیت به صورت سراسری برای تمامی کاربران ارسال و فعال گردید.");
  };

  const handleDeactivateAnnouncement = (id: string) => {
    saveAnnouncements(
      announcements.map(a => a.id === id ? { ...a, active: false } : a)
    );
  };

  const handleActivateAnnouncement = (id: string) => {
    saveAnnouncements(
      announcements.map(a => a.id === id ? { ...a, active: true } : { ...a, active: false })
    );
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm("آیا از حذف این اعلان مطمئن هستید؟")) {
      saveAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  // Filters for tables
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#111318] border border-[#232730] rounded-2xl p-6 shadow-xl text-right" dir="rtl">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 mb-6 gap-4">
        <div>
          <span className="text-amber-500 font-black text-xs uppercase tracking-wider block mb-1">پنل مدیریت یکپارچه سامانه آموزش هوشمند</span>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            داشبورد ناظر و مدیریت مرکزی
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت کامل اطلاعات کاربران، سرفصل دوره‌ها، آزمون‌های مهندسی، محتوای چندرسانه‌ای و پروژه‌های شبیه‌سازی کارگاهی برق
          </p>
        </div>
        
        {/* Statistics highlights */}
        <div className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
          <div className="text-[10px] pl-3 border-l border-slate-800">
            <span className="text-slate-500 block">وضعیت سرور کارگاه</span>
            <span className="text-emerald-400 font-extrabold font-mono">فعال (باند ۳۰۰۰)</span>
          </div>
          <div className="text-[10px] pr-2">
            <span className="text-slate-500 block">آخرین بروزرسانی</span>
            <span className="text-slate-300 font-black">هم‌اکنون</span>
          </div>
        </div>
      </div>

      {/* Grid containing Lateral Menu & Main panel Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sub-navigation */}
        <div className="lg:col-span-1 space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-900/60 h-fit">
          <span className="text-[9px] font-bold text-slate-500 block px-3 py-1.5 uppercase">بخش‌های مدیریتی</span>
          
          <button
            onClick={() => { setActiveSubTab("overview"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "overview" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              آمار استفاده و مانیتورینگ
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono text-amber-500">Live</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("users"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "users" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              مدیریت کاربران
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">{users.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("courses"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "courses" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              مدیریت دوره‌ها و دروس
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">+{customLessons.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("quizzes"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "quizzes" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              مدیریت آزمون‌ها
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">+{customQuizzes.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("videos"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "videos" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              مدیریت ویدئوها
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">+{customVideos.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("images"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "images" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              مدیریت تصاویر
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">+{customImages.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("simulations"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "simulations" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              پروژه‌های شبیه‌سازی
            </span>
            <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">+{customMissions.length}</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("notifications"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "notifications" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              ارسال اعلان سیستم
            </span>
            <span className="bg-rose-500/10 text-rose-400 text-[9px] px-1.5 py-0.5 rounded-md font-bold">Broadcaster</span>
          </button>

          <button
            onClick={() => { setActiveSubTab("jobs"); setSearchQuery(""); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "jobs" ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              درخواست‌های کار مشتریان
            </span>
            {clientJobs.filter(j => j.status === "pending").length > 0 ? (
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-black animate-pulse">
                {clientJobs.filter(j => j.status === "pending").length} جدید
              </span>
            ) : (
              <span className="bg-slate-900/50 text-[9px] px-1.5 py-0.5 rounded-md font-mono">{clientJobs.length}</span>
            )}
          </button>
        </div>

        {/* Right Active Sub-Panel Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* SUB-TAB 1: MONITORING OVERVIEW */}
            {activeSubTab === "overview" && (
              <motion.div
                key="overview-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                {/* Metric Bento Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">کاربران ثبت‌نام شده</span>
                      <span className="text-xl font-black text-white block mt-1">{users.length} نفر</span>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">▲ ۲۰٪ رشد هفتگی</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-500">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">دروس فعال و مراجع</span>
                      <span className="text-xl font-black text-white block mt-1">۲,۰۰۰+ درس</span>
                      <span className="text-[9px] text-amber-500 font-bold block mt-1">بر اساس مباحث ۱۳ و ۱۴</span>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-blue-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">کل دفعات شبیه‌سازی</span>
                      <span className="text-xl font-black text-white block mt-1">۱,۴۵۰ مرتبه</span>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">۹۸٪ بدون اتصال کوتاه</span>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">میانگین نمره آزمون‌ها</span>
                      <span className="text-xl font-black text-white block mt-1">۸۴.۲ از ۱۰۰</span>
                      <span className="text-[9px] text-amber-500 font-bold block mt-1">جامعه آماری ۱,۰۰۰ تستی</span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-purple-400">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Recharts Area and Bar graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Register and Study trends */}
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                      <h3 className="text-xs font-black text-slate-200">نمودار پیشرفت تحصیلی و فعالیت</h3>
                      <span className="text-[9px] text-slate-500">هفته جاری</span>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={STATS_HISTORY_DATA}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} labelStyle={{ color: "#fff", textAlign: "right" }} />
                          <Area type="monotone" dataKey="lessons" name="دروس مطالعه شده" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Simulator Executions */}
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                      <h3 className="text-xs font-black text-slate-200">دفعات اجرای پروژه‌های شبیه‌سازی</h3>
                      <span className="text-[9px] text-slate-500">زنده</span>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={STATS_HISTORY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
                          <Bar dataKey="simulations" name="مدارات شبیه‌سازی شده" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Important notices */}
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 mb-1">سیستم گزارش‌گیری خودکار</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      تمامی تعاملات کاربران در بستر کارگاه شبیه‌سازی مدار، تست‌ها، محاسبات و جستجوهای هوشمند در این صفحه مانیتور می‌شوند. با ثبت درس، سوال، ویدیو یا تصویر جدید، اطلاعات در دیتابیس لوکال ذخیره شده و بلادرنگ در اپلیکیشن فعال می‌گردند.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 2: USER MANAGEMENT */}
            {activeSubTab === "users" && (
              <motion.div
                key="users-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="جستجوی نام یا ایمیل کاربر..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pr-10 pl-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن کاربر آزمایشی جدید
                  </button>
                </div>

                {/* Users Table */}
                <div className="bg-slate-950 rounded-xl border border-slate-900 overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                      <tr>
                        <th className="p-3.5">نام کاربر</th>
                        <th className="p-3.5">آدرس ایمیل</th>
                        <th className="p-3.5">نقش</th>
                        <th className="p-3.5">تاریخ ثبت‌نام</th>
                        <th className="p-3.5">پیشرفت کل</th>
                        <th className="p-3.5">معدل آزمون</th>
                        <th className="p-3.5 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-3.5 font-bold text-white">{user.name}</td>
                          <td className="p-3.5 font-mono text-slate-400">{user.email}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                              user.role === "admin" ? "bg-rose-500/10 text-rose-400" :
                              user.role === "inspector" ? "bg-purple-500/10 text-purple-400" :
                              user.role === "technician" ? "bg-amber-500/10 text-amber-400" :
                              "bg-blue-500/10 text-blue-400"
                            }`}>
                              {user.role === "admin" && "مدیر کل"}
                              {user.role === "inspector" && "مهندس ناظر"}
                              {user.role === "technician" && "تکنسین برق"}
                              {user.role === "student" && "هنرجو"}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500">{user.joinDate}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full" style={{ width: `${user.progress}%` }}></div>
                              </div>
                              <span className="font-mono text-[10px] text-amber-500">{user.progress}%</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">{user.avgScore}%</td>
                          <td className="p-3.5 text-center">
                            <button
                              disabled={user.role === "admin"}
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              title="حذف کاربر"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-500">کاربری یافت نشد.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 3: COURSE MANAGEMENT */}
            {activeSubTab === "courses" && (
              <motion.div
                key="courses-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-slate-200">افزودن و مدیریت دروس دوره‌ها</h3>
                    <p className="text-[10px] text-slate-500">لیست دروس سفارشی اضافه شده به دایرةالمعارف ۲۰۰۰+ درس مبحث ۱۳</p>
                  </div>
                  <button
                    onClick={() => setShowAddLessonModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن درس سفارشی جدید
                  </button>
                </div>

                <div className="space-y-2">
                  {customLessons.map((lesson) => (
                    <div key={lesson.id} className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-800 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-2 py-0.5 rounded">
                            {lesson.category === "basics" && "مفاهیم پایه"}
                            {lesson.category === "circuits" && "نقشه مدارها"}
                            {lesson.category === "standards" && "مبحث ۱۳"}
                            {lesson.category === "safety" && "ایمنی"}
                            {lesson.category === "hvac" && "تهویه"}
                            {lesson.category === "low_voltage" && "جریان ضعیف"}
                            {lesson.category === "tools" && "ابزار کار"}
                            {lesson.category === "inspection" && "تست و تحویل"}
                          </span>
                          <h4 className="text-xs font-black text-white">{lesson.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{lesson.summary}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                          <span>طول: {lesson.duration}</span>
                          <span>•</span>
                          <span>سختی: {lesson.difficulty}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {customLessons.length === 0 && (
                    <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-500">
                      هیچ درس سفارشی ثبت نشده است. می‌توانید با زدن دکمه بالا اولین درس را ایجاد کنید تا در کنار ۲۰۰۰+ درس اصلی ظاهر شود.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 4: QUIZ QUESTIONS MANAGEMENT */}
            {activeSubTab === "quizzes" && (
              <motion.div
                key="quizzes-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-slate-200">افزودن و مدیریت سوالات آزمون</h3>
                    <p className="text-[10px] text-slate-500">سوالات شما به منبع ۱۰۰۰ سوالی آزمون سنجش مهارت اضافه می‌شوند</p>
                  </div>
                  <button
                    onClick={() => setShowAddQuizModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن سوال جدید
                  </button>
                </div>

                <div className="space-y-3.5">
                  {customQuizzes.map((q) => (
                    <div key={q.id} className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3 hover:border-slate-800 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-xs font-bold text-white leading-relaxed">{q.question}</h4>
                        <button
                          onClick={() => handleDeleteQuiz(q.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt: string, idx: number) => (
                          <div key={idx} className={`p-2 rounded-lg border ${
                            idx === q.correctIndex 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold" 
                              : "bg-slate-900/50 border-slate-800 text-slate-400"
                          }`}>
                            {idx + 1}. {opt} {idx === q.correctIndex && " (پاسخ صحیح)"}
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg text-[10px] text-slate-400 border border-slate-850">
                        💡 <strong>توضیح علمی پاسخ:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                  {customQuizzes.length === 0 && (
                    <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-500">
                      هیچ سوال سفارشی ثبت نشده است. سوالات تالیفی شما بلافاصله وارد چرخه ۱۰۰۰ سوال آزمون رندوم می‌شوند.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 5: VIDEOS MANAGEMENT */}
            {activeSubTab === "videos" && (
              <motion.div
                key="videos-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-slate-200">افزودن و مدیریت ویدئوهای کارگاه</h3>
                    <p className="text-[10px] text-slate-500">مدیریت دوره‌های آموزشی ۲۵۰ فیلم تخصصی برقکاران</p>
                  </div>
                  <button
                    onClick={() => setShowAddVideoModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن ویدئو آموزشی جدید
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customVideos.map((video) => (
                    <div key={video.id} className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between gap-3.5 hover:border-slate-850 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded font-black">{video.category}</span>
                          <span className="text-[9px] text-slate-500 font-mono">طول: {video.duration}</span>
                        </div>
                        <h4 className="text-xs font-black text-white leading-tight">{video.title}</h4>
                        <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-850">
                          {video.subtitles[0]?.text}
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                        <span className="text-[9px] text-slate-500">اضافه شده توسط ناظر</span>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {customVideos.length === 0 && (
                    <div className="col-span-2 bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-500">
                      هیچ فیلم آموزشی سفارشی ثبت نشده است. فیلم‌های افزوده شده بلافاصله در سرفصل‌های کارگاهی نشان داده می‌شوند.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 6: IMAGES MANAGEMENT */}
            {activeSubTab === "images" && (
              <motion.div
                key="images-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-slate-200">افزودن و مدیریت اطلس تصاویر آموزشی</h3>
                    <p className="text-[10px] text-slate-500">مدیریت مرجع ۵۰۰ تصویر فنی و شیوه‌های کابل‌کشی</p>
                  </div>
                  <button
                    onClick={() => setShowAddImageModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن تصویر جدید
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {customImages.map((img) => (
                    <div key={img.id} className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden hover:border-slate-800 transition-all flex flex-col justify-between">
                      <div className="relative h-32 w-full bg-slate-900 flex items-center justify-center">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="object-cover w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 right-2 bg-slate-950/85 text-[8px] font-black px-2 py-0.5 rounded text-amber-500 border border-amber-500/20">
                          {img.category}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-1.5">
                        <h4 className="text-[11px] font-black text-white truncate">{img.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{img.description}</p>
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="w-full mt-2 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف عکس سفارشی
                        </button>
                      </div>
                    </div>
                  ))}
                  {customImages.length === 0 && (
                    <div className="col-span-3 bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-500">
                      هیچ تصویر آموزشی سفارشی ثبت نشده است. پس از افزودن، در گالری ۵۰۰ تصویر برای کل کاربران در دسترس خواهد بود.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 7: SIMULATION SCENARIOS MANAGEMENT */}
            {activeSubTab === "simulations" && (
              <motion.div
                key="simulations-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-slate-200">افزودن و مدیریت پروژه‌های شبیه‌سازی</h3>
                    <p className="text-[10px] text-slate-500">افزودن ماموریت‌ها و چالش‌های طراحی کارگاه سیم‌کشی خلاق</p>
                  </div>
                  <button
                    onClick={() => setShowAddMissionModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن سناریو شبیه‌سازی جدید
                  </button>
                </div>

                <div className="space-y-3">
                  {customMissions.map((m) => (
                    <div key={m.id} className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-800 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded">
                            طرح نقشه: {m.blueprint === "living" ? "پذیرایی" : m.blueprint === "corridor" ? "راهرو" : m.blueprint === "bedroom" ? "اتاق خواب" : "حیاط عمارت"}
                          </span>
                          <h4 className="text-xs font-black text-white">{m.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.requirements.map((req: string, idx: number) => (
                            <span key={idx} className="bg-slate-900 text-slate-500 text-[9px] px-2 py-0.5 rounded border border-slate-800">
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMission(m.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {customMissions.length === 0 && (
                    <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-8 text-center text-slate-500">
                      هیچ پروژه/ماموریت سفارشی شبیه‌سازی ثبت نشده است. پس از افزودن، در تب ماموریت‌های کارگاه خلاق ظاهر خواهند شد.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 8: BROADCAST NOTIFICATIONS */}
            {activeSubTab === "notifications" && (
              <motion.div
                key="notifications-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left input form */}
                  <form onSubmit={handleSendAnnouncement} className="md:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-900 space-y-4">
                    <span className="text-rose-500 font-extrabold text-[9px] uppercase block tracking-wider">سیستم اطلاع‌رسانی سراسری</span>
                    <h3 className="text-xs font-black text-white">ارسال اعلان (Push Notification) جدید</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block">عنوان پیام</label>
                      <input
                        type="text"
                        required
                        placeholder="مانند: برگزاری کارگاه آنلاین مبحث ۱۳"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block">دسته‌بندی اعلان</label>
                      <select
                        value={newAnnouncement.category}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="مهم">مهم (نوار اعلان قرمز/آلارم)</option>
                        <option value="آموزشی">آموزشی (نوار اعلان آبی)</option>
                        <option value="عمومی">عمومی (نوار اعلان خاکستری)</option>
                        <option value="اضطراری">اضطراری (چشمک زن فوری)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block">متن اعلان</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="متن کامل پیام اطلاع‌رسانی را در این قسمت وارد کنید..."
                        value={newAnnouncement.message}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      انتشار و ارسال زنده اعلان سراسری
                    </button>
                  </form>

                  {/* Right history list */}
                  <div className="md:col-span-3 space-y-3">
                    <h3 className="text-xs font-black text-slate-300">تاریخچه اعلان‌های ارسال شده</h3>
                    
                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div key={ann.id} className={`p-4 rounded-xl border transition-all ${
                          ann.active 
                            ? "bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5" 
                            : "bg-slate-950 border-slate-900"
                        }`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                                  ann.category === "مهم" ? "bg-red-500/10 text-red-400" :
                                  ann.category === "آموزشی" ? "bg-blue-500/10 text-blue-400" :
                                  "bg-slate-800 text-slate-400"
                                }`}>
                                  {ann.category}
                                </span>
                                <h4 className="text-xs font-black text-white">{ann.title}</h4>
                                {ann.active && (
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{ann.message}</p>
                              <span className="text-[9px] text-slate-600 block pt-1">تاریخ انتشار: {ann.date}</span>
                            </div>
                            
                            {/* Action togglers */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {ann.active ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeactivateAnnouncement(ann.id)}
                                  className="px-2 py-1 bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 rounded-lg text-[9px] font-bold transition-all"
                                  title="غیرفعال کردن نمایش اعلان"
                                >
                                  قطع انتشار
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleActivateAnnouncement(ann.id)}
                                  className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 rounded-lg text-[9px] font-bold transition-all"
                                  title="فعال کردن مجدد اعلان"
                                >
                                  فعال‌سازی مجدد
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteAnnouncement(ann.id)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-TAB 9: CLIENT JOB REQUESTS MANAGEMENT */}
            {activeSubTab === "jobs" && (
              <motion.div
                key="jobs-subtab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div>
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Wrench className="h-4 w-4 text-amber-500" />
                      مدیریت پروژه‌ها و درخواست‌های اعزام برقکار
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">درخواست‌های ثبت شده توسط مشتریانی که به برقکار نیاز دارند.</p>
                  </div>
                  
                  {/* Stats badge */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                    <span>کل کارها: {clientJobs.length}</span>
                    <span>•</span>
                    <span className="text-amber-500">در انتظار: {clientJobs.filter(j => j.status === "pending").length}</span>
                    <span>•</span>
                    <span className="text-emerald-400">انجام شده: {clientJobs.filter(j => j.status === "completed").length}</span>
                  </div>
                </div>

                {/* Search / Filter jobs */}
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="جستجو در نام مشتری، نوع خدمات، محدوده و توضیحات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-lg py-2.5 pr-10 pl-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Job Cards / List */}
                <div className="space-y-4">
                  {clientJobs.filter(job => {
                    const query = searchQuery.toLowerCase();
                    return (
                      job.name.toLowerCase().includes(query) ||
                      job.phone.toLowerCase().includes(query) ||
                      job.neighborhood.toLowerCase().includes(query) ||
                      job.description.toLowerCase().includes(query)
                    );
                  }).length === 0 ? (
                    <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <Wrench className="h-8 w-8 text-slate-700" />
                      <span className="text-xs font-bold">هیچ درخواست کاری ثبت نشده یا با فیلتر شما همخوانی ندارد.</span>
                    </div>
                  ) : (
                    clientJobs
                      .filter(job => {
                        const query = searchQuery.toLowerCase();
                        return (
                          job.name.toLowerCase().includes(query) ||
                          job.phone.toLowerCase().includes(query) ||
                          job.neighborhood.toLowerCase().includes(query) ||
                          job.description.toLowerCase().includes(query)
                        );
                      })
                      .map((job) => {
                        // Quick label translation
                        const categoryLabels: Record<string, string> = {
                          electrical_fault: "اتصالی برق و رفع عیب سیم‌کشی",
                          reconstruction: "بازسازی و سیم‌کشی کامل ساختمان",
                          lighting_install: "نصب کلید، پریز، لوستر و هالوژن",
                          intercom_systems: "نصب و تعمیر آیفون صوتی و تصویری",
                          smart_home: "هوشمندسازی، نصب دزدگیر و دوربین مداربسته",
                          ac_wiring: "کابل‌کشی کولر گازی و راه‌اندازی کولر آبی",
                          industrial_electrical: "برق صنعتی، مونتاژ تابلو برق و عیب‌یابی"
                        };

                        const jobLabel = categoryLabels[job.serviceType] || "سایر خدمات برقی";

                        // Build whatsapp text
                        const waText = `سلام وقت بخیر جناب ${job.name}. پیرو درخواست خدمات برقکاری که ثبت کرده بودید مزاحمتون میشم...`;
                        const waLink = `https://wa.me/${job.phone.replace(/^0/, "98")}?text=${encodeURIComponent(waText)}`;

                        return (
                          <div 
                            key={job.id} 
                            className={`p-5 rounded-2xl border transition-all space-y-4 ${
                              job.status === "completed"
                                ? "bg-slate-950/40 border-slate-900 opacity-60"
                                : job.status === "processing"
                                ? "bg-slate-900 border-blue-500/20"
                                : "bg-[#14161f] border-amber-500/20 shadow-md shadow-amber-500/2"
                            }`}
                          >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black text-white">{job.name}</h4>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                                    job.urgency === "urgent" 
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                                      : "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                                  }`}>
                                    {job.urgency === "urgent" ? "🚨 فوری" : "عادی"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                                  <span>تاریخ: {job.date} - {job.time}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5 text-slate-400 font-sans">
                                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                    محدوده: {job.neighborhood || "ذکر نشده"}
                                  </span>
                                </div>
                              </div>

                              {/* Status badge toggler */}
                              <div className="flex items-center gap-2.5">
                                <span className="text-[9px] text-slate-500 font-bold">وضعیت:</span>
                                <select
                                  value={job.status}
                                  onChange={(e) => {
                                    const updated = clientJobs.map(j => j.id === job.id ? { ...j, status: e.target.value } : j);
                                    saveClientJobs(updated);
                                  }}
                                  className={`text-[9px] font-black px-2 py-1 rounded-lg border focus:outline-none ${
                                    job.status === "completed"
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                      : job.status === "processing"
                                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                  }`}
                                >
                                  <option value="pending" className="bg-slate-950 text-amber-400">در انتظار</option>
                                  <option value="processing" className="bg-slate-950 text-blue-400">در حال انجام</option>
                                  <option value="completed" className="bg-slate-950 text-emerald-400">انجام شده (پایان‌یافته)</option>
                                </select>
                              </div>
                            </div>

                            {/* Job Description */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-amber-500 font-black block">⚙️ نوع کار درخواستی: {jobLabel}</span>
                              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900 font-sans">{job.description}</p>
                            </div>

                            {/* Client Contact Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/40">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-500 font-bold">تلفن مشتری:</span>
                                <span className="text-xs font-mono font-bold text-white select-all">{job.phone}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${job.phone}`}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                >
                                  <Phone className="h-3 w-3" />
                                  تماس با مشتری
                                </a>

                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-slate-950 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  واتساپ مشتری
                                </a>

                                <button
                                  onClick={() => {
                                    if (confirm("آیا مایل به حذف دائم این درخواست کار هستید؟")) {
                                      saveClientJobs(clientJobs.filter(j => j.id !== job.id));
                                    }
                                  }}
                                  className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                                  title="حذف تیکت کار"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ==========================================
          MODALS & DIALOG POPUPS
          ========================================== */}
      
      {/* 1. Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-md w-full p-6 text-right space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن کاربر فرضی جدید</h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 block font-bold">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد امینی"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 block font-bold">آدرس ایمیل</label>
                <input
                  type="email"
                  required
                  placeholder="مثال: amini@gmail.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 block font-bold">نقش کاربر</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="student">هنرجو</option>
                  <option value="technician">تکنسین برق</option>
                  <option value="inspector">مهندس ناظر</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-bold">درصد پیشرفت (٪)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newUser.progress}
                    onChange={(e) => setNewUser({ ...newUser, progress: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-bold">نمره آزمون (٪)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newUser.avgScore}
                    onChange={(e) => setNewUser({ ...newUser, avgScore: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors">
                ایجاد و ذخیره کاربر فرضی
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Add Custom Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-2xl w-full p-6 text-right space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن درس سفارشی جدید</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">عنوان درس جدید</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: آموزش اصول کلید صلیبی"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">دسته‌بندی موضوعی</label>
                  <select
                    value={newLesson.category}
                    onChange={(e) => setNewLesson({ ...newLesson, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  >
                    <option value="basics">مفاهیم پایه</option>
                    <option value="circuits">نقشه مدارها</option>
                    <option value="standards">مبحث ۱۳ (قوانین)</option>
                    <option value="hvac">تهویه و پکیج</option>
                    <option value="safety">ایمنی و حفاظت</option>
                    <option value="low_voltage">جریان ضعیف</option>
                    <option value="tools">ابزارشناسی</option>
                    <option value="inspection">تست و تحویل کارگاهی</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">درجه سختی</label>
                  <select
                    value={newLesson.difficulty}
                    onChange={(e) => setNewLesson({ ...newLesson, difficulty: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  >
                    <option value="مقدماتی">مقدماتی</option>
                    <option value="متوسط">متوسط</option>
                    <option value="پیشرفته">پیشرفته</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">مدت زمان مطالعه (فرمت متنی)</label>
                  <input
                    type="text"
                    placeholder="مثال: ۱۵ دقیقه"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">خلاصه درس</label>
                <textarea
                  required
                  rows={2}
                  placeholder="توضیح کوتاه و جذاب در مورد محتوای درس..."
                  value={newLesson.summary}
                  onChange={(e) => setNewLesson({ ...newLesson, summary: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">بندهای تفصیلی و ضوابط ملی ساختمان (هر خط یک بند)</label>
                <textarea
                  rows={2}
                  placeholder="مثال: بر اساس بند ۱۳-۵-۲، رعایت سیم ارت پریز الزامیست..."
                  value={newLesson.clauses}
                  onChange={(e) => setNewLesson({ ...newLesson, clauses: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">مراحل اجرای کارگاهی (هر خط یک مرحله)</label>
                  <textarea
                    rows={2}
                    placeholder="مرحله ۱: شیارزنی دیوار..."
                    value={newLesson.steps}
                    onChange={(e) => setNewLesson({ ...newLesson, steps: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">قوانین و الزامات حفاظتی (هر خط یک نکته)</label>
                  <textarea
                    rows={2}
                    placeholder="نکته ۱: قطع فیوز اصلی..."
                    value={newLesson.safety}
                    onChange={(e) => setNewLesson({ ...newLesson, safety: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors">
                انتشار درس جدید در دایرةالمعارف
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Add Quiz Question Modal */}
      {showAddQuizModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-lg w-full p-6 text-right space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن سوال آزمون جدید</h3>
              <button onClick={() => setShowAddQuizModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddQuiz} className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">متن سوال تالیفی</label>
                <input
                  type="text"
                  required
                  placeholder="مانند: حداقل سطح مقطع سیم روشنایی چند میلی‌متر مربع است؟"
                  value={newQuiz.question}
                  onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold block">گزینه اول</label>
                  <input
                    type="text"
                    required
                    placeholder="گزینه ۱"
                    value={newQuiz.option1}
                    onChange={(e) => setNewQuiz({ ...newQuiz, option1: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold block">گزینه دوم</label>
                  <input
                    type="text"
                    required
                    placeholder="گزینه ۲"
                    value={newQuiz.option2}
                    onChange={(e) => setNewQuiz({ ...newQuiz, option2: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold block">گزینه سوم (اختیاری)</label>
                  <input
                    type="text"
                    placeholder="گزینه ۳"
                    value={newQuiz.option3}
                    onChange={(e) => setNewQuiz({ ...newQuiz, option3: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-bold block">گزینه چهارم (اختیاری)</label>
                  <input
                    type="text"
                    placeholder="گزینه ۴"
                    value={newQuiz.option4}
                    onChange={(e) => setNewQuiz({ ...newQuiz, option4: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">گزینه صحیح</label>
                <select
                  value={newQuiz.correctIndex}
                  onChange={(e) => setNewQuiz({ ...newQuiz, correctIndex: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                >
                  <option value={0}>گزینه ۱ صحیح است</option>
                  <option value={1}>گزینه ۲ صحیح است</option>
                  <option value={2}>گزینه ۳ صحیح است</option>
                  <option value={3}>گزینه ۴ صحیح است</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">توضیح پاسخ صحیح (جهت یادگیری بیشتر)</label>
                <textarea
                  rows={2}
                  placeholder="توضیح دهید چرا این گزینه صحیح است بر اساس بندهای مبحث ۱۳..."
                  value={newQuiz.explanation}
                  onChange={(e) => setNewQuiz({ ...newQuiz, explanation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors">
                ذخیره سوال در بانک آزمون
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 4. Add Video Modal */}
      {showAddVideoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-md w-full p-6 text-right space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن ویدئو آموزشی جدید</h3>
              <button onClick={() => setShowAddVideoModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">عنوان ویدئو</label>
                <input
                  type="text"
                  required
                  placeholder="مانند: سیم‌کشی جعبه مینیاتوری"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">سرفصل آموزشی</label>
                  <select
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  >
                    <option value="جعبه مینیاتوری و تابلوها">جعبه مینیاتوری و تابلوها</option>
                    <option value="مدارهای کلید و پریز">مدارهای کلید و پریز</option>
                    <option value="هم‌بندی و سیستم ارتینگ">هم‌بندی و سیستم ارتینگ</option>
                    <option value="سیستم‌های اعلام حریق">سیستم‌های اعلام حریق</option>
                    <option value="حفاظت جان و ایمنی">حفاظت جان و ایمنی</option>
                    <option value="روشنایی و فتوسل">روشنایی و فتوسل</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 block font-bold">مدت زمان ویدئو</label>
                  <input
                    type="text"
                    placeholder="مانند: ۰۴:۱۵"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">زیرنویس شبیه‌سازی شده صوتی (متن گفتار)</label>
                <textarea
                  rows={2}
                  placeholder="متن صوتی گفتار استاد در حین نمایش ویدئو..."
                  value={newVideo.subtitleText}
                  onChange={(e) => setNewVideo({ ...newVideo, subtitleText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">مراحل خلاصه کارگاه (هر خط یک مرحله)</label>
                <textarea
                  rows={2}
                  placeholder="بررسی ایمنی فیوز..."
                  value={newVideo.summarySteps}
                  onChange={(e) => setNewVideo({ ...newVideo, summarySteps: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors">
                افزودن و انتشار ویدئو
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 5. Add Image Modal */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-md w-full p-6 text-right space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن تصویر مرجع جدید</h3>
              <button onClick={() => setShowAddImageModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddImage} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">عنوان تصویر</label>
                <input
                  type="text"
                  required
                  placeholder="مانند: شمای حقیقی کلید تبدیل دوپل"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">دسته‌بندی تجهیزات</label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                >
                  <option value="تجهیزات">تجهیزات و متریال</option>
                  <option value="کلید و پریز">کلید و پریز</option>
                  <option value="تابلو برق">تابلو برق و مینیاتوری</option>
                  <option value="سیستم ارت">ارتینگ و هم‌بندی</option>
                  <option value="لوله گذاری">لوله‌گذاری و کاندوئیت</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">آدرس لینک تصویر (Unsplash یا مستقیم)</label>
                <input
                  type="url"
                  placeholder="پیش‌فرض: عکس شماتیک الکترونیک"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">توضیحات و نکات مهندسی مبحث ۱۳</label>
                <textarea
                  rows={2}
                  placeholder="توضیح دهید این تصویر چه المانی را نشان می‌دهد..."
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors">
                ذخیره تصویر جدید
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* 6. Add Simulation Scenario Modal */}
      {showAddMissionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] border border-[#232730] rounded-2xl max-w-md w-full p-6 text-right space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white">افزودن سناریو شبیه‌سازی جدید</h3>
              <button onClick={() => setShowAddMissionModal(false)} className="p-1 text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddMission} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">عنوان ماموریت شبیه‌ساز</label>
                <input
                  type="text"
                  required
                  placeholder="مانند: ماموریت ۳: طراحی ایمن مدار فتوسل حیاط"
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">بستر فیزیکی (نقشه پایه)</label>
                <select
                  value={newMission.blueprint}
                  onChange={(e) => setNewMission({ ...newMission, blueprint: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                >
                  <option value="living">پذیرایی (Living Room)</option>
                  <option value="corridor">راهرو (Corridor)</option>
                  <option value="bedroom">اتاق خواب (Bedroom)</option>
                  <option value="yard">حیاط عمارت (Yard)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">شرح کامل ماموریت و اهداف</label>
                <textarea
                  required
                  rows={2.5}
                  placeholder="توضیح دهید کاربر چه المان‌هایی را باید مستقر کند و چگونه سیم‌کشی فاز، نول و ارت را انجام دهد..."
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 block font-bold">چک‌لیست نیازمندی‌های تایید مدار (هر خط یک بند)</label>
                <textarea
                  rows={2}
                  placeholder="قراردادن کلید مینیاتوری...&#10;اتصال فاز برگشتی به لامپ..."
                  value={newMission.requirements}
                  onChange={(e) => setNewMission({ ...newMission, requirements: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg py-2 px-3 text-white focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors">
                انتشار سناریو شبیه‌سازی
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
