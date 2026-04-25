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
            "certifications-provider": "Amazon Web Services",
            "certifications-card-title": "AWS Cloud Quest: Cloud Practitioner - Training Badge",
            "certifications-issued": "Issued Apr 2026",
            "certifications-id-label": "Credential ID",
            "certifications-cta": "View Credential",
            "certifications-skills": "Amazon Web Services (AWS), EC2 and 4 more skills",
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
            "certifications-provider": "Amazon Web Services",
            "certifications-card-title": "AWS Cloud Quest: Cloud Practitioner - Training Badge",
            "certifications-issued": "Nis 2026 tarihinde verildi",
            "certifications-id-label": "Yeterlilik Kimliği",
            "certifications-cta": "Yeterlilik belgesini göster",
            "certifications-skills": "Amazon Web Hizmetleri (AWS), EC2 ve +4 yetenek",
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
            "certifications-provider": "Amazon Web Services",
            "certifications-card-title": "AWS Cloud Quest: Cloud Practitioner - Training Badge",
            "certifications-issued": "Délivré en avr. 2026",
            "certifications-id-label": "ID du certificat",
            "certifications-cta": "Afficher le certificat",
            "certifications-skills": "Amazon Web Services (AWS), EC2 et 4 autres compétences",
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
            "command-trigger": "Accès Rapide",
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
        const modalOverlay = document.getElementById('update-modal-overlay');
        if (!modalOverlay) return;

        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
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
                            <a href="${post.link}" target="_blank" class="link-preview" onclick="event.stopPropagation()">
                                <div class="preview-title">${post.linkPreview.title}</div>
                                <div class="preview-desc">${post.linkPreview.description}</div>
                            </a>
                        ` : ''}
                    `;
                    
                    // Modal Open Event
                    card.addEventListener('click', () => {
                        const modalOverlay = document.getElementById('update-modal-overlay');
                        const modalBody = document.getElementById('modal-body');
                        
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
                                    <a href="${post.link}" target="_blank" class="link-preview">
                                        <div class="preview-title">${post.linkPreview.title}</div>
                                        <div class="preview-desc">${post.linkPreview.description}</div>
                                    </a>
                                </div>
                            ` : ''}
                        `;
                        
                        modalOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
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

    let currentLang = localStorage.getItem('selectedLang') || 'en';
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
        document.body.style.overflow = '';
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
        document.body.style.overflow = 'hidden';
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
    // 6. Latest Updates Carousel Logic
    const updatesContainer = document.getElementById('updates-container');
    const prevBtn = document.getElementById('update-prev');
    const nextBtn = document.getElementById('update-next');
    const modalOverlay = document.getElementById('update-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');

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

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            closeUpdateModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeUpdateModal();
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

        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeUpdateModal();
        }

        if (event.key === 'Escape' && commandPaletteOverlay && commandPaletteOverlay.classList.contains('active')) {
            closeCommandPalette();
        }
    });
});


