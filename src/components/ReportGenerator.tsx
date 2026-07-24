import { useState, FormEvent } from "react";
import { FileText, Printer, CheckCircle, AlertTriangle, ShieldCheck, Plus, RefreshCw } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: "mabhath-13" | "mabhath-14" | "general";
  text: string;
  mandatory: boolean;
  checked: boolean;
}

export default function ReportGenerator() {
  // Project Info
  const [projectName, setProjectName] = useState("پروژه مسکونی لاله ۱");
  const [contractor, setContractor] = useState("مهندس علوی");
  const [inspector, setInspector] = useState("مهندس حسینی");
  const [location, setLocation] = useState("تهران، خیابان شریعتی، کوچه بهار");
  const [buildingType, setBuildingType] = useState("residential");

  // Checklist Items
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "item-1", category: "mabhath-13", text: "تست مقاومت چاه ارت اصلی ساختمان و اخذ تاییدیه زیر ۲ اهم", mandatory: true, checked: true },
    { id: "item-2", category: "mabhath-13", text: "نصب کلیدهای محافظ جان (RCD) با حساسیت ۳۰ میلی‌آمپر برای مدارهای عمومی", mandatory: true, checked: true },
    { id: "item-3", category: "mabhath-13", text: "استفاده از سیم‌کشی هادی با سطح مقطع حداقل ۲.۵ برای مدارهای پریز برق", mandatory: true, checked: true },
    { id: "item-4", category: "mabhath-13", text: "استفاده از سیم‌کشی هادی با سطح مقطع حداقل ۱.۵ برای مدارهای روشنایی فرعی", mandatory: true, checked: true },
    { id: "item-5", category: "mabhath-13", text: "تست نشت جریان و هم‌بندی اصلی و کمکی سازه فلزی و فونداسیون", mandatory: true, checked: false },
    { id: "item-6", category: "mabhath-13", text: "رعایت فاکتور پرشدگی کاندوئیت‌ها زیر ۴۰٪ ظرفیت مفید داخلی لوله‌های برق", mandatory: false, checked: true },
    { id: "item-7", category: "mabhath-14", text: "سیم‌کشی اختصاصی کابل کولر گازی به صورت مستقیم با فیوز ۲۰ آمپر", mandatory: true, checked: true },
    { id: "item-8", category: "mabhath-14", text: "نصب کابل سیلیکونی نسوز شیلددار برای دمپرها و هواسازهای تخلیه دود پله فرار", mandatory: true, checked: false },
    { id: "item-9", category: "general", text: "برچسب‌گذاری و عایق‌بندی فاز و نول روی فینگر برد جعبه فیوز مینیاتوری", mandatory: false, checked: true },
  ]);

  const [customItemText, setCustomItemText] = useState("");

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addCustomItem = (e: FormEvent) => {
    e.preventDefault();
    if (!customItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      category: "general",
      text: customItemText,
      mandatory: false,
      checked: true
    };

    setItems([...items, newItem]);
    setCustomItemText("");
  };

  const resetChecklist = () => {
    setItems(items.map(item => ({ ...item, checked: false })));
  };

  // Calculations
  const totalItems = items.length;
  const checkedItems = items.filter(i => i.checked).length;
  const mandatoryUnchecked = items.filter(i => i.mandatory && !i.checked).length;
  const complianceScore = Math.round((checkedItems / totalItems) * 100);

  const printReport = () => {
    window.print();
  };

  return (
    <div id="report-generator-section" className="bg-[#111318] border border-[#232730] rounded-2xl p-6 text-white" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-[#232730] gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <FileText className="h-6 w-6 text-amber-500" />
            سیستم صدور چک‌لیست و گزارش بازرسی ساختمان (مبحث ۱۳)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بررسی و صدور گواهی صلاحیت ایمنی برقی تاسیسات ساختمانی جهت اخذ پایان کار ساختمانی از سازمان نظام مهندسی
          </p>
        </div>
        <button
          onClick={printReport}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/10 self-start md:self-auto"
        >
          <Printer className="h-4 w-4" />
          چاپ و خروجی PDF گزارش
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Project Meta */}
        <div className="lg:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-900">مشخصات عمومی پرونده کارگاهی</h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">نام پروژه ساختمانی:</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">پیمانکار مجری برق:</label>
              <input
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">مهندس ناظر تاسیسات:</label>
              <input
                type="text"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">آدرس و پلاک ثبتی:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold">کاربری سازه:</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-500 text-white"
              >
                <option value="residential">مسکونی آپارتمانی</option>
                <option value="commercial">اداری / تجاری</option>
                <option value="industrial">کارگاهی / صنعتی</option>
              </select>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-[#161920] border border-[#232730] p-4 rounded-xl space-y-3 text-xs">
            <span className="font-bold text-slate-300 block">امتیاز انطباق با مبحث ۱۳:</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{complianceScore}%</span>
              <span className="text-[10px] text-slate-500 font-semibold">مجموع {totalItems} بند ارزیابی</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${complianceScore}%` }} />
            </div>

            {/* Compliance state tag */}
            <div className="pt-1.5">
              {mandatoryUnchecked > 0 ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded p-2.5 flex items-start gap-1.5 text-rose-400 text-[10px]">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>تعداد {mandatoryUnchecked} بند حیاتی و الزامی تایید نشده است. گواهی صادر نمی‌شود.</span>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2.5 flex items-start gap-1.5 text-emerald-400 text-[10px]">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>کلیه بندهای الزامی رعایت شده است. تاسیسات برق مورد تایید است.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Checklist & Printable Report */}
        <div className="lg:col-span-2 space-y-5">
          {/* Interactive Checklist Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold text-slate-300">ارزیابی گام‌به‌گام استانداردهای برقی</h3>
              <button
                onClick={resetChecklist}
                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                خالی کردن چک‌لیست
              </button>
            </div>

            {/* Checklist Items Rows */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    item.checked
                      ? "bg-[#161920] border-emerald-500/30 text-slate-200"
                      : "bg-[#111318]/40 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}} // toggled by outer click
                    className="mt-0.5 accent-amber-500 h-3.5 w-3.5 shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs leading-relaxed font-semibold">{item.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-1.5 rounded font-bold ${
                        item.category === "mabhath-13" ? "bg-blue-500/10 text-blue-400" : item.category === "mabhath-14" ? "bg-rose-500/10 text-rose-400" : "bg-slate-800 text-slate-500"
                      }`}>
                        {item.category === "mabhath-13" ? "مبحث ۱۳" : item.category === "mabhath-14" ? "مبحث ۱۴" : "عمومی"}
                      </span>
                      {item.mandatory && (
                        <span className="text-[9px] text-rose-400 font-extrabold bg-rose-500/10 px-1.5 rounded">
                          الزامی نظام مهندسی
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={addCustomItem} className="flex gap-2">
              <input
                type="text"
                placeholder="افزودن بند سفارشی کارگاهی..."
                value={customItemText}
                onChange={(e) => setCustomItemText(e.target.value)}
                className="flex-1 bg-[#161920] border border-[#232730] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-slate-850 hover:bg-slate-750 text-slate-300 border border-slate-700 px-3 rounded-lg flex items-center justify-center gap-1 text-xs font-bold"
              >
                <Plus className="h-4 w-4" />
                افزودن بند
              </button>
            </form>
          </div>

          {/* Printable Report preview block */}
          <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-200 space-y-4 shadow-xl text-right">
            <div className="text-center border-b-2 border-slate-800 pb-3">
              <h2 className="text-sm font-black text-slate-900">گزارش تایید فنی تاسیسات برقی ساختمان</h2>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">مطابق با استانداردهای مبحث ۱۳ مقررات ملی ساختمان ایران</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <span className="font-bold text-slate-500">نام پروژه:</span> <span className="font-black text-slate-900">{projectName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">تاریخ ارزیابی:</span> <span className="font-black text-slate-900">۱۴۰۵/۰۴/۲۵</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">مجری برق:</span> <span className="font-black text-slate-900">{contractor}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">مهندس ناظر برق:</span> <span className="font-black text-slate-900">{inspector}</span>
              </div>
              <div className="col-span-2">
                <span className="font-bold text-slate-500">آدرس پروژه:</span> <span className="font-black text-slate-900">{location}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-800 block">نتایج ممیزی بندهای ایمنی:</span>
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-[9px] text-right">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                      <th className="p-2">بند ارزیابی فنی تاسیسات</th>
                      <th className="p-2 text-center">نوع</th>
                      <th className="p-2 text-center">نتیجه نهایی</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">{item.text}</td>
                        <td className="p-2 text-center text-slate-500">{item.mandatory ? "الزامی" : "اختیاری"}</td>
                        <td className="p-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded-full font-black text-[8px] ${
                            item.checked ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {item.checked ? "تایید شد" : "نقص فنی"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-[10px] font-bold text-slate-700">
              <div className="flex flex-col gap-1">
                <span>امتیاز انطباق: {complianceScore}%</span>
                <span>تعداد موارد نقص: {totalItems - checkedItems} مورد</span>
              </div>
              <div className="text-left">
                <span>امضاء مهندس ناظر برق:</span>
                <div className="h-8 border-b-2 border-dashed border-slate-300 w-32 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
