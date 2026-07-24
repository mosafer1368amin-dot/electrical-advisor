import { useState, useEffect } from "react";
import { 
  BookOpen, Zap, HelpCircle, Calculator as CalcIcon, Bot, Flame, 
  ShieldAlert, Clock, CheckCircle2, ChevronLeft, Award, Sparkles, Menu, X, Check, Video, FileText,
  Search, Star, Filter, Image, Edit3, Play, Headphones, Smartphone, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TUTORIAL_CHAPTERS } from "./data/tutorials";
import { ALL_LESSONS } from "./data/lessonsIndex";
import Simulator from "./components/Simulator";
import Quiz from "./components/Quiz";
import Calculator from "./components/Calculator";
import AiAdvisor from "./components/AiAdvisor";
import BuildingCodes from "./components/BuildingCodes";
import VideoTutorials from "./components/VideoTutorials";
import ReportGenerator from "./components/ReportGenerator";
import EducationalImages from "./components/EducationalImages";
import ThreeDAndAr from "./components/ThreeDAndAr";
import AdminPanel from "./components/AdminPanel";
import SupportSection from "./components/SupportSection";
import JobRequestSection from "./components/JobRequestSection";

function getEncyclopediaContent(lesson: any) {
  const category = lesson.category;
  let standardRef = "";
  let clauses = [];
  let executionSteps = [];
  let safetyTips = [];
  let inspectorChecklist = [];

  switch(category) {
    case "basics":
      standardRef = "بندهای مبحث ۱۳ مقررات ملی ساختمان - مبانی مهندسی الکتریکی";
      clauses = [
        "آشنایی با اصول الکتریکی، پتانسیل زمین مرجع و مسیر هدایت بار در سیستم‌های مسکونی مساوی مقررات ملی.",
        "الزام تفکیک شینه‌های نول و ارت در تمامی تابلوهای تغذیه جهت عملکرد صحیح کلیدهای حفاظتی و عیب‌یابی راحت‌تر.",
        "محاسبه شدت جریان مجاز هادی مسی بر اساس دمای محیط نصب لوله‌ها و اعمال ضرایب تصحیح چندمداره."
      ];
      executionSteps = [
        "بررسی سیستم گراندینگ ساختمان و اندازه‌گیری ولتاژ زمین نسبت به نول شبکه توزیع (ترجیحاً زیر ۲ ولت).",
        "اطمینان از متوازن بودن نسبی بارهای الکتریکی تک‌فاز متصل شده به خطوط سه فاز ورودی ساختمان.",
        "نصب و استفاده صحیح از فازمترهای ایمن صنعتی جهت تشخیص پلاریته فاز در کلیدها و پریزها."
      ];
      safetyTips = [
        "هرگز از بدنه فلزی ساختمان یا لوله‌های گاز به جای هادی نول بازگشتی مدارها استفاده نکنید.",
        "قبل از لمس هرگونه سیم یا هادی برهنه، بی برق بودن آن را با مولتی‌متر یا فازمتر القایی بررسی مجدد نمایید."
      ];
      inspectorChecklist = [
        "تایید پیوستگی فیزیکی و الکتریکی سیم ارت در تمامی پریزها به وسیله اهم‌متر دیجیتال.",
        "عدم وجود هرگونه پلاریته معکوس (اتصال اشتباه فاز به جای نول در پریزها)."
      ];
      break;
    case "circuits":
      standardRef = "بند ۱۳-۵ مقررات ملی ساختمان - مدارهای روشنایی و فرمان";
      clauses = [
        "الزام عبور مستقیم و انحصاری هادی فاز از کلیدهای تک‌پل، دوپل، تبدیل و صلیبی جهت قطع قطعی فاز در بارهای روشنایی.",
        "ممنوعیت عبور مستقیم سیم نول از داخل قاب کلیدهای روشنایی مگر در صورت وجود ترمینال پیچی تفکیک‌شده مجزا.",
        "استفاده از سیم‌های با سطح مقطع حداقل ۱.۵ میلی‌متر مربع برای مدارهای فرمان و روشنایی عمومی."
      ];
      executionSteps = [
        "هدایت فاز ورودی به پیچ مشترک (ترمینال کامان طلایی) کلیدهای تبدیل یا یک‌پل.",
        "سیم‌کشی سیم‌های برگشتی فاز از خروجی‌های کلید به سرپیچ چراغ‌های روشنایی مربوطه.",
        "اتصال مستقیم سیم نول آبی‌رنگ به ترمینال بدنه سرپیچ لامپ جهت پیشگیری از خطرات تعویض لامپ."
      ];
      safetyTips = [
        "قطع کامل فیوز مینیاتوری خط روشنایی قبل از تعویض هر نوع چراغ یا دستکاری سرپیچ‌های فلزی.",
        "از عبور دادن سیم‌های مدار روشنایی در لوله‌های مشترک با کابل‌های قدرت قوی صنعتی مابین داکت‌ها خودداری کنید."
      ];
      inspectorChecklist = [
        "کنترل فیزیکی قطع شدن هادی فاز (نه نول) توسط کلیدها با استفاده از ولت‌متر.",
        "رعایت دقیق استاندارد رنگ عایق سیم‌ها (قهوه‌ای یا سیاه برای فاز، قرمز برای برگشتی، آبی برای نول)."
      ];
      break;
    case "standards":
      standardRef = "جدول فواصل و الزامات ارتفاعی مبحث ۱۳ مقررات ملی ساختمان";
      clauses = [
        "رعایت دقیق فواصل کلیدها و پریزها از لوله‌های تاسیسات گاز شهری و لوله‌های آب گرم و سرد ساختمان.",
        "محدودیت تعداد هادی‌های عبوری از داخل لوله‌های کاندوئیت برق به حداکثر ۴۰ درصد مساحت داخلی لوله.",
        "حداقل عمق نصب مجاز لوله‌های برق در کف ساختمان و مسیرهای عبور خودرو پیاده‌رو."
      ];
      executionSteps = [
        "استفاده از تراز لیزری یا شلنگ‌تراز جهت هم‌تراز کردن دقیق قوطی کلیدها و پریزهای مجاور دیواری.",
        "نصب لوله‌های یو‌پی‌سی نسوز خم سرد به همراه زانوها و بوشن‌های استاندارد در مسیر سیم‌کشی.",
        "ثبت دقیق فواصل عمودی و افقی لوله‌ها در نقشه‌های تاسیسات ازبیلت (چون ساخت) نهایی پروژه."
      ];
      safetyTips = [
        "از ضربه زدن به لوله‌های برق نصب شده در بتن و فونداسیون در حین بتن‌ریزی کارگاهی جداً خودداری کنید.",
        "هرگونه اتصال لوله‌ها با حرارت مستقیم شعله بدون استفاده از بوشن رابط ممنوع و غیراستاندارد است."
      ];
      inspectorChecklist = [
        "تست فواصل قوطی‌ها (حداقل ۳۰ سانتی‌متر فاصله افقی از شیرآلات و لوله‌های گاز).",
        "تایید عمق شیار زنی قوطی‌ها روی سفت‌کاری دیوار جهت جلوگیری از بیرون‌زدگی پس از نازک‌کاری."
      ];
      break;
    case "hvac":
      standardRef = "مبحث ۱۴ مقررات ملی ساختمان - الزامات الکتریکی تاسیسات مکانیکی";
      clauses = [
        "الزام تغذیه مستقیم از جعبه مینیاتوری با سیم یا کابل مجزا با سایز متناسب برای دستگاه‌های داکت اسپلیت و کولر گازی.",
        "نصب کلید مینیاتوری مجزا و متناسب با آمپراژ استارت کمپرسور (ترجیحاً تیپ C موتوری).",
        "هم‌ولتاژ کردن و اتصال بدنه فلزی کانال‌های فلزی انتقال هوا و فن‌کوئل‌ها به سیستم ارتینگ مرکزی ساختمان."
      ];
      executionSteps = [
        "کابل‌کشی سیم ۳ در ۴ یا ۳ در ۶ برای یونیت‌های خارجی اسپلیت با کابل دو روکش استاندارد NYY.",
        "سربندی ترموستات‌های دیواری هوشمند به شیرهای برقی پکیج یا برد کنترل فن‌کوئل طبق کاتالوگ سازنده.",
        "عایق‌بندی کامل لوله‌های فلاکسیبل عبوری از مجاورت لوله‌های تخلیه درین آب چگالیده کولرها."
      ];
      safetyTips = [
        "قبل از کار بر روی بردهای الکترونیکی چیلر یا کولر، از قطع کامل فیوز مینیاتوری بیرونی مطمئن شوید.",
        "رطوبت بالای مجاورت کندانسورها احتمال برق‌گرفتگی را چند برابر می‌کند؛ حتماً از ابزار عایق و دستکش مناسب استفاده کنید."
      ];
      inspectorChecklist = [
        "تایید نصب کلید ایزولاتور محلی (مینیاتوری مابعد) در نزدیکی کندانسور روی پشت‌بام.",
        "بررسی اتصال مستقل و مستحکم هادی حفاظتی ارت به شاسی فلزی بدنه کندانسور بیرونی."
      ];
      break;
    case "safety":
      standardRef = "مبحث ۱۳ - الزامات ایمنی و حفاظت جان در فضاهای مسکونی و مرطوب";
      clauses = [
        "الزام نصب کلید محافظ جان ۳۰ میلی‌آمپر (RCD) برای حفاظت در برابر تماس مستقیم با هادی‌های برق‌دار در تمامی واحدها.",
        "اجرای هم‌بندی اضافی (هم‌ولتاژ کردن کمکی) در حمام، جکوزی، استخر و فضاهای با رطوبت و تماس مستقیم آب.",
        "استفاده از ترانسفورماتورهای ایزوله کاهنده ولتاژ (۱۲ یا ۲۴ ولت) برای روشنایی‌های تزیینی داخل آب استخر."
      ];
      executionSteps = [
        "نصب کلید RCD در ردیف اول جعبه فیوز بعد از کلید اصلی مینیاتوری و کل ورودی واحد.",
        "سیم‌کشی فاز و نول مجزا از خروجی RCD به مدارهای پریز و روشنایی‌های پرخطر مرطوب.",
        "تست عملکرد کلید با فشردن دکمه تست مکانیکی زرد/قرمز و سنجش عملکردی به وسیله تستر دیجیتال."
      ];
      safetyTips = [
        "هرگز نول خروجی از کلید محافظ جان را با نول‌های قبل از آن یا ارت در جعبه تقسیم‌ها ادغام نکنید.",
        "در صورت تکرار تریپ کلید RCD، سریعاً تمام بارهای متصل را قطع کرده و مقاومت عایقی خطوط را تست کنید."
      ];
      inspectorChecklist = [
        "تست قطع کلید RCD با ایجاد جریان نشتی آزمایشی ۳۰ میلی‌آمپر و تایید قطع زیر ۴۰ میلی‌ثانیه.",
        "بررسی عایق‌بندی کامل قاب بیرونی جعبه فیوز و عدم وجود شینه‌های برنجی برهنه فاز و نول در دسترس افراد."
      ];
      break;
    case "low_voltage":
      standardRef = "مبحث ۱۳ - ضوابط کابل‌کشی سیستم‌های جریان ضعیف و ایمنی";
      clauses = [
        "استفاده از کابل‌های شیلددار و فویل‌دار استاندارد مخابراتی جهت ممانعت از القای نویز برق قوی بر روی سیگنال‌ها.",
        "الزام کابل‌کشی سیستم اعلام حریق با سیم‌های نسوز سیلیکونی گرید اعلام حریق مقاوم در برابر حرارت بالا.",
        "نصب مقاومت‌های ته خط (EOLR) در دتکتورها و شستی‌های انتهایی لوپ جهت پایش دایمی قطعی سیم‌کشی."
      ];
      executionSteps = [
        "لوله‌گذاری کاملاً مجزای سیستم آیفون، تلفن، اعلام حریق و دزدگیر بدون هرگونه تلاقی با کاندوئیت‌های روشنایی و پریز.",
        "سربندی و فیش زدن کابل‌های هم‌محور دوربین‌های مداربسته و تست پیوستگی مغزی سیم بوسیله مولتی‌متر.",
        "برنامه‌ریزی و زون‌بندی تخصصی دتکتورها بر روی زون‌های فعال کنترل پنل مرکزی اعلام حریق."
      ];
      safetyTips = [
        "از اتصال مستقیم ترانسفورماتورهای جریان ضعیف به خطوط فاز اصلی بدون مینیاتوری حفاظتی جداً خودداری کنید.",
        "کابل‌های مخابراتی در صورت تلاقی اجباری با کابل‌های قدرت قوی باید با زاویه دقیقا ۹۰ درجه از روی هم رد شوند."
      ];
      inspectorChecklist = [
        "تایید عملکرد آژیرها و فلاشر‌های اعلام حریق در زمان شبیه‌سازی حریق زون‌های مختلف دیواری.",
        "بررسی عدم وجود افت ولتاژ شدید در تغذیه دوربین‌های مداربسته تحت شبکه در مسافت‌های طولانی."
      ];
      break;
    case "tools":
      standardRef = "استانداردهای بین‌المللی ایمنی ابزارکار - استاندارد اروپایی VDE";
      clauses = [
        "استفاده انحصاری از ابزارهای دستی دارای تاییدیه عایق‌بندی ۱۰۰۰ ولت برای مونتاژ تابلوها و کار نیمه‌زنده.",
        "نگهداری، کالیبراسیون دوره‌ای و کارهای بهینه‌سازی ابزارهای اندازه‌گیری حساس نظیر میگر، ارت تستر و مولتی‌متر.",
        "ممنوعیت مطلق استفاده از ابزارهای صدمه‌دیده یا دارای دسته‌های پلاستیکی ترک‌خورده در محیط کارگاه."
      ];
      executionSteps = [
        "بررسی چشمی روکش پلاستیکی عایق سیم‌چین و انبردست قبل از شروع هرگونه سیم‌کشی فاز زنده.",
        "به کارگیری تراز لیزری یا تراز دستی کالیبره شده جهت جانمایی صاف و گونیای تاسیسات برقی روی دیوار.",
        "استفاده از وایرشو و کابل‌شو مناسب همراه با ابزار پرس شش‌ضلعی مخصوص جهت ممانعت از ایجاد اتصال شل."
      ];
      safetyTips = [
        "هرگز ابزارهای برقی سنگین کارگاهی مانند هیلتی یا فرز را از سیم برق متصل آویزان یا جابجا نکنید.",
        "استفاده از عینک ایمنی و دستکش ضخیم چرمی در زمان استفاده از شیارزن‌های دو تیغه دیواری کاملاً الزامی است."
      ];
      inspectorChecklist = [
        "تایید فشرده‌سازی اصولی سرسیم و کابل‌شو بر روی تمامی هادی‌های افشان متصل به کلیدها و کنتاکتورها.",
        "بررسی کالیبره بودن دستگاه‌های گران‌قیمت آزمایش صحت عایقی و تست زمین ارت شرکت‌های مجری تاسیسات."
      ];
      break;
    case "inspection":
      standardRef = "آیین‌نامه رسمی تحویل موقت تاسیسات برقی ساختمان - سازمان نظام مهندسی";
      clauses = [
        "اجرای الزامی تست مقاومت عایقی کابل‌ها با دستگاه میگر ۵۰۰ ولت قبل از هرگونه اتصال برق اصلی به تابلو.",
        "تست صحت عملکرد سرعت کلیدهای جریان تفاضلی (RCD) به وسیله دستگاه‌های شبیه‌ساز استاندارد دیجیتالی.",
        "بررسی انطباق دقیق رنگ‌بندی هادی‌ها در جعبه تقسیم‌ها، کلیدها، پریزها و تابلوهای توزیع اصلی."
      ];
      executionSteps = [
        "اندازه‌گیری مقاومت الکترود زمین چاه ارت با روش افت پتانسیل (روش سه نقطه کلاسیک استاندارد).",
        "انجام آزمایش تست پیوستگی تمامی هادی‌های حفاظتی ارت و هم‌بندی‌های تکمیلی ساختمان با جریان کمکی.",
        "تست مانور قطع برق اضطراری ژنراتور و تایید عملکرد صحیح کلید دوطرفه تابلوی چنج‌اور اتوماتیک ATS."
      ];
      safetyTips = [
        "هرگز قبل از اتمام کامل تست‌های عایقی و تست پیوستگی هادی حفاظتی، مینیاتوری اصلی کنتور را وصل نکنید.",
        "تست‌های مقاومت عایقی باید تحت شرایط دیسکانکت کامل شبکه فاقد ولتاژ فاز انجام شوند تا خطری نداشته باشد."
      ];
      inspectorChecklist = [
        "ثبت تاییدیه فنی مکتوب مقاومت چاه ارت زیر ۲ اهم در فرم گزارش مهندس ناظر تاسیسات الکتریکی ساختمان.",
        "تایید نهایی انطباق فیزیکی نقشه‌ها با کارهای سیم‌کشی و داکت‌کشی‌های اجرا شده در سقف کاذب."
      ];
      break;
    default:
      standardRef = "مبحث ۱۳ مقررات ملی ساختمان ایران";
      clauses = ["آشنایی با قوانین کلی سیم‌کشی و استانداردهای طراحی مدارها."];
      executionSteps = ["بررسی نقشه‌های مهندسی و شروع عملیات اجرایی بر اساس اصول فنی."];
      safetyTips = ["رعایت کامل نکات ایمنی در تمامی مراحل نصب و راه‌اندازی تجهیزات برقی."];
      inspectorChecklist = ["تست و بررسی نهایی جهت دریافت تاییدیه مهندسی ناظر تاسیسات الکتریکی."];
  }

  return { standardRef, clauses, executionSteps, safetyTips, inspectorChecklist };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"tutorial" | "simulator" | "quiz" | "calculator" | "ai" | "codes" | "videos" | "reports" | "images" | "threed-ar" | "admin" | "support" | "jobs">("tutorial");
  const [courseMode, setCourseMode] = useState<"basic" | "encyclopedia">("basic");
  const [selectedChapterId, setSelectedChapterId] = useState<string>(TUTORIAL_CHAPTERS[0].id);
  const [readChapters, setReadChapters] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert("برنامه آماده نصب است! برای نصب روی گوشی اندروید، آیفون یا کامپیوتر: \n\n۱. در بالای مرورگر خود روی دکمه ۳ نقطه (یا دکمه Share در آیفون) ضربه بزنید.\n۲. گزینه 'Install app' یا 'Add to Home screen' (افزودن به صفحه اصلی) را انتخاب کنید.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Search & Bookmarks States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Persisted Lesson overrides for: Title, Text, Image, Video, Quiz, Duration, Study Status
  const [lessonOverrides, setLessonOverrides] = useState<Record<string, {
    id: string;
    title?: string;
    content?: string;
    image?: string;
    video?: string;
    quizQuestion?: string;
    quizOptions?: string[];
    quizCorrectIndex?: number;
    quizExplanation?: string;
    duration?: string;
    studyStatus?: "unread" | "in_progress" | "read";
  }>>({});

  const [selectedLessonAnswers, setSelectedLessonAnswers] = useState<Record<string, number>>({});
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editLessonForm, setEditLessonForm] = useState({
    title: "",
    content: "",
    duration: "",
    image: "",
    video: "",
    quizQuestion: "",
    quizOption1: "",
    quizOption2: "",
    quizOption3: "",
    quizOption4: "",
    quizCorrectIndex: 0,
    quizExplanation: ""
  });

  // Floating AI Assistant States
  const [isFloatingAiOpen, setIsFloatingAiOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState("");

  const handleSetCourseMode = (mode: "basic" | "encyclopedia") => {
    setCourseMode(mode);
    if (mode === "basic") {
      setSelectedChapterId(TUTORIAL_CHAPTERS[0].id);
    } else {
      setSelectedChapterId(ALL_LESSONS[0].id);
    }
  };

  // Load progress, bookmarks, and overrides on mount
  useEffect(() => {
    const saved = localStorage.getItem("electrical_read_chapters");
    if (saved) {
      try {
        setReadChapters(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const savedBookmarks = localStorage.getItem("electrical_bookmarked_chapters");
    if (savedBookmarks) {
      try {
        setBookmarkedChapters(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }

    const savedOverrides = localStorage.getItem("electrical_lesson_overrides");
    if (savedOverrides) {
      try {
        setLessonOverrides(JSON.parse(savedOverrides));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Study status functions
  const getStudyStatus = (chapterId: string) => {
    if (lessonOverrides[chapterId]?.studyStatus) {
      return lessonOverrides[chapterId].studyStatus;
    }
    return readChapters.includes(chapterId) ? "read" : "unread";
  };

  const updateStudyStatus = (chapterId: string, status: "unread" | "in_progress" | "read") => {
    const updatedOverrides = {
      ...lessonOverrides,
      [chapterId]: {
        ...lessonOverrides[chapterId],
        id: chapterId,
        studyStatus: status
      }
    };
    setLessonOverrides(updatedOverrides);
    localStorage.setItem("electrical_lesson_overrides", JSON.stringify(updatedOverrides));

    // Keep readChapters in sync for backwards compatibility and statistics
    let updatedRead = [...readChapters];
    if (status === "read") {
      if (!updatedRead.includes(chapterId)) {
        updatedRead.push(chapterId);
      }
    } else {
      updatedRead = updatedRead.filter(id => id !== chapterId);
    }
    setReadChapters(updatedRead);
    localStorage.setItem("electrical_read_chapters", JSON.stringify(updatedRead));
  };

  // Handle marking a chapter as read (legacy fallback, delegates to updateStudyStatus)
  const toggleMarkAsRead = (chapterId: string) => {
    const current = getStudyStatus(chapterId);
    const nextStatus = current === "read" ? "unread" : "read";
    updateStudyStatus(chapterId, nextStatus);
  };

  const toggleBookmark = (chapterId: string) => {
    let updated = [...bookmarkedChapters];
    if (updated.includes(chapterId)) {
      updated = updated.filter(id => id !== chapterId);
    } else {
      updated.push(chapterId);
    }
    setBookmarkedChapters(updated);
    localStorage.setItem("electrical_bookmarked_chapters", JSON.stringify(updated));
  };

  const baseChapter = (courseMode === "basic" ? TUTORIAL_CHAPTERS : ALL_LESSONS).find(ch => ch.id === selectedChapterId) || (courseMode === "basic" ? TUTORIAL_CHAPTERS[0] : ALL_LESSONS[0]);

  // Construct active chapter with merged persistent overrides
  const activeChapter = {
    ...baseChapter,
    title: lessonOverrides[baseChapter.id]?.title || baseChapter.title,
    content: lessonOverrides[baseChapter.id]?.content !== undefined ? lessonOverrides[baseChapter.id]?.content : ("content" in baseChapter ? (baseChapter as any).content : ""),
    summary: lessonOverrides[baseChapter.id]?.summary || baseChapter.summary,
    duration: lessonOverrides[baseChapter.id]?.duration || baseChapter.duration,
    image: lessonOverrides[baseChapter.id]?.image !== undefined ? lessonOverrides[baseChapter.id]?.image : (baseChapter.id === "basics-voltage" ? "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"),
    video: lessonOverrides[baseChapter.id]?.video !== undefined ? lessonOverrides[baseChapter.id]?.video : `ویدئوی آموزشی شبیه‌سازی فنی شماره ${baseChapter.id}`,
    quizQuestion: lessonOverrides[baseChapter.id]?.quizQuestion || `کدام هادی وظیفه حفاظت از جان در برابر تماس غیرمستقیم با بدنه فلزی را دارد؟`,
    quizOptions: lessonOverrides[baseChapter.id]?.quizOptions || ["سیم فاز", "سیم نول", "سیم ارت (اتصال زمین)", "کابل شیلددار"],
    quizCorrectIndex: lessonOverrides[baseChapter.id]?.quizCorrectIndex !== undefined ? lessonOverrides[baseChapter.id]?.quizCorrectIndex : 2,
    quizExplanation: lessonOverrides[baseChapter.id]?.quizExplanation || "طبق مبحث ۱۳ مقررات ملی ساختمان، سیم ارت جریان خطا را به زمین منتقل کرده و باعث قطع کلید مینیاتوری یا محافظ جان می‌شود.",
    studyStatus: getStudyStatus(baseChapter.id)
  };

  // Calculate overall learning progress percent based on the selected mode
  const totalChaptersCount = courseMode === "basic" ? TUTORIAL_CHAPTERS.length : ALL_LESSONS.length;
  const progressPercent = Math.round((readChapters.filter(id => courseMode === "basic" ? TUTORIAL_CHAPTERS.some(ch => ch.id === id) : ALL_LESSONS.some(ch => ch.id === id)).length / totalChaptersCount) * 100);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950" dir="rtl">
      {/* GLOWING HEADER */}
      <header className="sticky top-0 z-50 bg-[#161920]/95 backdrop-blur-md border-b border-[#2D3139] px-4 py-3.5 shadow-lg shadow-[#0F1115]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-amber-500 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative w-10 h-10 bg-amber-500 rounded flex items-center justify-center shrink-0">
                <div className="w-6 h-6 border-4 border-[#0F1115] rounded-full flex items-center justify-center">
                  <div className="w-1 h-3 bg-[#0F1115]"></div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
                آموزش جامع برق ساختمان ولتاژ
              </h1>
              <p className="text-[10px] text-amber-500 font-semibold tracking-wide">
                کتابچه فنی تعاملی، شبیه‌ساز مدارها و عیب‌یاب هوشمند مبحث ۱۳ مقررات ملی
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab("tutorial")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "tutorial"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              دروس آموزشی
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "simulator"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              شبیه‌ساز مدار
            </button>

            <button
              onClick={() => setActiveTab("codes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "codes"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
              مباحث ۱۳ و ۱۴
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "videos"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              فیلم کارگاه
            </button>

            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "images"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Image className="h-3.5 w-3.5" />
              ۵۰۰ تصویر آموزشی
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "reports"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              چک‌لیست ناظر
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              آزمون مهارت
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "calculator"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <CalcIcon className="h-3.5 w-3.5" />
              محاسبات فنی
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all relative ${
                activeTab === "ai"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              دستیار هوشمند رفع عیب
              <span className="absolute -top-1 -left-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("threed-ar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "threed-ar"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              آموزش سه بعدی و AR
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "support"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-emerald-400 hover:bg-slate-900 hover:text-emerald-300"
              }`}
            >
              <Headphones className="h-3.5 w-3.5 text-emerald-500" />
              پشتیبانی ۲۴ساعته
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all relative ${
                activeTab === "jobs"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-amber-400 hover:bg-slate-900 hover:text-amber-300"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              اعزام برقکار (درخواست کار)
              <span className="absolute -top-1 -left-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === "admin"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-rose-400 hover:bg-slate-900 hover:text-rose-300"
              }`}
            >
              <Award className="h-3.5 w-3.5 text-rose-500" />
              پنل مدیریت
            </button>
          </nav>

          {/* Action Buttons: PWA Install and Source Download */}
          <div className="flex items-center gap-1.5 mr-auto ml-2 lg:ml-0 shrink-0">
            {/* PWA Install Button */}
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-[10px] md:text-xs font-black transition-all hover:scale-105 shadow-md shadow-amber-500/10 cursor-pointer"
              title="نصب اپلیکیشن ولتاژ روی گوشی اندروید یا آیفون"
            >
              <Smartphone className="h-3.5 w-3.5 animate-bounce" />
              <span>نصب اپلیکیشن</span>
            </button>

            {/* ZIP Download Button */}
            <a
              href="/api/download-zip"
              download="electrical-advisor-source.zip"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[10px] md:text-xs font-bold border border-slate-700/60 transition-all hover:scale-105 cursor-pointer"
              title="دانلود کدهای پروژه به صورت فایل ZIP"
            >
              <Download className="h-3.5 w-3.5 text-amber-500" />
              <span>دانلود ZIP کدها</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-slate-800 text-slate-300 rounded-lg focus:outline-none hover:bg-slate-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden shrink-0"
          >
            <div className="p-4 flex flex-col gap-2">
              <button
                onClick={() => { setActiveTab("tutorial"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "tutorial" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                کتابچه و دروس آموزشی
              </button>
              <button
                onClick={() => { setActiveTab("simulator"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "simulator" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Zap className="h-4 w-4" />
                کارگاه تعاملی شبیه‌ساز مدار
              </button>
              <button
                onClick={() => { setActiveTab("codes"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "codes" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <BookOpen className="h-4 w-4 text-amber-500" />
                آیین‌نامه‌های مباحث ۱۳ و ۱۴
              </button>
              <button
                onClick={() => { setActiveTab("videos"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "videos" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Video className="h-4 w-4" />
                فیلم‌های کارگاه تخصصی
              </button>
              <button
                onClick={() => { setActiveTab("images"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "images" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Image className="h-4 w-4" />
                ۵۰۰ تصویر آموزشی
              </button>
              <button
                onClick={() => { setActiveTab("reports"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "reports" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <FileText className="h-4 w-4" />
                چک‌لیست گزارش ناظر
              </button>
              <button
                onClick={() => { setActiveTab("quiz"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "quiz" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                آزمون سنجش مهارت فنی
              </button>
              <button
                onClick={() => { setActiveTab("calculator"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "calculator" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <CalcIcon className="h-4 w-4" />
                ابزارهای محاسبات مهندسی
              </button>
              <button
                onClick={() => { setActiveTab("ai"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "ai" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Bot className="h-4 w-4" />
                دستیار هوشمند عیب‌یابی (مبحث ۱۳)
              </button>
              <button
                onClick={() => { setActiveTab("threed-ar"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "threed-ar" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                آموزش سه بعدی و واقعیت افزوده (AR)
              </button>
              <button
                onClick={() => { setActiveTab("support"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "support" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-emerald-400 hover:bg-slate-800"
                }`}
              >
                <Headphones className="h-4 w-4 text-emerald-500" />
                پشتیبانی ۲۴ساعته تخصصی
              </button>

              <button
                onClick={() => { setActiveTab("jobs"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "jobs" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-amber-400 hover:bg-slate-800"
                }`}
              >
                <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
                اعزام فوری برقکار (درخواست کار)
              </button>

              <button
                onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-bold text-right ${
                  activeTab === "admin" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-rose-400 hover:bg-slate-800"
                }`}
              >
                <Award className="h-4 w-4 text-rose-500" />
                پنل مدیریت ناظر مرکزی
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP DASHBOARD METRICS SUMMARY WIDGET */}
      <section className="bg-slate-900 border-b border-slate-800/60 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Progress Widget */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold">پیشرفت یادگیری کل دروس</span>
              <span className="text-sm font-black text-white mt-1 block">{progressPercent}% تکمیل شده</span>
            </div>
            <div className="relative h-12 w-12 flex items-center justify-center">
              {/* Outer circular progress ring svg */}
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="18" stroke="#f59e0b" strokeWidth="4" fill="transparent"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (113 * progressPercent) / 100}
                />
              </svg>
              <span className="absolute text-[9px] font-mono font-bold text-amber-500">{readChapters.filter(id => courseMode === "basic" ? TUTORIAL_CHAPTERS.some(ch => ch.id === id) : ALL_LESSONS.some(ch => ch.id === id)).length}/{totalChaptersCount}</span>
            </div>
          </div>

          {/* Level Badge */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold">سطح فنی فرضی کارآموز</span>
              <span className="text-xs font-black text-slate-200 mt-1 block">
                {readChapters.filter(id => courseMode === "basic" ? TUTORIAL_CHAPTERS.some(ch => ch.id === id) : ALL_LESSONS.some(ch => ch.id === id)).length >= (totalChaptersCount * 0.8)
                  ? "تکنسین برق ماهر" 
                  : readChapters.filter(id => courseMode === "basic" ? TUTORIAL_CHAPTERS.some(ch => ch.id === id) : ALL_LESSONS.some(ch => ch.id === id)).length >= (totalChaptersCount * 0.4) 
                  ? "برقکار نیمه‌ماهر" 
                  : "کمک‌برقکار ساختمان"}
              </span>
            </div>
          </div>

          {/* Golden Safety Warning */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-amber-500">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-amber-500 block font-black">قانون اول ایمنی کارگاه</span>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                پیش از هرگونه کار فیزیکی، همواره کلید مینیاتوری مابعد کنتور را قطع کرده و از قطع برق با فازمتر مطمئن شوید.
              </p>
            </div>
          </div>

          {/* Date & standard references */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold">مرجع ملی و آئین‌نامه</span>
              <span className="text-[10px] font-bold text-slate-300 mt-1 block">
                مبحث ۱۳ مقررات ملی ساختمان
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">طراحی و اجرای تاسیسات برقی</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: TUTORIAL MODULE */}
          {activeTab === "tutorial" && (
            <motion.div
              key="tutorial-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn"
            >
              <div className="lg:col-span-1 space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 h-fit">
                {/* Course Mode Selector */}
                <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex gap-1">
                  <button
                    onClick={() => handleSetCourseMode("basic")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                      courseMode === "basic"
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    آموزش گام‌به‌گام
                  </button>
                  <button
                    onClick={() => handleSetCourseMode("encyclopedia")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all relative ${
                      courseMode === "encyclopedia"
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    دایرةالمعارف ۲۰۰۰+ درس جدید
                    <span className="absolute -top-1 -left-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  </button>
                </div>

                {/* Advanced Search Field */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو در متن دروس..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 text-white placeholder-slate-500 rounded-xl pr-10 pl-4 py-2 text-xs border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>

                {/* Category Pills & Bookmark Filter */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(courseMode === "basic"
                      ? [
                          { id: "all", label: "همه" },
                          { id: "basics", label: "پایه" },
                          { id: "circuits", label: "مدارها" },
                          { id: "standards", label: "مبحث ۱۳" },
                          { id: "safety", label: "ایمنی" }
                        ]
                      : [
                          { id: "all", label: "همه" },
                          { id: "basics", label: "پایه" },
                          { id: "circuits", label: "مدارها" },
                          { id: "standards", label: "مبحث ۱۳" },
                          { id: "hvac", label: "تهویه و پکیج" },
                          { id: "safety", label: "ایمنی" },
                          { id: "low_voltage", label: "جریان ضعیف" },
                          { id: "tools", label: "ابزارکار" },
                          { id: "inspection", label: "تست و تحویل" }
                        ]
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          selectedCategory === cat.id
                            ? "bg-amber-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                    className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                      showOnlyBookmarks
                        ? "bg-amber-500/10 border-amber-500 text-amber-400"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${showOnlyBookmarks ? "fill-amber-400" : ""}`} />
                    فقط نشان‌گذاری شده‌ها ({bookmarkedChapters.length})
                  </button>
                </div>

                <div className="space-y-2 mt-2 max-h-[500px] overflow-y-auto pr-1">
                  {(courseMode === "basic" ? TUTORIAL_CHAPTERS : ALL_LESSONS).filter((ch) => {
                    const matchesSearch =
                      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ch.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ("content" in ch ? (ch as any).content.toLowerCase().includes(searchTerm.toLowerCase()) : false);
                    const matchesCategory = selectedCategory === "all" || ch.category === selectedCategory;
                    const matchesBookmark = !showOnlyBookmarks || bookmarkedChapters.includes(ch.id);
                    return matchesSearch && matchesCategory && matchesBookmark;
                  }).map((ch) => {
                    const isSelected = ch.id === selectedChapterId;
                    const isRead = readChapters.includes(ch.id);
                    const isBookmarked = bookmarkedChapters.includes(ch.id);

                    return (
                      <div
                        key={ch.id}
                        className={`w-full text-right p-3.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-2.5 relative group ${
                          isSelected
                            ? "bg-slate-900 border-amber-500 text-white shadow-md"
                            : "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={() => setSelectedChapterId(ch.id)}
                            className="text-right flex-1"
                          >
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                              ch.category === "basics" ? "bg-blue-500/10 text-blue-400" :
                              ch.category === "circuits" ? "bg-amber-500/10 text-amber-400" :
                              ch.category === "standards" ? "bg-purple-500/10 text-purple-400" :
                              ch.category === "safety" ? "bg-red-500/10 text-red-400" :
                              ch.category === "hvac" ? "bg-teal-500/10 text-teal-400" :
                              ch.category === "low_voltage" ? "bg-indigo-500/10 text-indigo-400" :
                              ch.category === "tools" ? "bg-orange-500/10 text-orange-400" :
                              "bg-emerald-500/10 text-emerald-400"
                            }`}>
                              {ch.category === "basics" && "مفاهیم پایه"}
                              {ch.category === "circuits" && "نقشه مدارها"}
                              {ch.category === "standards" && "ضوابط و استاندارد"}
                              {ch.category === "safety" && "ایمنی و حفاظت"}
                              {ch.category === "hvac" && "تهویه و پکیج"}
                              {ch.category === "low_voltage" && "جریان ضعیف"}
                              {ch.category === "tools" && "ابزارشناسی"}
                              {ch.category === "inspection" && "تست و تحویل"}
                            </span>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] text-slate-500 font-mono">{ch.duration}</span>
                            {isRead && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(ch.id);
                              }}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                            >
                              <Star className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedChapterId(ch.id)}
                          className="text-right w-full"
                        >
                          <h4 className={`text-xs font-bold ${isSelected ? "text-amber-400" : "text-slate-300"}`}>
                            {ch.title}
                          </h4>
                          
                          <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-1">
                            {ch.summary}
                          </p>
                        </button>
                      </div>
                    );
                  })}
                  {(courseMode === "basic" ? TUTORIAL_CHAPTERS : ALL_LESSONS).filter((ch) => {
                    const matchesSearch =
                      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ch.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      ("content" in ch ? (ch as any).content.toLowerCase().includes(searchTerm.toLowerCase()) : false);
                    const matchesCategory = selectedCategory === "all" || ch.category === selectedCategory;
                    const matchesBookmark = !showOnlyBookmarks || bookmarkedChapters.includes(ch.id);
                    return matchesSearch && matchesCategory && matchesBookmark;
                  }).length === 0 && (
                    <div className="text-center py-12 text-slate-500 text-xs">درسی منطبق با جستجوی شما یافت نشد.</div>
                  )}
                </div>
              </div>

              {/* Main reading frame */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div>
                    {/* Chapter Header Banner matching the Elegant Dark style */}
                    <div className="bg-gradient-to-l from-amber-600 to-amber-950 rounded-2xl p-6 mb-6 flex flex-col justify-end relative overflow-hidden shadow-xl border border-amber-500/10">
                      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }}></div>
                      <div className="relative z-10">
                        <span className="bg-black/30 text-amber-300 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm mb-3 inline-block border border-amber-500/10 font-bold">
                          {courseMode === "basic" ? "آموزش گام به گام مبحث ۱۳" : "دانشنامه تخصصی و پایگاه داده مقررات برق ساختمان"}
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">{activeChapter.title}</h2>
                        <p className="text-amber-100/80 text-xs max-w-xl line-clamp-2">{activeChapter.summary}</p>
                      </div>
                    </div>

                    {/* Chapter Info Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                          <span>درجه سختی: <strong className="text-amber-500">{activeChapter.difficulty}</strong></span>
                          <span>•</span>
                          <span>زمان مطالعه: <strong>{activeChapter.duration}</strong></span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(activeChapter.id)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`h-4 w-4 ${bookmarkedChapters.includes(activeChapter.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>

                        <button
                          onClick={() => {
                            setEditLessonForm({
                              title: activeChapter.title,
                              content: activeChapter.content || "",
                              duration: activeChapter.duration,
                              image: activeChapter.image || "",
                              video: activeChapter.video || "",
                              quizQuestion: activeChapter.quizQuestion || "",
                              quizOption1: activeChapter.quizOptions?.[0] || "",
                              quizOption2: activeChapter.quizOptions?.[1] || "",
                              quizOption3: activeChapter.quizOptions?.[2] || "",
                              quizOption4: activeChapter.quizOptions?.[3] || "",
                              quizCorrectIndex: activeChapter.quizCorrectIndex || 0,
                              quizExplanation: activeChapter.quizExplanation || ""
                            });
                            setIsEditingLesson(true);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          ویرایش درس
                        </button>

                        <button
                          onClick={() => {
                            setAiInitialQuery(`لطفاً درباره مبحث آموزشی «${activeChapter.title}» اطلاعات کاربردی بیشتری بدهید و مهم‌ترین ضوابط مبحث ۱۳ مرتبط با آن را بگویید.`);
                            setIsFloatingAiOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                        >
                          <Bot className="h-3.5 w-3.5 text-purple-400" />
                          رفع اشکال با هوش مصنوعی
                        </button>
                      </div>

                      {/* Interactive Study Status Selector (Unread, In Progress, Read) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold">وضعیت مطالعه:</span>
                        <div className="bg-slate-950 p-0.5 rounded-xl border border-slate-800 flex gap-0.5">
                          {(["unread", "in_progress", "read"] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStudyStatus(activeChapter.id, status)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 ${
                                activeChapter.studyStatus === status
                                  ? status === "read"
                                    ? "bg-emerald-500 text-slate-950 font-black"
                                    : status === "in_progress"
                                    ? "bg-amber-500 text-slate-950 font-black"
                                    : "bg-slate-800 text-slate-300"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {status === "unread" && "🔴 مطالعه نشده"}
                              {status === "in_progress" && "🟡 در حال مطالعه"}
                              {status === "read" && "🟢 مطالعه شده"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rich Content Render area */}
                    {courseMode === "basic" ? (
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                        {"content" in activeChapter ? (activeChapter as any).content : ""}
                      </div>
                    ) : (() => {
                      const data = getEncyclopediaContent(activeChapter);
                      return (
                        <div className="space-y-6">
                          {/* 1. Standard Reference Banner */}
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block mb-1">مرجع رسمی و بندهای مبحث ۱۳:</span>
                              <span className="text-xs text-slate-200 font-bold leading-normal">{data.standardRef}</span>
                            </div>
                          </div>

                          {/* 2. Building Regulation Clauses */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                              <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                              بندهای تفصیلی و ضوابط ملی ساختمان
                            </h4>
                            <div className="space-y-2.5">
                              {data.clauses.map((clause, i) => (
                                <div key={i} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 flex items-start gap-2.5">
                                  <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black h-5 w-5 rounded-md flex items-center justify-center shrink-0">
                                    {i + 1}
                                  </span>
                                  <p className="text-slate-300 text-xs leading-relaxed">{clause}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Steps of Construction (Interactive Stepper) */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                              <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                              دستورالعمل و مراحل اجرای گام‌به‌گام کارگاهی
                            </h4>
                            <div className="relative border-r border-slate-850 mr-2.5 pr-4 space-y-4 py-2">
                              {data.executionSteps.map((step, i) => (
                                <div key={i} className="relative">
                                  {/* Dot indicator */}
                                  <span className="absolute -right-[21px] top-1 bg-amber-500 h-2.5 w-2.5 rounded-full border border-slate-900"></span>
                                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60">
                                    <span className="text-[9px] font-bold text-slate-500 block mb-1">مرحله {i + 1}</span>
                                    <p className="text-slate-200 text-xs leading-relaxed">{step}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Crucial Safety Advice */}
                          <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl space-y-2.5">
                            <div className="flex items-center gap-2 text-red-400">
                              <ShieldAlert className="h-5 w-5 shrink-0" />
                              <span className="text-xs font-black">قوانین و الزامات حفاظتی کار با برق</span>
                            </div>
                            <ul className="space-y-2 list-none pr-1">
                              {data.safetyTips.map((tip, i) => (
                                <li key={i} className="text-slate-300 text-xs leading-normal flex items-start gap-1.5">
                                  <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 5. Inspector Checklist */}
                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400">
                              <CheckCircle2 className="h-5 w-5 shrink-0" />
                              <span className="text-xs font-black">چک‌لیست مهندس ناظر جهت تایید نهایی (قابل کلیک و ارزیابی)</span>
                            </div>
                            <div className="space-y-2">
                              {data.inspectorChecklist.map((item, i) => (
                                <label key={i} className="flex items-start gap-2.5 cursor-pointer select-none group">
                                  <input 
                                    type="checkbox" 
                                    className="accent-emerald-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 mt-1 cursor-pointer shrink-0"
                                  />
                                  <span className="text-xs text-slate-300 leading-normal group-hover:text-slate-100 transition-colors">
                                    {item}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* 6. Technical Tip Footer */}
                          <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-3 text-center">
                            💡 <strong>توصیه فنی تکنسین:</strong> یادگیری مداوم بندهای مقررات ملی ساختمان تفاوت میان یک برقکار ساده و یک مجری فنی متخصص و مورد تایید نظام مهندسی است.
                          </div>
                        </div>
                      );
                    })()}

                    {/* Integrated Media & Interactive Quiz elements (title, content, image, video, quiz, duration, study status) */}
                    <div className="space-y-6 mt-6 border-t border-slate-800/80 pt-6">
                      
                      {/* 1. Image Block (تصویر) */}
                      {activeChapter.image && (
                        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 overflow-hidden shadow-inner">
                          <div className="flex items-center gap-2 text-amber-500 mb-2.5">
                            <Image className="h-4 w-4" />
                            <span className="text-[10px] font-black">تصویر و نقشه فنی ضمیمه درس:</span>
                          </div>
                          <div className="relative rounded-xl overflow-hidden group border border-slate-900 bg-slate-900/40">
                            {activeChapter.image.startsWith("http") ? (
                              <img
                                referrerPolicy="no-referrer"
                                src={activeChapter.image}
                                alt={activeChapter.title}
                                className="w-full max-h-72 object-cover rounded-xl group-hover:scale-[1.01] transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                            ) : (
                              <div className="p-4 text-xs text-slate-400 font-mono text-center">
                                📷 {activeChapter.image}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 2. Video Block (ویدئو) */}
                      {activeChapter.video && (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 shadow-inner">
                          <div className="flex items-center gap-2 text-amber-500 mb-3">
                            <Video className="h-4 w-4" />
                            <span className="text-[10px] font-black">ویدئوی تشریحی و کارگاهی درس:</span>
                          </div>
                          <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[160px] group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/5">
                                <Play className="h-6 w-6 fill-amber-500" />
                              </div>
                              <h5 className="text-xs font-bold text-white mb-1.5">{activeChapter.video}</h5>
                              <p className="text-[10px] text-slate-500 leading-normal">
                                جهت مشاهده ویدیوی صوتی و تعاملی این بخش کلیک کنید. ویدیو شامل راهنمای گام‌به‌گام سیم‌کشی و سربندی بر اساس مقررات نظام مهندسی است.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Interactive Quiz Block (آزمون) */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 shadow-inner">
                        <div className="flex items-center gap-2 text-amber-500 mb-3.5">
                          <HelpCircle className="h-4 w-4" />
                          <span className="text-[10px] font-black">آزمون خودسنجی اختصاصی این درس:</span>
                        </div>
                        <div className="space-y-3.5">
                          <p className="text-xs font-bold text-slate-200 leading-relaxed">
                            {activeChapter.quizQuestion}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {activeChapter.quizOptions?.map((opt: string, idx: number) => {
                              const isSelected = selectedLessonAnswers[activeChapter.id] === idx;
                              const isAnswered = selectedLessonAnswers[activeChapter.id] !== undefined;
                              const isCorrect = idx === activeChapter.quizCorrectIndex;

                              return (
                                <button
                                  key={idx}
                                  disabled={isAnswered}
                                  onClick={() => {
                                    setSelectedLessonAnswers({
                                      ...selectedLessonAnswers,
                                      [activeChapter.id]: idx
                                    });
                                  }}
                                  className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                                    isAnswered
                                      ? isCorrect
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                                        : isSelected
                                        ? "bg-red-500/10 border-red-500 text-red-400 font-bold"
                                        : "bg-slate-900 border-slate-850 text-slate-500"
                                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && isCorrect && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
                                  {isAnswered && isSelected && !isCorrect && <X className="h-4 w-4 text-red-500 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                          
                          {selectedLessonAnswers[activeChapter.id] !== undefined && (
                            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                              <div className="flex items-center gap-1.5 font-bold">
                                {selectedLessonAnswers[activeChapter.id] === activeChapter.quizCorrectIndex ? (
                                  <span className="text-emerald-400 flex items-center gap-1">🎉 پاسخ صحیح است!</span>
                                ) : (
                                  <span className="text-red-400 flex items-center gap-1">❌ پاسخ نادرست است!</span>
                                )}
                              </div>
                              <p className="text-slate-400 text-[11px] leading-relaxed">
                                {activeChapter.quizExplanation}
                              </p>
                              <button
                                onClick={() => {
                                  const copy = { ...selectedLessonAnswers };
                                  delete copy[activeChapter.id];
                                  setSelectedLessonAnswers(copy);
                                }}
                                className="text-[10px] text-amber-500 font-bold hover:underline mt-1 block"
                              >
                                تلاش مجدد آزمون
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Suggest related simulator toggle button if circuit chapter */}
                  {activeChapter.category === "circuits" && (
                    <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-200">آیا می‌خواهید مدار بالا را شبیه‌سازی کنید؟</span>
                          <span className="text-[9px] text-slate-500 block">شما می‌توانید با شبیه‌ساز مجازی ما جریان کلیدها را تست کنید.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("simulator")}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-bold transition-colors shadow-md shadow-amber-500/5 self-end sm:self-auto"
                      >
                        ورود به کارگاه شبیه‌ساز
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SIMULATOR */}
          {activeTab === "simulator" && (
            <motion.div
              key="simulator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Simulator />
            </motion.div>
          )}

          {/* TAB 3: QUIZ */}
          {activeTab === "quiz" && (
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Quiz />
            </motion.div>
          )}

          {/* TAB 4: CALCULATOR */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Calculator />
            </motion.div>
          )}

          {/* TAB 5: AI ADVISOR */}
          {activeTab === "ai" && (
            <motion.div
              key="ai-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AiAdvisor initialMessageText={aiInitialQuery} />
            </motion.div>
          )}

          {/* TAB 6: BUILDING CODES */}
          {activeTab === "codes" && (
            <motion.div
              key="codes-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BuildingCodes />
            </motion.div>
          )}

          {/* TAB 7: VIDEO TUTORIALS */}
          {activeTab === "videos" && (
            <motion.div
              key="videos-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VideoTutorials />
            </motion.div>
          )}

          {/* TAB 8: REPORT CHECKLIST GENERATOR */}
          {activeTab === "reports" && (
            <motion.div
              key="reports-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReportGenerator />
            </motion.div>
          )}

          {/* TAB 9: EDUCATIONAL IMAGES (500 images) */}
          {activeTab === "images" && (
            <motion.div
              key="images-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <EducationalImages />
            </motion.div>
          )}

          {/* TAB 10: 3D & AR TRAINING */}
          {activeTab === "threed-ar" && (
            <motion.div
              key="threed-ar-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ThreeDAndAr />
            </motion.div>
          )}

          {/* TAB 11: ADMIN PANEL */}
          {activeTab === "admin" && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel />
            </motion.div>
          )}

          {/* TAB 12: SUPPORT & CONTACT */}
          {activeTab === "support" && (
            <motion.div
              key="support-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SupportSection />
            </motion.div>
          )}

          {/* TAB 13: CLIENT JOB REQUESTS */}
          {activeTab === "jobs" && (
            <motion.div
              key="jobs-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <JobRequestSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-5 border-t border-slate-900 bg-slate-950 text-center text-[10px] text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span>سامانه هوشمند آموزش برق ساختمان بر اساس الزامات مبحث ۱۳ مقررات ملی ساختمان ایران</span>
          <span className="font-mono">۱۴۰۵ © طراحی و اجرا توسط تکنسین هوشمند</span>
        </div>
      </footer>

      {/* ADVANCED LESSON EDITOR MODAL */}
      <AnimatePresence>
        {isEditingLesson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#161920] border border-[#2D3139] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-black text-white">ویرایش پیشرفته اطلاعات درس</h3>
                </div>
                <button
                  onClick={() => setIsEditingLesson(false)}
                  className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">عنوان درس:</label>
                  <input
                    type="text"
                    value={editLessonForm.title}
                    onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">مدت زمان مطالعه (مثلاً: ۱۰ دقیقه):</label>
                  <input
                    type="text"
                    value={editLessonForm.duration}
                    onChange={(e) => setEditLessonForm({ ...editLessonForm, duration: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Content / Text */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">متن آموزشی درس:</label>
                  <textarea
                    rows={5}
                    value={editLessonForm.content}
                    onChange={(e) => setEditLessonForm({ ...editLessonForm, content: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none font-sans leading-relaxed text-xs"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">آدرس تصویر آموزشی (URL یا توصیف):</label>
                  <input
                    type="text"
                    value={editLessonForm.image}
                    onChange={(e) => setEditLessonForm({ ...editLessonForm, image: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none ltr text-left"
                  />
                  <span className="text-[9px] text-slate-500 block">نکته: می‌توانید آدرس عکس دلخواه خود را قرار دهید تا به صورت پویا جایگزین شود.</span>
                </div>

                {/* Video Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">شرح ویدئوی کارگاهی همراه:</label>
                  <input
                    type="text"
                    value={editLessonForm.video}
                    onChange={(e) => setEditLessonForm({ ...editLessonForm, video: e.target.value })}
                    className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Mini Quiz */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-3">
                  <span className="text-[10px] text-amber-500 font-black block">طراحی سوال آزمون خودسنجی درس</span>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[9px] text-slate-400 font-bold">صورت سوال:</label>
                    <input
                      type="text"
                      value={editLessonForm.quizQuestion}
                      onChange={(e) => setEditLessonForm({ ...editLessonForm, quizQuestion: e.target.value })}
                      className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">گزینه ۱:</label>
                      <input
                        type="text"
                        value={editLessonForm.quizOption1}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizOption1: e.target.value })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">گزینه ۲:</label>
                      <input
                        type="text"
                        value={editLessonForm.quizOption2}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizOption2: e.target.value })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">گزینه ۳:</label>
                      <input
                        type="text"
                        value={editLessonForm.quizOption3}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizOption3: e.target.value })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">گزینه ۴:</label>
                      <input
                        type="text"
                        value={editLessonForm.quizOption4}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizOption4: e.target.value })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">گزینه صحیح (۰ تا ۳):</label>
                      <select
                        value={editLessonForm.quizCorrectIndex}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizCorrectIndex: Number(e.target.value) })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      >
                        <option value={0}>گزینه ۱</option>
                        <option value={1}>گزینه ۲</option>
                        <option value={2}>گزینه ۳</option>
                        <option value={3}>گزینه ۴</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">توضیح پاسخ تشریحی:</label>
                      <input
                        type="text"
                        value={editLessonForm.quizExplanation}
                        onChange={(e) => setEditLessonForm({ ...editLessonForm, quizExplanation: e.target.value })}
                        className="w-full bg-slate-900 text-white rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsEditingLesson(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  onClick={() => {
                    const updatedOverrides = {
                      ...lessonOverrides,
                      [activeChapter.id]: {
                        id: activeChapter.id,
                        title: editLessonForm.title,
                        content: editLessonForm.content,
                        duration: editLessonForm.duration,
                        image: editLessonForm.image,
                        video: editLessonForm.video,
                        quizQuestion: editLessonForm.quizQuestion,
                        quizOptions: [
                          editLessonForm.quizOption1,
                          editLessonForm.quizOption2,
                          editLessonForm.quizOption3,
                          editLessonForm.quizOption4
                        ].filter(Boolean),
                        quizCorrectIndex: Number(editLessonForm.quizCorrectIndex),
                        quizExplanation: editLessonForm.quizExplanation,
                        studyStatus: lessonOverrides[activeChapter.id]?.studyStatus || (readChapters.includes(activeChapter.id) ? "read" : "unread")
                      }
                    };
                    setLessonOverrides(updatedOverrides);
                    localStorage.setItem("electrical_lesson_overrides", JSON.stringify(updatedOverrides));
                    setIsEditingLesson(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
                >
                  ذخیره تغییرات پایدار
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING AI ASSISTANT WIDGET */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {/* Floating Panel */}
        <AnimatePresence>
          {isFloatingAiOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-[#0F1115] pointer-events-auto"
            >
              <AiAdvisor 
                isFloating={true} 
                onClose={() => setIsFloatingAiOpen(false)} 
                initialMessageText={aiInitialQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button
          onClick={() => {
            if (!isFloatingAiOpen) {
              setAiInitialQuery("");
            }
            setIsFloatingAiOpen(!isFloatingAiOpen);
          }}
          className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          id="floating-ai-button"
          title="دستیار هوشمند برقکار"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -inset-1 rounded-full bg-amber-500/30 blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></span>
          
          {isFloatingAiOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <Bot className="h-6 w-6 animate-bounce" style={{ animationDuration: '3s' }} />
              {/* Notification Badge or Mini-label */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              {/* Tooltip on hover */}
              <span className="absolute right-16 bg-slate-900 border border-slate-800 text-slate-100 text-[10px] px-2.5 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl flex items-center gap-1.5 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                دستیار هوشمند برقکار همراه شماست!
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
