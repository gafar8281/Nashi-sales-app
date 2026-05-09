import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, CalendarCheck, Clock, LogIn, LogOut, Target, UserRound } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { loginEmployee, type Employee } from "@/lib/authService";
import {
  saveCheckIn,
  saveCheckOut,
  getAttendanceHistory,
  type AttendanceRecord,
} from "@/lib/attendanceService";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AttendanceStatus = "not-started" | "checked-in" | "checked-out";
type Section = "home" | "attendance" | "targets" | "profile" | "notices";
type Lang = "en" | "ar";

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------
const translations = {
  en: {
    // Brand
    brand: "Nashi Gold Jewellery",
    appTitle: "Sales Management",

    // Auth
    salesmanLogin: "Salesman Login",
    employeeId: "Employee ID",
    password: "Password",
    login: "Login",
    verifying: "Verifying…",
    logout: "Logout",

    // Confirm dialog
    confirm: "Confirm",
    confirmCheckIn: "Do you want to start your duty or not?",
    confirmCheckOut: "Do you want to end your duty or not?",
    confirmLogout: "Are you sure you want to log out?",
    yes: "Yes",
    no: "No",

    // Status
    notCheckedIn: "Not checked in",
    checkedIn: "Checked in",
    checkedOut: "Checked out",

    // Header tiles
    today: "Today",
    monthlyTarget: "Monthly Target",

    // Buttons
    checkIn: "Check In",
    checkOut: "Check Out",
    saving: "Saving…",

    // Nav
    home: "Home",
    attendance: "Attendance",
    targets: "Targets",
    profile: "Profile",
    notice: "Notice",

    // Home panels
    attendanceTitle: "Attendance",
    salesTargets: "Sales Targets",
    latestNotice: "Latest Notice",
    openAttendance: "Open attendance",
    viewTargets: "View targets",
    readNotices: "Read notices",
    monthlyTargetLabel: "Monthly Target",

    // Attendance section
    todaysAttendance: "Today's Attendance",
    checkInLabel: "Check In",
    checkOutLabel: "Check Out",
    attendanceHistory: "Attendance History",
    loadingHistory: "Loading history…",
    noRecords: "No attendance records found.",
    inLabel: "In:",
    outLabel: "Out:",

    // Targets section
    monthlyLabel: "Monthly",
    targetSuffix: "Target",
    may2026: "May 2026",

    // Profile section
    name: "Name",
    employeeIdLabel: "Employee ID",
    contact: "Contact",
    email: "Email",
    branch: "Branch",
    role: "Role",
    joiningDate: "Joining Date",

    // Notices
    noticePriorities: {
      High: "High",
      Training: "Training",
      Target: "Target",
    },
    noticeTitle0: "Announcement 📢",
    noticeMsg0: 
      `Hi everyone,\n\nIntroducing the new Nashi Sales Management app. You can use this app to view your monthly targets, mark your daily attendance, and stay updated with important announcements from the admin. \n\n If you encounter any issues, please email us at nashigold@gmail.com`,
    // noticeTitle1: "Diamond counter training",
    // noticeMsg1:
    //   "All salesmen assigned to evening shift must attend the new solitaire certification session at 6:30 PM.",
    // noticeTitle2: "Monthly target review",
    // noticeMsg2:
    //   "Team leads will review conversion ratio, average bill value, and remaining target progress every Friday.",

    // Errors
    loginFailed: "Login failed. Please try again.",
    syncError:
      "Check-in saved locally but could not sync to server. Please try again.",
    syncErrorOut:
      "Check-out saved locally but could not sync to server. Please try again.",
    historyError: "Could not load attendance history.",

    // Toggle
    langToggleLabel: "AR",
  },
  ar: {
    // Brand
    brand: "مجوهرات ناشي للذهب",
    appTitle: "إدارة المبيعات",

    // Auth
    salesmanLogin: "تسجيل دخول البائع",
    employeeId: "رقم الموظف",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    verifying: "جارٍ التحقق…",
    logout: "تسجيل الخروج",

    // Confirm dialog
    confirm: "تأكيد",
    confirmCheckIn: "هل تريد بدء دوامك؟",
    confirmCheckOut: "هل تريد إنهاء دوامك؟",
    confirmLogout: "هل أنت متأكد من تسجيل الخروج؟",
    yes: "نعم",
    no: "لا",

    // Status
    notCheckedIn: "لم يتم تسجيل الحضور",
    checkedIn: "تم تسجيل الحضور",
    checkedOut: "تم تسجيل الانصراف",

    // Header tiles
    today: "اليوم",
    monthlyTarget: "الهدف الشهري",

    // Buttons
    checkIn: "تسجيل الحضور",
    checkOut: "تسجيل الانصراف",
    saving: "جارٍ الحفظ…",

    // Nav
    home: "الرئيسية",
    attendance: "الحضور",
    targets: "الأهداف",
    profile: "الملف الشخصي",
    notice: "الإشعارات",

    // Home panels
    attendanceTitle: "الحضور",
    salesTargets: "أهداف المبيعات",
    latestNotice: "آخر إشعار",
    openAttendance: "فتح الحضور",
    viewTargets: "عرض الأهداف",
    readNotices: "قراءة الإشعارات",
    monthlyTargetLabel: "الهدف الشهري",

    // Attendance section
    todaysAttendance: "حضور اليوم",
    checkInLabel: "وقت الحضور",
    checkOutLabel: "وقت الانصراف",
    attendanceHistory: "سجل الحضور",
    loadingHistory: "جارٍ تحميل السجل…",
    noRecords: "لا توجد سجلات حضور.",
    inLabel: "حضور:",
    outLabel: "انصراف:",

    // Targets section
    monthlyLabel: "شهري",
    targetSuffix: "الهدف",
    may2026: "May 2026",

    // Profile section
    name: "الاسم",
    employeeIdLabel: "رقم الموظف",
    contact: "جهة الاتصال",
    email: "البريد الإلكتروني",
    branch: "الفرع",
    role: "المسمى الوظيفي",
    joiningDate: "تاريخ الالتحاق",

    // Notices — titles & messages translated, dates stay as-is
    noticePriorities: {
      High: "عالية",
      Training: "تدريب",
      Target: "هدف",
    },
    noticeTitle0: "📢 إعلان",
    noticeMsg0:
      "أهلاً جميعاً، نقدم لكم تطبيق ناشي الجديد لإدارة المبيعات. يمكنك استخدام هذا التطبيق للاطلاع على أهدافك الشهرية، وتسجيل حضورك اليومي، والبقاء على اطلاع بآخر الإعلانات الهامة من الإدارة.في حال واجهت أي مشاكل، يرجى مراسلتنا عبر البريد الإلكتروني: nashigold@gmail.com",
    // noticeTitle1: "تدريب كاونتر الماس",
    // noticeMsg1:
    //   "يجب على جميع البائعين المخصصين للوردية المسائية حضور جلسة شهادة السوليتير الجديدة الساعة 6:30 مساءً.",
    // noticeTitle2: "مراجعة الهدف الشهري",
    // noticeMsg2:
    //   "سيراجع قادة الفريق نسبة التحويل ومتوسط قيمة الفاتورة وتقدم الهدف المتبقي كل يوم جمعة.",

    // Errors
    loginFailed: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    syncError: "تم حفظ الحضور محلياً لكن تعذّر المزامنة مع الخادم. يرجى المحاولة مجدداً.",
    syncErrorOut: "تم حفظ الانصراف محلياً لكن تعذّر المزامنة مع الخادم. يرجى المحاولة مجدداً.",
    historyError: "تعذّر تحميل سجل الحضور.",

    // Toggle
    langToggleLabel: "EN",
  },
} as const;

