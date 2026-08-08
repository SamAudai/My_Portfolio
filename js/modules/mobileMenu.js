"use strict";

/**
 * MobileMenu
 * ----------
 * مسؤول فقط عن فتح/إغلاق القائمة الجانبية للشاشات الصغيرة عبر
 * checkbox مخفي + أنيميشن Web Animations API.
 */
export class MobileMenu {
  /**
   * @param {Object} [config]
   * @param {string} [config.menuSelector]
   * @param {string} [config.checkboxSelector]
   * @param {string} [config.itemSelector]  عناصر داخل القائمة تُغلقها عند النقر
   * @param {string} [config.activeClass]
   */
  constructor({
    menuSelector = "#menu",
    checkboxSelector = "#checkbox",
    itemSelector = ".control",
    activeClass = "active",
  } = {}) {
    this.menu = document.querySelector(menuSelector);
    this.checkbox = document.querySelector(checkboxSelector);
    this.itemSelector = itemSelector;
    this.activeClass = activeClass;

    this.openKeyframes = [
      { transform: "translateX(-200px)", opacity: 0 },
      { transform: "translateX(0px)", opacity: 1 },
      { transform: "translateX(100px)", opacity: 1 },
      { transform: "translateX(0px)", opacity: 1 },
    ];
    this.closeKeyframes = [
      { transform: "translateX(0px)", opacity: 1 },
      { transform: "translateX(100px)", opacity: 1 },
      { transform: "translateX(-200px)", opacity: 0 },
    ];
    this.animationOptions = {
      duration: 700,
      easing: "ease-in-out",
      fill: "forwards",
    };
  }

  init() {
    if (!this.menu || !this.checkbox) return this;

    this.checkbox.addEventListener("change", () => this._handleCheckboxChange());
    this.menu.querySelectorAll(this.itemSelector).forEach((item) => {
      item.addEventListener("click", () => this._closeIfOpen());
    });
    return this;
  }

  _handleCheckboxChange() {
    if (this.checkbox.checked) this._open();
    else this._close();
  }

  _open() {
    this.menu.classList.add(this.activeClass);
    this.menu.animate(this.openKeyframes, this.animationOptions);
  }

  _close() {
    // ملاحظة: "animationend" لا يُطلَق مع element.animate() (Web Animations API)،
    // لذلك نستخدم Animation.finished وهي الطريقة الصحيحة لمعرفة انتهاء الحركة.
    const closeAnim = this.menu.animate(this.closeKeyframes, this.animationOptions);
    closeAnim.finished
      .then(() => this.menu.classList.remove(this.activeClass))
      .catch(() => {
        // تجاهل الإلغاء (مثلاً عند بدء أنيميشن آخر قبل الانتهاء)
      });
  }

  _closeIfOpen() {
    if (!this.checkbox.checked) return;
    this.checkbox.checked = false;
    this._close();
  }
}
