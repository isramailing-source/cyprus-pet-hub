import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    common: {
      // Navigation
      home: "Home",
      community: "Community",
      forum: "Forum", 
      discussions: "Discussions",
      blog: "Blog",
      admin: "Admin",
      
      // Actions
      signIn: "Sign In",
      signOut: "Sign Out",
      account: "Account",
      profile: "Profile",
      adminDashboard: "Admin Dashboard",
      joinDiscussions: "Join Discussions",
      startDiscussion: "Start Discussion",
      
      // Pet Care Topics
      age: "Age",
      breed: "Breed",
      location: "Location", 
      petCare: "Pet Care",
      training: "Training",
      health: "Health",
      nutrition: "Nutrition",
      
      // Search  
      searchPlaceholder: "Search articles, guides, and discussions...",
      
      // Featured sections
      featuredDiscussions: "Featured Discussions",
      featuredDiscussionsDescription: "Join conversations with fellow pet enthusiasts",
      discussionCategories: "Discussion Categories",
      viewAllDiscussions: "Join All Discussions",
      latestTopics: "Latest Topics",
      popularGuides: "Popular Guides",
      
      // Forum specific
      replies: "Replies",
      views: "Views",  
      lastReply: "Last Reply",
      by: "by",
      
      // Footer
      aboutUs: "About Us",
      contactUs: "Contact Us", 
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      
      // General
      loading: "Loading...",
      error: "Error",
      noResults: "No results found", 
      tryAgain: "Try Again",
      
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
      forum: "Φόρουμ",
      discussions: "Συζητήσεις",
      blog: "Ιστολόγιο",
      admin: "Διαχείριση",
      
      // Actions
      signIn: "Σύνδεση",
      signOut: "Αποσύνδεση",
      account: "Λογαριασμός",
      profile: "Προφίλ",
      adminDashboard: "Πίνακας Διαχείρισης",
      joinDiscussions: "Συμμετοχή στις Συζητήσεις",
      startDiscussion: "Ξεκινήστε Συζήτηση",
      
      // Pet Care Topics
      age: "Ηλικία",
      breed: "Ράτσα",
      location: "Τοποθεσία",
      petCare: "Φροντίδα Κατοικίδιων",
      training: "Εκπαίδευση",
      health: "Υγεία",
      nutrition: "Διατροφή",
      
      // Search
      searchPlaceholder: "Αναζήτηση άρθρων, οδηγών και συζητήσεων...",
      
      // Featured sections
      featuredDiscussions: "Προτεινόμενες Συζητήσεις",
      featuredDiscussionsDescription: "Συμμετάσχετε σε συνομιλίες με άλλους λάτρεις των κατοικίδιων",
      discussionCategories: "Κατηγορίες Συζητήσεων",
      viewAllDiscussions: "Συμμετοχή σε Όλες τις Συζητήσεις",
      latestTopics: "Τελευταία Θέματα",
      popularGuides: "Δημοφιλείς Οδηγοί",
      
      // Forum specific
      replies: "Απαντήσεις",
      views: "Προβολές",
      lastReply: "Τελευταία Απάντηση",
      by: "από",
      
      // Footer
      aboutUs: "Σχετικά με εμάς",
      contactUs: "Επικοινωνία",
      privacyPolicy: "Πολιτική Απορρήτου",
      termsOfService: "Όροι Χρήσης",
      
      // General
      loading: "Φόρτωση...",
      error: "Σφάλμα",
      noResults: "Δεν βρέθηκαν αποτελέσματα",
      tryAgain: "Προσπαθήστε Ξανά",
      
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
      forum: "Форум",
      discussions: "Обсуждения",
      blog: "Блог",
      admin: "Админ",
      
      // Actions
      signIn: "Войти",
      signOut: "Выйти",
      account: "Аккаунт",
      profile: "Профиль",
      adminDashboard: "Панель Администратора",
      joinDiscussions: "Присоединиться к Обсуждениям",
      startDiscussion: "Начать Обсуждение",
      
      // Pet Care Topics
      age: "Возраст",
      breed: "Порода",
      location: "Местоположение",
      petCare: "Уход за Питомцами",
      training: "Обучение",
      health: "Здоровье", 
      nutrition: "Питание",
      
      // Search
      searchPlaceholder: "Поиск статей, руководств и обсуждений...",
      
      // Featured sections
      featuredDiscussions: "Рекомендуемые Обсуждения",
      featuredDiscussionsDescription: "Присоединяйтесь к беседам с другими любителями питомцев",
      discussionCategories: "Категории Обсуждений",
      viewAllDiscussions: "Присоединиться ко Всем Обсуждениям", 
      latestTopics: "Последние Темы",
      popularGuides: "Популярные Руководства",
      
      // Forum specific
      replies: "Ответы",
      views: "Просмотры",
      lastReply: "Последний Ответ", 
      by: "от",
      
      // Footer
      aboutUs: "О нас",
      contactUs: "Связаться с нами",
      privacyPolicy: "Политика Конфиденциальности",
      termsOfService: "Условия Использования",
      
      // General
      loading: "Загрузка...",
      error: "Ошибка",
      noResults: "Результаты не найдены",
      tryAgain: "Попробовать Снова",
      
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