// ---------------------------------------------------------------------------
// Static data (notices stay local – no Firestore needed for them)
// ---------------------------------------------------------------------------
const notices = [
  {
    titleKey: "noticeTitle0" as const,
    date: "5 May 2026",
    priority: "High" as const,
    msgKey: "noticeMsg0" as const,
  },
  {
    titleKey: "noticeTitle1" as const,
    date: "27 Apr 2026",
    priority: "Training" as const,
    msgKey: "noticeMsg1" as const,
  },
  {
    titleKey: "noticeTitle2" as const,
    date: "25 Apr 2026",
    priority: "Target" as const,
    msgKey: "noticeMsg2" as const,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatTarget = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

const currentTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// ---------------------------------------------------------------------------
// Language Toggle Component
// ---------------------------------------------------------------------------
const LanguageToggle = ({
  lang,
  onToggle,
}: {
  lang: Lang;
  onToggle: () => void;
}) => {
  const isAr = lang === "ar";
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle language"
      className="relative flex h-8 w-16 shrink-0 items-center rounded-full border border-border bg-muted px-1 transition-colors"
    >
      {/* Track label left */}
      <span
        className={`absolute left-2 text-[10px] font-bold transition-opacity ${
          isAr ? "opacity-100" : "opacity-30"
        }`}
      >
        AR
      </span>
      {/* Track label right */}
      <span
        className={`absolute right-2 text-[10px] font-bold transition-opacity ${
          !isAr ? "opacity-100" : "opacity-30"
        }`}
      >
        EN
      </span>
      {/* Thumb */}
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-primary shadow transition-all duration-200 ${
          isAr ? "left-1" : "left-9"
        }`}
      />
    </button>
  );
};

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------
const Index = () => {
  // ── Language ──────────────────────────────────────────────────────────────
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    return saved === "ar" ? "ar" : "en";
  });

  const tr = translations[lang];

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  // ── Auth state ────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [loggedInUser, setLoggedInUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem("loggedInUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [section, setSection] = useState<Section>("home");

  // ── Attendance state ──────────────────────────────────────────────────────
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>("not-started");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ── Firestore history ─────────────────────────────────────────────────────
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // ── Async operation state (save to Firestore) ─────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Confirm dialog ────────────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"check-in" | "check-out" | "logout" | null>(null);

  // ── Derived salesman object (maps Firestore field names) ──────────────────
  const salesman = loggedInUser
    ? {
        name: loggedInUser.name || "Unknown",
        employeeId: String(loggedInUser.id),
        phone: loggedInUser.contact ? String(loggedInUser.contact) : "N/A",
        email: loggedInUser.email || "N/A",
        branch: loggedInUser.branch || "N/A",
        role: loggedInUser.job_title || "Salesman",
        joined: "N/A",
        targetMay: typeof loggedInUser.target === "number" ? loggedInUser.target : 0,
      }
    : null;

  // ── Load attendance history when section becomes "attendance" ─────────────
  useEffect(() => {
    if (section !== "attendance" || !salesman) return;

    let cancelled = false;
    setHistoryLoading(true);
    setHistoryError("");

    getAttendanceHistory(salesman.employeeId)
      .then((records) => {
        if (!cancelled) setHistory(records);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        if (!cancelled) setHistoryError(tr.historyError);
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [section]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Today label ───────────────────────────────────────────────────────────
  const todayLabel = useMemo(() => {
    if (attendanceStatus === "checked-out") return tr.checkedOut;
    if (attendanceStatus === "checked-in") return tr.checkedIn;
    return tr.notCheckedIn;
  }, [attendanceStatus, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const employeeId = String(form.get("employeeId") || "").trim();
    const password = String(form.get("password") || "").trim();

    setLoginError("");
    setIsLoggingIn(true);

    try {
      const user = await loginEmployee(employeeId, password);
      setLoggedInUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    } catch (err: any) {
      setLoginError(err?.message || tr.loginFailed);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ── Attendance actions ────────────────────────────────────────────────────
  const markCheckIn = async () => {
    if (attendanceStatus !== "not-started" || !salesman) return;
    const time = currentTime();
    setSaveError("");
    setIsSaving(true);
    try {
      await saveCheckIn(salesman.employeeId, time);
      setCheckIn(time);
      setAttendanceStatus("checked-in");
    } catch (err) {
      console.error("Check-in save failed:", err);
      setSaveError(tr.syncError);
      setCheckIn(time);
      setAttendanceStatus("checked-in");
    } finally {
      setIsSaving(false);
    }
  };

  const markCheckOut = async () => {
    if (attendanceStatus !== "checked-in" || !salesman) return;
    const time = currentTime();
    setSaveError("");
    setIsSaving(true);
    try {
      await saveCheckOut(salesman.employeeId, time);
      setCheckOut(time);
      setAttendanceStatus("checked-out");
    } catch (err) {
      console.error("Check-out save failed:", err);
      setSaveError(tr.syncErrorOut);
      setCheckOut(time);
      setAttendanceStatus("checked-out");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Confirm dialog helpers ────────────────────────────────────────────────
  const requestCheckIn = () => { setPendingAction("check-in"); setConfirmOpen(true); };
  const requestCheckOut = () => { setPendingAction("check-out"); setConfirmOpen(true); };
  const requestLogout = () => { setPendingAction("logout"); setConfirmOpen(true); };

  const handleConfirmYes = async () => {
    if (pendingAction === "check-in") markCheckIn();
    if (pendingAction === "check-out") markCheckOut();
    if (pendingAction === "logout") {
      if (attendanceStatus === "checked-in" && salesman) {
        const time = currentTime();
        await saveCheckOut(salesman.employeeId, time);
        setCheckOut(time);
        setAttendanceStatus("checked-out");
      }

      setIsLoggedIn(false);
      setLoggedInUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
    }
    setConfirmOpen(false);
    setPendingAction(null);
  };

  // ── Guard: show login if not authenticated ────────────────────────────────
  if (!isLoggedIn) {
    return (
      <LoginScreen
        loginError={loginError}
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        tr={tr}
        lang={lang}
        onToggleLang={toggleLang}
      />
    );
  }

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems = [
    { id: "home" as Section, label: tr.home, icon: CalendarCheck },
    { id: "attendance" as Section, label: tr.attendance, icon: Clock },
    { id: "targets" as Section, label: tr.targets, icon: Target },
    { id: "profile" as Section, label: tr.profile, icon: UserRound },
    { id: "notices" as Section, label: tr.notice, icon: Bell },
  ];

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground sm:pb-0">
      {/* ── Header ── */}
      <section className="border-b border-border bg-card text-card-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{tr.brand}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">{tr.appTitle}</h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {salesman?.name} · {salesman?.employeeId}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle lang={lang} onToggle={toggleLang} />
              <button
                onClick={requestLogout}
                className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-muted-foreground"
              >
                {tr.logout}
              </button>
            </div>
          </header>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatusTile label={tr.today} value={todayLabel} />
            <StatusTile label={tr.monthlyTarget} value={formatTarget(salesman?.targetMay || 0) + " gm"} />
          </div>

          {/* Sync error banner */}
          {saveError && (
            <p className="rounded-md bg-muted p-3 text-sm font-medium text-ruby">{saveError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={requestCheckIn}
              disabled={attendanceStatus !== "not-started" || isSaving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-55 sm:flex-none"
            >
              <LogIn className="h-4 w-4" />
              {isSaving && pendingAction === "check-in" ? tr.saving : tr.checkIn}
            </button>
            <button
              onClick={requestCheckOut}
              disabled={attendanceStatus !== "checked-in" || isSaving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-sm disabled:opacity-55 sm:flex-none"
            >
              <LogOut className="h-4 w-4" />
              {isSaving && pendingAction === "check-out" ? tr.saving : tr.checkOut}
            </button>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="hidden grid-cols-5 gap-2 sm:grid">
          {navItems.map((item) => (
            <NavButton key={item.id} item={item} active={section === item.id} onClick={() => setSection(item.id)} />
          ))}
        </nav>

        <div className="mt-0 sm:mt-6">
          {section === "home" && (
            <Home
              todayLabel={todayLabel}
              checkIn={checkIn}
              checkOut={checkOut}
              setSection={setSection}
              targetMay={salesman?.targetMay || 0}
              tr={tr}
            />
          )}
          {section === "attendance" && (
            <Attendance
              todayLabel={todayLabel}
              checkIn={checkIn}
              checkOut={checkOut}
              markCheckIn={requestCheckIn}
              markCheckOut={requestCheckOut}
              attendanceStatus={attendanceStatus}
              history={history}
              historyLoading={historyLoading}
              historyError={historyError}
              tr={tr}
            />
          )}
          {section === "targets" && <Targets targetMay={salesman?.targetMay || 0} tr={tr} />}
          {section === "profile" && <Profile salesman={salesman} tr={tr} />}
          {section === "notices" && <Notices tr={tr} />}
        </div>
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-border bg-card px-2 py-2 shadow-sm sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold ${
                section === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Confirm dialog ── */}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tr.confirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "check-in"
                ? tr.confirmCheckIn
                : pendingAction === "check-out"
                ? tr.confirmCheckOut
                : pendingAction === "logout"
                ? tr.confirmLogout
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tr.no}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmYes}>{tr.yes}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const LoginScreen = ({
  loginError,
  onLogin,
  isLoggingIn,
  tr,
  lang,
  onToggleLang,
}: {
  loginError: string;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  isLoggingIn: boolean;
  tr: typeof translations["en"];
  lang: Lang;
  onToggleLang: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8 text-foreground">
      <section className="w-full max-w-sm rounded-md border border-border bg-card p-5 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{tr.brand}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">{tr.salesmanLogin}</h1>
          </div>
          <LanguageToggle lang={lang} onToggle={onToggleLang} />
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">{tr.employeeId}</span>
            <input
              name="employeeId"
              required
              disabled={isLoggingIn}
              className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">{tr.password}</span>
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoggingIn}
                className="h-12 w-full rounded-md border border-input bg-background pl-3 pr-10 text-base outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          {loginError && (
            <p className="rounded-md bg-muted p-3 text-sm font-medium text-ruby">{loginError}</p>
          )}

          <button
            disabled={isLoggingIn}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {tr.verifying}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" /> {tr.login}
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
};

const StatusTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border bg-background p-3">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-semibold">{value}</p>
  </div>
);

const NavButton = ({
  item,
  active,
  onClick,
}: {
  item: { id: Section; label: string; icon: typeof Clock };
  active: boolean;
  onClick: () => void;
}) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:border-primary"
      }`}
    >
      <Icon className="h-4 w-4" /> {item.label}
    </button>
  );
};

