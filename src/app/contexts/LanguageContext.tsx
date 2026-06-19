"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Çeviri verileri
const translations = {
  tr: {
    // Ana Sayfa
    'about': 'Hakkımda',
    'interests': 'İlgi Alanları',
    'projects': 'Projeler',
    'certificates': 'Sertifikalar',
    'languages': 'Konuşulan Diller',
    'projects.coming.soon': 'Projeler bölümü yakında güncellenecek...',

    // Nav
    'nav.home': 'Ana Sayfa',
    'nav.research': 'Araştırma',
    'nav.whitepapers': 'Whitepaper',
    'nav.trades': 'Tradeler',
    'nav.cv': 'CV',

    // Hero
    'hero.eyebrow': 'Aktif olarak araştırıyor · METU Fizik',
    'hero.headline.1': 'Eren Ege Çelik',
    'hero.headline.2': 'fizikçi, ',
    'hero.headline.3': 'hesaplamalı sistemler',
    'hero.headline.4': ' kuruyor.',
    'hero.lede': 'METU Fizik 2. sınıf öğrencisi. Araştırmalarım bilgi teorisi, tersinir hesaplama ve hesaplama karmaşıklığı kesişiminde — Collatz, P vs NP, SHA-256 devre tasarımı. Şu sıralar Polymarket üzerinde gölge piyasa-yapıcılığı çalıştırıyorum.',
    'hero.cta.primary': 'Son whitepaper\'ı oku',
    'hero.cta.secondary': 'Araştırmaları gör',
    'hero.meta.location': 'Konum',
    'hero.meta.location.value': 'Ankara, TR',
    'hero.meta.updated': 'Son güncelleme',
    'hero.meta.active': 'Aktif çalışmalar',
    'hero.meta.active.value': '3 yazı · 1 bot',
    'hero.meta.contact': 'İletişim',

    // Sections
    'section.recent.research': 'Güncel Araştırma',
    'section.live.pnl': 'Canlı · paper PnL (son 24sa)',
    'section.projects': 'Projeler',
    'section.all': 'Tümü',
    'section.full.log': 'Tam log',

    // Trade ticker (mock)
    'trades.empty': 'Canlı feed bağlantısı yakında kurulacak. Şimdilik son tradeler gösteriliyor.',
    'trades.paper.pnl': 'paper PnL',

    // Status badges
    'status.active': 'Aktif',
    'status.live': 'Canlı',
    'status.draft': 'Taslak',
    'status.planned': 'Planlandı',
    'status.whitepaper': 'Whitepaper',

    // Coming soon
    'coming.soon': 'Yakında',
    'whitepapers.coming': 'Whitepaper koleksiyonu burada toplanacak — tersinir SAT devreleri, piyasa mikroyapısı, Collatz analizi.',
    'trades.coming': 'Polymarket gölge piyasa-yapıcı botunun canlı PnL\'i ve son tradeleri burada görünecek.',
    
    // Projeler
    'project.1.title': 'GridNode: Akıllı Dağıtık Hesaplama',
    'project.1.description': 'Hesaplama yoğunluklu iş yüklerini otomatik olarak analiz edip parçalara ayıran ve heterojen bulut/uç düğümler arasında optimize ederek dağıtan bir orkestrasyon sistemi. Grafik bölümleme, altmodüler optimizasyon ve güven temelli modeller kullanarak maliyeti düşürürken güvenilirliği artırır.',
    'project.2.title': 'Teorik Matematik Araştırması',
    'project.2.description': 'Collatz konjektürü, tersinir hesaplama ve P vs NP gibi problemleri mantık ve bilgi teorisini birleştirerek bağımsız olarak araştırıyorum.',
    'project.3.title': 'Mobil ve Web Uygulama Geliştirme',
    'project.3.description': 'Kişisel ve işbirlikçi kullanım için mobil uygulamalar ve web siteleri geliştirdim. Kullanıcı deneyimi ve sistem mantığına odaklanıyorum.',
    'detailed.cv': 'Detaylı CV',
    'cv.pdf': 'CV (PDF)',
    'research.publications': 'Araştırmalar',
    
    // Hakkımda metni
    'about.text': 'Orta Doğu Teknik Üniversitesi (ODTÜ) Fizik bölümü ikinci sınıf öğrencisiyim. İlk yılımı İzmir Yüksek Teknoloji Enstitüsü (İYTE)\'de 3.56 GPA ile tamamladıktan sonra ODTÜ\'ye yatay geçiş yaptım. Hem teorik hem de uygulamalı fizik ile kuantum hesaplama konularında güçlü bir tutkuya sahibim. Akademik ilgi alanlarım Collatz konjektürü, P vs NP, tersinir hesaplama ve bilgi teorisinin fizik ve bilgisayar bilimi ile entegrasyonu gibi temel problemler etrafında şekilleniyor. C, C# ve Python dillerinde yetkinim ve birçok mobil uygulama ve website geliştirdim, bu da full-stack geliştirme ve kullanıcı odaklı tasarım becerilerimi güçlendirdi. Ayrıca tersinir mantık ve kriptografik sistemleri içeren bir proje dahil olmak üzere bağımsız araştırma projeleri yürüttüm ve bilgiyi koruyan yeni hesaplama modellerini keşfetmeyi hedefliyorum. Yakın zamanda Almanya\'da bir yarı iletken şirketinde staj yaptım ve burada çip üretim teknolojilerinde hands-on deneyim kazandım. Hedefim, bilim ve teknolojinin öncüsü olan disiplinler arası ekiplerle işbirliği yaparak kuantum hesaplama ve hesaplamalı fizik alanında öncü araştırmalara katkıda bulunmaktır.',
    
    // ProfileCard kısa özet
    'profile.short.bio': 'ODTÜ Fizik ikinci sınıf öğrencisi. Kuantum hesaplama ve hesaplamalı fizik alanında öncü araştırmalara katkıda bulunmayı hedefliyorum.',
    
    // CV Sayfası
    'cv.title': 'Özgeçmiş',
    'back.to.home': '← Ana Sayfa',
    'personal.info': 'Kişisel Bilgiler',
    'education': 'Eğitim',
    'experience': 'İş Deneyimi',
    'skills': 'Teknik Beceriler',
    'download.full.cv': 'Tam CV\'yi PDF Olarak İndir',
    
    // CV Detayları
    'cv.name': 'Ad Soyad',
    'cv.email': 'E-posta',
    'cv.phone': 'Telefon',
    'cv.department': 'Bölüm',
    'cv.class': 'Sınıf',
    'cv.focus.areas': 'Odak Alanları',
    'cv.transcript.download': 'Transkript İndir',
    'cv.courses.taken': 'Alınan Dersler',
    'cv.course': 'Ders',
    'cv.status': 'Durum',
    'cv.successfully.completed': 'Başarıyla tamamlandı',
    'cv.description': 'Açıklama',
    'cv.kadir.has.summer': 'Kadir Has Üniversitesi - Yaz Okulu',
    'cv.12th.grade.summer': '12. Sınıf Yaz',
    'cv.kadir.has.description': 'Lise eğitimi sırasında üniversite düzeyinde dersler alarak akademik gelişimi destekleme',
    'cv.course.1.certificate': 'Augmented Electricity and Magnetism',
    'cv.course.2.certificate': 'Augmented Mechanics',
    'cv.ap.courses': 'Advanced Placement (AP) Dersleri',
    'cv.high.school.period': 'Lise Dönemi',
    'cv.program': 'Program',
    'cv.ap.description': 'Lise düzeyinde üniversite kredili dersler alarak akademik mükemmellik gösterme',
    'cv.ap.score.report': 'AP Skor Raporu İndir',
    'cv.ap.awards': 'AP Ödülleri İndir',
    'cv.high.school.education': 'Lise Eğitimi',
    'cv.graduation': 'Mezuniyet',
    'cv.special.achievements': 'Özel Başarılar',
    'cv.high.school.achievements': 'AP dersleri, 11. sınıfta üniversite yaz okulu, 12. sınıfta staj deneyimi',
    'cv.diploma.download': 'Diploma İndir',
    'cv.internship.title': 'Stajyer - Yarı İletken Teknolojileri',
    'cv.germany': 'Almanya',
    'cv.12th.grade.break': '12. Sınıf Ara Tatil',
    'cv.period': 'Dönem',
    'cv.internship.period': 'Lise son sınıf ara tatil dönemi',
    'cv.duties': 'Görevler',
    'cv.duty.1': 'Çip üretim süreçlerinde hands-on deneyim kazanma',
    'cv.duty.2': 'Yarı iletken teknolojilerinde araştırma ve gözlem',
    'cv.duty.3': 'Uygulamalı fizik ve teknoloji entegrasyonu öğrenme',
    'cv.duty.4': 'Uluslararası çalışma ortamında deneyim kazanma',
    'cv.duty.5': 'Alman iş kültürü ve teknik terminoloji öğrenme',
    'cv.achievements': 'Kazanımlar',
    'cv.internship.achievements': 'Teorik fizik bilgilerini endüstriyel uygulamalarla birleştirme, teknoloji sektöründe kariyer planlaması',
    'cv.internship.certificate': 'Staj Belgesi İndir',
    'cv.programming.languages': 'Programlama Dilleri',
    'cv.other.languages': 'Diğer diller',
    'cv.technologies.tools': 'Teknolojiler & Araçlar',
    'cv.other.tools': 'Diğer araçlar',
    'cv.academic.fields': 'Akademik Alanlar',
    'cv.theoretical.physics': 'Teorik Fizik',
    'cv.algorithm.analysis': 'Algoritma Analizi',
    'cv.quantum.computing': 'Kuantum Hesaplama',
    'cv.institution': 'Kurum',
    'cv.year': 'Yıl',
    'cv.score': 'Skor',
    'cv.certificate.download': 'Sertifika İndir',
    'cv.language.skills': 'Dil Becerileri',
    'cv.turkish': 'Türkçe',
    'cv.native': 'Ana Dil',
    'cv.english': 'İngilizce',
    'cv.advanced': 'İleri Seviye',
    'cv.german': 'Almanca',
    'cv.beginner': 'Başlangıç',
    
    // Eğitim
    'education.iztech': 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)',
    'education.physics': 'Fizik (Lisans)',
    'education.first.year': '1. Sınıf',
    'education.continuing': 'Devam Ediyor',
    'education.focus.areas': 'Teorik Fizik, Matematik, Bilgisayar Bilimi',
    
    // İlgi Alanları
    'interest.collatz': 'Collatz Konjektürü',
    'interest.p.vs.np': 'P vs NP Problemi',
    'interest.reversible': 'Tersinir Hesaplama',
    'interest.quantum': 'Kuantum Fiziği',
    'interest.algorithms': 'Algoritma Analizi',
    'interest.crypto': 'SHA-256 & Kriptografi',
    'interest.semiconductor': 'Yarıiletken Teknolojisi',
    
    // Diller
    'lang.turkish': 'Türkçe (Ana dil)',
    'lang.english': 'İngilizce (İleri seviye)',
    'lang.german': 'Almanca (Başlangıç)',

    // İndirmeler
    'downloads': 'İndirmeler',
    'download.gridnode': 'GridNode Test Paketi',
    'password.required': 'Şifre Gerekli',
    'enter.password': 'Bu dosyayı indirmek için lütfen şifreyi giriniz.',
    'password.placeholder': 'Şifre',
    'submit': 'Onayla',
    'wrong.password': 'Hatalı şifre, tekrar deneyiniz.',
    'download.ready': 'İndirme Hazır',
    'click.to.download': 'Dosyayı İndir',
  },
  en: {
    // Main Page
    'about': 'About',
    'interests': 'Interests',
    'projects': 'Projects',
    'certificates': 'Certificates',
    'languages': 'Languages',
    'projects.coming.soon': 'Projects section will be updated soon...',

    // Nav
    'nav.home': 'Home',
    'nav.research': 'Research',
    'nav.whitepapers': 'Whitepapers',
    'nav.trades': 'Trades',
    'nav.cv': 'CV',

    // Hero
    'hero.eyebrow': 'Actively researching · METU Physics',
    'hero.headline.1': 'Eren Ege Çelik',
    'hero.headline.2': 'physicist building ',
    'hero.headline.3': 'computational systems',
    'hero.headline.4': '.',
    'hero.lede': 'Second-year Physics at METU. Research at the intersection of information theory, reversible computing, and computational complexity — Collatz, P vs NP, SHA-256 circuit design. Currently running shadow market-making on Polymarket.',
    'hero.cta.primary': 'Read latest whitepaper',
    'hero.cta.secondary': 'View research',
    'hero.meta.location': 'Based in',
    'hero.meta.location.value': 'Ankara, TR',
    'hero.meta.updated': 'Last update',
    'hero.meta.active': 'Active threads',
    'hero.meta.active.value': '3 papers · 1 bot',
    'hero.meta.contact': 'Contact',

    // Sections
    'section.recent.research': 'Recent research',
    'section.live.pnl': 'Live · paper PnL (last 24h)',
    'section.projects': 'Projects',
    'section.all': 'All',
    'section.full.log': 'Full log',

    // Trade ticker (mock)
    'trades.empty': 'Live feed wiring coming soon. Showing recent trades for now.',
    'trades.paper.pnl': 'paper PnL',

    // Status badges
    'status.active': 'Active',
    'status.live': 'Live',
    'status.draft': 'Draft',
    'status.planned': 'Planned',
    'status.whitepaper': 'Whitepaper',

    // Coming soon
    'coming.soon': 'Coming soon',
    'whitepapers.coming': 'Whitepaper collection will gather here — reversible SAT circuits, market microstructure, Collatz analysis.',
    'trades.coming': 'Live PnL and recent trades from the Polymarket shadow market-making bot will appear here.',
    
    // Projects
    'project.1.title': 'GridNode: Intelligent Distributed Computing',
    'project.1.description': 'An intelligent distributed computing orchestration system that automatically analyzes compute-intensive workloads, decomposes them into parallelizable tasks using program slicing and dependency graph analysis, and optimally distributes execution across heterogeneous cloud and edge nodes—combining graph partitioning algorithms, submodular optimization for task assignment, and adaptive verification mechanisms to achieve significant cost reduction while maintaining reliability through data-locality-aware scheduling and reputation-based trust models.',
    'project.2.title': 'Theoretical Math Research',
    'project.2.description': 'Independently exploring problems such as the Collatz conjecture, reversible computation, and P vs NP through combining logic and information theory.',
    'project.3.title': 'Mobile & Web App Development',
    'project.3.description': 'Created mobile apps and websites for personal and collaborative use, with emphasis on user experience and system logic.',
    'detailed.cv': 'Detailed CV',
    'cv.pdf': 'CV (PDF)',
    'research.publications': 'Research',
    
    // About text
          'about.text': 'I am a second-year Physics student at Middle East Technical University (METU), having transferred from İzmir Institute of Technology (İZTECH) where I completed my first year with a 3.56 GPA. I have a strong passion for both theoretical and applied physics, as well as quantum computing. My academic interests revolve around foundational problems such as the Collatz conjecture, P vs NP, reversible computation, and the integration of information theory with physics and computer science. I am proficient in C, C#, and Python, and have developed several mobile applications and websites, which have strengthened my skills in full-stack development and user-focused design. I have also conducted independent research projects, including one involving reversible logic and cryptographic systems, aiming to explore new models of computation that preserve information. Recently, I completed an internship at a semiconductor company in Germany, where I gained hands-on experience in chip manufacturing technologies. My goal is to contribute to pioneering research in quantum computing and computational physics by collaborating with interdisciplinary teams working at the cutting edge of science and technology.',
      
      // ProfileCard short bio
      'profile.short.bio': 'Second-year Physics student at METU. Aiming to contribute to pioneering research in quantum computing and computational physics.',
    
    // CV Page
    'cv.title': 'Curriculum Vitae',
    'back.to.home': '← Home',
    'personal.info': 'Personal Information',
    'education': 'Education',
    'experience': 'Work Experience',
    'skills': 'Technical Skills',
    'download.full.cv': 'Download Full CV as PDF',
    
    // CV Details
    'cv.name': 'Name',
    'cv.email': 'Email',
    'cv.phone': 'Phone',
    'cv.department': 'Department',
    'cv.class': 'Year',
    'cv.focus.areas': 'Focus Areas',
    'cv.transcript.download': 'Download Transcript',
    'cv.courses.taken': 'Courses Taken',
    'cv.course': 'Course',
    'cv.status': 'Status',
    'cv.successfully.completed': 'Successfully Completed',
    'cv.description': 'Description',
    'cv.kadir.has.summer': 'Kadir Has University - Summer School',
    'cv.12th.grade.summer': '12th Grade Summer',
    'cv.kadir.has.description': 'Taking university-level courses during high school to support academic development',
    'cv.course.1.certificate': 'Augmented Electricity and Magnetism',
    'cv.course.2.certificate': 'Augmented Mechanics',
    'cv.ap.courses': 'Advanced Placement (AP) Courses',
    'cv.high.school.period': 'High School Period',
    'cv.program': 'Program',
    'cv.ap.description': 'Taking university-credit courses at high school level to demonstrate academic excellence',
    'cv.ap.score.report': 'Download AP Score Report',
    'cv.ap.awards': 'Download AP Awards',
    'cv.high.school.education': 'High School Education',
    'cv.graduation': 'Graduation',
    'cv.special.achievements': 'Special Achievements',
    'cv.high.school.achievements': 'AP courses, university summer school in 11th grade, internship in 12th grade',
    'cv.diploma.download': 'Download Diploma',
    'cv.internship.title': 'Intern - Semiconductor Technologies',
    'cv.germany': 'Germany',
    'cv.12th.grade.break': '12th Grade Break',
    'cv.period': 'Period',
    'cv.internship.period': 'Senior year break period',
    'cv.duties': 'Duties',
    'cv.duty.1': 'Gaining hands-on experience in chip production processes',
    'cv.duty.2': 'Research and observation in semiconductor technologies',
    'cv.duty.3': 'Learning applied physics and technology integration',
    'cv.duty.4': 'Gaining experience in international work environment',
    'cv.duty.5': 'Learning German work culture and technical terminology',
    'cv.achievements': 'Achievements',
    'cv.internship.achievements': 'Combining theoretical physics knowledge with industrial applications, career planning in technology sector',
    'cv.internship.certificate': 'Download Internship Certificate',
    'cv.programming.languages': 'Programming Languages',
    'cv.other.languages': 'Other languages',
    'cv.technologies.tools': 'Technologies & Tools',
    'cv.other.tools': 'Other tools',
    'cv.academic.fields': 'Academic Fields',
    'cv.theoretical.physics': 'Theoretical Physics',
    'cv.algorithm.analysis': 'Algorithm Analysis',
    'cv.quantum.computing': 'Quantum Computing',
    'cv.institution': 'Institution',
    'cv.year': 'Year',
    'cv.score': 'Score',
    'cv.certificate.download': 'Download Certificate',
    'cv.language.skills': 'Language Skills',
    'cv.turkish': 'Turkish',
    'cv.native': 'Native',
    'cv.english': 'English',
    'cv.advanced': 'Advanced',
    'cv.german': 'German',
    'cv.beginner': 'Beginner',
    
    // Education
    'education.iztech': 'Izmir Institute of Technology (IZTECH)',
    'education.physics': 'Physics (Bachelor)',
    'education.first.year': '1st Year',
    'education.continuing': 'Ongoing',
    'education.focus.areas': 'Theoretical Physics, Mathematics, Computer Science',
    
          // Interests
      'interest.collatz': 'Collatz Conjecture',
      'interest.p.vs.np': 'P vs NP Problem',
      'interest.reversible': 'Reversible Computing',
      'interest.quantum': 'Quantum Physics',
      'interest.algorithms': 'Algorithm Analysis',
      'interest.crypto': 'SHA-256 & Cryptography',
      'interest.semiconductor': 'Semiconductor Technology',
    
    // Languages
    'lang.turkish': 'Turkish (Native)',
    'lang.english': 'English (Advanced)',
    'lang.german': 'German (Beginner)',

    // Downloads
    'downloads': 'Downloads',
    'download.gridnode': 'GridNode Test Pack',
    'password.required': 'Password Required',
    'enter.password': 'Please enter the password to download this file.',
    'password.placeholder': 'Password',
    'submit': 'Submit',
    'wrong.password': 'Incorrect password, please try again.',
    'download.ready': 'Download Ready',
    'click.to.download': 'Download File',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['tr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 