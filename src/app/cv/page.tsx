"use client";
import { useRef, useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from '../contexts/LanguageContext';

interface CVSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

function CVSection({ title, children, icon }: CVSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.sectionCard} ${visible ? styles.sectionCardVisible : ""}`}>
      <h2>
        {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export default function CVPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.pageModern}>
      <LanguageSwitcher />
      {/* Header */}
      <div className={styles.cvHeader}>
        <Link href="/" className={styles.backButton}>
          {t('back.to.home')}
        </Link>
        <h1 className={styles.cvTitle}>{t('cv.title')}</h1>
        <div className={styles.cvSubtitle}>Eren Ege Çelik</div>
      </div>

      {/* Kişisel Bilgiler */}
      <CVSection title={t('personal.info')} icon="👤">
        <div className={styles.personalInfo}>
                      <div className={styles.infoGrid}>
              <div><strong>{t('cv.name')}:</strong> Eren Ege Çelik</div>
              <div><strong>{t('cv.email')}:</strong> <a href="mailto:erenegecelik62@gmail.com">erenegecelik62@gmail.com</a></div>
              <div><strong>GitHub:</strong> <a href="https://github.com/ErenEClk" target="_blank" rel="noopener noreferrer">github.com/ErenEClk</a></div>
            </div>
        </div>
      </CVSection>

      {/* Eğitim */}
      <CVSection title={t('education')} icon="🎓">
        <div className={styles.educationSection}>
          <div className={styles.educationItem}>
            <div className={styles.educationHeader}>
              <h3>Middle East Technical University (METU)</h3>
              <span className={styles.educationDate}>2025 - {t('education.continuing')}</span>
            </div>
            <div className={styles.educationDetails}>
              <p><strong>{t('cv.department')}:</strong> {t('education.physics')}</p>
              <p><strong>{t('cv.class')}:</strong> Second Year</p>
              <p><strong>Current GPA:</strong> 3.63/4.00</p>
              <p><strong>{t('cv.focus.areas')}:</strong> {t('education.focus.areas')}</p>
              <div className={styles.documentLinks}>
                <a href="/transkriptim.JPG" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 {t('cv.transcript.download')}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.educationItem}>
            <div className={styles.educationHeader}>
              <h3>İzmir Institute of Technology (İZTECH)</h3>
              <span className={styles.educationDate}>2024 - 2025</span>
            </div>
            <div className={styles.educationDetails}>
              <p><strong>{t('cv.department')}:</strong> {t('education.physics')}</p>
              <p><strong>{t('cv.class')}:</strong> First Year (Completed)</p>
              <p><strong>GPA:</strong> 3.56/4.00</p>
              <p><strong>Status:</strong> Transferred to METU</p>
            </div>
          </div>

          <div className={styles.educationItem}>
            <div className={styles.educationHeader}>
              <h3>{t('cv.kadir.has.summer')}</h3>
              <span className={styles.educationDate}>2023 ({t('cv.12th.grade.summer')})</span>
            </div>
            <div className={styles.educationDetails}>
              <p><strong>{t('cv.courses.taken')}:</strong> 2 {t('cv.course')}</p>
              <p><strong>{t('cv.status')}:</strong> {t('cv.successfully.completed')}</p>
              <p><strong>{t('cv.description')}:</strong> {t('cv.kadir.has.description')}</p>
              <div className={styles.documentLinks}>
                <a href="/documents/kadir-has-certificate-1.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 Augmented Electricity and Magnetism
                </a>
                <a href="/documents/kadir-has-certificate-2.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 Augmented Mechanics
                </a>
              </div>
            </div>
          </div>

          <div className={styles.educationItem}>
            <div className={styles.educationHeader}>
              <h3>{t('cv.ap.courses')}</h3>
              <span className={styles.educationDate}>{t('cv.high.school.period')}</span>
            </div>
            <div className={styles.educationDetails}>
              <p><strong>{t('cv.program')}:</strong> College Board Advanced Placement</p>
              <p><strong>{t('cv.status')}:</strong> {t('cv.successfully.completed')}</p>
              <p><strong>{t('cv.description')}:</strong> {t('cv.ap.description')}</p>
              <div className={styles.documentLinks}>
                <a href="/documents/ap-score-report.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 {t('cv.ap.score.report')}
                </a>
                <a href="/documents/ap-awards.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 {t('cv.ap.awards')}
                </a>
              </div>
            </div>
          </div>
          
          <div className={styles.educationItem}>
            <div className={styles.educationHeader}>
              <h3>{t('cv.high.school.education')}</h3>
              <span className={styles.educationDate}>2020 - 2024</span>
            </div>
            <div className={styles.educationDetails}>
              <p><strong>{t('cv.graduation')}:</strong> 2024</p>
              <p><strong>{t('cv.special.achievements')}:</strong> {t('cv.high.school.achievements')}</p>
              <div className={styles.documentLinks}>
                <a href="/documents/diploma.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 {t('cv.diploma.download')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CVSection>

      {/* Deneyim */}
      <CVSection title={t('experience')} icon="💼">
        <div className={styles.experienceSection}>
          <div className={styles.experienceItem}>
            <div className={styles.experienceHeader}>
              <h3>{t('cv.internship.title')}</h3>
              <span className={styles.experienceLocation}>{t('cv.germany')}</span>
                              <span className={styles.experienceDate}>2023 ({t('cv.12th.grade.break')})</span>
            </div>
            <div className={styles.experienceDetails}>
              <p><strong>{t('cv.period')}:</strong> {t('cv.internship.period')}</p>
              <p><strong>{t('cv.duties')}:</strong></p>
              <ul>
                <li>{t('cv.duty.1')}</li>
                <li>{t('cv.duty.2')}</li>
                <li>{t('cv.duty.3')}</li>
                <li>{t('cv.duty.4')}</li>
                <li>{t('cv.duty.5')}</li>
              </ul>
              <p><strong>{t('cv.achievements')}:</strong> {t('cv.internship.achievements')}</p>
              <div className={styles.documentLinks}>
                <a href="/documents/internship-certificate.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📄 {t('cv.internship.certificate')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CVSection>

      {/* Projeler - Geçici olarak kaldırıldı */}
      {/* 
      <CVSection title="Projeler" icon="🚀">
        <div className={styles.projectsSection}>
          <p style={{ color: "#e0e6ed", fontStyle: "italic" }}>
            Projeler bölümü yakında güncellenecek...
          </p>
        </div>
      </CVSection>
      */}


      {/* Sertifikalar */}
      <CVSection title={t('certificates')} icon="🏆">
        <div className={styles.certificatesSection}>
          <div className={styles.certificateItem}>
            <h3>TOEFL IBT</h3>
            <p><strong>{t('cv.institution')}:</strong> ETS</p>
            <p><strong>{t('cv.year')}:</strong> 2024</p>
            <p><strong>{t('cv.score')}:</strong> [{t('cv.score')}]</p>
            <div className={styles.documentLinks}>
              <a href="/documents/toefl-certificate.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                📄 {t('cv.certificate.download')}
              </a>
            </div>
          </div>

          <div className={styles.certificateItem}>
            <h3>Advanced Placement (AP) Awards</h3>
            <p><strong>{t('cv.institution')}:</strong> College Board</p>
            <p><strong>{t('cv.year')}:</strong> {t('cv.high.school.period')}</p>
            <div className={styles.documentLinks}>
              <a href="/documents/ap-awards.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                📄 {t('cv.ap.awards')}
              </a>
              <a href="/documents/ap-score-report.pdf" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                📄 {t('cv.ap.score.report')}
              </a>
            </div>
          </div>
        </div>
      </CVSection>

      {/* Diller */}
      <CVSection title={t('cv.language.skills')} icon="🌍">
        <div className={styles.languagesSection}>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>{t('cv.turkish')}</span>
            <span className={styles.languageLevel}>{t('cv.native')}</span>
          </div>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>{t('cv.english')}</span>
            <span className={styles.languageLevel}>{t('cv.advanced')} (TOEFL IBT)</span>
          </div>
          <div className={styles.languageItem}>
            <span className={styles.languageName}>{t('cv.german')}</span>
            <span className={styles.languageLevel}>{t('cv.beginner')}</span>
          </div>
        </div>
      </CVSection>

      {/* CV İndir */}
      <div className={styles.downloadSection}>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
          📄 {t('download.full.cv')}
        </a>
      </div>
    </div>
  );
} 