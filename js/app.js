"use strict";

/**
 * app.js — نقطة الدخول (Composition Root)
 * -----------------------------------------
 * المكان الوحيد الذي "يعرف" بكل الوحدات ويربطها ببعضها.
 * كل وحدة (ThemeManager, TabGroup, ...) لا تستورد ولا تعرف بوجود
 * أي وحدة أخرى — وهذا هو معنى Loose Coupling عمليًا هنا.
 *
 * يتطلب تضمينه في HTML كوحدة ES Module:
 *   <script type="module" src="js/app.js"></script>
 * (بدلاً من تضمين main.js و language.js كسكربتين منفصلين)
 */
import { StorageService } from "./utils/storage.js";
import { TabGroup } from "./modules/tabGroup.js";
import { ThemeManager } from "./modules/themeManager.js";
import { FormSubmitter } from "./modules/formSubmitter.js";
import { TextCarousel } from "./modules/textCarousel.js";
import { MobileMenu } from "./modules/mobileMenu.js";
import { BrokenLinkGuard } from "./modules/brokenLinkGuard.js";
import { LanguageManager } from "./modules/languageManager.js";
import { ControlsAutoHide } from"./modules/ControlsAutoHide.js";

document.addEventListener("DOMContentLoaded", () => {
  const storage = new StorageService();

  // تبديل الأقسام الرئيسية (كان initSectionTabs)
  new TabGroup({
    triggerSelector: ".control",
    activeTriggerClass: "active-btn",
    activeTargetClass: "active-section",
    storage,
    storageTriggerKey: "activeButton",
    storageTargetKey: "activeSection",
  }).init();

  // تبويبات قسم السيرة الذاتية (كان initMyResumeTabs)
  new TabGroup({
    triggerSelector: ".tab-link",
    activeTriggerClass: "active-link",
    activeTargetClass: "active-tab",
    storage,
    storageTriggerKey: "activeLink",
    storageTargetKey: "activeContent",
  }).init();

  new ThemeManager({ storage }).init();
  new TextCarousel().init();
  new FormSubmitter().init();
  new MobileMenu().init();
  new BrokenLinkGuard().init();
  new LanguageManager({ storage }).init();
  new ControlsAutoHide().init();
});