const Home = ({
  todayLabel,
  checkIn,
  checkOut,
  setSection,
  targetMay,
  tr,
}: {
  todayLabel: string;
  checkIn: string;
  checkOut: string;
  setSection: (section: Section) => void;
  targetMay: number;
  tr: typeof translations["en"];
}) => (
  <div className="grid gap-4 lg:grid-cols-3">
    <InfoPanel
      title={tr.attendanceTitle}
      icon={Clock}
      value={todayLabel}
      detail={`${tr.inLabel} ${checkIn || "--"} · ${tr.outLabel} ${checkOut || "--"}`}
      action={tr.openAttendance}
      onClick={() => setSection("attendance")}
    />
    <InfoPanel
      title={tr.salesTargets}
      icon={Target}
      value={formatTarget(targetMay) + " gm"}
      detail={tr.monthlyTargetLabel}
      action={tr.viewTargets}
      onClick={() => setSection("targets")}
    />
    <InfoPanel
      title={tr.latestNotice}
      icon={Bell}
      value={tr.noticeTitle0}
      detail={notices[0].date}
      action={tr.readNotices}
      onClick={() => setSection("notices")}
    />
  </div>
);

const InfoPanel = ({
  title,
  icon: Icon,
  value,
  detail,
  action,
  onClick,
}: {
  title: string;
  icon: typeof Clock;
  value: string;
  detail: string;
  action: string;
  onClick: () => void;
}) => (
  <article className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
    <div className="flex items-center gap-3 text-muted-foreground">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-medium">{title}</span>
    </div>
    <p className="mt-4 text-xl font-semibold tracking-normal text-card-foreground sm:text-2xl">{value}</p>
    <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    <button
      onClick={onClick}
      className="mt-5 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-gold-soft"
    >
      {action}
    </button>
  </article>
);

