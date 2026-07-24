import { useState } from "react";
import { BookOpen, Search, Filter, ShieldAlert, CheckCircle } from "lucide-react";

interface CodeTopic {
  id: string;
  mabhath: "13" | "14";
  section: string;
  title: string;
  summary: string;
  clauses: string[];
  safetyLevel: "high" | "medium" | "low";
}

export default function BuildingCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMabhath, setSelectedMabhath] = useState<"all" | "13" | "14">("all");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics: CodeTopic[] = [
    {
      id: "m13-1",
      mabhath: "13",
      section: "سیستم ارتینگ و هم‌بندی (Earthing)",
      title: "مقررات کلی الکترود زمین و هم‌بندی اصلی ساختمان",
      summary: "اتصال تمامی بدنه هادی دستگاه‌ها به هادی حفاظتی و اتصال آن به سیستم ارت و هم‌بندی اصلی فلزی جهت پیشگیری از برق‌گرفتگی.",
      clauses: [
        "بند ۱۳-۲-۲-۱: هم‌بندی اصلی شامل اتصال اسکلت فلزی ساختمان، لوله‌های فلزی گاز و آب و فونداسیون به شینه ارت مرکزی است.",
        "بند ۱۳-۳-۱-۴: در کلیه مدارها، عبور هادی ارت (PE) همراه با سیم‌های فاز و نول در کاندوئیت الزامی است.",
        "بند ۱۳-۳-۴: مقاومت مجاز الکترود زمین ساختمان مسکونی نباید از ۲ اهم تجاوز کند."
      ],
      safetyLevel: "high"
    },
    {
      id: "m13-2",
      mabhath: "13",
      section: "کلید محافظ جان (RCD)",
      title: "الزامات نصب کلید جریان تفاضلی (محافظ جان) در ساختمان‌ها",
      summary: "پیشگیری از مرگ ناشی از تماس غیرمستقیم با جریان نشتی با قطع آنی در کمتر از ۲۰۰ میلی‌ثانیه.",
      clauses: [
        "بند ۱۳-۴-۱: جریان باقیمانده عملکرد کلیدهای RCD برای مدارهای عمومی مسکونی و پریزها باید حداکثر ۳۰ میلی‌آمپر باشد.",
        "بند ۱۳-۴-۳: برای حفاظت کلان ورودی ساختمان از خطر آتش‌سوزی الکتریکی، نصب کلید جریان نشتی ۳۰۰ میلی‌آمپر الزامی است.",
        "بند ۱۳-۴-۵: کلید محافظ جان هرگز نباید بدون وجود سیم ارت نصب و استفاده شود."
      ],
      safetyLevel: "high"
    },
    {
      id: "m13-3",
      mabhath: "13",
      section: "مدارهای فرعی و پریزها",
      title: "ظرفیت جریان مجاز سیم‌کشی‌ها و لوله‌گذاری",
      summary: "دستورالعمل‌های استاندارد در مورد جریان دهی، سایزهای مجاز و فاکتور لوله‌های برق.",
      clauses: [
        "بند ۱۳-۵-۲: حداقل سطح مقطع سیم هادی برای بارهای روشنایی ۱.۵ و برای بارهای پریز ۲.5 میلی‌متر مربع است.",
        "بند ۱۳-۵-۶: تعداد پریزهای متصل به یک فیوز مینیاتوری ۱۶ آمپر نباید بیشتر از ۱۲ عدد باشد.",
        "بند ۱۳-۵-۹: در هر جعبه تقسیم یا لوله برق، مخلوط کردن سیم‌های مدارهای مختلف ممنوع است."
      ],
      safetyLevel: "medium"
    },
    {
      id: "m14-1",
      mabhath: "14",
      section: "تجهیزات گرمایشی و سرمایشی",
      title: "مقررات تاسیسات برقی کولرهای گازی و چیلرها",
      summary: "سیم‌کشی اختصاصی و مستقل برای سیستم‌های تهویه مطبوع، هواسازها و چیلرها طبق استانداردهای سرمایشی.",
      clauses: [
        "بند ۱۴-۳-۱: کولر گازی (اسپلیت) باید دارای خط مستقل تغذیه با کابل حداقل ۴ میلی‌متر مربع و فیوز مناسب بیست آمپر باشد.",
        "بند ۱۴-۴-۲: سیم ارت جداگانه به همراه کابل تغذیه اصلی به کل بدنه کندانسور و اوپراتور کولر گازی متصل گردد.",
        "بند ۱۴-۶-۱: کلیه کلیدهای حفاظتی موتورهای کمپرسور باید از نوع کندکار (تیپ C) باشند."
      ],
      safetyLevel: "medium"
    },
    {
      id: "m14-2",
      mabhath: "14",
      section: "سیستم‌های کانال و هواکش",
      title: "تغذیه موتور دمپرهای حریق و هواسازها",
      summary: "برق‌رسانی اضطراری به دمپرهای حریق و فن‌های تخلیه دود پله فرار در مواقع بحرانی.",
      clauses: [
        "بند ۱۴-۸-۱: کابل تغذیه فن‌های فشار مثبت راه‌پله و دمپرهای دود باید از نوع نسوز (شیلد دار سیلیکونی) باشد.",
        "بند ۱۴-۸-۳: تغذیه این فن‌ها باید مستقیم از تابلو توزیع فرعی دیزل ژنراتور اضطراری ساختمان منشعب شود.",
        "بند ۱۴-۹-۱: نصب ترموستات‌های چند مرحله‌ای روی کوره هوای گرم جهت قطع اضطراری فن در صورت خاموشی مشعل الزامی است."
      ],
      safetyLevel: "high"
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMabhath = selectedMabhath === "all" || topic.mabhath === selectedMabhath;

    return matchesSearch && matchesMabhath;
  });

  return (
    <div id="building-codes-section" className="bg-[#111318] border border-[#232730] rounded-2xl p-6 text-white" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-[#232730] gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-amber-500" />
            سامانه مرجع قوانین و مقررات ملی ساختمان (مباحث ۱۳ و ۱۴)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            خلاصه آموزشی ضوابط ایمنی برق و سیم‌کشی تاسیسات مکانیکی و سرمایشی، مورد تایید سازمان نظام مهندسی ساختمان ایران
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی بند یا موضوع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161920] text-white placeholder-slate-500 rounded-lg pr-10 pl-4 py-2 text-xs border border-[#232730] focus:outline-none focus:border-amber-500"
          />
          <Search className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-500" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMabhath("all")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              selectedMabhath === "all" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}
          >
            همه مباحث
          </button>
          <button
            onClick={() => setSelectedMabhath("13")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              selectedMabhath === "13" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}
          >
            مبحث ۱۳ (برق)
          </button>
          <button
            onClick={() => setSelectedMabhath("14")}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              selectedMabhath === "14" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}
          >
            مبحث ۱۴ (مکانیک)
          </button>
        </div>

        <div className="bg-[#161920] border border-[#232730] p-2 rounded-lg flex items-center justify-between text-xs text-slate-400">
          <span>تعداد سرفصل‌های یافت شده:</span>
          <span className="font-extrabold text-amber-500">{filteredTopics.length} مورد</span>
        </div>
      </div>

      {/* Topics Split list and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Topics List */}
        <div className="lg:col-span-1 space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedTopic === topic.id
                  ? "bg-amber-500/10 border-amber-500"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  topic.mabhath === "13" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  مبحث {topic.mabhath}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  topic.safetyLevel === "high" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400"
                }`}>
                  {topic.safetyLevel === "high" ? "حیاتی / خطر جانی" : "مهم فنی"}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">{topic.title}</h4>
              <span className="text-[10px] text-slate-500 block">{topic.section}</span>
            </div>
          ))}
          {filteredTopics.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">موضوعی متناسب با جستجوی شما یافت نشد.</div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2">
          {selectedTopic ? (
            (() => {
              const topic = topics.find((t) => t.id === selectedTopic);
              if (!topic) return null;
              return (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-500">{topic.section}</span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{topic.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-extrabold ${
                      topic.mabhath === "13" ? "bg-blue-500/10 text-blue-300" : "bg-rose-500/10 text-rose-300"
                    }`}>
                      مقررات ملی مبحث {topic.mabhath}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                      شرح و خلاصه آیین‌نامه فنی:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#161920] p-3 rounded-lg border border-[#232730]">
                      {topic.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      بندهای تفصیلی و استانداردهای بازرسی ناظر:
                    </h4>
                    <div className="space-y-2">
                      {topic.clauses.map((clause, idx) => (
                        <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2.5">
                          <span className="bg-slate-800 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{clause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-xl p-16 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <BookOpen className="h-10 w-10 text-slate-800 mb-2" />
              <p className="text-xs text-slate-500">جهت مشاهده جزئیات آیین‌نامه‌ها، بندها و نکات بازرسی مبحث ۱۳ و ۱۴، یکی از موضوعات را از لیست سمت راست انتخاب کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
