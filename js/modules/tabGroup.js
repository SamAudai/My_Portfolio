"use strict";

/**
 * TabGroup
 * --------
 * مكوّن عام لأي مجموعة "أزرار تبديل تُظهر عنصر هدف مقابل"، ويحفظ
 * آخر اختيار في التخزين ويستعيده عند التحميل.
 *
 * يحل محل الدالتين المكررتين سابقًا:
 *  - initSectionTabs   (أزرار .control -> أقسام .active-section)
 *  - initMyResumeTabs  (روابط .tab-link -> تبويبات .active-tab)
 *
 * لأن المنطق كان متطابقًا 100% بينهما (اختلاف فقط في الـ selectors
 * وأسماء الأصناف ومفاتيح التخزين)، تم استخراجه في كلاس واحد
 * (Open/Closed Principle: التوسّع عبر الإعدادات لا عبر تعديل الكلاس).
 */
export class TabGroup {
  /**
   * @param {Object} config
   * @param {string} config.triggerSelector      selector لعناصر التحكم القابلة للنقر
   * @param {string} config.activeTriggerClass    الصنف الذي يُضاف على عنصر التحكم النشط
   * @param {string} config.activeTargetClass      الصنف الذي يُضاف على العنصر الهدف النشط
   * @param {import("../utils/storage.js").StorageService} config.storage
   * @param {string} config.storageTriggerKey      مفتاح حفظ معرف عنصر التحكم النشط
   * @param {string} config.storageTargetKey       مفتاح حفظ معرف العنصر الهدف النشط
   */
  constructor({
    triggerSelector,
    activeTriggerClass,
    activeTargetClass,
    storage,
    storageTriggerKey,
    storageTargetKey,
  }) {
    this.triggers = [...document.querySelectorAll(triggerSelector)];
    this.activeTriggerClass = activeTriggerClass;
    this.activeTargetClass = activeTargetClass;
    this.storage = storage;
    this.storageTriggerKey = storageTriggerKey;
    this.storageTargetKey = storageTargetKey;
  }

  init() {
    if (this.triggers.length === 0) return this;
    this._restoreSavedState();
    this._bindClickEvents();
    return this;
  }

  _restoreSavedState() {
    const savedTriggerId = this.storage.get(this.storageTriggerKey, null);
    const savedTargetId = this.storage.get(this.storageTargetKey, null);

    if (savedTriggerId) {
      const trigger = this.triggers.find((t) => t.id === savedTriggerId);
      if (trigger) this._activateTrigger(trigger);
    }

    if (savedTargetId) {
      const target = document.getElementById(savedTargetId);
      if (target) this._activateTarget(target);
    }
  }

  _bindClickEvents() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        this._activateTrigger(trigger);

        const target = document.getElementById(trigger.dataset.id);
        if (target) this._activateTarget(target);

        this.storage.set(this.storageTriggerKey, trigger.id || "");
        this.storage.set(this.storageTargetKey, trigger.dataset.id || "");
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    });
  }

  _activateTrigger(trigger) {
    document
      .querySelector(`.${this.activeTriggerClass}`)
      ?.classList.remove(this.activeTriggerClass);
    trigger.classList.add(this.activeTriggerClass);
  }

  _activateTarget(target) {
    document
      .querySelector(`.${this.activeTargetClass}`)
      ?.classList.remove(this.activeTargetClass);
    target.classList.add(this.activeTargetClass);
  }
}
