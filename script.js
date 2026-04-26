document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const commandPaletteTrigger = document.getElementById('command-palette-trigger');
    const commandPaletteOverlay = document.getElementById('command-palette-overlay');
    const commandPaletteInput = document.getElementById('command-palette-input');
    const commandPaletteResults = document.getElementById('command-palette-results');
    const commandPaletteClose = document.getElementById('command-palette-close');
    const commandPaletteTitle = document.getElementById('command-palette-title');
    const commandPaletteTriggerText = document.getElementById('command-palette-trigger-text');
    const updateModalOverlay = document.getElementById('update-modal-overlay');
    const updateModalCloseBtn = document.getElementById('modal-close');
    const certificationsList = document.getElementById('certifications-list');
    const certificationsOpenBtn = document.getElementById('certifications-open-modal');
    const certificationsModalOverlay = document.getElementById('certifications-modal-overlay');
    const certificationsModalBody = document.getElementById('certifications-modal-body');
    const certificationsModalCloseBtn = document.getElementById('certifications-modal-close');
    const certificationsModalTitle = document.getElementById('certifications-modal-title');
    let certificationsLastFocusedElement = null;

    // --- Dynamic Year ---
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // --- Translation Engine ---
    const translations = {
        en: {
            "nav-updates": "Updates",
            "nav-about": "About",
            "nav-certifications": "Certifications",
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
            "hero-exp4": "Cloud & DevOps",
            "hero-exp5": "AI & LLM Engineering",
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
            "certifications-title": "🏅 Certifications",
            "certifications-id-label": "Credential ID",
            "certifications-cta": "View Credential",
            "certifications-open-modal": "Browse all certifications",
            "certifications-modal-eyebrow": "Verified credentials",
            "certifications-modal-title": "All Certifications",
            "certifications-close-modal": "Close certifications modal",
            "certifications-verified-badge": "Verified certificate",
            "certifications-group-aws": "AWS",
            "certifications-group-google": "Google",
            "certifications-group-anthropic": "Anthropic",
            "certifications-group-linkedin": "LinkedIn",
            "certifications-group-ibm": "IBM",
            "certifications-group-other": "Other",
            "footer-title": "📫 Connect with Me",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-motto": "⚡ From Neural Data to Pixel Perfection.",
            "perspective-title": "🤝 Collaborative Strategy",
            "perspective-p1": "With years of experience in web and mobile application development, I have mastered the skill of understanding client requirements according to the latest trends. I have worked with businesses from different niches, so you can rely on me for yours.",
            "perspective-p2": "I have a solid foundation in designing innovative mobile solutions that significantly improve user experience and accelerate business growth. My business background gives me a unique perspective on aligning technology with strategic objectives, ensuring my contributions are both technically sound and commercially viable. Having worked on various live projects, I can help you with the best possible suggestions and ideas we can proceed with. With me, you aren’t forced to accept anything. I give you a variety of options we can work on together.",
            "footer-copy": "© 2026 Ismail Celik | Licensed under MIT",
            "updates-title": "📢 Latest Updates",
            "follow-linkedin": "Follow on LinkedIn",
            "command-trigger": "Quick Nav",
            "command-title": "Quick Navigation",
            "command-placeholder": "Search sections or commands...",
            "command-empty": "No matching command.",
            "command-go-updates": "Go to Latest Updates",
            "command-go-projects": "Go to Projects",
            "command-go-certifications": "Go to Certifications",
            "command-go-skills": "Go to Skills",
            "command-go-about": "Go to About",
            "command-go-strategy": "Go to Strategy",
            "command-go-contact": "Go to Contact",
            "command-toggle-theme": "Toggle Theme",
            "command-open-linkedin": "Open LinkedIn"
        },
        tr: {
            "nav-updates": "Güncel",
            "nav-about": "Hakkımda",
            "nav-certifications": "Sertifikalar",
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
            "hero-exp4": "Cloud & DevOps",
            "hero-exp5": "AI & LLM Engineering",
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
            "certifications-title": "🏅 Sertifikalar",
            "certifications-id-label": "Yeterlilik Kimliği",
            "certifications-cta": "Yeterlilik belgesini göster",
            "certifications-open-modal": "Tüm sertifikaları görüntüle",
            "certifications-modal-eyebrow": "Doğrulanmış yetkinlikler",
            "certifications-modal-title": "Tüm Sertifikalar",
            "certifications-close-modal": "Sertifika modalını kapat",
            "certifications-verified-badge": "Doğrulanmış sertifika",
            "certifications-group-aws": "AWS",
            "certifications-group-google": "Google",
            "certifications-group-anthropic": "Anthropic",
            "certifications-group-linkedin": "LinkedIn",
            "certifications-group-ibm": "IBM",
            "certifications-group-other": "Diğer",
            "footer-title": "📫 Benimle Bağlantı Kur",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-motto": "⚡ Sinirsel Veriden Piksel Mükemmelliğine.",
            "perspective-title": "🤝 İşbirlikçi Strateji",
            "perspective-p1": "Web ve mobil uygulama geliştirme konusundaki yılların deneyimiyle, en son trendlere göre müşteri gereksinimlerini anlama becerilerinde ustalaştım. Farklı nişlerden işletmelerle çalıştım, bu yüzden kendi işletmeniz için bana güvenebilirsiniz.",
            "perspective-p2": "Kullanıcı deneyimini önemli ölçüde iyileştiren ve iş büyümesini hızlandıran yenilikçi mobil çözümler tasarlama konusunda sağlam bir temele sahibim. İş geçmişim, teknolojiyi stratejik hedeflerle uyumlu hale getirme konusunda bana benzersiz bir bakış açısı sağlıyor; katkılarımın hem teknik olarak sağlam hem de ticari olarak uygulanabilir olmasını garanti ediyor. Hali hazırda yayında olan çeşitli projelerde çalışmış biri olarak, ilerleyebileceğimiz en iyi öneri ve fikirlerle size yardımcı olabilirim. Benimle çalışırken hiçbir şeyi kabul etmeye zorlanmazsınız; birlikte üzerinde çalışabileceğimiz çeşitli seçenekler sunarım.",
            "footer-copy": "© 2026 Ismail Celik | MIT Lisansı ile lisanslanmıştır",
            "updates-title": "📢 Güncel",
            "follow-linkedin": "LinkedIn'de Takip Et",
            "command-trigger": "Hızlı Geçiş",
            "command-title": "Hızlı Geçiş",
            "command-placeholder": "Bölüm veya komut ara...",
            "command-empty": "Eşleşen komut yok.",
            "command-go-updates": "Güncel bölümüne git",
            "command-go-projects": "Çalışmalara git",
            "command-go-certifications": "Sertifikalara git",
            "command-go-skills": "Yeteneklere git",
            "command-go-about": "Hakkımda bölümüne git",
            "command-go-strategy": "Strateji bölümüne git",
            "command-go-contact": "İletişime git",
            "command-toggle-theme": "Temayı değiştir",
            "command-open-linkedin": "LinkedIn aç"
        },
        fr: {
            "nav-updates": "Actualités",
            "nav-about": "À propos",
            "nav-certifications": "Certifications",
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
            "hero-exp4": "Cloud & DevOps",
            "hero-exp5": "Ingénierie IA & LLM",
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
            "certifications-title": "🏅 Certifications",
            "certifications-id-label": "ID du certificat",
            "certifications-cta": "Afficher le certificat",
            "certifications-open-modal": "Voir toutes les certifications",
            "certifications-modal-eyebrow": "Titres vérifiés",
            "certifications-modal-title": "Toutes les certifications",
            "certifications-close-modal": "Fermer la fenêtre des certifications",
            "certifications-verified-badge": "Certificat vérifié",
            "certifications-group-aws": "AWS",
            "certifications-group-google": "Google",
            "certifications-group-anthropic": "Anthropic",
            "certifications-group-linkedin": "LinkedIn",
            "certifications-group-ibm": "IBM",
            "certifications-group-other": "Autres",
            "footer-title": "📫 Me Contacter",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "E-mail",
            "footer-motto": "⚡ Des données neuronales à la perfection des pixels.",
            "perspective-title": "🤝 Stratégie Collaborative",
            "perspective-p1": "Avec des années d'expérience dans le développement d'applications web et mobiles, j'ai acquis la maîtrise de la compréhension des besoins des clients selon les dernières tendances. J'ai travaillé avec des entreprises de différents secteurs, vous pouvez donc compter sur moi pour le vôtre.",
            "perspective-p2": "J'ai une base solide dans la conception de solutions mobiles innovantes qui améliorent considérablement l'expérience utilisateur et accélèrent la croissance de l'entreprise. Mon parcours professionnel me donne une perspective unique sur l'alignement de la technologie avec les objectifs stratégiques, garantissant que mes contributions sont à la fois techniquement solides et commercialement viables. Ayant travaillé sur divers projets déjà en ligne, je peux vous aider avec les meilleures suggestions et idées possibles pour progresser. Avec moi, vous n'êtes forcé de rien accepter ; je vous propose une variété d'options sur lesquelles nous pouvons travailler ensemble.",
            "footer-copy": "© 2026 Ismail Celik | Sous licence MIT",
            "updates-title": "📢 Actualités",
            "follow-linkedin": "Suivre sur LinkedIn",
            "command-trigger": "Accès",
            "command-title": "Accès Rapide",
            "command-placeholder": "Rechercher une section ou une commande...",
            "command-empty": "Aucune commande correspondante.",
            "command-go-updates": "Aller aux actualités",
            "command-go-projects": "Aller aux projets",
            "command-go-certifications": "Aller aux certifications",
            "command-go-skills": "Aller aux compétences",
            "command-go-about": "Aller à propos",
            "command-go-strategy": "Aller à la stratégie",
            "command-go-contact": "Aller au contact",
            "command-toggle-theme": "Changer le thème",
            "command-open-linkedin": "Ouvrir LinkedIn"
        }
    };

    let currentLang = localStorage.getItem('selectedLang') || 'en';

    const certificationGroupOrder = ['AWS', 'Google', 'Anthropic', 'LinkedIn', 'IBM', 'Other'];
    const featuredCertificationIds = [
        'aws-cloud-quest',
        'anthropic-building-with-claude-api',
        'linkedin-career-essentials-genai',
        'google-gen-ai-agents',
        'ibm-python-101-data-science'
    ];

    const certifications = [
        {
            id: 'aws-cloud-quest',
            title: 'AWS Cloud Quest: Cloud Practitioner - Training Badge',
            provider: 'Amazon Web Services',
            group: 'AWS',
            verifyUrl: 'https://www.credly.com/badges/d6a23e7f-e791-45dc-af4c-2c153100f8ab/linked_in_profile',
            credentialId: 'd6a23e7f-e791-45dc-af4c-2c153100f8ab',
            issued: {
                en: 'Issued Apr 2026',
                tr: 'Nis 2026 tarihinde verildi',
                fr: 'Délivré en avr. 2026'
            },
            skills: {
                en: 'Amazon Web Services (AWS), EC2 and 4 more skills',
                tr: 'Amazon Web Hizmetleri (AWS), EC2 ve +4 yetenek',
                fr: 'Amazon Web Services (AWS), EC2 et 4 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/aws-logo.png',
                alt: 'Amazon Web Services'
            },
            badgeImage: 'https://images.credly.com/size/340x340/images/30816e43-2550-4e1c-be22-3f03c5573bb9/blob',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--aws',
            badgeBackground: '#ffffff'
        },
        {
            id: 'anthropic-building-with-claude-api',
            title: 'Building with the Claude API',
            provider: 'Anthropic',
            group: 'Anthropic',
            verifyUrl: 'https://verify.skilljar.com/c/tpmqa4yquc64',
            credentialId: 'tpmqa4yquc64',
            logo: {
                type: 'image',
                src: 'assets/anthropic-logo.png',
                alt: 'Anthropic'
            },
            badgeImage: 'assets/ant-cert-1.png',
            skills: {
                en: 'Claude API, Tool Use and 3 more skills',
                tr: 'Claude API, Tool Use ve +3 yetenek',
                fr: 'API Claude, Tool Use et 3 autres compétences'
            },
            logoFit: 'contain',
            logoClass: 'cert-logo-image--anthropic',
            badgeBackground: '#6f9ed1',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--anthropic'
        },
        {
            id: 'linkedin-career-essentials-genai',
            title: 'Career Essentials in Generative AI by Microsoft and LinkedIn',
            provider: 'Microsoft',
            group: 'LinkedIn',
            verifyUrl: 'https://www.linkedin.com/learning/certificates/c9bf2e317293a00fa8dfb3a745801ad1d736f4dee5a058e2ae28c3f668928f31',
            credentialId: 'c9bf2e317293a00fa8dfb3a745801ad1d736f4dee5a058e2ae28c3f668928f31',
            skills: {
                en: 'Generative AI, Microsoft Copilot and 3 more skills',
                tr: 'Üretken Yapay Zekâ, Microsoft Copilot ve +3 yetenek',
                fr: 'IA générative, Microsoft Copilot et 3 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/microsoft-logo.png',
                alt: 'Microsoft'
            },
            badgeImage: 'assets/microsoft-cert.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--microsoft',
            badgeBackground: '#c7d7dc',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--microsoft'
        },
        {
            id: 'google-gen-ai-agents',
            title: 'Gen AI Agents: Transform Your Organization',
            provider: 'Google',
            group: 'Google',
            verifyUrl: 'https://www.skills.google/public_profiles/f12d1071-06da-4184-ae4c-ec9a43295466/badges/23802425',
            credentialId: '23802425',
            skills: {
                en: 'Gen AI Agents, Gemini, GCP and 3 more skills',
                tr: 'Gen AI Agents, Gemini, GCP ve +3 yetenek',
                fr: 'Gen AI Agents, Gemini, GCP et 3 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/google-logo.png',
                alt: 'Google'
            },
            badgeImage: 'https://cdn.qwiklabs.com/6NReGq4hSLm8QJHw6Xz1w6UjnCjOcqZX0pyDcRmEQX8%3D',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--google',
            badgeBackground: '#ffffff',
            badgePadding: '0.45rem',
            badgeImageClass: 'cert-badge-image--google'
        },
        {
            id: 'ibm-python-101-data-science',
            title: 'Python 101 for Data Science',
            provider: 'IBM',
            group: 'IBM',
            verifyUrl: 'https://courses.cognitiveclass.ai/certificates/5ac6eabe1e3e448f97490ae85e3c12f7',
            credentialId: '5ac6eabe1e3e448f97490ae85e3c12f7',
            skills: {
                en: 'Python, Data Science and 3 more skills',
                tr: 'Python, Veri Bilimi ve +3 yetenek',
                fr: 'Python, Data Science et 3 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/IBM-logo.png',
                alt: 'IBM'
            },
            badgeImage: 'assets/IBM-cert.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--ibm',
            badgeBackground: '#d9dfe5',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--ibm'
        },
        {
            id: 'google-certificate-23802106',
            title: 'Gen AI Apps: Transform Your Work',
            provider: 'Google',
            group: 'Google',
            verifyUrl: 'https://www.skills.google/public_profiles/f12d1071-06da-4184-ae4c-ec9a43295466/badges/23802106',
            credentialId: '23802106',
            skills: {
                en: 'NotebookLM, GCP, Google Gemini and 2 more skills',
                tr: 'NotebookLM, GCP, Google Gemini ve +2 yetenek',
                fr: 'NotebookLM, GCP, Google Gemini et 2 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/google-logo.png',
                alt: 'Google'
            },
            badgeImage: 'https://cdn.qwiklabs.com/9O2IRFwesEmalG0DGGZ2cjVVE7GzSClBz5xBIMzH%2BZ4%3D',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--google',
            badgeBackground: '#ffffff',
            badgePadding: '0.45rem',
            badgeImageClass: 'cert-badge-image--google'
        },
        {
            id: 'google-certificate-23799197',
            title: 'Gen AI: Beyond the Chatbot',
            provider: 'Google',
            group: 'Google',
            verifyUrl: 'https://www.skills.google/public_profiles/f12d1071-06da-4184-ae4c-ec9a43295466/badges/23799197',
            credentialId: '23799197',
            skills: {
                en: 'Machine Learning, AI and LLM',
                tr: 'Machine Learning, AI ve LLM',
                fr: 'Machine Learning, IA et LLM'
            },
            logo: {
                type: 'image',
                src: 'assets/google-logo.png',
                alt: 'Google'
            },
            badgeImage: 'https://cdn.qwiklabs.com/ZLTKgDPBgi5GOfU5%2Fr3IPnPCd4W%2Bv5F8AeuvASVCK0Q%3D',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--google',
            badgeBackground: '#ffffff',
            badgePadding: '0.45rem',
            badgeImageClass: 'cert-badge-image--google'
        },
        {
            id: 'google-certificate-23798362',
            title: 'Introduction to Generative AI',
            provider: 'Google',
            group: 'Google',
            verifyUrl: 'https://www.skills.google/public_profiles/f12d1071-06da-4184-ae4c-ec9a43295466/badges/23798362',
            credentialId: '23798362',
            skills: {
                en: 'NotebookLM, GCP, Google Gemini, Prompt Engineering and Prompt Chaining',
                tr: 'NotebookLM, GCP, Google Gemini, Prompt Engineering ve Prompt Chaining',
                fr: 'NotebookLM, GCP, Google Gemini, Prompt Engineering et Prompt Chaining'
            },
            logo: {
                type: 'image',
                src: 'assets/google-logo.png',
                alt: 'Google'
            },
            badgeImage: 'https://cdn.qwiklabs.com/KL76j4TVMguwIkrbJ%2FL3LOpCTYHAGjRiEv2dUHLbeFY%3D',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--google',
            badgeBackground: '#ffffff',
            badgePadding: '0.45rem',
            badgeImageClass: 'cert-badge-image--google'
        },
        {
            id: 'anthropic-certificate-7nhwwpoo5xew',
            title: 'Introduction to Model Context Protocol',
            provider: 'Anthropic',
            group: 'Anthropic',
            verifyUrl: 'https://verify.skilljar.com/c/7nhwwpoo5xew',
            credentialId: '7nhwwpoo5xew',
            skills: {
                en: 'Anthropic Claude, AI and MCP',
                tr: 'Anthropic Claude, AI ve MCP',
                fr: 'Anthropic Claude, IA et MCP'
            },
            logo: {
                type: 'image',
                src: 'assets/anthropic-logo.png',
                alt: 'Anthropic'
            },
            badgeImage: 'assets/ant-cert-5.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--anthropic',
            badgeBackground: '#bfd3cf',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--anthropic'
        },
        {
            id: 'anthropic-certificate-yezrj5jd63pg',
            title: 'Introduction to Agent Skills',
            provider: 'Anthropic',
            group: 'Anthropic',
            verifyUrl: 'https://verify.skilljar.com/c/yezrj5jd63pg',
            credentialId: 'yezrj5jd63pg',
            skills: {
                en: 'Anthropic Claude, Agents and AI',
                tr: 'Anthropic Claude, Agents ve AI',
                fr: 'Anthropic Claude, Agents et IA'
            },
            logo: {
                type: 'image',
                src: 'assets/anthropic-logo.png',
                alt: 'Anthropic'
            },
            badgeImage: 'assets/ant-cert-4.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--anthropic',
            badgeBackground: '#78a6d5',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--anthropic'
        },
        {
            id: 'anthropic-certificate-szkh29v76syv',
            title: 'AI Fluency: Framework & Foundations',
            provider: 'Anthropic',
            group: 'Anthropic',
            verifyUrl: 'https://verify.skilljar.com/c/szkh29v76syv',
            credentialId: 'szkh29v76syv',
            skills: {
                en: 'Prompt Engineering and AI',
                tr: 'Prompt Engineering ve AI',
                fr: 'Prompt Engineering et IA'
            },
            logo: {
                type: 'image',
                src: 'assets/anthropic-logo.png',
                alt: 'Anthropic'
            },
            badgeImage: 'assets/ant-cert-2.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--anthropic',
            badgeBackground: '#6f9ed1',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--anthropic'
        },
        {
            id: 'anthropic-certificate-xiast5enj4xw',
            title: 'Claude 101',
            provider: 'Anthropic',
            group: 'Anthropic',
            verifyUrl: 'https://verify.skilljar.com/c/xiast5enj4xw',
            credentialId: 'xiast5enj4xw',
            skills: {
                en: 'Claude Code Agents, MCP and AI',
                tr: 'Claude Code Agents, MCP ve AI',
                fr: 'Claude Code Agents, MCP et IA'
            },
            logo: {
                type: 'image',
                src: 'assets/anthropic-logo.png',
                alt: 'Anthropic'
            },
            badgeImage: 'assets/ant-cert-3.png',
            logoFit: 'contain',
            logoClass: 'cert-logo-image--anthropic',
            badgeBackground: '#879a63',
            badgePadding: '0',
            badgeImageClass: 'cert-badge-image--anthropic'
        }
    ];

    const certificationGroupTranslationKeys = {
        AWS: 'certifications-group-aws',
        Google: 'certifications-group-google',
        Anthropic: 'certifications-group-anthropic',
        LinkedIn: 'certifications-group-linkedin',
        IBM: 'certifications-group-ibm',
        Other: 'certifications-group-other'
    };

    const syncBodyScrollLock = () => {
        const shouldLock = Boolean(
            updateModalOverlay?.classList.contains('active') ||
            commandPaletteOverlay?.classList.contains('active') ||
            certificationsModalOverlay?.classList.contains('active')
        );
        document.body.style.overflow = shouldLock ? 'hidden' : '';
    };

    const getLocalizedValue = (value, lang = currentLang) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.en || '';
    };

    const getCertificationLogoMarkup = (cert) => {
        const logoTextClass = cert.group.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (cert.logo?.type === 'image') {
            return `
                <div class="cert-logo">
                    <img
                        src="${cert.logo.src}"
                        alt="${cert.logo.alt || cert.provider}"
                        class="${[
                            cert.logoFit === 'contain' ? 'cert-logo-image--contain' : '',
                            cert.logoClass || ''
                        ].filter(Boolean).join(' ')}"
                    />
                </div>
            `;
        }

        return `
            <div class="cert-logo cert-logo--text cert-logo--${logoTextClass}" aria-hidden="true">
                <span>${cert.logo?.text || cert.group.slice(0, 2)}</span>
            </div>
        `;
    };

    const getCertificationVisualMarkup = (cert) => {
        if (cert.badgeImage) {
            return `
                <div
                    class="cert-badge-visual"
                    style="${cert.badgeBackground ? `background:${cert.badgeBackground};` : ''}${cert.badgePadding ? `padding:${cert.badgePadding};` : ''}"
                >
                    <img
                        src="${cert.badgeImage}"
                        alt="${cert.title}"
                        class="${cert.badgeImageClass || ''}"
                    />
                </div>
            `;
        }

        return `
            <div class="cert-badge-visual cert-badge-visual--placeholder">
                <span class="cert-badge-provider">${cert.provider}</span>
                <strong>${translations[currentLang]["certifications-verified-badge"]}</strong>
                <span class="cert-badge-title">${cert.title}</span>
            </div>
        `;
    };

    const renderCertificationCard = (cert, options = {}) => {
        const isCompact = options.compact ? ' cert-shell--compact' : '';
        const credentialMarkup = cert.credentialId
            ? `
                <p class="cert-id">
                    <span class="cert-id-label">${translations[currentLang]["certifications-id-label"]}:</span>
                    <span class="cert-id-value" title="${cert.credentialId}">${cert.credentialId}</span>
                </p>
            `
            : '';
        const skillsMarkup = cert.skills
            ? `
                <div class="cert-skill-row">
                    <i data-lucide="badge-check"></i>
                    <span>${getLocalizedValue(cert.skills)}</span>
                </div>
            `
            : '';

        return `
            <article class="cert-shell glass certification-card${isCompact}">
                <div class="cert-row">
                    <div class="cert-main">
                        ${getCertificationLogoMarkup(cert)}
                        <div class="cert-content">
                            <h3>${cert.title}</h3>
                            <p class="cert-org">${cert.provider}</p>
                            ${credentialMarkup}
                            <a
                                href="${cert.verifyUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="cert-action"
                            >
                                <i data-lucide="external-link"></i> ${translations[currentLang]["certifications-cta"]}
                            </a>
                            ${skillsMarkup}
                        </div>
                    </div>
                    ${getCertificationVisualMarkup(cert)}
                </div>
            </article>
        `;
    };

    const renderFeaturedCertifications = () => {
        if (!certificationsList) return;
        const featuredCertifications = featuredCertificationIds
            .map((id) => certifications.find((cert) => cert.id === id))
            .filter(Boolean);

        certificationsList.innerHTML = featuredCertifications
            .map((cert) => renderCertificationCard(cert))
            .join('');
        observeRevealElements(certificationsList);
    };

    const renderCertificationsModal = () => {
        if (!certificationsModalBody) return;

        const orderedCertifications = certificationGroupOrder.flatMap((group) =>
            certifications.filter((cert) => cert.group === group)
        );

        certificationsModalBody.innerHTML = `
            <div class="certifications-group-list certifications-group-list--flat">
                ${orderedCertifications.map((cert) => renderCertificationCard(cert, { compact: true })).join('')}
            </div>
        `;
        observeRevealElements(certificationsModalBody);
    };

    const getCertificationModalFocusableItems = () => {
        if (!certificationsModalOverlay) return [];
        return Array.from(
            certificationsModalOverlay.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter((element) => !element.hasAttribute('disabled'));
    };

    const closeCertificationsModal = () => {
        if (!certificationsModalOverlay) return;
        certificationsModalOverlay.classList.remove('active');
        certificationsModalOverlay.setAttribute('aria-hidden', 'true');
        syncBodyScrollLock();
        certificationsLastFocusedElement?.focus?.();
    };

    const openCertificationsModal = () => {
        if (!certificationsModalOverlay) return;
        certificationsLastFocusedElement = document.activeElement;
        renderCertificationsModal();
        certificationsModalOverlay.classList.add('active');
        certificationsModalOverlay.setAttribute('aria-hidden', 'false');
        syncBodyScrollLock();
        if (window.lucide) lucide.createIcons();
        setTimeout(() => certificationsModalCloseBtn?.focus(), 0);
    };

    const getRelativeTime = (dateString, lang) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInDays = Math.floor(diffInSeconds / 86400);

        if (lang === 'tr') {
            if (diffInDays === 0) return 'Bugün';
            if (diffInDays === 1) return 'Dün';
            if (diffInDays < 7) return `${diffInDays} gün önce`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
            if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay önce`;
            return `${Math.floor(diffInDays / 365)} yıl önce`;
        } else if (lang === 'fr') {
            if (diffInDays === 0) return "Aujourd'hui";
            if (diffInDays === 1) return 'Hier';
            if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
            if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
            if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
            return `Il y a ${Math.floor(diffInDays / 365)} ans`;
        } else {
            if (diffInDays === 0) return 'Today';
            if (diffInDays === 1) return 'Yesterday';
            if (diffInDays < 7) return `${diffInDays} days ago`;
            if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
            if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
            return `${Math.floor(diffInDays / 365)} years ago`;
        }
    };

    const closeUpdateModal = () => {
        if (!updateModalOverlay) return;
        updateModalOverlay.classList.remove('active');
        syncBodyScrollLock();
    };

    const renderUpdates = (lang) => {
        const updatesContainer = document.getElementById('updates-container');
        if (!updatesContainer) return;

        fetch('posts.json')
            .then(res => res.json())
            .then(posts => {
                updatesContainer.innerHTML = '';
                posts.slice().reverse().forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'update-card glass';
                    
                    const relativeTime = getRelativeTime(post.date, lang);

                    card.innerHTML = `
                        <div class="update-date">${relativeTime}</div>
                        <div class="update-content">${post.content}</div>
                        ${post.tags ? `
                            <div class="update-tags">
                                ${post.tags.map(tag => `<span class="update-tag">#${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                          ${post.linkPreview ? `
                              <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="link-preview" onclick="event.stopPropagation()">
                                  <div class="preview-title">${post.linkPreview.title}</div>
                                  <div class="preview-desc">${post.linkPreview.description}</div>
                              </a>
                          ` : ''}
                    `;
                    
                    // Modal Open Event
                    card.addEventListener('click', () => {
                          const modalBody = document.getElementById('modal-body');
                          if (!updateModalOverlay || !modalBody) return;
                          
                          modalBody.innerHTML = `
                              <div class="modal-date">${relativeTime}</div>
                            <div class="modal-full-content">${post.content}</div>
                            ${post.tags ? `
                                <div class="modal-tags">
                                    ${post.tags.map(tag => `<span class="update-tag">#${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${post.linkPreview ? `
                                <div class="modal-link-preview">
                                      <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="link-preview">
                                          <div class="preview-title">${post.linkPreview.title}</div>
                                          <div class="preview-desc">${post.linkPreview.description}</div>
                                      </a>
                                  </div>
                              ` : ''}
                          `;
                          
                          updateModalOverlay.classList.add('active');
                          syncBodyScrollLock();
                          if (window.lucide) lucide.createIcons();
                      });

                    updatesContainer.appendChild(card);
                });

                // Update Progress Bar
                const progressBar = document.getElementById('carousel-progress-bar');
                const updateProgress = () => {
                    const scrollLeft = updatesContainer.scrollLeft;
                    const scrollWidth = updatesContainer.scrollWidth - updatesContainer.clientWidth;
                    const progress = (scrollLeft / (scrollWidth || 1)) * 100;
                    if (progressBar) progressBar.style.width = `${progress}%`;
                };

                updatesContainer.addEventListener('scroll', updateProgress);
                updateProgress();
            })
            .catch(err => console.error('Error fetching posts:', err));
    };

    const updateLanguage = (lang) => {
        currentLang = lang;
        body.setAttribute('data-lang', lang);

        // Standard translations
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        const iconElements = document.querySelectorAll('[data-i18n-with-icon]');
        iconElements.forEach(el => {
            const key = el.getAttribute('data-i18n-with-icon');
            const iconName = el.getAttribute('data-icon');
            const existingImg = el.querySelector('img');
            
            if (translations[lang] && translations[lang][key]) {
                if (existingImg) {
                    // Preserve the image icon
                    el.innerHTML = `${existingImg.outerHTML} ${translations[lang][key]}`;
                } else {
                    el.innerHTML = `<i data-lucide="${iconName}"></i> ${translations[lang][key]}`;
                }
            }
        });

        renderFeaturedCertifications();
        renderCertificationsModal();

        // Re-render updates with new language
        renderUpdates(lang);

        // Update selector UI
        const flagUrls = {
            en: "https://flagcdn.com/w20/gb.png",
            tr: "https://flagcdn.com/w20/tr.png",
            fr: "https://flagcdn.com/w20/fr.png"
        };
        const flagImg = document.getElementById('current-lang-flag');
        const flagText = document.getElementById('current-lang-text');
        
        if (flagImg) flagImg.src = flagUrls[lang];
        if (flagText) flagText.textContent = lang.toUpperCase();

        if (commandPaletteInput) {
            commandPaletteInput.placeholder = translations[lang]["command-placeholder"];
        }

        if (commandPaletteTitle) {
            commandPaletteTitle.textContent = translations[lang]["command-title"];
        }

        if (commandPaletteTriggerText) {
            commandPaletteTriggerText.textContent = translations[lang]["command-trigger"];
        }

        if (certificationsModalTitle) {
            certificationsModalTitle.textContent = translations[lang]["certifications-modal-title"];
        }

        if (certificationsModalCloseBtn) {
            certificationsModalCloseBtn.setAttribute('aria-label', translations[lang]["certifications-close-modal"]);
        }

        if (commandPaletteOverlay && commandPaletteOverlay.classList.contains('active')) {
            renderCommandPalette(commandPaletteInput?.value || '');
        }

        localStorage.setItem('selectedLang', lang);
        if (window.lucide) lucide.createIcons();
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
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', theme === 'dark' ? '#0a0a0c' : '#f8f9fa');
        }
    };

    // 2. Theme Toggle Event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('theme-dark');
            const newTheme = isDark ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    const getCommandItems = (lang) => [
        { label: translations[lang]["command-go-updates"], keywords: ['updates', 'latest', 'news', 'güncel', 'actualités'], action: () => document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-projects"], keywords: ['projects', 'work', 'çalışmalar', 'projets'], action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-certifications"], keywords: ['certifications', 'certification', 'sertifikalar', 'certifications'], action: () => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-skills"], keywords: ['skills', 'tech', 'stack', 'yetenekler', 'compétences'], action: () => document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-about"], keywords: ['about', 'bio', 'hakkımda', 'propos'], action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-strategy"], keywords: ['strategy', 'perspective', 'strateji'], action: () => document.getElementById('perspective')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-go-contact"], keywords: ['contact', 'footer', 'mail', 'iletişim'], action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
        { label: translations[lang]["command-toggle-theme"], keywords: ['theme', 'dark', 'light', 'tema'], action: () => themeToggle?.click() },
        { label: translations[lang]["command-open-linkedin"], keywords: ['linkedin', 'social'], action: () => window.open('https://www.linkedin.com/in/ismailcelik', '_blank', 'noopener,noreferrer') }
    ];

    const closeCommandPalette = () => {
        if (!commandPaletteOverlay) return;
        commandPaletteOverlay.classList.remove('active');
        commandPaletteOverlay.setAttribute('aria-hidden', 'true');
        if (commandPaletteInput) commandPaletteInput.value = '';
        syncBodyScrollLock();
    };

    const runCommand = (item) => {
        closeCommandPalette();
        item.action();
    };

    const renderCommandPalette = (query = '') => {
        if (!commandPaletteResults) return;
        const commandItems = getCommandItems(currentLang);
        const normalizedQuery = query.trim().toLowerCase();
        const filtered = commandItems.filter((item) => {
            if (!normalizedQuery) return true;
            return item.label.toLowerCase().includes(normalizedQuery) ||
                item.keywords.some((keyword) => keyword.includes(normalizedQuery));
        });

        commandPaletteResults.innerHTML = filtered.length
            ? filtered.map((item, index) => `
                <button class="command-item${index === 0 ? ' active' : ''}" data-command-index="${commandItems.indexOf(item)}">
                    <span>${item.label}</span>
                </button>
            `).join('')
            : `<div class="command-empty">${translations[currentLang]["command-empty"]}</div>`;
    };

    const openCommandPalette = () => {
        if (!commandPaletteOverlay) return;
        commandPaletteOverlay.classList.add('active');
        commandPaletteOverlay.setAttribute('aria-hidden', 'false');
        renderCommandPalette();
        syncBodyScrollLock();
        setTimeout(() => commandPaletteInput?.focus(), 0);
    };

    if (commandPaletteTrigger) {
        commandPaletteTrigger.addEventListener('click', openCommandPalette);
    }

    if (commandPaletteClose) {
        commandPaletteClose.addEventListener('click', closeCommandPalette);
    }

    if (commandPaletteOverlay) {
        commandPaletteOverlay.addEventListener('click', (event) => {
            if (event.target === commandPaletteOverlay) {
                closeCommandPalette();
            }
        });
    }

    if (commandPaletteInput) {
        commandPaletteInput.addEventListener('input', (event) => {
            renderCommandPalette(event.target.value);
        });

        commandPaletteInput.addEventListener('keydown', (event) => {
            const items = Array.from(document.querySelectorAll('.command-item'));
            const currentIndex = items.findIndex((item) => item.classList.contains('active'));

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items.forEach((item) => item.classList.remove('active'));
                items[nextIndex]?.classList.add('active');
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items.forEach((item) => item.classList.remove('active'));
                items[nextIndex]?.classList.add('active');
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                const activeItem = document.querySelector('.command-item.active');
                const commandIndex = activeItem?.getAttribute('data-command-index');
                if (commandIndex !== null && commandIndex !== undefined) {
                    const commandItems = getCommandItems(currentLang);
                    runCommand(commandItems[Number(commandIndex)]);
                }
            }
        });
    }

    if (commandPaletteResults) {
        commandPaletteResults.addEventListener('click', (event) => {
            const button = event.target.closest('.command-item');
            if (!button) return;
            const commandIndex = button.getAttribute('data-command-index');
            if (commandIndex !== null) {
                const commandItems = getCommandItems(currentLang);
                runCommand(commandItems[Number(commandIndex)]);
            }
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

    const observeRevealElements = (root = document) => {
        root.querySelectorAll('.glass, .section-header').forEach(el => {
            if (el.dataset.revealBound === 'true') return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
            observer.observe(el);
            el.dataset.revealBound = 'true';
        });
    };

    observeRevealElements();

    setTheme(getPreferredTheme());
    updateLanguage(currentLang);

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
    // 6. Latest Updates Carousel Logic
    const updatesContainer = document.getElementById('updates-container');
    const prevBtn = document.getElementById('update-prev');
    const nextBtn = document.getElementById('update-next');

    // Carousel Controls
    if (prevBtn && nextBtn && updatesContainer) {
        const cardWidth = 360; // card + gap
        
        nextBtn.addEventListener('click', () => {
            const isAtEnd = updatesContainer.scrollLeft + updatesContainer.clientWidth >= updatesContainer.scrollWidth - 10;
            if (isAtEnd) {
                updatesContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                updatesContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });

        prevBtn.addEventListener('click', () => {
            const isAtStart = updatesContainer.scrollLeft <= 10;
            if (isAtStart) {
                updatesContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                updatesContainer.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });
        
        // Auto-play (paused on hover)
        let autoPlayInterval = setInterval(() => {
            if (updatesContainer.scrollLeft + updatesContainer.clientWidth >= updatesContainer.scrollWidth - 10) {
                updatesContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                updatesContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, 5000);

        updatesContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        updatesContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                if (updatesContainer.scrollLeft + updatesContainer.clientWidth >= updatesContainer.scrollWidth - 10) {
                    updatesContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    updatesContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, 5000);
        });
    }

    if (updateModalCloseBtn) {
        updateModalCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            closeUpdateModal();
        });
    }

    if (updateModalOverlay) {
        updateModalOverlay.addEventListener('click', (event) => {
            if (event.target === updateModalOverlay) {
                closeUpdateModal();
            }
        });
    }

    if (certificationsOpenBtn) {
        certificationsOpenBtn.addEventListener('click', openCertificationsModal);
    }

    if (certificationsModalCloseBtn) {
        certificationsModalCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            closeCertificationsModal();
        });
    }

    if (certificationsModalOverlay) {
        certificationsModalOverlay.addEventListener('click', (event) => {
            if (event.target === certificationsModalOverlay) {
                closeCertificationsModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            if (commandPaletteOverlay && commandPaletteOverlay.classList.contains('active')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
            return;
        }

        if (event.key === 'Escape' && updateModalOverlay && updateModalOverlay.classList.contains('active')) {
            closeUpdateModal();
        }

        if (event.key === 'Escape' && commandPaletteOverlay && commandPaletteOverlay.classList.contains('active')) {
            closeCommandPalette();
        }

        if (event.key === 'Escape' && certificationsModalOverlay && certificationsModalOverlay.classList.contains('active')) {
            closeCertificationsModal();
        }

        if (event.key === 'Tab' && certificationsModalOverlay && certificationsModalOverlay.classList.contains('active')) {
            const focusable = getCertificationModalFocusableItems();
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});