// ── Attendance section ────────────────────────────────────────────────────────
const Attendance = ({
  todayLabel,
  checkIn,
  checkOut,
  markCheckIn,
  markCheckOut,
  attendanceStatus,
  history,
  historyLoading,
  historyError,
  tr,
}: {
  todayLabel: string;
  checkIn: string;
  checkOut: string;
  markCheckIn: () => void;
  markCheckOut: () => void;
  attendanceStatus: AttendanceStatus;
  history: AttendanceRecord[];
  historyLoading: boolean;
  historyError: string;
  tr: typeof translations["en"];
}) => (
  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
    {/* Today */}
    <section className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-semibold tracking-normal sm:text-2xl">{tr.todaysAttendance}</h2>
      <p className="mt-2 text-muted-foreground">{todayLabel}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-muted p-3 sm:p-4">
          <p className="text-sm text-muted-foreground">{tr.checkInLabel}</p>
          {/* Time value kept as-is — constraint #4 */}
          <p className="mt-1 text-lg font-semibold sm:text-xl">{checkIn || "--"}</p>
        </div>
        <div className="rounded-md bg-muted p-3 sm:p-4">
          <p className="text-sm text-muted-foreground">{tr.checkOutLabel}</p>
          {/* Time value kept as-is — constraint #4 */}
          <p className="mt-1 text-lg font-semibold sm:text-xl">{checkOut || "--"}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          onClick={markCheckIn}
          disabled={attendanceStatus !== "not-started"}
          className="flex-1 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-55"
        >
          {tr.checkIn}
        </button>
        <button
          onClick={markCheckOut}
          disabled={attendanceStatus !== "checked-in"}
          className="flex-1 rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground disabled:opacity-55"
        >
          {tr.checkOut}
        </button>
      </div>
    </section>

    {/* History */}
    <section className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-semibold tracking-normal sm:text-2xl">{tr.attendanceHistory}</h2>

      {historyLoading && (
        <p className="mt-4 text-sm text-muted-foreground">{tr.loadingHistory}</p>
      )}

      {historyError && (
        <p className="mt-4 rounded-md bg-muted p-3 text-sm font-medium text-ruby">{historyError}</p>
      )}

      {!historyLoading && !historyError && history.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">{tr.noRecords}</p>
      )}

      {!historyLoading && history.length > 0 && (
        <div className="mt-4 grid gap-3">
          {history.map((item) => (
            <HistoryRow
              key={item.dateISO}
              date={item.date}
              checkIn={item.checkIn || "--"}
              checkOut={item.checkOut || "--"}
              status={item.status}
              tr={tr}
            />
          ))}
        </div>
      )}
    </section>
  </div>
);

