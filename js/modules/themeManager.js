"use strict";

/**
 * ThemeManager
 * ------------
 * مسؤول فقط عن: تحديد الثيم الابتدائي، تطبيقه على DOM، وحفظه،
 * والتبديل عند نقر الزر. لا يعرف شيئًا عن اللغة أو التبويبات أو
 * أي وحدة أخرى (Loose Coupling).
 */
export class ThemeManager {
  /**
   * @param {Object} config
   * @param {import("../utils/storage.js").StorageService} config.storage
   * @param {string} [config.toggleSelector]
   * @param {string} [config.sunSelector]
   * @param {string} [config.moonSelector]
   * @param {string} [config.lightModeBodyClass] الصنف (المُعرَّف في style.css) الذي يُضاف على body عند تفعيل الوضع الفاتح
   * @param {string} [config.storageKey]
   */
  constructor({
    storage,
    toggleSelector = ".theme-btn",
    sunSelector = "#sun",
    moonSelector = "#moon",
    lightModeBodyClass = "light-mode",
    storageKey = "theme",
  }) {
    this.storage = storage;
    this.toggle = document.querySelector(toggleSelector);
    this.sun = document.querySelector(sunSelector);
    this.moon = document.querySelector(moonSelector);
    this.lightModeBodyClass = lightModeBodyClass;
    this.storageKey = storageKey;
  }

  init() {
    // بدون الأيقونتين لا يمكن إدارة الحالة بشكل صحيح
    if (!this.sun || !this.moon) return this;

    const isDark = this._resolveInitialTheme();
    this._apply(isDark);
    this._persist(isDark);

    this.toggle?.addEventListener("click", () => this._handleToggleClick());
    return this;
  }

  /**
   * يحدد الثيم الابتدائي: من التخزين إن وُجد، وإلا من تفضيل النظام.
   * (تم تصحيح قيمة matchMedia من "dark-mode" الخاطئة إلى "dark").
   */
  _resolveInitialTheme() {
    const stored = this.storage.get(this.storageKey, null);
    if (stored === "dark-mode" || stored === "light-mode") {
      return stored === "dark-mode";
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  }

  _apply(isDark) {
    // style.css يقلب الألوان إلى الوضع الفاتح عندما يكون lightModeBodyClass موجودًا،
    // لذا نضيفه فقط عندما لا نكون في الوضع الداكن (!isDark).
    document.body.classList.toggle(this.lightModeBodyClass, !isDark);
    this.sun.style.display = isDark ? "none" : "inline-flex";
    this.moon.style.display = isDark ? "inline-flex" : "none";
  }

  _persist(isDark) {
    // نحفظ دائمًا قيمة نصية صريحة، فلا نقع في مشكلة تخزين "null" كسلسلة نصية
    this.storage.set(this.storageKey, isDark ? "dark-mode" : "light-mode");
  }

  _handleToggleClick() {
    // الحالة الحالية هي "داكن" إن لم يكن كلاس الوضع الفاتح موجودًا على body
    const currentIsDark = !document.body.classList.contains(this.lightModeBodyClass);
    const nextIsDark = !currentIsDark;
    this._apply(nextIsDark);
    this._persist(nextIsDark);
  }
}
