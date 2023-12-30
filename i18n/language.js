// Function to update content based on the selected language
function updateContent(langData) {
    document.querySelectorAll('[translate]').forEach(element => {
        const key = element.getAttribute('translate');
        element.textContent = langData[key];
    });
}

// Function to set the language preference
function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// Function to fetch language data
async function fetchLanguageData(lang) {
    const response = (await fetch(`i18n/${lang}.json`));
    return response.json();
}

// Function to change language
async function changeLanguage(lang) {
    setLanguagePreference(lang);    
    const langData = await fetchLanguageData(lang);
    updateContent(langData);
    toggleArabicStylesheet(lang); // Toggle Arabic stylesheet
}

// Function to toggle Arabic stylesheet based on language selection
function toggleArabicStylesheet(lang) {   
    if (lang === 'ar') {
        document.body.classList.add('direction');
    }
}

// Call updateContent() on page load
window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    toggleArabicStylesheet(userPreferredLanguage);
});
