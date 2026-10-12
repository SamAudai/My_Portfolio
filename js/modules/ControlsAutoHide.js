"use strict";

/**
 * ControlsAutoHide
 * ----------------
 * مسؤول فقط عن إخفاء/إظهار شرائط التحكم (مثل .controls و .tools) أثناء التمرير:
 *  - يخفي الشرائط عند التمرير للأسفل.
 *  - يظهرها عند التمرير للأعلى.
 *  - يظهرها دائمًا في أعلى الصفحة.
 *  - يظهرها تلقائيًا بعد توقف التمرير.
 *  - يظهرها عند تغيير القسم، تغيير حجم النافذة، أو العودة للتبويب.
 *  - يلتقط التمرير من أي حاوية داخلية عبر `capture: true`.
 *  - يحترم تفضيل المستخدم لتقليل الحركة (`prefers-reduced-motion`).
 */
export class ControlsAutoHide {
  /**
   * @param {Object}  [config]
   * @param {string}  [config.controlsSelector]   محدّد العناصر (يمكن أن يشمل أكثر من واحد)
   * @param {string}  [config.hideClass]          الصنف المُضاف عند الإخفاء
   * @param {number}  [config.hideThreshold]      أدنى مسافة تمرير قبل السماح بالإخفاء
   * @param {number}  [config.scrollDelta]        حساسية التمرير (تجاهل الحركات الصغيرة)
   * @param {number}  [config.showTimeoutMs]      إظهار تلقائي بعد التوقف (مللي ثانية)
   * @param {string}  [config.sectionChangedEvent] اسم الحدث المخصص عند تغيير القسم
   */
  constructor({
    controlsSelector = ".controls, .tools",
    hideClass = "hide-on-scroll",
    hideThreshold = 80,
    scrollDelta = 4,
    showTimeoutMs = 1200,
    sectionChangedEvent = "section:changed",
  } = {}) {
    // ✅ نُخزّن مصفوفة عناصر لتسهيل المرور عليها
    this.targets = Array.from(
      document.querySelectorAll(controlsSelector)
    );
    this.hideClass = hideClass;
    this.hideThreshold = hideThreshold;
    this.scrollDelta = scrollDelta;
    this.showTimeoutMs = showTimeoutMs;
    this.sectionChangedEvent = sectionChangedEvent;

    // حالة داخلية
    this._lastScroll = 0;
    this._ticking = false;
    this._showTimer = null;
    this._enabled = false;

    // ربط الدوال بالـ this
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._onSectionChanged = this._onSectionChanged.bind(this);
  }

  /**
   * تفعيل المراقبة وإرفاق جميع المستمعين.
   * @returns {ControlsAutoHide}
   */
  init() {
    // ✅ فحص فعّال: لا عناصر → لا شيء لفعله
    if (this.targets.length === 0) return this;

    // احترام تفضيل المستخدم لتقليل الحركة
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return this;
    }

    this._enabled = true;

    document.addEventListener("scroll", this._onScroll, {
      passive: true,
      capture: true,
    });
    document.addEventListener(
      this.sectionChangedEvent,
      this._onSectionChanged
    );
    window.addEventListener("resize", this._onResize, { passive: true });
    document.addEventListener(
      "visibilitychange",
      this._onVisibilityChange
    );

    // الحالة الابتدائية
    this._lastScroll = this._getScrollTop(window);
    this._show();

    return this;
  }

  /**
   * إزالة جميع المستمعين وتفريغ المؤقّتات.
   * @returns {ControlsAutoHide}
   */
  destroy() {
    if (!this._enabled) return this;

    document.removeEventListener("scroll", this._onScroll, { capture: true });
    document.removeEventListener(
      this.sectionChangedEvent,
      this._onSectionChanged
    );
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener(
      "visibilitychange",
      this._onVisibilityChange
    );

    clearTimeout(this._showTimer);
    this._showTimer = null;
    this._enabled = false;

    return this;
  }

  /* ============================================================
   * المستمعون (Handlers)
   * ============================================================ */

  _onScroll(e) {
    if (this._ticking) return;
    this._ticking = true;

    const value = this._getScrollTop(e.target);
    requestAnimationFrame(() => this._handleScroll(value));
  }

  _onResize() {
    this._show();
  }

  _onVisibilityChange() {
    if (!document.hidden) this._show();
  }

  _onSectionChanged() {
    this._show();
    this._scheduleShow();
  }

  /* ============================================================
   * منطق الإخفاء/الإظهار
   * ============================================================ */

  _handleScroll(current) {
    const diff = current - this._lastScroll;

    if (Math.abs(diff) < this.scrollDelta) {
      this._ticking = false;
      return;
    }

    if (current <= this.hideThreshold) {
      this._show();
    } else if (diff > 0) {
      this._hide();
    } else {
      this._show();
    }

    this._scheduleShow();
    this._lastScroll = current;
    this._ticking = false;
  }

  _hide() {
    // ✅ المرور على كل العناصر
    for (const el of this.targets) el.classList.add(this.hideClass);
  }

  _show() {
    for (const el of this.targets) el.classList.remove(this.hideClass);
  }

  _scheduleShow() {
    clearTimeout(this._showTimer);
    this._showTimer = setTimeout(() => this._show(), this.showTimeoutMs);
  }

  /* ============================================================
   * مساعدات
   * ============================================================ */

  /**
   * قراءة قيمة التمرير من أي هدف (window / document / عنصر).
   * @param {EventTarget|Element|null} target
   * @returns {number}
   */
  _getScrollTop(target) {
    if (
      !target ||
      target === document ||
      target === window ||
      target === document.documentElement ||
      target === document.body
    ) {
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    }
    if (target instanceof Element) return target.scrollTop;
    return 0;
  }
}