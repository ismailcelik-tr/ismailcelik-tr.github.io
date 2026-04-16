document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Dynamic Year ---
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // --- Translation Engine ---
    const translations = {
        en: {
            "nav-about": "About",
            "nav-skills": "Skills",
            "nav-work": "Work",
            "nav-contact": "Contact",
            "hero-hi": "Hi",
            "hero-name": "I'm İsmail!",
            "hero-subtitle": "Specialist in Full-Stack & Mobile Development | AI, Data Science & Systems Architecture Enthusiast | Network & System Solutions",
            "hero-bio": "developing new apps is overly exciting. love problem solving in systems and networks. also i make things... 🧑‍💻",
            "hero-exp1": "Mobile Expertise",
            "hero-exp2": "Clean Code",
            "hero-exp3": "AI Integration",
            "about-title": "🔥 About Me",
            "about-card1-title": "Architecture",
            "about-card1-p": "Strong focus on systems programming, backend engineering, and high-performance solutions.",
            "about-card2-title": "Foundations",
            "about-card2-p": "Enjoy building things from scratch: network servers, parsers, and CLIs.",
            "about-card3-title": "Low-Level",
            "about-card3-p": "Interested in memory management, concurrency, I/O protocols, and performance tuning.",
            "tech-title": "🛠 Tech Stack & Skills",
            "tech-expanding-title": "🌟 Expanding the Horizon",
            "work-title": "🚀 What I'm Working On",
            "work-card1-title": "Advanced Architecture",
            "work-card1-p": "Implementing Clean Architecture and modular design patterns across mobile and backend.",
            "work-card2-title": "Web & Mobile Sync",
            "work-card2-p": "Developing unified experiences using React.js and high-performance cross-platform tools.",
            "work-card3-title": "AI & Data",
            "work-card3-p": "Integrating machine learning models into mobile environments for intelligent user experiences.",
            "work-card4-title": "Cloud Systems",
            "work-card4-p": "Architecting scalable and reliable cloud infrastructures using AWS, Docker, and Kubernetes.",
            "work-card5-title": "Automation & CI/CD",
            "work-card5-p": "Optimizing development workflows through automated pipelines and custom GitHub Actions.",
            "work-card6-title": "System Performance",
            "work-card6-p": "Monitoring and fine-tuning resource efficiency with high-performance system metrics.",
            "footer-title": "📫 Connect with Me",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-motto": "⚡ From Neural Data to Pixel Perfection.",
            "perspective-title": "🤝 Collaborative Strategy",
            "perspective-p1": "With years of experience in web and mobile application develop I have mastered the skills of understanding client requirements according to the latest trends. I have worked with businesses from different niches so you can rely on me for yours.",
            "perspective-p2": "I have a solid foundation in designing innovative mobile solutions that significantly improve user experience and accelerate business growth. My business background gives me a unique perspective on aligning technology with strategic objectives, ensuring my contributions are both technically sound and commercially viable. Having worked on various projects that are already live, I can help you with the best possible suggestions and ideas that we can proceed with. With me, you aren’t forced to accept anything. I give you a variety of options we can work on together.",
            "footer-copy": "© 2026 Ismail Celik | Licensed under MIT"
        },
        tr: {
            "nav-about": "Hakkımda",
            "nav-skills": "Yetenekler",
            "nav-work": "Çalışmalar",
            "nav-contact": "İletişim",
            "hero-hi": "Selam",
            "hero-name": "Ben İsmail!",
            "hero-subtitle": "Full-Stack ve Mobil Geliştirici | AI, Veri Bilimi ve Sistem Mimarisi Meraklısı | Ağ ve Sistem Çözümleri",
            "hero-bio": "yeni uygulamalar geliştirmek fazlasıyla heyecan verici. sistemlerde ve ağlarda problem çözmeyi seviyorum. ayrıca bir şeyler üretiyorum... 🧑‍💻",
            "hero-exp1": "Mobil Uzmanlık",
            "hero-exp2": "Temiz Kod",
            "hero-exp3": "AI Entegrasyonu",
            "about-title": "🔥 Hakkımda",
            "about-card1-title": "Mimari",
            "about-card1-p": "Sistem programlama, backend mühendisliği ve yüksek performanslı çözümlere güçlü odak.",
            "about-card2-title": "Temeller",
            "about-card2-p": "Her şeyi sıfırdan oluşturmayı seviyorum: ağ sunucuları, ayrıştırıcılar ve CLI araçları.",
            "about-card3-title": "Alt Seviye",
            "about-card3-p": "Bellek yönetimi, eşzamanlılık, G/Ç protokolleri ve performans optimizasyonu ile ilgileniyorum.",
            "tech-title": "🛠 Teknoloji Yığını & Yetenekler",
            "tech-expanding-title": "🌟 Ufku Genişletmek",
            "work-title": "🚀 Neler Üzerinde Çalışıyorum",
            "work-card1-title": "Gelişmiş Mimari",
            "work-card1-p": "Mobil ve backend genelinde Temiz Mimari ve modüler tasarım desenleri uygulama.",
            "work-card2-title": "Web & Mobil Senkronizasyon",
            "work-card2-p": "React.js ve yüksek performanslı platformlar arası araçlarla bütünleşik deneyimler geliştirme.",
            "work-card3-title": "AI & Veri",
            "work-card3-p": "Akıllı kullanıcı deneyimleri için makine öğrenimi modellerini mobil ortamlara entegre etme.",
            "work-card4-title": "Bulut Sistemleri",
            "work-card4-p": "AWS, Docker ve Kubernetes kullanarak ölçeklenebilir ve güvenilir bulut altyapıları oluşturma.",
            "work-card5-title": "Otomasyon & CI/CD",
            "work-card5-p": "Otomatik iş akışları ve özel GitHub Action'lar ile geliştirme süreçlerini optimize ediyorum.",
            "work-card6-title": "Sistem Performansı",
            "work-card6-p": "Yüksek performanslı sistem metrikleri ile kaynak verimliliğini izliyor ve ince ayarlar yapıyorum.",
            "footer-title": "📫 Benimle Bağlantı Kur",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-motto": "⚡ Sinirsel Veriden Piksel Mükemmelliğine.",
            "perspective-title": "🤝 İşbirlikçi Strateji",
            "perspective-p1": "Web ve mobil uygulama geliştirme konusundaki yılların deneyimiyle, en son trendlere göre müşteri gereksinimlerini anlama becerilerinde ustalaştım. Farklı nişlerden işletmelerle çalıştım, bu yüzden kendi işletmeniz için bana güvenebilirsiniz.",
            "perspective-p2": "Kullanıcı deneyimini önemli ölçüde iyileştiren ve iş büyümesini hızlandıran yenilikçi mobil çözümler tasarlama konusunda sağlam bir temele sahibim. İş geçmişim, teknolojiyi stratejik hedeflerle uyumlu hale getirme konusunda bana benzersiz bir bakış açısı sağlıyor; katkılarımın hem teknik olarak sağlam hem de ticari olarak uygulanabilir olmasını garanti ediyor. Hali hazırda yayında olan çeşitli projelerde çalışmış biri olarak, ilerleyebileceğimiz en iyi öneri ve fikirlerle size yardımcı olabilirim. Benimle çalışırken hiçbir şeyi kabul etmeye zorlanmazsınız; birlikte üzerinde çalışabileceğimiz çeşitli seçenekler sunarım.",
            "footer-copy": "© 2026 Ismail Celik | MIT Lisansı ile lisanslanmıştır"
        },
        fr: {
            "nav-about": "À propos",
            "nav-skills": "Compétences",
            "nav-work": "Travaux",
            "nav-contact": "Contact",
            "hero-hi": "Salut",
            "hero-name": "Je suis İsmail !",
            "hero-subtitle": "Développeur Full-Stack & Mobile | Passionné d'IA, Science des Données & Architecture Système | Solutions Réseau & Système",
            "hero-bio": "développer de nouvelles applications est passionnant. j'adore résoudre des problèmes dans les systèmes et les réseaux. je crée aussi des choses... 🧑‍💻",
            "hero-exp1": "Expertise Mobile",
            "hero-exp2": "Code Propre",
            "hero-exp3": "Intégration d'IA",
            "about-title": "🔥 À propos de moi",
            "about-card1-title": "Architecture",
            "about-card1-p": "Accent mis sur la programmation système, l'ingénierie backend et les solutions haute performance.",
            "about-card2-title": "Fondations",
            "about-card2-p": "J'aime construire à partir de zéro : serveurs réseau, parseurs et outils CLI.",
            "about-card3-title": "Bas Niveau",
            "about-card3-p": "Intéressé par la gestion de la mémoire, la concurrence, les protocoles E/S et l'optimisation des performances.",
            "tech-title": "🛠 Stack Tech & Compétences",
            "tech-expanding-title": "🌟 Élargir l'horizon",
            "work-title": "🚀 Mes Projets Actuels",
            "work-card1-title": "Architecture Avancée",
            "work-card1-p": "Mise en œuvre de la Clean Architecture et de modèles de conception modulaires.",
            "work-card2-title": "Synchro Web & Mobile",
            "work-card2-p": "Développement d'expériences unifiées avec React.js et des outils multiplateformes performants.",
            "work-card3-title": "IA & Données",
            "work-card3-p": "Intégration de modèles d'apprentissage automatique dans les environnements mobiles.",
            "work-card4-title": "Systèmes Cloud",
            "work-card4-p": "Conception d'infrastructures cloud évolutives avec AWS, Docker et Kubernetes.",
            "work-card5-title": "Automatisation & CI/CD",
            "work-card5-p": "Optimisation des flux de travail de développement via des pipelines automatisés et des Actions GitHub personnalisées.",
            "work-card6-title": "Performance Système",
            "work-card6-p": "Surveillance et optimisation de l'efficacité des ressources avec des métriques système haute performance.",
            "footer-title": "📫 Me Contacter",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "E-mail",
            "footer-motto": "⚡ Des données neuronales à la perfection des pixels.",
            "perspective-title": "🤝 Stratégie Collaborative",
            "perspective-p1": "Avec des années d'expérience dans le développement d'applications web et mobiles, j'ai acquis la maîtrise de la compréhension des besoins des clients selon les dernières tendances. J'ai travaillé avec des entreprises de différents secteurs, vous pouvez donc compter sur moi pour le vôtre.",
            "perspective-p2": "J'ai une base solide dans la conception de solutions mobiles innovantes qui améliorent considérablement l'expérience utilisateur et accélèrent la croissance de l'entreprise. Mon parcours professionnel me donne une perspective unique sur l'alignement de la technologie avec les objectifs stratégiques, garantissant que mes contributions sont à la fois techniquement solides et commercialement viables. Ayant travaillé sur divers projets déjà en ligne, je peux vous aider avec les meilleures suggestions et idées possibles pour progresser. Avec moi, vous n'êtes forcé de rien accepter ; je vous propose une variété d'options sur lesquelles nous pouvons travailler ensemble.",
            "footer-copy": "© 2026 Ismail Celik | Sous licence MIT"
        }
    };

    const updateLanguage = (lang) => {
        // Standard translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Translations with icon preservation
        const iconElements = document.querySelectorAll('[data-i18n-with-icon]');
        iconElements.forEach(el => {
            const key = el.getAttribute('data-i18n-with-icon');
            const iconName = el.getAttribute('data-icon');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = `<i data-lucide="${iconName}"></i> ${translations[lang][key]}`;
                if (window.lucide) lucide.createIcons();
            }
        });

        // Update selector UI (Flag Images)
        const flagUrls = {
            en: "https://flagcdn.com/w20/gb.png",
            tr: "https://flagcdn.com/w20/tr.png",
            fr: "https://flagcdn.com/w20/fr.png"
        };
        const flagImg = document.getElementById('current-lang-flag');
        const flagText = document.getElementById('current-lang-text');
        
        if (flagImg) flagImg.src = flagUrls[lang];
        if (flagText) flagText.textContent = lang.toUpperCase();

        localStorage.setItem('selectedLang', lang);
    };

    // Language Dropdown Logic
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');

    if (langDropdown) {
        document.querySelectorAll('.lang-dropdown button').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                updateLanguage(lang);
                langDropdown.style.display = 'none';
            });
        });
    }

    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = langDropdown.style.display === 'flex';
            langDropdown.style.display = isVisible ? 'none' : 'flex';
        });
    }

    document.addEventListener('click', () => {
        if (langDropdown) langDropdown.style.display = 'none';
    });

    // 1. Initial Theme & Lang Setup
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = (theme) => {
        body.classList.remove('theme-dark', 'theme-light', 'theme-auto');
        body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);
    };

    const currentLang = localStorage.getItem('selectedLang') || 'en';
    setTheme(getPreferredTheme());
    updateLanguage(currentLang);

    // 2. Theme Toggle Event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('theme-dark');
            const newTheme = isDark ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Scroll Reveal Effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // 5. Special Lightning Trigger
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('mouseover', () => {
            profileImg.style.animationDuration = '0.5s';
        });
        profileImg.addEventListener('mouseleave', () => {
            profileImg.style.animationDuration = '3s';
        });
    }
});
