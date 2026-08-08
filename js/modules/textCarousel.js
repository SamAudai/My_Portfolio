"use strict";

/**
 * TextCarousel
 * ------------
 * مسؤول فقط عن تدوير مجموعة عناصر نصية (مثل قسم المهارات) كل فترة زمنية.
 * يوفّر destroy() لإيقاف المؤقت عند الحاجة (تفادي تسرب الذاكرة في SPA
 * أو عند إعادة التهيئة).
 */
export class TextCarousel {
  /**
   * @param {Object} [config]
   * @param {string} [config.itemSelector]
   * @param {string} [config.activeClass]
   * @param {number} [config.intervalMs]
   */
  constructor({
    itemSelector = ".animated-item",
    activeClass = "active",
    intervalMs = 5000,
  } = {}) {
    this.items = [...document.querySelectorAll(itemSelector)];
    this.activeClass = activeClass;
    this.intervalMs = intervalMs;
    this.index = 0;
    this._timerId = null;
  }

  init() {
    if (this.items.length === 0) return this;
    this._revealText();
    this._show(0);
    this._start();
    return this;
  }

  _revealText() {
    // النص محفوظ في data-text ليبقى مخفيًا عن أي تحليل نصي مبكر ثم يُظهر عبر JS
    this.items.forEach((el) => {
      el.textContent = el.getAttribute("data-text");
    });
  }

  _show(i) {
    this.items.forEach((el, idx) => {
      el.classList.toggle(this.activeClass, idx === i);
    });
  }

  _start() {
    this._timerId = setInterval(() => {
      this.index = (this.index + 1) % this.items.length;
      this._show(this.index);
    }, this.intervalMs);
  }

  /** إيقاف الدوران التلقائي (مثلاً عند مغادرة الصفحة أو إعادة التهيئة) */
  destroy() {
    if (this._timerId !== null) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }
}
