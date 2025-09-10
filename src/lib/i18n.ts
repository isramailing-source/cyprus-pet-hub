import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    common: {
      // Navigation
      home: "Home",
      community: "Community",
      admin: "Admin",
      
      // Actions
      browsePets: "Browse Pets",
      postAd: "Post Ad",
      signIn: "Sign In",
      signOut: "Sign Out",
      account: "Account",
      profile: "Profile",
      adminDashboard: "Admin Dashboard",
      
      // Featured Section
      featuredPets: "Featured Pets",
      featuredPetsDescription: "Discover amazing pets looking for their forever homes in Cyprus",
      viewAllListings: "View All Listings",
      
      // Pet Details
      age: "Age",
      breed: "Breed",
      location: "Location",
      price: "Price",
      
      // Search & Filters
      searchPlaceholder: "Search for pets, equipment...",
      
      // Footer
      aboutUs: "About Us",
      contactUs: "Contact Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      
      // Common
      loading: "Loading...",
      error: "Error",
      noResultsFound: "No results found",
      
      // Languages
      language: "Language",
      english: "English",
      greek: "Ελληνικά",
      russian: "Русский"
    }
  },
  el: {
    common: {
      // Navigation
      home: "Αρχική",
      community: "Κοινότητα",
      admin: "Διαχείριση",
      
      // Actions
      browsePets: "Περιήγηση Κατοικίδια",
      postAd: "Δημοσίευση Αγγελίας",
      signIn: "Σύνδεση",
      signOut: "Αποσύνδεση",
      account: "Λογαριασμός",
      profile: "Προφίλ",
      adminDashboard: "Πίνακας Διαχείρισης",
      
      // Featured Section
      featuredPets: "Προτεινόμενα Κατοικίδια",
      featuredPetsDescription: "Ανακαλύψτε υπέροχα κατοικίδια που ψάχνουν για το αιώνιο σπίτι τους στην Κύπρο",
      viewAllListings: "Δείτε Όλες τις Αγγελίες",
      
      // Pet Details
      age: "Ηλικία",
      breed: "Ράτσα",
      location: "Τοποθεσία",
      price: "Τιμή",
      
      // Search & Filters
      searchPlaceholder: "Αναζήτηση κατοικίδιων, εξοπλισμού...",
      
      // Footer
      aboutUs: "Σχετικά με εμάς",
      contactUs: "Επικοινωνία",
      privacyPolicy: "Πολιτική Απορρήτου",
      termsOfService: "Όροι Χρήσης",
      
      // Common
      loading: "Φόρτωση...",
      error: "Σφάλμα",
      noResultsFound: "Δεν βρέθηκαν αποτελέσματα",
      
      // Languages
      language: "Γλώσσα",
      english: "English",
      greek: "Ελληνικά",
      russian: "Русский"
    }
  },
  ru: {
    common: {
      // Navigation
      home: "Главная",
      community: "Сообщество",
      admin: "Админ",
      
      // Actions
      browsePets: "Просмотр Питомцев",
      postAd: "Разместить Объявление",
      signIn: "Войти",
      signOut: "Выйти",
      account: "Аккаунт",
      profile: "Профиль",
      adminDashboard: "Панель Администратора",
      
      // Featured Section
      featuredPets: "Рекомендуемые Питомцы",
      featuredPetsDescription: "Откройте для себя удивительных питомцев, которые ищут свой дом навсегда на Кипре",
      viewAllListings: "Посмотреть Все Объявления",
      
      // Pet Details
      age: "Возраст",
      breed: "Порода",
      location: "Местоположение",
      price: "Цена",
      
      // Search & Filters
      searchPlaceholder: "Поиск питомцев, оборудования...",
      
      // Footer
      aboutUs: "О нас",
      contactUs: "Связаться с нами",
      privacyPolicy: "Политика Конфиденциальности",
      termsOfService: "Условия Использования",
      
      // Common
      loading: "Загрузка...",
      error: "Ошибка",
      noResultsFound: "Результаты не найдены",
      
      // Languages
      language: "Язык",
      english: "English",
      greek: "Ελληνικά",
      russian: "Русский"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['common'],
    defaultNS: 'common'
  });

export default i18n;