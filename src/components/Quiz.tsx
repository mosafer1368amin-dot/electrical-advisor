import { useState, useMemo } from "react";
import { QuizQuestion } from "../types";
import { 
  HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Award, 
  AlertCircle, Sparkles, BookOpen, Clock, Settings, ShieldCheck, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generate1000Questions } from "../data/questionsGenerator";

// Generate the master pool of 1000 questions
const MASTER_POOL = generate1000Questions();

export default function Quiz() {
  const [quizMode, setQuizMode] = useState<"setup" | "active" | "finished">("setup");
  const [selectedLength, setSelectedLength] = useState<number>(10);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  // Custom states for dynamic search & filtering inside 1000 questions
  const [activeQuestionPool, setActiveQuestionPool] = useState<QuizQuestion[]>([]);
  const [shuffleMode, setShuffleMode] = useState<boolean>(true);

  // Initialize the quiz with selected options
  const startQuiz = () => {
    const storedCustom = localStorage.getItem("custom_quiz_questions");
    let customPool: QuizQuestion[] = [];
    if (storedCustom) {
      try {
        customPool = JSON.parse(storedCustom);
      } catch (e) {
        console.error(e);
      }
    }
    let pool = [...customPool, ...MASTER_POOL];
    
    // If shuffle is active, shuffle the pool deterministically/randomly
    if (shuffleMode) {
      pool.sort(() => Math.random() - 0.5);
    }
    
    // Slice according to selected length (up to 1000)
    setActiveQuestionPool(pool.slice(0, selectedLength));
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizMode("active");
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOpt === null || isAnswered) return;
    
    if (selectedOpt === activeQuestionPool[currentIdx].correctIndex) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    if (currentIdx + 1 < activeQuestionPool.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizMode("finished");
    }
  };

  const restartQuiz = () => {
    setQuizMode("setup");
  };

  const getRank = (finalScore: number, total: number) => {
    const ratio = finalScore / total;
    if (ratio === 1) return { title: "مهندس ارشد ناظر برق ساختمان (فوق لیسانس)", desc: "تسلط ۱۰۰ درصدی به مبحث ۱۳ مقررات ملی ساختمان و استانداردهای نظام مهندسی کشور!", color: "text-amber-400" };
    if (ratio >= 0.8) return { title: "تکنیسین خبره و ماهر برق", desc: "اطلاعات فنی و آکادمیک بسیار قوی. شما آماده اجرا و نظارت بر پروژه‌های بزرگ هستید.", color: "text-emerald-400" };
    if (ratio >= 0.5) return { title: "کمک‌برقکار پرتلاش", desc: "پایه‌های بسیار خوبی بنا کرده‌اید، اما برای قبولی در آزمون نظام مهندسی نیاز به مرور جزئیات بیشتری دارید.", color: "text-blue-400" };
    return { title: "کارآموز علاقه‌مند به مهندسی", desc: "توصیه می‌شود بخش آموزش‌های ویدیویی تعاملی و شبیه‌سازها را مجدداً مرور فرمایید.", color: "text-slate-400" };
  };

  const activeQuestion = activeQuestionPool[currentIdx];

  return (
    <div id="quiz-section" className="bg-[#111318] border border-[#232730] rounded-2xl p-6 text-white" dir="rtl">
      <AnimatePresence mode="wait">
        
        {/* 1. Setup / Selection Screen */}
        {quizMode === "setup" && (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center py-4">
              <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-4">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-100">آزمون جامع و تخصصی مبحث ۱۳ مقررات ملی ساختمان</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
                یک شبیه‌ساز آزمون استاندارد با بانک اطلاعاتی عظیم شامل <span className="text-amber-400 font-bold">۱۰۰۰ سوال کاربردی</span> (مباحث کابل‌کشی، محاسبه افت ولتاژ، جریان نامی کلیدها، هم‌بندی ارت، اعلام حریق و سیستم‌های روشنایی فتوسل).
              </p>
            </div>

            {/* Config Box */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-5">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-900">
                <Settings className="h-4 w-4 text-amber-500" />
                تنظیمات آزمون و تعیین سطح دشواری
              </h3>

              {/* Length selection */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block">تعداد سوالات مورد نظر خود را انتخاب کنید:</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "۱۰ سوال (سریع)", val: 10, desc: "تست فوری و ارزیابی اولیه" },
                    { label: "۳۰ سوال (استاندارد)", val: 30, desc: "شبیه‌ساز واقعی نظام مهندسی" },
                    { label: "۱۰۰ سوال (ماراتن)", val: 100, desc: "آزمون نیمه‌جامع و چالش‌برانگیز" },
                    { label: "۱۰۰۰ سوال (بانک کامل)", val: 1000, desc: "پوشش کل سرفصل‌های مقررات ملّی" }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setSelectedLength(opt.val)}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1.5 ${
                        selectedLength === opt.val
                          ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20"
                          : "bg-slate-900/60 border-slate-900/80 hover:border-slate-800"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{opt.label}</span>
                      <span className="text-[9px] text-slate-500 leading-normal">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced settings */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">ترتیب چیدمان سوالات آزمون:</span>
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setShuffleMode(true)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        shuffleMode ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      تصادفی (سؤالات شافل شده)
                    </button>
                    <button
                      onClick={() => setShuffleMode(false)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        !shuffleMode ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      مرتب شده (از درس اول به بعد)
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  بروزرسانی شده بر اساس آخرین ویرایش مقررات ملی ساختمان
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center">
              <button
                onClick={startQuiz}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                <Flame className="h-5 w-5 fill-slate-950" />
                شروع آزمون جامع با {selectedLength} سوال
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Active Quiz Panel */}
        {quizMode === "active" && activeQuestion && (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: -10, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#232730]">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-bold text-slate-300">سنجش زنده مفاهیم کارگاهی و مهندسی</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-bold hidden md:inline-block">بانک ۱۰۰۰ تایی</span>
                <span className="text-xs bg-slate-950 text-amber-400 border border-slate-800 px-3 py-1 rounded-full font-mono font-bold">
                  سوال {currentIdx + 1} از {activeQuestionPool.length}
                </span>
              </div>
            </div>

            {/* Realtime progress bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-amber-500 h-full transition-all duration-300" 
                style={{ width: `${((currentIdx) / activeQuestionPool.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 mb-5">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-extrabold mb-3 inline-block">
                سؤال آکادمیک شماره {activeQuestion.id}
              </span>
              <h3 className="text-sm md:text-base font-extrabold text-slate-100 leading-relaxed">
                {activeQuestion.question}
              </h3>
            </div>

            {/* Options list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {activeQuestion.options.map((option, idx) => {
                let btnStyle = "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-200";
                
                if (selectedOpt === idx) {
                  btnStyle = "bg-amber-500/10 border-amber-500 text-amber-300 ring-2 ring-amber-500/20";
                }
                
                if (isAnswered) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/10";
                  } else if (selectedOpt === idx) {
                    btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/10";
                  } else {
                    btnStyle = "bg-slate-950/40 border-slate-950 text-slate-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-right p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{option}</span>
                    <div className="flex items-center shrink-0">
                      {isAnswered && idx === activeQuestion.correctIndex && (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                      )}
                      {isAnswered && selectedOpt === idx && idx !== activeQuestion.correctIndex && (
                        <XCircle className="h-4.5 w-4.5 text-rose-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#232730]">
              <div>
                {isAnswered && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    {selectedOpt === activeQuestion.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1">✓ پاسخ شما کاملاً دقیق و صحیح بود.</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">✗ پاسخ اشتباه. جواب تشریحی و استاندارد را بخوانید.</span>
                    )}
                  </div>
                )}
              </div>

              {!isAnswered ? (
                <button
                  disabled={selectedOpt === null}
                  onClick={handleAnswerSubmit}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedOpt !== null
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/10"
                      : "bg-slate-900 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  ثبت پاسخ نهایی
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  {currentIdx + 1 === activeQuestionPool.length ? "مشاهده نتایج نهایی آزمون" : "سوال بعدی"}
                  <ArrowRight className="h-4 w-4 transform rotate-180" />
                </button>
              )}
            </div>

            {/* Explanation card */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-[#161920] rounded-xl border border-[#232730]"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 mb-1">پاسخ تشریحی بر اساس آیین‌نامه‌ها:</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">{activeQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 3. Quiz Finished Screen */}
        {quizMode === "finished" && (
          <motion.div
            key="quiz-finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 flex flex-col items-center"
          >
            <div className="p-4 bg-amber-500/10 rounded-full mb-4 border border-amber-500/20">
              <Award className="h-12 w-12 text-amber-500 animate-bounce" />
            </div>
            
            <h3 className="text-xl font-black mb-2 text-slate-100">آزمون به پایان رسید!</h3>
            <p className="text-xs text-slate-400 mb-4">نتایج سنجش عملکرد شما از بانک جامع ۱۰۰۰ تایی سؤالات مبحث ۱۳</p>
            
            <div className="mb-6">
              <span className="text-slate-500 text-xs font-bold">امتیاز نهایی کسب شده:</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
                {score} <span className="text-slate-500 text-lg">از {activeQuestionPool.length}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl max-w-md w-full mb-6">
              <span className="text-[10px] text-slate-500 block mb-1 font-bold">رده‌بندی و سطح مهارت فنی شما:</span>
              <span className={`text-xs font-extrabold block mb-2 ${getRank(score, activeQuestionPool.length).color}`}>
                {getRank(score, activeQuestionPool.length).title}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">{getRank(score, activeQuestionPool.length).desc}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                بازگشت به صفحه تنظیمات و آزمون مجدد
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