const HistoryRow = ({
  date,
  checkIn,
  checkOut,
  status,
  tr,
}: {
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  tr: typeof translations["en"];
}) => (
  <div className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center">
    {/* Date value kept as-is — constraint #5 (e.g. "05 May 2026") */}
    <p className="font-semibold">{date}</p>
    {/* Time values kept as-is — constraint #4; only the label is translated */}
    <p className="text-sm text-muted-foreground">{tr.inLabel} {checkIn}</p>
    <p className="text-sm text-muted-foreground">{tr.outLabel} {checkOut}</p>
    <span className="w-fit rounded-md bg-emerald-soft px-3 py-1 text-sm font-semibold text-accent">
      {status}
    </span>
  </div>
);

const Targets = ({ targetMay, tr }: { targetMay: number; tr: typeof translations["en"] }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <TargetCard label={tr.monthlyLabel} target={targetMay} tr={tr} />
  </div>
);

const TargetCard = ({
  label,
  target,
  tr,
}: {
  label: string;
  target: number;
  tr: typeof translations["en"];
}) => (
  <article className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label} {tr.targetSuffix}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal sm:text-2xl">
          {/* Number + unit kept as-is — constraint #3 */}
          {formatTarget(target)} gm
        </h2>
      </div>
      <span className="rounded-md bg-gold-soft px-3 py-1 text-sm font-semibold text-gold-deep">
        {/* "May 2026" format kept fixed — constraint #3 related */}
        {tr.may2026}
      </span>
    </div>
  </article>
);

