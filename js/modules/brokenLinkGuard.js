"use strict";

/**
 * BrokenLinkGuard
 * ---------------
 * مسؤول فقط عن منع سلوك الروابط غير المكتملة (placeholder links)
 * وإظهار رسالة توضيحية بدل الانتقال لرابط غير موجود.
 */
export class BrokenLinkGuard {
  /**
   * @param {Object} [config]
   * @param {string} [config.selector]
   * @param {string} [config.message]
   */
  constructor({
    selector = 'a[href="#nonexistent"]',
    message = "Attention: This link is currently under construction and will be activated soon.",
  } = {}) {
    this.selector = selector;
    this.message = message;
  }

  init() {
    document.querySelectorAll(this.selector).forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        alert(this.message);
      });
    });
    return this;
  }
}
