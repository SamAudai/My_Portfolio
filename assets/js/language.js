(async () => {
  const root = document.documentElement;
  const langToggle = document.querySelector(".lang-btn");

  const STORAGE_KEY = "language";
  const getStoredLanguage = () => localStorage.getItem(STORAGE_KEY) || "en";
  const setStoredLanguage = (lang) => {
    localStorage.setItem(STORAGE_KEY, lang);
  };

  async function fetchLanguageData(lang) {
    try {
      const code =
        typeof lang === "string" ? lang : lang && lang.code ? lang.code : "en";
      const path = `/assets/localization/${code}.json`;
      const response = await fetch(path);

      if (!response.ok) {
        console.warn(
          `Localization file not found: ${path} (status ${response.status}). Falling back to 'en'.`
        );
        const fallback = await fetch(`/assets/localization/en.json`);
        if (!fallback.ok) throw new Error("Fallback localization not found");
        return await fallback.json();
      }

      return await response.json();
    } catch (err) {
      console.error("Error loading localization data:", err);
      return {};
    }
  }

  // التعديل هنا: ترجمة كل عنصر بشكل مستقل باستخدام textContent
  function updateContent(langData) {
    const elements = document.querySelectorAll("[data-translate-key]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-translate-key");
      if (langData.hasOwnProperty(key)) {
        const newVal = langData[key];
        // فقط إذا تغيّر النص لتفادي عمليات إعادة الإدراج المتكررة
        if (el.textContent !== newVal) {
          el.textContent = newVal;
        }
      }
    });
  }

  function applyLanguageStyles(code) {
    if (code === "ar") {
      root.setAttribute("dir", "rtl");
      document.body.classList.add("arabic-mode");
    } else {
      root.setAttribute("dir", "ltr");
      document.body.classList.remove("arabic-mode");
    }

    toggleArabicEnglish(code);
  }

  function toggleArabicEnglish(lang) {
    if (langToggle) {
      langToggle.textContent = lang === "ar" ? "EN" : "AR";
    }
  }

  async function changeLanguage(lang) {
    setStoredLanguage(lang);
    const langData = await fetchLanguageData(lang);
    // تأكد من وجود اللغة المختارة
    const code =
      typeof lang === "string" ? lang : lang && lang.code ? lang.code : "en";
    applyLanguageStyles(code);
    updateContent(langData);
  }

  if (!langToggle) {
    console.warn("Language toggle button not found.");
    return;
  }

  langToggle.addEventListener("click", async () => {
    const current = getStoredLanguage();
    const nextLang = current === "en" ? "ar" : "en";
    await changeLanguage(nextLang);
  });

  // تهيئة عند تحميل الصفحة
  (async () => {
    try {
      const initialLang = getStoredLanguage();
      await changeLanguage(initialLang);
    } catch (e) {
      console.error("خطأ في الترجمة:", e);
    }
  })();
})();
