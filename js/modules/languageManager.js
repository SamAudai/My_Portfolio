"use strict";

/**
 * LanguageManager
 * ---------------
 * مسؤول فقط عن: تحميل ملفات الترجمة، تبديل اتجاه الصفحة (rtl/ltr)،
 * وتحديث النصوص المُعلَّمة بـ [data-translate-key].
 *
 * تحسينات عن النسخة الأصلية (language.js):
 *  - إزالة الفرع الميت الذي كان يتعامل مع lang ككائن {code} (لم يكن
 *    يُستدعى أبدًا بهذا الشكل في أي مكان من الكود - YAGNI).
 *  - إضافة ذاكرة تخزين مؤقت (cache) لملفات الترجمة، فلا يُعاد جلب
 *    نفس ملف JSON من الشبكة عند كل تبديل بين نفس اللغتين.
 *  - حقن StorageService بدل استدعاء localStorage مباشرة (اتساق مع
 *    باقي الوحدات + DIP).
 */
export class LanguageManager {
  /**
   * @param {Object} config
   * @param {import("../utils/storage.js").StorageService} config.storage
   * @param {string} [config.toggleSelector]
   * @param {string} [config.storageKey]
   * @param {string} [config.localizationPath] المسار الذي تُقرأ منه ملفات JSON (localizationPath/{lang}.json)
   * @param {string} [config.defaultLang]
   * @param {string[]} [config.rtlLangs] قائمة رموز اللغات التي تُعرض من اليمين لليسار
   */
  constructor({
    storage,
    toggleSelector = ".lang-btn",
    storageKey = "language",
    localizationPath = "localization",
    defaultLang = "en",
    rtlLangs = ["ar"],
  }) {
    this.root = document.documentElement;
    this.toggle = document.querySelector(toggleSelector);
    this.storage = storage;
    this.storageKey = storageKey;
    this.localizationPath = localizationPath;
    this.defaultLang = defaultLang;
    this.rtlLangs = rtlLangs;
    this._cache = new Map();
  }

  async init() {
    if (!this.toggle) {
      console.warn("Language toggle button not found.");
      return this;
    }

    this.toggle.addEventListener("click", () => this._handleToggleClick());
    await this._changeLanguage(this._getStoredLanguage());
    return this;
  }

  _getStoredLanguage() {
    return this.storage.get(this.storageKey, this.defaultLang);
  }

  async _handleToggleClick() {
    const current = this._getStoredLanguage();
    const fallbackRtl = this.rtlLangs[0] || "ar";
    const next = current === this.defaultLang ? fallbackRtl : this.defaultLang;
    try {
      await this._changeLanguage(next);
    } catch (e) {
      console.error("خطأ في تبديل اللغة:", e);
    }
  }

  async _changeLanguage(lang) {
    this.storage.set(this.storageKey, lang);
    const langData = await this._fetchLanguageData(lang);
    this._applyDirectionAndToggleLabel(lang);
    this._applyTranslatedContent(langData);
  }

  async _fetchLanguageData(lang) {
    if (this._cache.has(lang)) return this._cache.get(lang);

    try {
      const data = await this._fetchJSON(`${this.localizationPath}/${lang}.json`);
      this._cache.set(lang, data);
      return data;
    } catch (err) {
      console.warn(
        `Localization file not found for "${lang}". Falling back to "${this.defaultLang}".`,
        err
      );
      if (lang === this.defaultLang) return {};

      try {
        const fallback = await this._fetchJSON(
          `${this.localizationPath}/${this.defaultLang}.json`
        );
        this._cache.set(lang, fallback);
        return fallback;
      } catch (fallbackErr) {
        console.error("Error loading fallback localization data:", fallbackErr);
        return {};
      }
    }
  }

  async _fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return res.json();
  }

  _applyDirectionAndToggleLabel(lang) {
    const isRtl = this.rtlLangs.includes(lang);
    this.root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.body.classList.toggle("arabic-mode", isRtl);
    if (this.toggle) {
      this.toggle.textContent = isRtl ? "EN" : "AR";
    }
  }

  _applyTranslatedContent(langData) {
    document.querySelectorAll("[data-translate-key]").forEach((el) => {
      const key = el.getAttribute("data-translate-key");
      if (Object.prototype.hasOwnProperty.call(langData, key)) {
        const newVal = langData[key];
        // فقط إذا تغيّر النص لتفادي عمليات إعادة الإدراج المتكررة
        if (el.textContent !== newVal) {
          el.textContent = newVal;
        }
      }
    });
  }
}
