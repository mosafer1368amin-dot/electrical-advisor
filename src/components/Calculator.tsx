import { useState, FormEvent, useEffect, useMemo } from "react";
import { 
  Calculator as CalcIcon, Settings, AlertCircle, Info, Zap, 
  Activity, DollarSign, Lightbulb, ShieldCheck, RefreshCw,
  Trophy, Gamepad2, Timer, Flame, ShieldAlert, Award,
  Heart, HelpCircle, Check, X, Play, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type CalculatorTab = "wire" | "power" | "conduit" | "rcd" | "lighting" | "bill" | "games";

const PACETOWN_QUESTIONS = [
  {
    question: "حداقل سطح مقطع سیم مسی مدار روشنایی در ساختمان‌های مسکونی طبق مبحث ۱۳ چند میلی‌متر مربع است؟",
    options: ["۱.۰ میلی‌متر مربع", "۱.۵ میلی‌متر مربع", "۲.۵ میلی‌متر مربع", "۴.۰ میلی‌متر مربع"],
    correct: 1,
    explanation: "طبق استاندارد، حداقل مقطع سیم مسی برای مدارهای روشنایی ۱.۵ میلی‌متر مربع است تا مانع افزایش حرارت و افت ولتاژ گردد."
  },
  {
    question: "حداکثر ارتفاع مجاز برای نصب پریزهای برق عمومی در اتاق‌های خواب و هال چند سانتی‌متر از کف تمام‌شده است؟",
    options: ["۱۰ تا ۱۵ سانتی‌متر", "۳۰ تا ۴۰ سانتی‌متر", "۸۰ تا ۹۰ سانتی‌متر", "۱۱۰ تا ۱۲۰ سانتی‌متر"],
    correct: 1,
    explanation: "پریزهای عمومی باید در ارتفاع ۳۰ تا ۴۰ سانتی‌متر نصب شوند تا از برخورد رطوبت تی کشیدن زمین مصون باشند."
  },
  {
    question: "حساسیت کلید محافظ جان (RCD) ویژه مصارف عمومی و پریزها جهت حفاظت جان انسان چقدر است؟",
    options: ["۱۰ میلی‌آمپر", "۳۰ میلی‌آمپر", "۳۰۰ میلی‌آمپر", "۵۰۰ میلی‌آمپر"],
    correct: 1,
    explanation: "۳۰ میلی‌آمپر آستانه جریان غیرمرگبار برای بدن انسان است که در کمتر از کسر ثانیه جریان الکتریکی را قطع می‌کند."
  },
  {
    question: "کلید مینیاتوری تیپ B چه نوع جریانی را کنترل می‌کند و برای چه باری تندکار به شمار می‌رود؟",
    options: ["بارهای موتوری و پریزها", "بارهای سلفی بزرگ", "بارهای روشنایی مسکونی", "بارهای اتصال کوتاه دیمند"],
    correct: 2,
    explanation: "تیپ B تندکار بوده و برای مصارف روشنایی به کار می‌رود که جریان هجومی راه‌اندازی ندارند."
  },
  {
    question: "حداقل فاصله مجاز لوله‌های عبور سیم‌های برق از لوله‌های گاز چند سانتی‌متر تعیین شده است? ",
    options: ["۵ سانتی‌متر", "۱۳ سانتی‌متر", "۲۵ سانتی‌متر", "۵۰ سانتی‌متر"],
    correct: 1,
    explanation: "حداقل فاصله افقی یا عمودی لوله‌های برق با لوله‌های گاز طبق آیین‌نامه ۱۳ سانتی‌متر است."
  },
  {
    question: "در سیستم هم‌بندی اصلی ساختمان، شینه ارت مرکزی به کدام سازه هم‌بند متصل می‌شود؟",
    options: ["فونداسیون فلزی و لوله‌های فلزی آب", "لوله‌های پی‌وی‌سی فاضلاب", "کنتور گاز شهری", "سیم فاز پشتیبان"],
    correct: 0,
    explanation: "هم‌بندی اصلی شامل اتصال شینه ارت به فونداسیون فلزی، اسکلت فلزی و لوله‌های فلزی ورودی آب و گاز است."
  },
  {
    question: "برای سیم‌کشی سیستم جریان ضعیف مانند پریز تلفن و آیفون، چه نوع کابل حفاظتی توصیه می‌شود؟",
    options: ["سیم معمولی مفتولی", "کابل فویل‌دار شیلددار ضد نویز (JY-ST-Y)", "کابل افشان کواکسیال دبل", "کابل نول بدون ارت"],
    correct: 1,
    explanation: "کابل‌های شیلددار با فویل فلزی مانع نفوذ نویز و تداخل امواج الکترومغناطیسی برق قوی روی سیم تلفن می‌شوند."
  },
  {
    question: "طبق لومن متد، شدت روشنایی استاندارد برای اتاق مطالعه یا دفتر کار اداری چند لوکس است؟",
    options: ["۸۰ لوکس", "۱۵۰ لوکس", "۳۰۰ لوکس", "۴۵۰ لوکس"],
    correct: 3,
    explanation: "برای کارهای دقیق چشمی مانند مطالعه و کارهای اداری، شدت روشنایی متوسط ۴۵۰ لوکس استاندارد است."
  },
  {
    question: "ضریب پرشدگی کابل‌ها در داخل لوله‌های کاندوئیت پی‌وی‌سی جهت تخلیه حرارتی چقدر است؟",
    options: ["حداکثر ۲۰ درصد", "حداکثر ۴۰ درصد", "حداکثر ۷۰ درصد", "۱۰۰ درصد کامل"],
    correct: 1,
    explanation: "طبق مبحث ۱۳، کابل‌ها حداکثر باید ۴۰٪ از فضای داخلی لوله را پر کنند تا هوا برای خنک‌کاری سیم‌ها جریان داشته باشد."
  },
  {
    question: "در فضای زون ۱ حمام (داخل فضای وان یا زیر دوش)، مجاز به نصب کدام وسیله برقی هستیم؟",
    options: ["پریز برق درپوش‌دار", "کلید دوپل روشنایی", "تجهیزات روشنایی ولتاژ ۱۲ ولت مستقیم ایمن (SELV)", "هیچ‌کدام حتی با ارت"],
    correct: 2,
    explanation: "در زون ۱ حمام فقط نصب چراغ‌های مخصوص ضدآب با تغذیه ۱۲ ولت فوق‌العاده ضعیف ایمن مجاز است."
  }
];

const RCD_SCENARIOS = [
  {
    title: "حمام مرطوب و جکوزی",
    description: "شخصی در محیط بسیار مرطوب حمام در حال دوش گرفتن است. یک سشوار متصل به پریز دچار اتصال بدنه شده است. رطوبت بالا مقاومت بدن انسان را کاهش داده و جریان نشتی به شدت خطرناک است.",
    dangerousCurrent: "نشتی جریان ۱۲ میلی‌آمپر (فراتر از آستانه قفل عضلانی بدن)",
    correctSens: "10mA",
    correctPoles: "2P",
    feedbackCorrect: "پاسخ عالی! طبق مبحث ۱۳، برای زون‌های مرطوب مانند حمام، سونا و جکوزی نصب کلید محافظ جان فوق‌حساس ۱۰ میلی‌آمپر (تک‌فاز دوپل) برای قطع آنی جریان نشتی و نجات جان انسان اجباری است.",
    feedbackIncorrect: "غلط! حساسیت انتخاب شده برای زون‌های خیس کافی نیست. ۳۰ میلی‌آمپر در رطوبت حمام ممکن است کشنده باشد. همچنین برای کل تابلوی اصلی حساسیت ۳۰۰ میلی‌آمپر صرفاً ضدحریق است و جان انسان را محافظت نمی‌کند."
  },
  {
    title: "پریزهای آشپزخانه مسکونی",
    description: "یخچال ساید و ماشین لباسشویی مجاور سینک آشپزخانه دچار اتصال فاز به بدنه شده‌اند. مادر خانواده با دست مرطوب به دستگیره فلزی لباسشویی دست می‌زند.",
    dangerousCurrent: "نشتی جریان ۳۵ میلی‌آمپر (آستانه فیبریلاسیون قلبی)",
    correctSens: "30mA",
    correctPoles: "2P",
    feedbackCorrect: "درست! برای مصارف پریز عمومی مسکونی و آشپزخانه، استاندارد جهانی و مبحث ۱۳ استفاده از محافظ جان ۳۰ میلی‌آمپر دوپل (تک‌فاز) را اجباری کرده است.",
    feedbackIncorrect: "نادرست! حساسیت ۱۰ میلی‌آمپر برای آشپزخانه به دلیل نویزها و استارت موتور یخچال باعث قطع مکرر و بی‌دلیل فیوز (Trip) می‌شود و ۳۰۰ میلی‌آمپر نیز از شوک قلبی انسان جلوگیری نمی‌کند. انتخاب بهینه ۳۰ میلی‌آمپر است."
  },
  {
    title: "تابلو توزیع ورودی اصلی ساختمان سه فاز",
    description: "در جعبه تابلوی مشاعات اصلی (سه فاز)، بر اثر رطوبت باران در طبقه همکف، کابل ضخیم ورودی ساییده شده و جریان فرار کوچک به سازه فولادی ساختمان در جریان است که خطر آتش‌سوزی الکتریکی ساختمان را تهدید می‌کند.",
    dangerousCurrent: "نشتی و فرار جریان ۳۸۰ میلی‌آمپر (حرارت شدید و ذوب کابل)",
    correctSens: "300mA",
    correctPoles: "4P",
    feedbackCorrect: "آفرین! برای ورودی اصلی تابلوی توزیع کل ساختمان (سه‌فاز چهارپل)، از کلید محافظ جان ۳۰۰ میلی‌آمپر ضد حریق استفاده می‌شود تا جلوی قوس الکتریکی و شعله‌ور شدن کابل‌ها را بگیرد بدون اینکه در کار مداوم قطعی مکرر ایجاد کند.",
    feedbackIncorrect: "اشتباه! برای تابلوی سه فاز کل توزیع، استفاده از کلید ۳۰ یا ۱۰ میلی‌آمپر به دلیل وجود جریان خازنی طبیعی کابل‌ها بلافاصله تریپ داده و کل برق مجتمع را دائم قطع خواهد کرد. حساسیت ۳۰۰ میلی‌آمپر چهارپل انتخاب اصولی است."
  }
];

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("wire");

  // ==========================================
  // 7. ELECTRICAL MINI-GAMES STATE
  // ==========================================
  const [activeMiniGame, setActiveMiniGame] = useState<"none" | "pacetown" | "lighting" | "rcd">("none");
  const [gameScore, setGameScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("electrical_game_highscore") || "0", 10);
  });

  // Pacetown State
  const [ptIsPlaying, setPtIsPlaying] = useState<boolean>(false);
  const [ptCurrentIndex, setPtCurrentIndex] = useState<number>(0);
  const [ptTimeLeft, setPtTimeLeft] = useState<number>(15);
  const [ptStreak, setPtStreak] = useState<number>(0);
  const [ptSelectedOpt, setPtSelectedOpt] = useState<number | null>(null);
  const [ptIsAnswered, setPtIsAnswered] = useState<boolean>(false);

  // Lighting Game State
  const [lgRoomType, setLgRoomType] = useState<"kitchen" | "bedroom" | "study" | "living">("kitchen");
  const [lgRoomWidth, setLgRoomWidth] = useState<number>(4);
  const [lgRoomLength, setLgRoomLength] = useState<number>(5);
  const [lgBulbCount, setLgBulbCount] = useState<number>(4);
  const [lgBulbWattage, setLgBulbWattage] = useState<number>(12); // LED 12W
  const [lgScore, setLgScore] = useState<number>(0);
  const [lgPassCount, setLgPassCount] = useState<number>(0);

  // RCD Safety Game State
  const [rcdScenarioIndex, setRcdScenarioIndex] = useState<number>(0);
  const [rcdSelSens, setRcdSelSens] = useState<string>("");
  const [rcdSelPoles, setRcdSelPoles] = useState<string>("");
  const [rcdSubmitted, setRcdSubmitted] = useState<boolean>(false);
  const [rcdIsSuccess, setRcdIsSuccess] = useState<boolean>(false);
  const [rcdLives, setRcdLives] = useState<number>(3);
  const [rcdGameFinished, setRcdGameFinished] = useState<boolean>(false);

  // Countdown timer for Pacetown
  useEffect(() => {
    let interval: any = null;
    if (ptIsPlaying && !ptIsAnswered && ptTimeLeft > 0) {
      interval = setInterval(() => {
        setPtTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (ptTimeLeft === 0 && ptIsPlaying && !ptIsAnswered) {
      // Time run out! Handle as wrong answer
      setPtSelectedOpt(-1); // special index for time out
      setPtIsAnswered(true);
      setPtStreak(0);
    }
    return () => clearInterval(interval);
  }, [ptIsPlaying, ptIsAnswered, ptTimeLeft]);

  // ==========================================
  // 1. WIRE SIZING & VOLTAGE DROP STATE
  // ==========================================
  const [powerType, setPowerType] = useState<"amp" | "watt">("amp");
  const [loadValue, setLoadValue] = useState<string>("16");
  const [length, setLength] = useState<string>("35");
  const [allowedDrop, setAllowedDrop] = useState<string>("3");
  const [phaseType, setPhaseType] = useState<"single" | "three">("single");
  const [conductorMaterial, setConductorMaterial] = useState<"copper" | "aluminum">("copper");

  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
  const [recommendedWire, setRecommendedWire] = useState<string>("");
  const [recommendedFuse, setRecommendedFuse] = useState<string>("");
  const [actualDropPercent, setActualDropPercent] = useState<number | null>(null);

  // ==========================================
  // 2. POWER & CURRENT STATE
  // ==========================================
  const [voltage, setVoltage] = useState<string>("220");
  const [currentPower, setCurrentPower] = useState<string>("12");
  const [powerFactor, setPowerFactor] = useState<string>("0.85");
  const [powerPhase, setPowerPhase] = useState<"single" | "three">("single");
  
  const [activePower, setActivePower] = useState<number | null>(null); // kW
  const [reactivePower, setReactivePower] = useState<number | null>(null); // kVAR
  const [apparentPower, setApparentPower] = useState<number | null>(null); // kVA
  const [requiredCapacitor, setRequiredCapacitor] = useState<number | null>(null); // kVAR

  // ==========================================
  // 3. CONDUIT CAPACITY STATE
  // ==========================================
  const [wireSizeSelection, setWireSizeSelection] = useState<"1.5" | "2.5" | "4" | "6">("2.5");
  const [wireCount, setWireCount] = useState<string>("5");
  const [conduitResult, setConduitResult] = useState<string>("");
  const [ductResult, setDuctResult] = useState<string>("");

  // ==========================================
  // 4. RCD (SENSITIVITY & GROUNDING) STATE
  // ==========================================
  const [occupancyType, setOccupancyType] = useState<string>("residential_dry");
  const [rcdRatedCurrent, setRcdRatedCurrent] = useState<string>("25");
  const [rcdPhase, setRcdPhase] = useState<"single" | "three">("single");

  const [rcdSensitivity, setRcdSensitivity] = useState<string>("");
  const [rcdPoles, setRcdPoles] = useState<string>("");
  const [maxEarthRes, setMaxEarthRes] = useState<number | null>(null);
  const [rcdTripTime, setRcdTripTime] = useState<string>("");

  // ==========================================
  // 5. LIGHTING DESIGN (LUMEN METHOD) STATE
  // ==========================================
  const [roomLength, setRoomLength] = useState<string>("6");
  const [roomWidth, setRoomWidth] = useState<string>("4");
  const [spaceType, setSpaceType] = useState<string>("living");
  const [lampType, setLampType] = useState<string>("led_12w");

  const [totalLumensNeeded, setTotalLumensNeeded] = useState<number | null>(null);
  const [fixturesCount, setFixturesCount] = useState<number | null>(null);
  const [suggestedLayout, setSuggestedLayout] = useState<string>("");
  const [standardLux, setStandardLux] = useState<number | null>(null);

  // ==========================================
  // 6. ENERGY BILL STATE
  // ==========================================
  const [appliancePower, setAppliancePower] = useState<string>("2200"); // AC or Water heater
  const [dailyHours, setDailyHours] = useState<string>("5");
  const [monthlyDays, setMonthlyDays] = useState<string>("30");
  const [tierPrice, setTierPrice] = useState<string>("300"); // Toman/kWh

  const [monthlyKwh, setMonthlyKwh] = useState<number | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  // ==========================================
  // CALCULATOR LOGIC
  // ==========================================

  // 1. Calculate Wire Size & Voltage Drop
  const calculateWireSize = (e: FormEvent) => {
    e.preventDefault();
    const lValue = parseFloat(loadValue);
    const len = parseFloat(length);
    const dropPercent = parseFloat(allowedDrop);

    if (isNaN(lValue) || isNaN(len) || isNaN(dropPercent) || lValue <= 0 || len <= 0 || dropPercent <= 0) {
      return;
    }

    const volt = phaseType === "single" ? 220 : 380;
    
    // Convert Watts to Amps if needed
    let current = lValue;
    if (powerType === "watt") {
      if (phaseType === "single") {
        current = lValue / (220 * 0.9);
      } else {
        current = lValue / (1.732 * 380 * 0.9);
      }
    }

    // Conductivity: Copper ~ 56, Aluminum ~ 34
    const conductivity = conductorMaterial === "copper" ? 56 : 34;
    const allowedDropVolts = (dropPercent / 100) * volt;

    // Standard formula:
    // Single Phase: S = (2 * L * I) / (conductivity * dV)
    // Three Phase: S = (1.732 * L * I * cos_phi) / (conductivity * dV)
    let computedArea = 1.5;
    if (phaseType === "single") {
      computedArea = (2 * len * current) / (conductivity * allowedDropVolts);
    } else {
      computedArea = (1.732 * len * current * 0.9) / (conductivity * allowedDropVolts);
    }

    setCalculatedArea(parseFloat(computedArea.toFixed(3)));

    const standardSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
    let recSize = "1.5";
    for (const size of standardSizes) {
      if (computedArea <= size) {
        recSize = size.toString();
        break;
      }
    }
    if (computedArea > 120) {
      recSize = "بزرگتر از ۱۲۰ (مشاوره کابل فشار قوی لازم است)";
    }
    setRecommendedWire(recSize);

    // Miniature Circuit Breaker choice
    let fuse = "۱۰ آمپر تیپ B";
    if (phaseType === "single") {
      if (current <= 8) fuse = "۱۰ آمپر تیپ B (تندکار روشنایی)";
      else if (current <= 13) fuse = "۱۶ آمپر تیپ B یا C";
      else if (current <= 18) fuse = "۲۰ آمپر تیپ C (موتوری)";
      else if (current <= 22) fuse = "۲۵ آمپر تیپ C";
      else if (current <= 28) fuse = "۳۲ آمپر تیپ C";
      else fuse = "۵۰ آمپر مینیاتوری سه فاز";
    } else {
      const tripAmps = Math.ceil(current * 1.25);
      fuse = `سه‌فاز ${tripAmps} آمپر مینیاتوری تیپ C (حفاظت موتور)`;
    }
    setRecommendedFuse(fuse);

    // Actual drop calculations
    const recSizeNum = parseFloat(recSize);
    if (!isNaN(recSizeNum)) {
      let actDropV = 0;
      if (phaseType === "single") {
        actDropV = (2 * len * current) / (conductivity * recSizeNum);
      } else {
        actDropV = (1.732 * len * current * 0.9) / (conductivity * recSizeNum);
      }
      const actDropP = (actDropV / volt) * 100;
      setActualDropPercent(parseFloat(actDropP.toFixed(2)));
    } else {
      setActualDropPercent(null);
    }
  };

  // 2. Calculate Power & Current
  const calculatePower = (e: FormEvent) => {
    e.preventDefault();
    const v = parseFloat(voltage);
    const i = parseFloat(currentPower);
    const pf = parseFloat(powerFactor);

    if (isNaN(v) || isNaN(i) || isNaN(pf) || v <= 0 || i <= 0 || pf <= 0 || pf > 1) {
      return;
    }

    let pActive = 0;
    let pApparent = 0;

    if (powerPhase === "single") {
      pApparent = v * i;
      pActive = v * i * pf;
    } else {
      pApparent = 1.732 * v * i;
      pActive = 1.732 * v * i * pf;
    }

    const pReactive = Math.sqrt(Math.pow(pApparent, 2) - Math.pow(pActive, 2));

    setActivePower(parseFloat((pActive / 1000).toFixed(2))); // kW
    setApparentPower(parseFloat((pApparent / 1000).toFixed(2))); // kVA
    setReactivePower(parseFloat((pReactive / 1000).toFixed(2))); // kVAR

    // Required capacitor size for cos_phi correction to 0.95
    const angleInitial = Math.acos(pf);
    const angleTarget = Math.acos(0.95);
    const qCap = (pActive / 1000) * (Math.tan(angleInitial) - Math.tan(angleTarget));
    setRequiredCapacitor(qCap > 0 ? parseFloat(qCap.toFixed(2)) : 0);
  };

  // 3. Calculate Conduit capacity
  const calculateConduit = (e: FormEvent) => {
    e.preventDefault();
    const count = parseInt(wireCount);
    if (isNaN(count) || count <= 0) return;

    const size = parseFloat(wireSizeSelection);
    let diameter = 3.8;
    if (size === 1.5) diameter = 3.2;
    if (size === 4) diameter = 4.5;
    if (size === 6) diameter = 5.2;

    const singleWireArea = Math.PI * Math.pow(diameter / 2, 2);
    const totalWireArea = singleWireArea * count;
    const minConduitArea = totalWireArea / 0.4; // 40% fill factor
    const minDiameter = 2 * Math.sqrt(minConduitArea / Math.PI);

    let pgSize = "لوله برق نمره ۱۳.۵ (PG 11)";
    if (minDiameter <= 11) {
      pgSize = "لوله برق نمره ۱۳.۵ (PG 11 - قطر ۱۸.۶mm)";
    } else if (minDiameter <= 13.5) {
      pgSize = "لوله برق نمره ۱۶ (PG 13.5 - قطر ۲۰.۴mm)";
    } else if (minDiameter <= 16) {
      pgSize = "لوله برق نمره ۲۱ (PG 16 - قطر ۲۲.۵mm)";
    } else if (minDiameter <= 21) {
      pgSize = "لوله برق نمره ۲۹ (PG 21 - قطر ۲۸.۳mm)";
    } else {
      pgSize = "لوله برق بزرگتر از نمره ۲۹ (PG 29 یا نمره ۳۶)";
    }

    setConduitResult(pgSize);

    let duct = "داکت ۲ × ۲ سانتی‌متر";
    if (count <= 3 && size <= 2.5) {
      duct = "داکت ۱.۵ × ۱.۵ سانتی‌متر";
    } else if (count <= 8 && size <= 2.5) {
      duct = "داکت ۲ × ۲ سانتی‌متر";
    } else if (count <= 15 && size <= 2.5) {
      duct = "داکت ۳ × ۳ سانتی‌متر";
    } else {
      duct = "داکت ۴ × ۴ سانتی‌متر یا بزرگتر";
    }
    setDuctResult(duct);
  };

  // 4. Calculate RCD Sensitivity & Grounding Requirements
  const calculateRcd = (e: FormEvent) => {
    e.preventDefault();
    const current = parseFloat(rcdRatedCurrent);
    if (isNaN(current) || current <= 0) return;

    // RCD properties based on Mabhath 13
    let sensitivity = "۳۰ میلی‌آمپر (حفاظت جان)";
    let sensitivityVal = 0.03; // Amp
    let tripTime = "کمتر از ۴۰ میلی‌ثانیه (آنی)";

    if (occupancyType === "bathroom" || occupancyType === "pool") {
      sensitivity = "۱۰ میلی‌آمپر (بسیار حساس - حمام، سونا، جکوزی)";
      sensitivityVal = 0.01;
    } else if (occupancyType === "main_panel") {
      sensitivity = "۳۰۰ میلی‌آمپر (حفاظت تجهیزات و ضد حریق)";
      sensitivityVal = 0.3;
      tripTime = "کمتر از ۲۰۰ میلی‌ثانیه (جلوگیری از آتش‌سوزی الکتریکی)";
    }

    setRcdSensitivity(sensitivity);
    setRcdTripTime(tripTime);

    // Number of poles
    setRcdPoles(rcdPhase === "single" ? "دوپل (۲P - فاز و نول)" : "چهارپل (۴P - سه فاز و نول)");

    // Maximum grounding resistance standard: Ra <= 50V / IΔn
    const maxRa = 50 / sensitivityVal;
    setMaxEarthRes(parseFloat(maxRa.toFixed(1)));
  };

  // 5. Calculate Lighting Design (Lumen method)
  const calculateLighting = (e: FormEvent) => {
    e.preventDefault();
    const lengthM = parseFloat(roomLength);
    const widthM = parseFloat(roomWidth);

    if (isNaN(lengthM) || isNaN(widthM) || lengthM <= 0 || widthM <= 0) return;

    const area = lengthM * widthM;

    // 1. Get standard Lux level (E) from Mabhath 13
    let lux = 150;
    if (spaceType === "living") lux = 200;
    else if (spaceType === "bedroom") lux = 100;
    else if (spaceType === "kitchen") lux = 300;
    else if (spaceType === "bathroom") lux = 100;
    else if (spaceType === "office") lux = 450;
    else if (spaceType === "stairs") lux = 80;

    setStandardLux(lux);

    // 2. Get lamp lumen output
    let lampLumen = 1100; // default for 12W
    let lampPowerDesc = "۱۲ وات LED";
    if (lampType === "led_9w") {
      lampLumen = 800;
      lampPowerDesc = "۹ وات LED";
    } else if (lampType === "led_18w") {
      lampLumen = 1650;
      lampPowerDesc = "۱۸ وات LED";
    } else if (lampType === "led_30w") {
      lampLumen = 2800;
      lampPowerDesc = "۳۰ وات LED";
    } else if (lampType === "led_50w") {
      lampLumen = 4600;
      lampPowerDesc = "۵۰ وات COB";
    }

    // Lumen Method formula:
    // Total Lumens = (Lux * Area) / (UtilizationFactor * MaintenanceFactor)
    // We assume standard average residential coefficients: UF = 0.5, MF = 0.8
    // So UF * MF = 0.4
    const totalLumens = (lux * area) / 0.4;
    setTotalLumensNeeded(Math.round(totalLumens));

    const counts = Math.ceil(totalLumens / lampLumen);
    setFixturesCount(counts);

    // Suggested spacing grid layout
    let layoutText = `${counts} عدد لامپ به طور متقارن`;
    if (counts <= 2) {
      layoutText = `${counts} عدد لامپ در یک ردیف خط وسط`;
    } else if (counts <= 4) {
      layoutText = `آرایش شبکه ۲ در ۲ (مربعی متقارن)`;
    } else if (counts <= 6) {
      layoutText = `آرایش شبکه ۲ در ۳ (دو ردیف سه تایی)`;
    } else if (counts <= 9) {
      layoutText = `آرایش شبکه ۳ در ۳ (سه ردیف سه تایی)`;
    } else {
      layoutText = `توصیه به نصب در خطوط نور خطی یا چند دسته شبکه متوازن`;
    }
    setSuggestedLayout(layoutText);
  };

  // 6. Calculate Bill & Cost
  const calculateBill = (e: FormEvent) => {
    e.preventDefault();
    const watts = parseFloat(appliancePower);
    const hours = parseFloat(dailyHours);
    const days = parseFloat(monthlyDays);
    const rate = parseFloat(tierPrice);

    if (isNaN(watts) || isNaN(hours) || isNaN(days) || isNaN(rate) || watts <= 0 || hours <= 0 || days <= 0 || rate <= 0) {
      return;
    }

    const kwh = (watts * hours * days) / 1000;
    const totalCost = kwh * rate;

    setMonthlyKwh(parseFloat(kwh.toFixed(1)));
    setEstimatedCost(Math.round(totalCost));
  };

  // ==========================================
  // GAME HANDLERS
  // ==========================================

  // 1. Pacetown (Speed Calculation Game)
  const [ptQuestions, setPtQuestions] = useState<any[]>([]);

  const startPacetownGame = () => {
    const shuffled = [...PACETOWN_QUESTIONS].sort(() => Math.random() - 0.5);
    setPtQuestions(shuffled);
    setPtCurrentIndex(0);
    setPtTimeLeft(15);
    setPtStreak(0);
    setPtSelectedOpt(null);
    setPtIsAnswered(false);
    setGameScore(0);
    setPtIsPlaying(true);
    setActiveMiniGame("pacetown");
  };

  const submitPacetownAnswer = (optIdx: number) => {
    if (ptIsAnswered) return;
    setPtSelectedOpt(optIdx);
    setPtIsAnswered(true);

    const currentQ = ptQuestions[ptCurrentIndex];
    if (optIdx === currentQ.correct) {
      const streakBonus = Math.min(ptStreak, 4); // max x1.4 multiplier
      const basePoints = 100;
      const speedBonus = ptTimeLeft * 10;
      const earned = Math.round((basePoints + speedBonus) * (1 + streakBonus * 0.1));
      
      setGameScore(prev => {
        const newScore = prev + earned;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("electrical_game_highscore", newScore.toString());
        }
        return newScore;
      });
      setPtStreak(prev => prev + 1);
    } else {
      setPtStreak(0);
    }
  };

  const nextPacetownQuestion = () => {
    if (ptCurrentIndex + 1 < ptQuestions.length) {
      setPtCurrentIndex(prev => prev + 1);
      setPtTimeLeft(15);
      setPtSelectedOpt(null);
      setPtIsAnswered(false);
    } else {
      setPtIsPlaying(false);
    }
  };

  // 2. Lighting Design Master Game
  const lgCurrentLux = useMemo(() => {
    const area = lgRoomWidth * lgRoomLength;
    let lampLumen = 1100; // default for 12W
    if (lgBulbWattage === 9) lampLumen = 800;
    else if (lgBulbWattage === 18) lampLumen = 1650;
    else if (lgBulbWattage === 30) lampLumen = 2800;
    else if (lgBulbWattage === 50) lampLumen = 4600;

    const totalLumens = lampLumen * lgBulbCount;
    // Lux = (TotalLumens * UF * MF) / Area = (TotalLumens * 0.4) / Area
    return Math.round((totalLumens * 0.4) / area);
  }, [lgRoomWidth, lgRoomLength, lgBulbCount, lgBulbWattage]);

  const lgTargetLux = useMemo(() => {
    switch (lgRoomType) {
      case "kitchen": return 300;
      case "bedroom": return 100;
      case "study": return 450;
      case "living": return 200;
      default: return 200;
    }
  }, [lgRoomType]);

  const lgStatus = useMemo(() => {
    const ratio = lgCurrentLux / lgTargetLux;
    if (ratio < 0.6) return { text: "⚠️ بسیار تاریک و نامناسب!", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    if (ratio < 0.9) return { text: "⚠️ شدت نور زیر استاندارد (کمی تاریک)", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    if (ratio >= 0.9 && ratio <= 1.1) return { text: "🎉 نور ایده‌آل و مهندسی شده عالی!", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (ratio <= 1.5) return { text: "⚠️ شدت نور بیش از حد استاندارد (پرنور)", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { text: "🚨 پدیده خیرگی شدید و آسیب به چشم!", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  }, [lgCurrentLux, lgTargetLux]);

  const submitLightingDesign = () => {
    const ratio = lgCurrentLux / lgTargetLux;
    if (ratio >= 0.9 && ratio <= 1.1) {
      setLgScore(prev => prev + 500);
      setLgPassCount(prev => prev + 1);
      
      const roomTypes: ("kitchen" | "bedroom" | "study" | "living")[] = ["kitchen", "bedroom", "study", "living"];
      const nextType = roomTypes.filter(t => t !== lgRoomType)[Math.floor(Math.random() * 3)];
      setLgRoomType(nextType);
      
      setLgRoomWidth(Math.floor(Math.random() * 5) + 3);
      setLgRoomLength(Math.floor(Math.random() * 6) + 4);
      setLgBulbCount(1);
    }
  };

  // 3. RCD Safety Shield Game
  const startRcdGame = () => {
    setRcdScenarioIndex(0);
    setRcdSelSens("");
    setRcdSelPoles("");
    setRcdSubmitted(false);
    setRcdIsSuccess(false);
    setRcdLives(3);
    setRcdGameFinished(false);
    setLgScore(0);
    setActiveMiniGame("rcd");
  };

  const submitRcdAnswer = () => {
    if (rcdSubmitted || rcdGameFinished) return;
    
    const scenario = RCD_SCENARIOS[rcdScenarioIndex];
    const isCorrect = rcdSelSens === scenario.correctSens && rcdSelPoles === scenario.correctPoles;
    
    setRcdSubmitted(true);
    setRcdIsSuccess(isCorrect);
    
    if (isCorrect) {
      setLgScore(prev => prev + 300);
    } else {
      setRcdLives(prev => {
        const nextLives = prev - 1;
        if (nextLives === 0) {
          setRcdGameFinished(true);
        }
        return nextLives;
      });
    }
  };

  const nextRcdScenario = () => {
    if (rcdScenarioIndex + 1 < RCD_SCENARIOS.length) {
      setRcdScenarioIndex(prev => prev + 1);
      setRcdSelSens("");
      setRcdSelPoles("");
      setRcdSubmitted(false);
      setRcdIsSuccess(false);
    } else {
      setRcdGameFinished(true);
    }
  };

  return (
    <div id="calculator-section" className="bg-[#111318] border border-[#232730] rounded-2xl p-6 text-white animate-fadeIn" dir="rtl">
      
      {/* Tab select menu buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-6 border-b border-slate-800/80 pb-4">
        {[
          { id: "wire", label: "مقطع کابل و فیوز" },
          { id: "power", label: "محاسبه جریان و توان" },
          { id: "conduit", label: "سایز لوله و داکت" },
          { id: "rcd", label: "محاسب کلید RCD" },
          { id: "lighting", label: "روشنایی و لومن" },
          { id: "bill", label: "بهای قبض و مصرف" },
          { id: "games", label: "🎮 باشگاه بازی" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CalculatorTab)}
            className={`py-2.5 px-1.5 rounded-xl text-[10.5px] font-black transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: WIRE SIZING & DROP
          ========================================== */}
      {activeTab === "wire" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculateWireSize} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Settings className="h-3.5 w-3.5 text-amber-500" />
              ورودی پارامترهای بار الکتریکی و کابل‌کشی
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setPhaseType("single")}
                className={`py-1.5 rounded font-bold text-center ${phaseType === "single" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                تک‌فاز (۲۲۰ ولت)
              </button>
              <button
                type="button"
                onClick={() => setPhaseType("three")}
                className={`py-1.5 rounded font-bold text-center ${phaseType === "three" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                سه‌فاز (۳۸۰ ولت)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setConductorMaterial("copper")}
                className={`py-1.5 rounded font-bold text-center ${conductorMaterial === "copper" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                سیم مسی (Cu)
              </button>
              <button
                type="button"
                onClick={() => setConductorMaterial("aluminum")}
                className={`py-1.5 rounded font-bold text-center ${conductorMaterial === "aluminum" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                سیم آلومینیومی (Al)
              </button>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setPowerType("amp"); setLoadValue("16"); }}
                className={`flex-1 py-1 px-2.5 rounded text-[11px] font-semibold text-center ${powerType === "amp" ? "bg-slate-700 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400"}`}
              >
                جریان مصرفی (آمپر)
              </button>
              <button
                type="button"
                onClick={() => { setPowerType("watt"); setLoadValue("3500"); }}
                className={`flex-1 py-1 px-2.5 rounded text-[11px] font-semibold text-center ${powerType === "watt" ? "bg-slate-700 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400"}`}
              >
                توان مصرفی (وات)
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">
                {powerType === "amp" ? "جریان مصرفی مدار (آمپر):" : "توان کل بار مصرفی (وات):"}
              </label>
              <input
                type="number"
                value={loadValue}
                onChange={(e) => setLoadValue(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">مسافت کابل‌کشی یا طول سیم از منبع (متر):</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">افت ولتاژ مجاز بر اساس آیین‌نامه (٪):</label>
              <select
                value={allowedDrop}
                onChange={(e) => setAllowedDrop(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
              >
                <option value="1.5">۱.۵٪ (مدار روشنایی حساس)</option>
                <option value="3">۳.۰٪ (مدارهای پریز و فرعی عمومی)</option>
                <option value="5">۵.۰٪ (حداکثر مجاز بارهای دینامیکی و کمپرسورها)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              محاسبه و مقایسه مقطع کابل استاندارد
            </button>
          </form>

          {/* Sizing result */}
          <div className="space-y-4">
            {calculatedArea !== null ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">مشخصات کابل و افت ولتاژ نهایی</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">ضخامت کابل محاسباتی:</span>
                    <span className="text-sm font-extrabold text-slate-300 font-mono">{calculatedArea} mm²</span>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-amber-500 font-semibold block">سایز کابل استاندارد بازار:</span>
                    <span className="text-sm font-extrabold text-amber-400 font-mono">سیم نمره {recommendedWire} {conductorMaterial === "copper" ? "مسی" : "آلومینیوم"}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">فیوز مینیاتوری پیشنهادی:</span>
                    <span className="font-bold text-amber-500">{recommendedFuse}</span>
                  </div>
                  {actualDropPercent !== null && (
                    <div className="flex justify-between py-1 border-b border-slate-900/80">
                      <span className="text-slate-400">افت ولتاژ واقعی برای این مقطع:</span>
                      <span className={`font-bold font-mono ${actualDropPercent > parseFloat(allowedDrop) ? "text-rose-400" : "text-emerald-400"}`}>
                        {actualDropPercent}٪
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800/60 flex gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <strong>توصیه مبحث ۱۳:</strong> استفاده از کابل با مقطع نازک منجر به تلفات شدید حرارتی در دیوار، داغ شدن سیم و پدیده خطرناک افت ولتاژ می‌شود که می‌تواند به وسایل برقی حساس مثل کمپرسور یخچال و اسپلیت آسیب جدی برساند.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-slate-900 border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <Zap className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">پارامترهای کابل را در فرم سمت راست تکمیل کنید تا محاسبات افت ولتاژ و مقاومت خط آغاز شود.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: POWER & CURRENT
          ========================================== */}
      {activeTab === "power" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculatePower} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Activity className="h-4 w-4 text-amber-500" />
              ورودی پارامترهای بار القایی الکتروموتور
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => { setPowerPhase("single"); setVoltage("220"); }}
                className={`py-1.5 rounded font-bold text-center ${powerPhase === "single" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                تک‌فاز (۲۲۰ ولت)
              </button>
              <button
                type="button"
                onClick={() => { setPowerPhase("three"); setVoltage("380"); }}
                className={`py-1.5 rounded font-bold text-center ${powerPhase === "three" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                سه‌فاز (۳۸۰ ولت)
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">ولتاژ نامی موثر ولت متر (ولت):</label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">جریان عبوری اندازه‌گیری شده (آمپر):</label>
              <input
                type="number"
                value={currentPower}
                onChange={(e) => setCurrentPower(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">ضریب توان مصرف‌کننده (Cos φ):</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={powerFactor}
                onChange={(e) => setPowerFactor(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              محاسبه مثلث توان و جریان راکتیو
            </button>
          </form>

          <div className="space-y-4">
            {activePower !== null ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">آنالیز مثلث توان دستگاه</h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">توان اکتیو یا مفید واقعی (P):</span>
                    <span className="font-bold text-slate-200 font-mono">{activePower} kW</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">توان راکتیو غیرمفید خازنی (Q):</span>
                    <span className="font-bold text-rose-400 font-mono">{reactivePower} kVAR</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">توان کل ظاهری شبکه (S):</span>
                    <span className="font-bold text-indigo-400 font-mono">{apparentPower} kVA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-500/30 bg-amber-500/10 p-2.5 rounded-lg">
                    <span className="text-amber-400 font-bold">خازن پله خنثی‌ساز جهت بهبود به ۰.۹۵:</span>
                    <span className="font-black text-amber-300 font-mono">{requiredCapacitor} kVAR</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800/60 flex gap-2">
                  <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    نصب پله‌های خازنی علاوه بر حذف جریمه راکتیو کنتورهای دیجیتال، به شدت جریان عبوری کابل‌ها را کاهش داده و موجب صرفه‌جویی چشمگیر در هزینه‌های فیش برق کل مجتمع مسکونی می‌شود.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-slate-900 border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <Activity className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">جریان و ولتاژ مصرف‌کننده القایی را وارد کنید تا محاسبات خازن فورا صادر گردد.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: CONDUIT CAPACITY
          ========================================== */}
      {activeTab === "conduit" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculateConduit} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Settings className="h-3.5 w-3.5 text-amber-500" />
              محاسبه ظرفیت ایمن کاندوئیت لوله عبوری برق
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">سایز سیم فرعی (میلی‌متر مربع):</label>
              <select
                value={wireSizeSelection}
                onChange={(e: any) => setWireSizeSelection(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="1.5">سیم روشنایی (۱.۵ mm²)</option>
                <option value="2.5">سیم پریز استاندارد (۲.۵ mm²)</option>
                <option value="4">سیم خط اسپلیت (۴.۰ mm²)</option>
                <option value="6">کابل اصلی ورودی واحد (۶.۰ mm²)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">تعداد کل سیم‌های موازی عبوری از لوله:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={wireCount}
                onChange={(e) => setWireCount(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              محاسبه قطر و سایز بهینه لوله برق
            </button>
          </form>

          <div className="space-y-4">
            {conduitResult ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">سایز لوله برق و داکت استاندارد</h4>

                <div className="space-y-3">
                  <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-amber-500 font-semibold block">سایز کاندوئیت لوله PVC/UPVC پیشنهادی:</span>
                    <span className="text-xs font-extrabold text-amber-400 block mt-1">{conduitResult}</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">سایز داکت پلاستیکی عبور دیواری روکار:</span>
                    <span className="text-xs font-extrabold text-slate-300 block mt-1">{ductResult}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 flex items-start gap-2">
                  <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <strong>ضابطه لوله‌گذاری:</strong> پر کردن بیش از حد لوله علاوه بر بروز حرارت شدید و ذوب عایق سیم‌ها، مانع از حرکت راحت فنر برقکاری حین کابل‌کشی مجدد آینده یا سیم‌کشی عیب‌یابی می‌شود.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-slate-900 border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <Settings className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">تعداد کابل‌ها را در فرم سمت راست وارد کنید تا سایز مجاز کاندوئیت‌ها صادر شود.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: RCD (SENSITIVITY & LEAKAGE)
          ========================================== */}
      {activeTab === "rcd" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculateRcd} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
              الزامات فنی کلید جریان باقیمانده (RCD محافظ جان)
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">مکان و نوع کاربری محل نصب:</label>
              <select
                value={occupancyType}
                onChange={(e) => setOccupancyType(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="residential_dry">اتاق خواب، هال و فضاهای عمومی مسکونی</option>
                <option value="bathroom">حمام، آشپزخانه و فضاهای مرطوب واحد</option>
                <option value="pool">استخر، جکوزی، سونا و جک استخر</option>
                <option value="main_panel">تابلو توزیع اصلی ورودی ساختمان (ضد حریق)</option>
                <option value="industrial">سیم‌کشی‌های کارگاهی و دپارتمان صنعتی</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setRcdPhase("single")}
                className={`py-1.5 rounded font-bold text-center ${rcdPhase === "single" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                شبکه تک‌فاز مسکونی
              </button>
              <button
                type="button"
                onClick={() => setRcdPhase("three")}
                className={`py-1.5 rounded font-bold text-center ${rcdPhase === "three" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                شبکه سه‌فاز صنعتی
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">جریان نامی مجاز کنتاکت‌های کلید RCD (آمپر):</label>
              <select
                value={rcdRatedCurrent}
                onChange={(e) => setRcdRatedCurrent(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="16">۱۶ آمپر</option>
                <option value="25">۲۵ آمپر (استاندارد آپارتمانی)</option>
                <option value="32">۳۲ آمپر</option>
                <option value="40">۴۰ آمپر (ورودی اصلی واحد)</option>
                <option value="63">۶۳ آمپر</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              استخراج الزامات ایمنی کلید RCD و ارتینگ
            </button>
          </form>

          <div className="space-y-4">
            {rcdSensitivity ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">شناسنامه ایمنی و تایید نظام مهندسی</h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">حساسیت جریان نشتی (IΔn):</span>
                    <span className="font-extrabold text-amber-400">{rcdSensitivity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">آرایش ساختاری پل‌های کلید:</span>
                    <span className="font-bold text-slate-200">{rcdPoles}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">زمان قطع در خطا (قطع زودهنگام):</span>
                    <span className="font-bold text-indigo-400">{rcdTripTime}</span>
                  </div>
                  {maxEarthRes !== null && (
                    <div className="flex justify-between py-2 border-b border-emerald-500/30 bg-emerald-500/10 p-2.5 rounded-lg">
                      <span className="text-emerald-300 font-bold">حداکثر مقاومت زمین مجاز جهت قطع:</span>
                      <span className="font-black text-emerald-400 font-mono">{maxEarthRes} Ω (اهم)</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/60 flex gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <strong>ضابطه حیاتی مبحث ۱۳:</strong> نصب کلید محافظ جان ۳۰ میلی‌آمپر برای پریزهای ساختمان مسکونی الزامی است. این جریان کمتر از آستانه خطر انقباض قلبی انسان (که ۳۰ میلی‌آمپر است) بوده و مرگ با برق‌گرفتگی را غیرممکن می‌سازد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-slate-900 border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <ShieldCheck className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">نوع کاربری فضا را تعیین کنید تا مشخصات دقیق کلیدهای RCD و تست دوره ای آنها نمایش داده شود.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: LIGHTING DESIGN (LUMEN METHOD)
          ========================================== */}
      {activeTab === "lighting" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculateLighting} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
              محاسبه بهینه روشنایی فضای مسکونی (روش لومن)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-semibold">طول کل اتاق (متر):</label>
                <input
                  type="number"
                  step="0.1"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-semibold">عرض کل اتاق (متر):</label>
                <input
                  type="number"
                  step="0.1"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">نوع کاربری اتاق یا فضا:</label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="living">سالن پذیرایی و هال نشیمن عمومی (200 Lux)</option>
                <option value="bedroom">اتاق خواب بزرگسالان (100 Lux)</option>
                <option value="kitchen">آشپزخانه و میز طبخ مسکونی (300 Lux)</option>
                <option value="bathroom">سرویس بهداشتی و حمام (100 Lux)</option>
                <option value="office">اتاق کار خانگی یا دفتر مطالعه (450 Lux)</option>
                <option value="stairs">راه‌پله و پاگردها (80 Lux)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-semibold">نوع و توان لامپ مصرفی:</label>
              <select
                value={lampType}
                onChange={(e) => setLampType(e.target.value)}
                className="w-full bg-slate-900 text-white rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="led_9w">لامپ ال‌ای‌دی ۹ وات (شار ۸۰۰ لومن)</option>
                <option value="led_12w">لامپ ال‌ای‌دی ۱۲ وات (شار ۱۱۰۰ لومن - استاندارد)</option>
                <option value="led_18w">لامپ ال‌ای‌دی ۱۸ وات (شار ۱۶۵۰ لومن)</option>
                <option value="led_30w">لامپ حبابی ۳۰ وات (شار ۲۸۰۰ لومن)</option>
                <option value="led_50w">لامپ کارگاهی COB پنجاه وات (شار ۴۶۰۰ لومن)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              محاسبه هوشمند تعداد چراغ‌های مورد نیاز
            </button>
          </form>

          <div className="space-y-4">
            {totalLumensNeeded !== null ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">گزارش توزیع نوری و چینش فضا</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">شدت روشنایی استاندارد:</span>
                    <span className="text-sm font-extrabold text-indigo-400 font-mono">{standardLux} Lux</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">شار نوری مورد نیاز کل فضا:</span>
                    <span className="text-sm font-extrabold text-slate-300 font-mono">{totalLumensNeeded} lm</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-center">
                  <span className="text-[10px] text-amber-500 font-bold block">تعداد نهایی لامپ‌های مورد نیاز:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{fixturesCount} عدد</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900/80">
                    <span className="text-slate-400">چینش و چیدمان پیشنهادی سقف:</span>
                    <span className="font-bold text-slate-200">{suggestedLayout}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800/60 flex gap-2">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <strong>نکات نصب:</strong> فواصل چراغ‌ها از هم باید تقریباً دو برابر فاصله چراغ تا دیوارهای جانبی سقف باشد تا سایه‌های تیره مابین سقف ایجاد نشود و نور کاملا یکنواخت توزیع گردد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-slate-900 border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <Lightbulb className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">ابعاد اتاق و نوع کاربری آن را پر کنید تا تعداد فیکسچرهای چراغ به روش لومن محاسبه شود.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 6: BILL CONSUMPTION
          ========================================== */}
      {activeTab === "bill" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={calculateBill} className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-900">
              <DollarSign className="h-4 w-4 text-amber-500" />
              ورودی برآورد مصرف انرژی دستگاه‌ها و برآوردهای مالی
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">توان مصرفی دستگاه برقی (وات):</label>
              <input
                type="number"
                value={appliancePower}
                onChange={(e) => setAppliancePower(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                placeholder="مثلاً ۲۰۰۰ وات برای اسپلیت"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">تعداد ساعات روشن بودن در شبانه‌روز:</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="24"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">تعداد روزهای استفاده در ماه:</label>
              <input
                type="number"
                min="1"
                max="31"
                value={monthlyDays}
                onChange={(e) => setMonthlyDays(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-semibold">تعرفه برق به ازای هر کیلووات ساعت (تومان):</label>
              <input
                type="number"
                value={tierPrice}
                onChange={(e) => setTierPrice(e.target.value)}
                className="w-full bg-slate-900 rounded px-3 py-1.5 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                placeholder="مثلاً ۳۰۰ تومان"
                required
              />
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-black text-xs transition-colors">
              برآورد مصرف انرژی ماهانه و هزینه نهایی
            </button>
          </form>

          <div className="space-y-4">
            {monthlyKwh !== null ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col gap-4 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">برآورد نهایی هزینه مصرف انرژی</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 block">کیلووات ساعت مصرفی کل ماه:</span>
                    <span className="text-sm font-extrabold text-slate-300 font-mono">{monthlyKwh} kWh</span>
                  </div>

                  <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-amber-500 font-semibold block">هزینه نهایی کل ماه:</span>
                    <span className="text-sm font-extrabold text-amber-400 font-mono">{estimatedCost?.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800/60 flex gap-2">
                  <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    با بهینه‌سازی الگوی مصرف برق (مثلاً تعویض لامپ‌های رشته‌ای به ال‌ای‌دی یا قرار دادن درجه اسپلیت روی دمای آسایش ۲۴ درجه سانتی‌گراد) می‌توانید تا ۴۰٪ بهای نهایی فیش برق را تقلیل دهید.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-12 rounded-xl border border-[#232730] border-dashed text-center flex flex-col items-center justify-center h-full min-h-[260px]">
                <DollarSign className="h-8 w-8 text-slate-700 mb-2" />
                <span className="text-xs text-slate-500">مشخصات مصرف دستگاه را وارد کنید تا هزینه نهایی آن برآورد گردد.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 7: ELECTRICAL INTERACTIVE GAMES
          ========================================== */}
      {activeTab === "games" && (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 animate-fadeIn text-right" dir="rtl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-amber-500 animate-bounce" />
                باشگاه بازی و چالش‌های تعاملی مهندسان برق
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">مهارت محاسباتی، ایمنی و طراحی روشنایی خود را در مسابقه بسنجید.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] text-slate-400 font-bold">رکورد طلایی:</span>
                <span className="text-xs font-black text-amber-400 font-mono">{highScore}</span>
              </div>
              
              {activeMiniGame !== "none" && (
                <button 
                  onClick={() => {
                    setActiveMiniGame("none");
                    setPtIsPlaying(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors"
                >
                  بازگشت به منو
                </button>
              )}
            </div>
          </div>

          {/* GAME SELECTION MENU */}
          {activeMiniGame === "none" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Game 1: Pace Town */}
              <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 p-5 rounded-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="bg-amber-500/10 p-2.5 rounded-lg w-fit mb-4 text-amber-500 group-hover:scale-110 transition-transform">
                    <Timer className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-200 mb-2">۱. مسابقه سرعت محاسباتی (Pace Town)</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mb-4">
                    با پاسخ به سوالات تستی استاندارد مبحث ۱۳ در کمترین زمان ممکن، بالاترین رکورد امتیازی و Streak طلایی را کسب کنید!
                  </p>
                </div>
                <button 
                  onClick={startPacetownGame}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  شروع مسابقه سرعت
                </button>
              </div>

              {/* Game 2: Lighting Design Master */}
              <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 p-5 rounded-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="bg-sky-500/10 p-2.5 rounded-lg w-fit mb-4 text-sky-400 group-hover:scale-110 transition-transform">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-200 mb-2">۲. آتلیه روشنایی و لومن (Lighting Master)</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mb-4">
                    اتاق‌هایی با ابعاد تصادفی بگیرید و با تنظیم تعداد چراغ و توان ال‌ای‌دی، شدت لوکس هدف استاندارد را مهندسی کنید!
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setActiveMiniGame("lighting");
                    setLgScore(0);
                    setLgPassCount(0);
                    setLgBulbCount(4);
                  }}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  ورود به آتلیه روشنایی
                </button>
              </div>

              {/* Game 3: RCD Safety Challenge */}
              <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 p-5 rounded-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="bg-emerald-500/10 p-2.5 rounded-lg w-fit mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-200 mb-2">۳. چالش شیلد جان انسان (RCD Safety)</h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mb-4">
                    در محیط‌های خطرناک خانگی، با تحلیل نشتی جریان، رله‌های نشت جریان (RCD) مناسب با قطب و حساسیت ایمن نصب کنید.
                  </p>
                </div>
                <button 
                  onClick={startRcdGame}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  شروع چالش ایمنی
                </button>
              </div>
            </div>
          )}

          {/* GAME 1: PACETOWN ACTIVE SCREEN */}
          {activeMiniGame === "pacetown" && ptQuestions.length > 0 && (
            <div className="max-w-2xl mx-auto bg-slate-900 p-5 rounded-xl border border-slate-800">
              {/* Score and stats */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 text-[11px] font-bold text-slate-400">
                <span>امتیاز فعلی: <span className="text-amber-400 font-extrabold font-mono text-xs">{gameScore}</span></span>
                
                {ptStreak > 0 && (
                  <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full animate-pulse text-[9.5px]">
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    استریک x{ptStreak} (+{Math.min(ptStreak, 4) * 10}٪)
                  </span>
                )}
                
                <span>سوال {ptCurrentIndex + 1} از {ptQuestions.length}</span>
              </div>

              {/* Timer Bar */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  className={`h-full ${ptTimeLeft > 5 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(ptTimeLeft / 15) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              {/* Question */}
              <h4 className="text-xs font-black text-slate-200 mb-6 leading-relaxed">
                {ptQuestions[ptCurrentIndex].question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {ptQuestions[ptCurrentIndex].options.map((option: string, oIdx: number) => {
                  let btnStyle = "bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-300";
                  if (ptIsAnswered) {
                    if (oIdx === ptQuestions[ptCurrentIndex].correct) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold shadow-sm";
                    } else if (ptSelectedOpt === oIdx) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400";
                    } else {
                      btnStyle = "bg-slate-950/30 border-slate-900 text-slate-600 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={ptIsAnswered}
                      onClick={() => submitPacetownAnswer(oIdx)}
                      className={`w-full text-right py-3 px-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {ptIsAnswered && oIdx === ptQuestions[ptCurrentIndex].correct && (
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {ptIsAnswered && ptSelectedOpt === oIdx && oIdx !== ptQuestions[ptCurrentIndex].correct && (
                        <X className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Timeout state */}
              {ptIsAnswered && ptSelectedOpt === -1 && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10.5px] font-bold text-center">
                  ⏰ زمان به پایان رسید! سرعت خود را افزایش دهید.
                </div>
              )}

              {/* Explanation & Next */}
              {ptIsAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6"
                >
                  <span className="text-[10px] font-bold text-amber-500 block mb-1">💡 راهنما و ضوابط مبحث ۱۳:</span>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">{ptQuestions[ptCurrentIndex].explanation}</p>
                </motion.div>
              )}

              {ptIsAnswered && (
                <button
                  onClick={nextPacetownQuestion}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  {ptCurrentIndex + 1 < ptQuestions.length ? "سوال بعدی ➔" : "پایان چالش مهندسی"}
                </button>
              )}
            </div>
          )}

          {/* GAME 2: LIGHTING MASTER ACTIVE SCREEN */}
          {activeMiniGame === "lighting" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel: Simulation Controls & Gauges */}
              <div className="space-y-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black text-slate-200">طراحی مهندسی روشنایی</h4>
                  <span className="text-[10.5px] text-slate-400">کسب امتیاز: <b className="text-sky-400 font-mono text-xs">{lgScore}</b> | تاییدیه: <b className="text-emerald-400 font-mono text-xs">{lgPassCount}</b></span>
                </div>

                {/* Step 1: Select Room Type */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-bold block">محیط نیازمند طراحی روشنایی:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "kitchen", label: "آشپزخانه (300lx)" },
                      { id: "bedroom", label: "اتاق خواب (100lx)" },
                      { id: "study", label: "اتاق مطالعه (450lx)" },
                      { id: "living", label: "پذیرایی (200lx)" }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setLgRoomType(t.id as any)}
                        className={`py-2 rounded-lg text-[10px] font-black transition-all ${
                          lgRoomType === t.id 
                            ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10" 
                            : "bg-slate-950 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Sliders for width and length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>عرض اتاق:</span>
                      <span className="font-extrabold text-slate-200 font-mono">{lgRoomWidth} متر</span>
                    </div>
                    <input 
                      type="range" 
                      min="3" 
                      max="8" 
                      value={lgRoomWidth}
                      onChange={(e) => setLgRoomWidth(parseInt(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>طول اتاق:</span>
                      <span className="font-extrabold text-slate-200 font-mono">{lgRoomLength} متر</span>
                    </div>
                    <input 
                      type="range" 
                      min="3" 
                      max="12" 
                      value={lgRoomLength}
                      onChange={(e) => setLgRoomLength(parseInt(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Step 3: Bulb wattage and count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-950">
                    <label className="text-[11px] text-slate-400 block mb-1">نوع و قدرت چراغ ال‌ای‌دی:</label>
                    <select 
                      value={lgBulbWattage}
                      onChange={(e) => setLgBulbWattage(parseInt(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    >
                      <option value="9">LED 9W (800 lm)</option>
                      <option value="12">LED 12W (1100 lm)</option>
                      <option value="18">LED 18W (1650 lm)</option>
                      <option value="30">LED 30W (2800 lm)</option>
                      <option value="50">COB 50W (4600 lm)</option>
                    </select>
                  </div>

                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>تعداد چراغ‌ها:</span>
                      <span className="font-extrabold text-slate-200 font-mono">{lgBulbCount} عدد</span>
                    </div>
                    <div className="flex gap-1.5 mt-0.5">
                      <button 
                        onClick={() => setLgBulbCount(prev => Math.max(1, prev - 1))}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 py-1 rounded text-center text-xs font-black text-slate-300"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setLgBulbCount(prev => Math.min(24, prev + 1))}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 py-1 rounded text-center text-xs font-black text-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results & gauge */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">شدت روشنایی فعلی:</span>
                    <span className="text-sm font-black text-sky-400 font-mono">{lgCurrentLux} Lux</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900 pt-2">
                    <span>لوکس هدف استاندارد:</span>
                    <span className="font-extrabold font-mono text-slate-300">{lgTargetLux} Lux</span>
                  </div>

                  {/* Progress Gauge */}
                  <div className="w-full bg-slate-900 h-2.5 rounded-full relative overflow-hidden">
                    {/* Target region highlighted */}
                    <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-500/30" />
                    
                    {/* Current pointer */}
                    <div 
                      className="absolute top-0 bottom-0 bg-sky-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (lgCurrentLux / (lgTargetLux * 2)) * 100)}%` }}
                    />
                  </div>

                  {/* Status Box */}
                  <div className={`p-3 rounded-lg border text-center text-[10.5px] font-bold ${lgStatus.bg} ${lgStatus.border} ${lgStatus.color}`}>
                    {lgStatus.text}
                  </div>
                </div>

                {/* Next room validation */}
                {lgCurrentLux >= lgTargetLux * 0.9 && lgCurrentLux <= lgTargetLux * 1.1 ? (
                  <button
                    onClick={submitLightingDesign}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-lg transition-all animate-bounce flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Award className="h-4 w-4" />
                    تایید نهایی و ثبت طرح (+۵۰۰ امتیاز مهندسی)
                  </button>
                ) : (
                  <div className="p-3 bg-slate-950 text-slate-500 border border-slate-900 rounded-lg text-center text-[10px] font-medium leading-relaxed">
                    💡 تعداد یا توان چراغ‌ها را طوری تغییر دهید تا لوکس حاصل نزدیک به لوکس هدف استاندارد گردد (تولرانس مجاز ۱۰± درصد).
                  </div>
                )}
              </div>

              {/* Right Panel: Interactive Ceiling Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between items-center">
                <div className="w-full text-right pb-2 border-b border-slate-850">
                  <h4 className="text-xs font-bold text-slate-300">پلان شماتیک ۲بعدی چیدمان چراغ در سقف</h4>
                  <p className="text-[9.5px] text-slate-500">موقعیت متقارن قرارگیری چراغ‌ها جهت یکنواختی توزیع نور</p>
                </div>

                {/* Room Grid Area */}
                <div className="w-full max-w-[280px] aspect-[4/5] bg-slate-950 border-2 border-slate-800 rounded-xl my-6 relative overflow-hidden flex flex-col justify-center items-center shadow-inner">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-b border-l border-white" />
                    ))}
                  </div>

                  {/* Bulb layouts based on bulb count */}
                  <div className="absolute inset-4 grid gap-4 place-items-center"
                       style={{
                         gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(lgBulbCount))}, 1fr)`,
                         gridTemplateRows: `repeat(${Math.round(Math.sqrt(lgBulbCount))}, 1fr)`
                       }}>
                    {Array.from({ length: lgBulbCount }).map((_, idx) => {
                      const isWinning = lgCurrentLux >= lgTargetLux * 0.9 && lgCurrentLux <= lgTargetLux * 1.1;
                      return (
                        <div key={idx} className="relative flex flex-col items-center">
                          {/* Radial Glow */}
                          <div className={`absolute rounded-full transition-all duration-300 ${
                            isWinning 
                              ? "w-20 h-20 bg-amber-400/20 blur-xl animate-pulse" 
                              : "w-12 h-12 bg-amber-400/10 blur-md"
                          }`} />
                          
                          {/* Bulb Icon element */}
                          <div className={`relative p-2 rounded-full border-2 ${
                            isWinning 
                              ? "bg-amber-400 border-amber-300 text-slate-950 shadow-lg shadow-amber-400/30" 
                              : "bg-slate-900 border-slate-800 text-amber-500/80"
                          } transition-all duration-300`}>
                            <Lightbulb className={`h-5 w-5 ${isWinning ? "stroke-[2.5]" : ""}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ceiling dimensions label */}
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">
                    {lgRoomWidth}m x {lgRoomLength}m ({lgRoomWidth * lgRoomLength}m²)
                  </div>
                </div>

                <div className="text-slate-500 text-[10px] text-center max-w-[280px] leading-relaxed">
                  چیدمان خودکار متقارن چراغ‌ها متناسب با ابعاد اتاق، مانع ایجاد نواحی تاریک و سایه‌های زننده در گوشه‌های فضا می‌گردد.
                </div>
              </div>
            </div>
          )}

          {/* GAME 3: RCD SAFETY CHALLENGE ACTIVE SCREEN */}
          {activeMiniGame === "rcd" && (
            <div className="max-w-2xl mx-auto bg-slate-900 p-5 rounded-xl border border-slate-800">
              {rcdGameFinished ? (
                <div className="text-center py-8 space-y-5 animate-fadeIn">
                  <div className="bg-emerald-500/10 p-4 rounded-full w-fit mx-auto text-emerald-400 border border-emerald-500/20">
                    <Trophy className="h-10 w-10" />
                  </div>
                  <h4 className="text-sm font-black text-slate-200">چالش ایمنی RCD به پایان رسید!</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                    تبریک! شما با تحلیل صحیح جریان فرار نشتی و مشخصات هادی فاز و نول، توانستید به خوبی تابلوی ایمن کلید نشتی جریان را در برابر حوادث و حریق بیمه کنید.
                  </p>
                  
                  <div className="bg-slate-950 max-w-xs mx-auto p-4 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">امتیاز کل کسب‌شده:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{lgScore} امتیاز</span>
                  </div>

                  <button
                    onClick={startRcdGame}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 px-6 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    تلاش مجدد و ارتقای امتیاز
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Stats header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 font-bold ml-1">جبران ایمنی (جون‌ها):</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Heart 
                            key={idx} 
                            className={`h-4 w-4 ${idx < rcdLives ? 'text-rose-500 fill-current' : 'text-slate-800'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-black">سناریو {rcdScenarioIndex + 1} از {RCD_SCENARIOS.length}</span>
                  </div>

                  {/* Scenario box */}
                  <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-2.5">
                    <h5 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                      محل حادثه: {RCD_SCENARIOS[rcdScenarioIndex].title}
                    </h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {RCD_SCENARIOS[rcdScenarioIndex].description}
                    </p>
                    <div className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/15 p-2 rounded-lg font-bold">
                      ⚠️ هشدار بحران: {RCD_SCENARIOS[rcdScenarioIndex].dangerousCurrent}
                    </div>
                  </div>

                  {/* Form Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Sensitivity select */}
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400 font-bold block">۱. آستانه حساسیت قطع جریان نشتی:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["10mA", "30mA", "300mA"].map((sens) => (
                          <button
                            key={sens}
                            disabled={rcdSubmitted}
                            onClick={() => setRcdSelSens(sens)}
                            className={`py-2 rounded-lg text-[10.5px] font-black border transition-all ${
                              rcdSelSens === sens
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/10"
                                : "bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850"
                            }`}
                          >
                            {sens === "10mA" ? "۱۰mA (فوق حساس)" : sens === "30mA" ? "۳۰mA (حفاظت جان)" : "۳۰۰mA (ضد حریق)"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Option 2: Poles select */}
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400 font-bold block">۲. نوع تعداد پل‌های کلید RCD:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["2P", "4P"].map((p) => (
                          <button
                            key={p}
                            disabled={rcdSubmitted}
                            onClick={() => setRcdSelPoles(p)}
                            className={`py-2 rounded-lg text-[10.5px] font-black border transition-all ${
                              rcdSelPoles === p
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/10"
                                : "bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850"
                            }`}
                          >
                            {p === "2P" ? "۲ پل (تک‌فاز)" : "۴ پل (سه‌فاز)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submission & Validation Feedback */}
                  {rcdSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border ${
                        rcdIsSuccess 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      } space-y-2`}
                    >
                      <h5 className="text-xs font-black flex items-center gap-1.5">
                        {rcdIsSuccess ? (
                          <>
                            <Check className="h-4.5 w-4.5" />
                            سیستم با موفقیت قطع شد و جان فرد نجات یافت! 🎉
                          </>
                        ) : (
                          <>
                            <X className="h-4.5 w-4.5 animate-pulse" />
                            بروز فاجعه الکتریکی حین اتصال خطا! 🚨
                          </>
                        )}
                      </h5>
                      <p className="text-[10.5px] leading-relaxed text-slate-300">
                        {rcdIsSuccess 
                          ? RCD_SCENARIOS[rcdScenarioIndex].feedbackCorrect 
                          : RCD_SCENARIOS[rcdScenarioIndex].feedbackIncorrect
                        }
                      </p>
                      
                      <button
                        onClick={nextRcdScenario}
                        className="w-full bg-slate-950 hover:bg-slate-850 text-slate-200 font-bold text-[11px] py-2 rounded-lg mt-3 transition-colors"
                      >
                        {rcdScenarioIndex + 1 < RCD_SCENARIOS.length ? "سناریو بعدی ➔" : "مشاهده نتیجه نهایی کل سناریوها"}
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      disabled={!rcdSelSens || !rcdSelPoles}
                      onClick={submitRcdAnswer}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-850 disabled:text-slate-500 text-slate-950 font-black text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <ShieldCheck className="h-4.5 w-4.5" />
                      فعال‌سازی رله حفاظتی و قطع اتصال
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
