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
    window.location.reload(); 
    toggleArabicStyle(lang); // Toggle Arabic stylesheet    
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
    //toggleArabicStyle(lang); // Toggle Arabic stylesheet  
    updateContent(langData);          
}

// Function to toggle Arabic stylesheet based on language selection
function toggleArabicStyle(lang) {   
    if (lang === 'ar') {
        document.body.classList.add('arabic');
    }
}

// Function to toggle Arabic/English display based on language selection
function toggleArabicEnglish(lang) {   
    if (lang === 'ar') {
        document.getElementById('en').style.display = "block";
        document.getElementById('ar').style.display = "none";
    }
    else if(lang === 'en'){
        document.getElementById('ar').style.display = "block";
        document.getElementById('en').style.display = "none";
    }
}

// Call updateContent() on page load
this.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    const langData = await fetchLanguageData(userPreferredLanguage);
    toggleArabicStyle(userPreferredLanguage);
    toggleArabicEnglish(userPreferredLanguage);   
    updateContent(langData);
});
