import React, { useState } from "react";
import { 
  Wrench, Phone, MessageSquare, Send, MapPin, Clock, CheckCircle2, 
  User, Sparkles, PhoneCall, AlertTriangle, AlertCircle, BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function JobRequestSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "electrical_fault",
    neighborhood: "",
    urgency: "urgent",
    description: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<number | null>(null);

  // Quick categories definitions
  const serviceCategories = [
    { value: "electrical_fault", label: "اتصالی برق و رفع عیب سیم‌کشی" },
    { value: "reconstruction", label: "بازسازی و سیم‌کشی کامل ساختمان" },
    { value: "lighting_install", label: "نصب کلید، پریز، لوستر و هالوژن" },
    { value: "intercom_systems", label: "نصب و تعمیر آیفون صوتی و تصویری" },
    { value: "smart_home", label: "هوشمندسازی، نصب دزدگیر و دوربین مداربسته" },
    { value: "ac_wiring", label: "کابل‌کشی کولر گازی و راه‌اندازی کولر آبی" },
    { value: "industrial_electrical", label: "برق صنعتی، مونتاژ تابلو برق و عیب‌یابی" }
  ];

  const getServiceLabel = (val: string) => {
    return serviceCategories.find(c => c.value === val)?.label || "سایر خدمات برقی";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.description) return;

    const newRequest = {
      ...formData,
      id: Date.now(),
      status: "pending", // pending, processing, completed
      date: new Date().toLocaleDateString("fa-IR"),
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    };

    // Save to local storage list
    const existing = localStorage.getItem("client_job_requests");
    const list = existing ? JSON.parse(existing) : [];
    const updated = [newRequest, ...list];
    localStorage.setItem("client_job_requests", JSON.stringify(updated));

    // Store submit confirmation
    setLastSubmittedId(newRequest.id);
    setIsSubmitted(true);
  };

  // Helper to build pre-filled SMS text
  const getSmsUrl = () => {
    const text = `سلام مهندس امین ادیسون.\nدرخواست کار برقکاری دارم:\n👤 نام: ${formData.name}\n📞 تلفن: ${formData.phone}\n🛠️ نوع کار: ${getServiceLabel(formData.serviceType)}\n📍 محدوده: ${formData.neighborhood || "ذکر نشده"}\n🚨 اولویت: ${formData.urgency === "urgent" ? "فوری (نیازمند عیب‌یابی)" : "عادی"}\n📝 شرح کار: ${formData.description}`;
    return `sms:09196641692?body=${encodeURIComponent(text)}`;
  };

  // Helper to build pre-filled WhatsApp text
  const getWhatsAppUrl = () => {
    const text = `سلام مهندس امین ادیسون وقت بخیر.\nیک درخواست کار برقی در سامانه ثبت کردم:\n\n👤 *نام مشتری:* ${formData.name}\n📞 *تلفن تماس:* ${formData.phone}\n🛠️ *نوع کار:* ${getServiceLabel(formData.serviceType)}\n📍 *محدوده:* ${formData.neighborhood || "ذکر نشده"}\n🚨 *اولویت:* ${formData.urgency === "urgent" ? "🔴 فوری" : "🟢 عادی"}\n📝 *شرح کار:* ${formData.description}`;
    return `https://wa.me/989196641692?text=${encodeURIComponent(text)}`;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      serviceType: "electrical_fault",
      neighborhood: "",
      urgency: "urgent",
      description: ""
    });
    setIsSubmitted(false);
    setLastSubmittedId(null);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-slate-950 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] px-2.5 py-1 rounded-full font-black flex items-center gap-1 uppercase tracking-wider">
                <Wrench className="h-3 w-3" />
                سامانه هوشمند اعزام برقکار
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                فعال سراسر تهران و البرز
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight">درخواست استادکار برق ساختمان (مهندس امین ادیسون)</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              اگر دچار اتصالی برق، قطعی فیوز مینیاتوری، خرابی آیفون تصویری شده‌اید یا نیاز به سیم‌کشی کامل، نورپردازی مدرن و هوشمندسازی دارید، همین حالا اطلاعات کار را ثبت کنید.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="tel:09196641692"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <PhoneCall className="h-4.5 w-4.5 animate-pulse" />
              <span>تماس فوری: ۰۹۱۹۶۶۴۱۶۹۲</span>
            </a>
            <span className="text-[10px] text-slate-500 text-center font-bold">پاسخگویی و اعزام سریع در سریع‌ترین زمان</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Instructions and Quick Benefits */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white flex items-center gap-2 pb-2.5 border-b border-slate-800">
              <Sparkles className="h-4 w-4 text-amber-500" />
              چرا مهندس امین ادیسون؟
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold">۱</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-200">سرعت بالا در عیب‌یابی</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">اعزام استادکار مجهز به ابزارهای پیشرفته تست مدار جهت پیدا کردن دقیق اتصالی در کمترین زمان.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold">۲</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-200">رعایت استانداردهای نظام مهندسی</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">کلیه سیم‌کشی‌ها، فواصل، مقادیر آمپر مینیاتورها و سیم ارت دقیقا بر اساس مبحث ۱۳ انجام می‌شود.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 font-bold">۳</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-200">تجهیزات و متریال مرغوب</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">استفاده انحصاری از سیم‌های مسی استاندارد و کلیدهای حفاظتی و فیوزهای معتبر بازار.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-4.5 w-4.5" />
              <h4 className="text-xs font-black">هشدار ایمنی حیاتی!</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              در صورت بروز هرگونه اتصالی شدید، استشمام بوی سوختگی پلاستیک از پریزها یا تابلوی مینیاتوری، ابتدا فیوز کلید محافظ جان (RCD) یا کلید مینیاتوری کل خانه را فوراً قطع کرده و به هیچ وجه شخصاً اقدام به دستکاری سیم‌ها نکنید.
            </p>
          </div>
        </div>

        {/* Right Side: Request Form or Success Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6"
              >
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-xs font-black text-white">فرم ثبت جزئیات کار و اعزام برقکار</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">لطفاً موارد زیر را با دقت تکمیل کنید تا نزدیک‌ترین تیم فنی با ابزار کامل اعزام گردد.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">نام و نام خانوادگی متقاضی:</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="مثال: علیرضا حسینی"
                          className="w-full bg-slate-950 text-white rounded-xl pr-3 pl-10 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">شماره تماس جهت هماهنگی:</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="مثال: 09121234567"
                          className="w-full bg-slate-950 text-white rounded-xl pr-3 pl-10 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none font-mono text-right"
                        />
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Type */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">نوع خدمات مورد نیاز شما:</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      >
                        {serviceCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold">اولویت و فوریت کار:</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border cursor-pointer transition-all ${
                          formData.urgency === "urgent"
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 font-black"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}>
                          <input
                            type="radio"
                            name="urgency"
                            value="urgent"
                            checked={formData.urgency === "urgent"}
                            onChange={() => setFormData({ ...formData, urgency: "urgent" })}
                            className="hidden"
                          />
                          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                          <span>فوری (اتصالی/قطعی برق)</span>
                        </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border cursor-pointer transition-all ${
                          formData.urgency === "normal"
                            ? "bg-blue-500/10 border-blue-500 text-blue-400 font-black"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}>
                          <input
                            type="radio"
                            name="urgency"
                            value="normal"
                            checked={formData.urgency === "normal"}
                            onChange={() => setFormData({ ...formData, urgency: "normal" })}
                            className="hidden"
                          />
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          <span>عادی (بازسازی/نصب)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Neighborhood */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold">محدوده محل سکونت یا کارگاه (شهر، منطقه، محله):</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        placeholder="مثال: تهرانپارس، نیاوران، کرج عظیمیه و ..."
                        className="w-full bg-slate-950 text-white rounded-xl pr-3 pl-10 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold">توضیحات تکمیلی و شرح کار (برای عیب‌یابی دقیق):</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="توضیح دهید دقیقا چه مشکلی پیش آمده یا چه پروژه‌ای دارید. مثلا: برق نیمی از پذیرایی قطع شده و فیوز مینیاتوری بالا نمی‌ایستد..."
                      className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    <BookmarkCheck className="h-4.5 w-4.5" />
                    <span>ثبت نهایی درخواست و اعلام به مهندس</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 md:p-8 text-center space-y-6"
              >
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white">درخواست کار شما با موفقیت ثبت گردید!</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    اطلاعات کار به بانک داده سراسری ارسال شد و در پنل استادکار قرار گرفت. برای سرعت‌بخشی حداکثری و نمایش مستقیم تیکت روی گوشی موبایل مهندس، یکی از گزینه‌های زیر را انتخاب کنید:
                  </p>
                </div>

                {/* Highly Interactive Actions to send to Electrician's phone immediately */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 hover:bg-green-400 text-slate-950 p-4 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span>ارسال جزئیات در واتساپ مهندس</span>
                    <span className="text-[9px] opacity-80 font-normal">ارسال سریع جزئیات، عکس و لوکیشن</span>
                  </a>

                  <a
                    href={getSmsUrl()}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 p-4 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-sky-500/20"
                  >
                    <Send className="h-6 w-6" />
                    <span>ارسال پیامک (SMS) مستقیم</span>
                    <span className="text-[9px] opacity-80 font-normal">ارسال مستقیم جزئیات کار به سیم‌کارت</span>
                  </a>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto">
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-amber-500 hover:underline font-bold"
                  >
                    ثبت یک درخواست کار دیگر
                  </button>
                  <a
                    href="tel:09196641692"
                    className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 px-4 py-2 rounded-lg text-[11px] font-bold"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    <span>برقراری تماس مستقیم تلفنی</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
