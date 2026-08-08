# إعادة هيكلة main.js + language.js

## كيفية الربط في HTML

استبدل السكربتين القديمين:

```html
<script src="main.js"></script>
<script src="language.js"></script>
```

بسكربت واحد من نوع module:

```html
<script type="module" src="js/app.js"></script>
```

> ملاحظة: ملفات ES Modules تُحمَّل عبر HTTP/HTTPS فقط (لن تعمل بفتح
> الملف مباشرة عبر `file://`). أثناء التطوير المحلي شغّل أي سيرفر
> بسيط، مثلًا: `python -m http.server` أو Live Server في VS Code.

## بنية المشروع

```
js/
├── app.js                      # نقطة الدخول (Composition Root) — الوحيدة التي تعرف كل الوحدات
├── utils/
│   └── storage.js              # StorageService: غلاف موحّد وآمن حول localStorage
└── modules/
    ├── tabGroup.js              # TabGroup: يوحّد initSectionTabs + initMyResumeTabs
    ├── themeManager.js          # ThemeManager: الوضع الداكن/الفاتح
    ├── formSubmitter.js         # FormSubmitter: إرسال النموذج
    ├── textCarousel.js          # TextCarousel: دوران نصوص المهارات (كان initSkillsIntervial)
    ├── mobileMenu.js            # MobileMenu: قائمة الجوال (كان initToggleMenu)
    ├── brokenLinkGuard.js       # BrokenLinkGuard: روابط قيد الإنشاء (كان noneExisting)
    └── languageManager.js       # LanguageManager: الترجمة + الاتجاه (كان language.js بالكامل)
```

## أهم مبادئ SOLID / Loose Coupling المطبّقة

| المبدأ | كيف طُبِّق |
|---|---|
| **SRP** (مسؤولية واحدة) | كل كلاس يدير جانبًا واحدًا فقط: الثيم، أو النموذج، أو اللغة... إلخ. |
| **OCP** (مفتوح للتوسعة، مغلق للتعديل) | كل كلاس يقبل إعدادات عبر الـ constructor (selectors، مفاتيح تخزين...)، فيمكن استخدامه لسياق جديد دون تعديل الكلاس نفسه — وهذا بالضبط كيف تم توحيد `TabGroup` لخدمة حالتين مختلفتين (الأقسام والتبويبات) بنفس الكود. |
| **DIP** (انعكاس التبعية) | كل وحدة تحتاج تخزينًا تستقبل `StorageService` كتبعية محقونة، بدل استدعاء `localStorage` مباشرة في كل مكان. |
| **Loose Coupling** | لا توجد وحدة تستورد وحدة أخرى غير `storage.js`. الربط بينها كلها يحدث فقط في `app.js`. يمكن حذف أي وحدة أو استبدالها دون التأثير على البقية. |
| **High Cohesion** | كل ما يخص "الثيم" مثلًا (القراءة، التطبيق، الحفظ، التبديل) مُجمَّع داخل `ThemeManager` فقط، ولا يتوزع بين عدة أماكن. |

## إصلاحات وظيفية أُدمجت أثناء إعادة الهيكلة

- **ظهور أيقونتي الشمس/القمر معًا عند أول تحميل**: كان الكود لا يُطبّق أي حالة
  في أول زيارة (مسار `matchMedia` كان يستخدم قيمة خاطئة `dark-mode` بدل
  `dark` فلا يتفعّل أبدًا)، فتبقى الأيقونتان بدون `display` محدد. تم إصلاحه
  في `themeManager.js` بحيث تُحسب الحالة الابتدائية وتُطبَّق دائمًا.
- **`animationend` لا يُطلَق مع `element.animate()`**: تم استبداله بـ
  `Animation.finished` في `mobileMenu.js`.
- **تكرار كامل بين `initSectionTabs` و`initMyResumeTabs`**: تم توحيدهما في
  `TabGroup` القابل لإعادة الاستخدام.
- **تخزين `"null"` كسلسلة نصية حرفية في localStorage**: أصبح `StorageService`
  والوحدات المستخدمة له تحفظ قيمًا صريحة فقط.
- **إعادة جلب ملف الترجمة من الشبكة عند كل تبديل**: أضيف تخزين مؤقت
  (`Map`) داخل `LanguageManager` لكل لغة تم تحميلها سابقًا.
- **فرع ميت في `language.js`** كان يتعامل مع `lang` كأنه قد يكون كائنًا
  `{code}` رغم أنه لا يُستدعى بهذا الشكل من أي مكان — تمت إزالته (YAGNI).

## ملاحظات

- جميع أسماء الأصناف (`.control`, `.active-btn`, `.light-mode`, ...) بقيت
  كما هي تمامًا، فلا حاجة لتعديل أي شيء في CSS.
- عناصر HTML التي تعتمد عليها الوحدات (`#form-submit`, `#menu`,
  `#checkbox`, `.lang-btn`, ...) لم تتغيّر أسماؤها أو معرّفاتها.
- كل كلاس يتحقق من وجود عناصره قبل العمل عليها، فلن يكسر أي صفحة لا تحتوي
  على أحد هذه العناصر (مثلاً صفحة بلا نموذج تواصل).
