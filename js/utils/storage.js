"use strict";

/**
 * StorageService
 * ---------------
 * غلاف آمن حول localStorage (Single Responsibility: التخزين فقط).
 * يُحقن (inject) في أي وحدة تحتاج للحفظ/القراءة بدل استدعاء
 * localStorage مباشرة من كل مكان في الكود (Dependency Inversion).
 *
 * يدعم أيضًا namespace اختياري (prefix) لتفادي تعارض المفاتيح
 * بين وحدات مختلفة تستخدم نفس اسم المفتاح.
 */
export class StorageService {
  /** @param {string} [prefix] بادئة اختيارية تُضاف لكل مفتاح */
  constructor(prefix = "") {
    this.prefix = prefix;
  }

  /** @param {string} key */
  _key(key) {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  /**
   * @param {string} key
   * @param {*} [fallback]
   * @returns {string|*}
   */
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(this._key(key));
      return value !== null ? value : fallback;
    } catch {
      return fallback;
    }
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns {boolean} نجاح العملية
   */
  set(key, value) {
    try {
      localStorage.setItem(this._key(key), value);
      return true;
    } catch {
      return false;
    }
  }

  /** @param {string} key */
  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * قراءة قيمة JSON محفوظة، مع رجوع آمن للقيمة الافتراضية عند الفشل.
   * @param {string} key
   * @param {*} [fallback]
   */
  getJSON(key, fallback = null) {
    const raw = this.get(key, null);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  setJSON(key, value) {
    try {
      return this.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  }
}