const Profile = ({
  salesman,
  tr,
}: {
  salesman: any;
  tr: typeof translations["en"];
}) => {
  if (!salesman) return null;
  const rows = [
    [tr.name, salesman.name],
    [tr.employeeIdLabel, salesman.employeeId],
    [tr.contact, salesman.phone],
    [tr.email, salesman.email],
    [tr.branch, salesman.branch],
    [tr.role, salesman.role],
    [tr.joiningDate, salesman.joined],
  ];
  const initials = salesman.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-primary text-xl font-bold text-primary-foreground sm:h-16 sm:w-16 sm:text-2xl">
          {initials}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-normal sm:text-2xl">{salesman.name}</h2>
          <p className="text-muted-foreground">{salesman.role}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-muted p-3 sm:p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 break-words font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Notices = ({ tr }: { tr: typeof translations["en"] }) => (
  <section className="grid gap-4">
    {notices.slice(0, 1).map((notice) => (
      <article key={notice.titleKey} className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-normal sm:text-xl">{tr[notice.titleKey]}</h2>
          <span className="rounded-md bg-ruby px-3 py-1 text-sm font-semibold text-primary-foreground">
            {tr.noticePriorities[notice.priority]}
          </span>
        </div>
        {/* Date kept as-is — constraint #1 (e.g. "29 Apr 2026") */}
        <p className="mt-1 text-sm text-muted-foreground">{notice.date}</p>
        <p className="mt-4 leading-relaxed">{tr[notice.msgKey]}</p>
      </article>
    ))}
  </section>
);

export default Index;
