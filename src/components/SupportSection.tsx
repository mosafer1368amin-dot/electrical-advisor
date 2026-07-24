import React, { useState } from "react";
import { 
  Headphones, Phone, MessageCircle, Send, Instagram, 
  Smartphone, CheckCircle2, User, FileText, ExternalLink, ShieldCheck, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SupportSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "electrical_question",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMessages, setSubmittedMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem("support_offline_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    const newMessage = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString("fa-IR"),
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      status: "در انتظار پاسخ پشتیبانی"
    };

    const updated = [newMessage, ...submittedMessages];
    setSubmittedMessages(updated);
    localStorage.setItem("support_offline_messages", JSON.stringify(updated));
    setIsSubmitted(true);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      subject: "electrical_question",
      message: ""
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const supportContacts = [
    {
      id: "call",
      title: "تماس تلفنی مستقیم",
      value: "۰۹۱۹۶۶۴۱۶۹۲",
      raw: "09196641692",
      description: "پاسخگویی مستقیم مهندس امین ادیسون جهت مشاوره‌های تخصصی و پروژه‌ای برق",
      actionText: "تماس تلفنی با مهندس",
      actionUrl: "tel:09196641692",
      icon: Phone,
      colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
      btnClass: "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
    },
    {
      id: "whatsapp",
      title: "پشتیبانی در واتساپ",
      value: "ارسال پیام در واتساپ",
      raw: "09196641692",
      description: "ارسال سریع تصاویر مدارها، نقشه‌های اجرایی ساختمان و هماهنگی دوره‌های آموزشی",
      actionText: "گفتگو در واتساپ",
      actionUrl: "https://wa.me/989196641692?text=سلام%20مهندس%20وقت%20بخیر%20جهت%20پشتیبانی%20پروژه%20برق%20مزاحم%20میشم",
      icon: MessageCircle,
      colorClass: "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20",
      btnClass: "bg-green-500 hover:bg-green-400 text-slate-950"
    },
    {
      id: "telegram",
      title: "ارتباط تلگرامی",
      value: "amin_adison@ / ۰۹۱۹۶۶۴۱۶۹۲",
      raw: "amin_adison",
      description: "ارسال فایل‌های اتوکد نقشه‌کشی، پی‌دی‌اف‌های محاسباتی و پاسخ سریع سوالات کارآموزان",
      actionText: "ارسال پیام تلگرام",
      actionUrl: "https://t.me/amin_adison",
      icon: Send,
      colorClass: "bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20",
      btnClass: "bg-sky-500 hover:bg-sky-400 text-slate-950"
    },
    {
      id: "instagram",
      title: "صفحه اینستاگرام",
      value: "amin_adison@",
      raw: "amin_adison",
      description: "مشاهده ویدیوهای کوتاه آموزشی، آموزش‌های کارگاهی زنده، ابزارشناسی و ترفندهای بازارکار",
      actionText: "دنبال کردن در اینستاگرام",
      actionUrl: "https://instagram.com/amin_adison",
      icon: Instagram,
      colorClass: "bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/20",
      btnClass: "bg-pink-500 hover:bg-pink-400 text-slate-950"
    }
  ];

  const faqs = [
    {
      q: "چگونه می‌توانم با پشتیبانی در ارتباط باشم؟",
      a: "شما می‌توانید از طریق تماس مستقیم تلفنی به شماره 09196641692 یا پیام‌رسان‌های تلگرام، واتساپ و دایرکت اینستاگرام با کارشناسان و مهندس امین ادیسون گفتگو کنید."
    },
    {
      q: "ساعات پاسخگویی بخش پشتیبانی فنی به چه صورت است؟",
      a: "پاسخگویی تلفنی از شنبه تا پنجشنبه از ساعت ۹ صبح الی ۱۹ عصر فعال است. در پیام‌رسان‌های تلگرام و واتساپ نیز به صورت ۲۴ ساعته می‌توانید پیام بگذارید تا در اسرع وقت پاسخ داده شود."
    },
    {
      q: "آیا مشاوره در خصوص نقشه‌های اجرایی نظام مهندسی رایگان است؟",
      a: "بله، راهنمایی اولیه و رفع ابهام در خصوص بندهای مبحث ۱۳ مقررات ملی ساختمان و نقشه‌کشی‌های عمومی از طرف تیم پشتیبانی به صورت رایگان انجام می‌شود."
    },
    {
      q: "چگونه خطاهای کار با شبیه‌ساز یا پنل آموزش را گزارش کنم؟",
      a: "از فرم ثبت تیکت آفلاین زیر استفاده کنید یا عکس خطا را به تلگرام یا واتساپ شماره پشتیبانی ارسال فرمایید تا کمتر از ۲ ساعت عیب‌یابی شود."
    }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Main Glassmorphic Header */}
      <div className="bg-gradient-to-l from-amber-500/15 via-slate-950 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px" }}></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2.5 py-1 rounded-full border border-amber-500/20 font-black flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                مرکز پشتیبانی کارآموزان و مهندسان
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight">با پشتیبانی تخصصی در ارتباط باشید</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              هرگونه سوال فنی در خصوص سیم‌کشی برق ساختمان، استانداردهای مبحث ۱۳، شبیه‌سازهای کارگاهی و دوره‌های آموزشی دارید را مستقیماً با ما در میان بگذارید.
            </p>
          </div>
          <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-center md:min-w-[180px]">
            <Smartphone className="h-6 w-6 text-amber-500 mb-2 animate-bounce" />
            <span className="text-[10px] text-slate-500 block">تلفن پشتیبانی مستقیم</span>
            <span className="text-base font-black text-white font-mono mt-0.5 select-all leading-normal" dir="ltr">0919 664 1692</span>
            <span className="text-[9px] text-emerald-400 font-bold mt-1">● پاسخگویی آنلاین فعال</span>
          </div>
        </div>
      </div>

      {/* 2. Responsive 4-Column Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportContacts.map((contact) => {
          const IconComp = contact.icon;
          return (
            <motion.div
              key={contact.id}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${contact.colorClass}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{contact.title}</h3>
                    <span className="text-[10px] font-mono font-bold block opacity-90 mt-0.5" dir="ltr">{contact.value}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed min-h-[44px]">
                  {contact.description}
                </p>
              </div>

              <a
                href={contact.actionUrl}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 shadow-md ${contact.btnClass}`}
              >
                <span>{contact.actionText}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Dynamic Interactive Feedback & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offline Ticket Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
            <FileText className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-xs font-black text-white">ارسال پیام آفلاین و درخواست تماس</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">در صورت عدم دسترسی به پیام‌رسان‌ها، مشخصات خود را بگذارید تا با شما تماس بگیریم.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 font-bold">نام و نام خانوادگی:</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: رضا محمدی"
                    className="w-full bg-slate-950 text-white rounded-xl pr-3 pl-10 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 font-bold">شماره تماس (جهت پیگیری یا واتساپ):</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="مثال: 09123456789"
                    className="w-full bg-slate-950 text-white rounded-xl pr-3 pl-10 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none text-right font-mono"
                  />
                  <Smartphone className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 font-bold">موضوع پیام یا اشکال:</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-950 text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
              >
                <option value="electrical_question">سوال علمی درباره سیم‌کشی یا مبحث ۱۳</option>
                <option value="app_bug">گزارش اشکال یا باگ در برنامه یا شبیه‌ساز</option>
                <option value="training_course">مشاوره درباره دوره‌های آموزش برق کارگاهی</option>
                <option value="suggestion">پیشنهادات و انتقادات جهت ارتقای سامانه</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 font-bold">متن پیام تفصیلی:</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="لطفاً شرح کامل سوال یا چالش خود را در این بخش بنویسید..."
                className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
              />
            </div>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-emerald-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-bold">پیام شما با موفقیت ثبت شد! کارشناسان به زودی با شما تماس خواهند گرفت.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>ارسال نهایی پیام پشتیبانی</span>
            </button>
          </form>
        </div>

        {/* Saved Tickets & History List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* History Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black block mb-3 uppercase tracking-wider">سوابق تیکت‌ها و پیام‌ها</span>
              
              {submittedMessages.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center p-4">
                  <FileText className="h-7 w-7 text-slate-700 mb-2" />
                  <span className="text-[10px] text-slate-500 font-bold leading-relaxed">تاکنون تیکت یا درخواستی به صورت آفلاین ثبت نکرده‌اید.</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {submittedMessages.map((msg: any) => (
                    <div key={msg.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-300 font-black">{msg.name}</span>
                        <span className="bg-amber-500/10 text-amber-500 text-[8px] font-bold px-1.5 py-0.5 rounded">
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                      <div className="flex items-center justify-between text-[8px] text-slate-600 font-mono">
                        <span>{msg.date}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submittedMessages.length > 0 && (
              <button
                onClick={() => {
                  setSubmittedMessages([]);
                  localStorage.removeItem("support_offline_messages");
                }}
                className="text-[9px] text-rose-500 hover:underline hover:text-rose-400 font-bold mt-4 text-center block w-full"
              >
                پاک کردن تاریخچه پیام‌ها
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. FAQs accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-4">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <div>
            <h3 className="text-xs font-black text-white">سوالات متداول کاربران (FAQs)</h3>
            <p className="text-[9px] text-slate-500 mt-0.5">پاسخ متداول‌ترین سوالات درباره کارگاه، گواهی‌ها و خدمات پشتیبانی</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 space-y-2">
              <h4 className="text-xs font-black text-amber-400 flex items-start gap-2 leading-relaxed">
                <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold h-5 w-5 rounded flex items-center justify-center shrink-0">?</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed pr-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
