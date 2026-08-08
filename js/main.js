"use strict";

(() => {
  const readLS = (key, def) => {
    try {
      const v = localStorage.getItem(key);
      return v != null ? v : def;
    } catch {
      return def;
    }
  };
  // حفظ قيمة المفتاح مع وجودها
  const writeLS = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // تجاهل الخطأ
    }
  };

  // تهيئة التبديل بين الأقسام
  const initSectionTabs = () => {
    const buttons = [...document.querySelectorAll(".control")];

    // قراءة الحالة المحفوظة إن وجدت وربطها بواجهة المستخدم قبل الاستماع للحدث
    const savedActiveBtnId = readLS("activeButton", null);
    const savedActiveSectionId = readLS("activeSection", null);

    // تطبيق الحالة المحفوظة عند الإقلاع
    if (savedActiveBtnId) {
      const btn = buttons.find((b) => b.id === savedActiveBtnId);
      if (btn) {
        document.querySelector(".active-btn")?.classList.remove("active-btn");
        btn.classList.add("active-btn");
      }
    }

    if (savedActiveSectionId) {
      document
        .querySelector(".active-section")
        ?.classList.remove("active-section");
      const section = document.getElementById(savedActiveSectionId);
      if (section) section.classList.add("active-section");
    }

    // إضافة الاستماع للنقر وتحديث التخزين
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        // تحديث الواجهة
        const currentActiveBtn = document.querySelector(".active-btn");
        if (currentActiveBtn) currentActiveBtn.classList.remove("active-btn");
        this.classList.add("active-btn");

        const currentActiveSection = document.querySelector(".active-section");
        if (currentActiveSection)
          currentActiveSection.classList.remove("active-section");
        const targetSection = document.getElementById(this.dataset.id);
        if (targetSection) targetSection.classList.add("active-section");

        // حفظ الحالة الحديثة
        writeLS("activeButton", this.id || "");
        writeLS("activeSection", this.dataset.id || "");
      });
    });
  };

  // تهيئة التبديل بين تبويبات قسم السيرة الذاتية
  const initMyResumeTabs = () => {
    const links = [...document.querySelectorAll(".tab-link")];

    // قراءة الحالة المحفوظة إن وجدت وربطها بواجهة المستخدم قبل الاستماع للحدث
    const savedActiveLinkId = readLS("activeLink", null);
    const savedActiveContentId = readLS("activeContent", null);

    // تطبيق الحالة المحفوظة عند الإقلاع
    if (savedActiveLinkId) {
      const link = links.find((b) => b.id === savedActiveLinkId);
      if (link) {
        document.querySelector(".active-link")?.classList.remove("active-link");
        link.classList.add("active-link");
      }
    }

    if (savedActiveContentId) {
      document.querySelector(".active-tab")?.classList.remove("active-tab");
      const content = document.getElementById(savedActiveContentId);
      if (content) content.classList.add("active-tab");
    }

    // إضافة الاستماع للنقر وتحديث التخزين
    links.forEach((l) => {
      l.addEventListener("click", function () {
        // تحديث الواجهة
        const currentActiveLink = document.querySelector(".active-link");
        if (currentActiveLink)
          currentActiveLink.classList.remove("active-link");
        this.classList.add("active-link");

        const currentActiveContent = document.querySelector(".active-tab");
        if (currentActiveContent)
          currentActiveContent.classList.remove("active-tab");
        const targetContent = document.getElementById(this.dataset.id);
        if (targetContent) targetContent.classList.add("active-tab");

        // حفظ الحالة الحديثة
        writeLS("activeLink", this.id || "");
        writeLS("activeContent", this.dataset.id || "");
      });
    });
  };

  // تهيئة الثيم (تم إعادة كتابتها بالكامل لإصلاح ظهور الأيقونتين معًا)
  const initTheme = () => {
    const toggle = document.querySelector(".theme-btn");
    const sun = document.querySelector("#sun");
    const moon = document.querySelector("#moon");

    // بدون العنصرين لا يمكن إدارة الأيقونات، فلا داعي للمتابعة
    if (!sun || !moon) return;

    // دالة واحدة موحّدة لتطبيق حالة الثيم على body والأيقونتين معًا
    // (isDark = true تعني القسم المظلم مفعّل)
    const applyTheme = (isDark) => {
      document.body.classList.toggle("light-mode", isDark);
      sun.style.display = isDark ? "none" : "inline-flex";
      moon.style.display = isDark ? "inline-flex" : "none";
    };

    // "dark-mode" أو "light-mode" أو null إن لم يسبق الحفظ
    const storedTheme = readLS("theme", null);

    let isDark;
    if (storedTheme === "dark-mode" || storedTheme === "light-mode") {
      isDark = storedTheme === "dark-mode";
    } else {
      // لا توجد قيمة محفوظة صالحة بعد: استخدم تفضيل النظام
      // (تم تصحيح قيمة الميديا كويري من "dark-mode" الخاطئة إلى "dark")
      isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    }

    applyTheme(isDark);
    // نحفظ قيمة نصية صريحة دائمًا، فلا تتكرر مشكلة حفظ "null" كسلسلة نصية
    writeLS("theme", isDark ? "dark-mode" : "light-mode");

    // تفعّل الزر إن وُجد
    if (toggle) {
      toggle.addEventListener("click", () => {
        const nowDark = document.body.classList.toggle("light-mode");
        sun.style.display = nowDark ? "none" : "inline-flex";
        moon.style.display = nowDark ? "inline-flex" : "none";
        writeLS("theme", nowDark ? "dark-mode" : "light-mode");
      });
    }
  };

  // إرسال النموذج إلى Google Sheets مع معالجة آمنة
  const initFormSubmission = () => {
    const form = document.getElementById("form-submit");
    if (!form || !(form instanceof HTMLFormElement)) return;

    const loader = document.getElementById("loader");
    const submitBtn = document.getElementById("submitBtn"); // أو استخدم Button داخل form
    const msg = document.getElementById("msg");
    const scriptURL = form.getAttribute("action") || "";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (loader) loader.style.display = "block";
      if (submitBtn) submitBtn.classList.add("disabled");

      try {
        const data = new FormData(form);
        const res = await fetch(scriptURL, { method: "POST", body: data });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        if (msg) msg.style.display = "block";
        form.reset();
      } catch (err) {
        const text = err?.message ?? "Unknown error";
        alert(`Error: ${text}`);
      } finally {
        if (loader) loader.style.display = "none";
        if (submitBtn) submitBtn.classList.remove("disabled");
        if (msg) {
          setTimeout(() => {
            msg.style.display = "none";
          }, 2000);
        }
      }
    });
  };

  const initSkillsInterval = () => {
    // احصل على العناصر وتحديث النص الظاهر
    const items = Array.from(document.querySelectorAll(".animated-item"));
    if (items.length === 0) return;

    // اجعل النصوص مرئية من النص المحفوظ في data-text
    items.forEach((el) => {
      el.textContent = el.getAttribute("data-text");
    });

    let index = 0;
    const total = items.length;

    // اجعل عنصر البداية ظاهرًا فعلاً
    function showIndex(i) {
      items.forEach((el, idx) => {
        el.classList.toggle("active", idx === i);
      });
    }

    // ابدأ بالدوران كل 5 ثوانِ (تعديل الوقت كما تريد)
    const INTERVAL_MS = 5000;
    setInterval(() => {
      index = (index + 1) % total;
      showIndex(index);
    }, INTERVAL_MS);

    // تأكد أن البداية تعرض العنصر الأول فقط
    showIndex(0);
  };

  //active main menu for small divice
  const initToggleMenu = () => {
    // أنماط الحركة (فتح/إغلاق)
    const keyframes_open = [
      { transform: "translateX(-200px)", opacity: 0 },
      { transform: "translateX(0px)", opacity: 1 },
      { transform: "translateX(100px)", opacity: 1 },
      { transform: "translateX(0px)", opacity: 1 },
    ];

    // حركة الإغلاق: من النهاية إلى البداية
    const keyframes_close = [
      { transform: "translateX(0px)", opacity: 1 },
      { transform: "translateX(100px)", opacity: 1 },
      { transform: "translateX(-200px)", opacity: 0 },
    ];

    const options = {
      duration: 700,
      easing: "ease-in-out",
      fill: "forwards",
    };

    const sideMenu = document.querySelector("#menu");
    const checkbox = document.querySelector("#checkbox");

    // تحقق من وجود العناصر
    if (!sideMenu || !checkbox) return;

    // اعتمد على التشيك فقط
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        // فتح
        sideMenu.classList.add("active"); // يمكن حفظ الحالة في CSS
        sideMenu.animate(keyframes_open, options);
      } else {
        // إغلاق
        const closeAnim = sideMenu.animate(keyframes_close, options);
        // ملاحظة: تم استبدال حدث "animationend" (لا يُطلق مع animate())
        // بـ closeAnim.finished لأنه الطريقة الصحيحة لمعرفة انتهاء أنيميشن Web Animations API
        closeAnim.finished
          .then(() => {
            sideMenu.classList.remove("active");
          })
          .catch(() => {
            // تجاهل الإلغاء (مثلاً إن بدأ أنيميشن آخر قبل الانتهاء)
          });
      }
    });

    // خيار إضافي: اجعل نقر على قائمة العناصر يغلقها ويعيد ضبط الـ checkbox
    sideMenu.querySelectorAll(".control").forEach((ctrl) => {
      ctrl.addEventListener("click", () => {
        // افترض أن نقوم بإغلاق القائمة عندما يختار مستخدم خياراً في القائمة
        if (checkbox.checked) {
          checkbox.checked = false;
          const closeAnim = sideMenu.animate(keyframes_close, options);
          closeAnim.finished
            .then(() => {
              sideMenu.classList.remove("active");
            })
            .catch(() => {});
        }
      });
    });
  };

  const noneExisting = () => {
    // مثال: إذا كان هناك رابط غير مكتمل، نعرض رسالة مؤقتة
    document.querySelectorAll('a[href="#nonexistent"]').forEach((a) => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        alert("Attention: This link is currently under construction and will be activated soon.");
      });
    });
  };

  // تشغيل التهيئة عند تحميل DOM
  document.addEventListener("DOMContentLoaded", () => {
    initSectionTabs();
    initMyResumeTabs();
    initTheme();
    initSkillsInterval();
    initFormSubmission();
    initToggleMenu();
    noneExisting();
  });
})();