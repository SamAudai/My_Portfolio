"use strict";

/**
 * FormSubmitter
 * -------------
 * مسؤول فقط عن إرسال النموذج (عادة إلى Google Apps Script) وإدارة
 * مؤشرات التحميل/النجاح/الخطأ المرتبطة به.
 */
export class FormSubmitter {
  /**
   * @param {Object} [config]
   * @param {string} [config.formId]
   * @param {string} [config.loaderId]
   * @param {string} [config.submitBtnId]
   * @param {string} [config.msgId]
   * @param {number} [config.successMessageDurationMs]
   */
  constructor({
    formId = "form-submit",
    loaderId = "loader",
    submitBtnId = "submitBtn",
    msgId = "msg",
    successMessageDurationMs = 2000,
  } = {}) {
    this.form = document.getElementById(formId);
    this.loader = document.getElementById(loaderId);
    this.submitBtn = document.getElementById(submitBtnId);
    this.msg = document.getElementById(msgId);
    this.successMessageDurationMs = successMessageDurationMs;
  }

  init() {
    if (!(this.form instanceof HTMLFormElement)) return this;
    this.form.addEventListener("submit", (e) => this._handleSubmit(e));
    return this;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    this._setLoading(true);

    try {
      await this._send();
      this._showSuccess();
      this.form.reset();
    } catch (err) {
      this._showError(err);
    } finally {
      this._setLoading(false);
    }
  }

  async _send() {
    const scriptURL = this.form.getAttribute("action") || "";
    const data = new FormData(this.form);
    const res = await fetch(scriptURL, { method: "POST", body: data });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }

  _setLoading(isLoading) {
    if (this.loader) this.loader.style.display = isLoading ? "block" : "none";
    this.submitBtn?.classList.toggle("disabled", isLoading);
  }

  _showSuccess() {
    if (!this.msg) return;
    this.msg.style.display = "block";
    setTimeout(() => {
      this.msg.style.display = "none";
    }, this.successMessageDurationMs);
  }

  _showError(err) {
    const text = err?.message ?? "Unknown error";
    alert(`Error: ${text}`);
  }
}
