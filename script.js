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
    const updatesLoadMoreBtn = document.getElementById('updates-load-more');
    const certificationsList = document.getElementById('certifications-list');
    const certificationsOpenBtn = document.getElementById('certifications-open-modal');
    const certificationsModalOverlay = document.getElementById('certifications-modal-overlay');
    const certificationsModalBody = document.getElementById('certifications-modal-body');
    const certificationsModalCloseBtn = document.getElementById('certifications-modal-close');
    const certificationsModalTitle = document.getElementById('certifications-modal-title');
    let certificationsLastFocusedElement = null;
    let visibleUpdateCount = 5;
    const updatesPageSize = 2;
    const baseDocumentTitle = 'Ismail | Full-stack, mobile and AI systems built with practical architecture.';
    const scrollingDocumentTitle = `${baseDocumentTitle} \u2022 `;
    let titleScrollIndex = 0;
    let titleScrollInterval = null;
    let setShaderTheme = () => {};

    const updateScrollingTitle = () => {
        const rotatedTitle = scrollingDocumentTitle.slice(titleScrollIndex) + scrollingDocumentTitle.slice(0, titleScrollIndex);
        document.title = rotatedTitle.trim();
        titleScrollIndex = (titleScrollIndex + 1) % scrollingDocumentTitle.length;
    };

    const startTitleScroll = () => {
        if (titleScrollInterval || document.hidden) return;
        updateScrollingTitle();
        titleScrollInterval = window.setInterval(updateScrollingTitle, 220);
    };

    const stopTitleScroll = () => {
        if (!titleScrollInterval) return;
        window.clearInterval(titleScrollInterval);
        titleScrollInterval = null;
        document.title = baseDocumentTitle;
    };

    const initHeroShader = () => {
        const canvas = document.getElementById('hero-shader');
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            canvas.classList.add('hero-shader-unavailable');
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let program = null;
        let buffer = null;
        let frameId = null;
        let darkValue = document.body.classList.contains('theme-dark') ? 1 : 0;

        const vertexSource = `#version 300 es
precision highp float;
in vec4 position;
void main() {
    gl_Position = position;
}`;

        const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform float dark;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898,78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = rnd(i);
  float b = rnd(i + vec2(1,0));
  float c = rnd(i + vec2(0,1));
  float d = rnd(i + 1.);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2. * m;
    a *= .5;
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - .5 * R) / MN;
  float n = fbm(uv * 1.6 + vec2(T * .02, -T * .012));
  float m = smoothstep(.35, 1.45, n);
  vec3 baseL = vec3(.980, .976, .961);
  vec3 tintL = vec3(.925, .910, .873);
  vec3 warmL = vec3(.851, .467, .341);
  vec3 baseD = vec3(.122, .118, .106);
  vec3 tintD = vec3(.173, .165, .149);
  vec3 warmD = vec3(.322, .208, .157);
  vec3 base = mix(baseL, baseD, dark);
  vec3 tint = mix(tintL, tintD, dark);
  vec3 warm = mix(warmL, warmD, dark);
  vec3 col = mix(base, tint, m);
  col = mix(col, warm, .05 * smoothstep(.75, 1.3, n));
  O = vec4(col, 1);
}`;

        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        const createProgram = () => {
            const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
            const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
            if (!vertexShader || !fragmentShader) return null;

            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.error('Shader link error:', gl.getProgramInfoLog(shaderProgram));
                gl.deleteProgram(shaderProgram);
                return null;
            }

            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            return shaderProgram;
        };

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1));
            canvas.width = Math.max(1, Math.floor(rect.width * dpr));
            canvas.height = Math.max(1, Math.floor(rect.height * dpr));
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        const drawFrame = (time = performance.now()) => {
            if (!program) return;

            gl.clearColor(0.98, 0.976, 0.961, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);
            gl.uniform1f(gl.getUniformLocation(program, 'time'), time * 0.001);
            gl.uniform1f(gl.getUniformLocation(program, 'dark'), darkValue);
            const position = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            if (!reduceMotion.matches) {
                frameId = window.requestAnimationFrame(drawFrame);
            }
        };

        const restart = () => {
            resizeCanvas();
            if (frameId) {
                window.cancelAnimationFrame(frameId);
                frameId = null;
            }
            drawFrame();
        };

        program = createProgram();
        if (!program) return;

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

        window.addEventListener('resize', restart);
        reduceMotion.addEventListener?.('change', restart);
        setShaderTheme = (theme) => {
            darkValue = theme === 'dark' ? 1 : 0;
            if (!frameId) drawFrame();
        };
        restart();
    };

    // --- Dynamic Year ---
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    document.title = baseDocumentTitle;
    startTitleScroll();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopTitleScroll();
            return;
        }

        startTitleScroll();
    });

    // --- Translation Engine ---
    const translations = {
        en: {
            "nav-updates": "Updates",
            "nav-about": "About",
            "nav-certifications": "Certifications",
            "nav-skills": "Skills",
            "nav-work": "Work",
            "nav-contact": "Contact",
            "hero-title": "Full-stack, mobile and AI systems built with practical architecture.",
            "hero-bio": "I build reliable web and mobile experiences, connect AI into real workflows, and care about the systems work that keeps products fast, maintainable, and useful.",
            "hero-primary-action": "View Projects",
            "hero-secondary-action": "Start a Conversation",
            "hero-cv-label": "Download CV",
            "hero-cv-en": "English",
            "hero-cv-tr": "Turkish",
            "about-title": "About",
            "about-p1": "I work across mobile, full-stack and AI systems, with a strong focus on architecture, backend engineering and high-performance solutions.",
            "about-p2": "I enjoy building things from scratch — network servers, parsers, CLI tools — and I care about the low-level details: memory management, concurrency, I/O protocols and performance tuning.",
            "skills-title": "Skills",
            "skills-group-mobile": "Mobile",
            "skills-group-backend": "Backend",
            "skills-group-ai": "AI & Data",
            "skills-group-cloud": "Cloud & DevOps",
            "skills-group-data": "Databases",
            "skills-group-lang": "Languages & Tools",
            "work-title": "Selected Work",
            "status-live": "Live",
            "status-in-progress": "In progress",
            "cv-project1-title": "Gemini RAG Knowledge Assistant",
            "cv-project1-note": "A production-oriented Retrieval-Augmented Generation assistant built with Gemini API, FastAPI, vector search, and Google Cloud-ready architecture.",
            "cv-project2-title": "Factory RAG Assistant",
            "cv-project2-note": "An assistant concept for turning factory documents and operational knowledge into searchable AI workflows.",
            "cv-project3-title": "Netelsan Cloud",
            "cv-project3-note": "A mobile cloud experience for Netelsan users across iOS and Android app stores.",
            "cv-project4-title": "Netelsan Burglar Alarm System",
            "cv-project4-note": "A production mobile alarm system for monitoring and managing burglar alarm workflows.",
            "cv-project5-title": "PCB Anomaly Detection System",
            "cv-project5-note": "Computer vision pipeline designed to reduce manual PCB production checks and catch anomalies earlier.",
            "cv-project6-title": "Remote Alarm Monitoring Software",
            "cv-project7-title": "Automatic Versioning & Distribution System",
            "cv-project8-title": "Vehicle Tracking Mobile & Web Apps",
            "cv-project9-title": "Log Management & Monitoring Systems",
            "cv-project10-title": "Cisco Network Configuration Tool",
            "cv-project11-title": "Pardus Migration & Open Source Server Stack",
            "cv-project12-title": "Terminal Server Web Control Application",
            "certifications-title": "Certifications",
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
            "footer-title": "Let’s work together",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-copy": "© 2026 İsmail ÇELİK | Licensed under MIT",
            "updates-title": "Latest Updates",
            "follow-linkedin": "Follow on LinkedIn",
            "updates-load-more": "Read More",
            "updates-load-error": "Updates could not be loaded. Open the site through a local server instead of the file directly.",
            "command-trigger": "Quick Nav",
            "command-title": "Quick Navigation",
            "command-placeholder": "Search sections or commands...",
            "command-empty": "No matching command.",
            "command-go-updates": "Go to Latest Updates",
            "command-go-projects": "Go to Projects",
            "command-go-certifications": "Go to Certifications",
            "command-go-skills": "Go to Skills",
            "command-go-about": "Go to About",
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
            "hero-title": "Pratik mimariyle geliştirilen full-stack, mobil ve AI sistemleri.",
            "hero-bio": "Güvenilir web ve mobil deneyimler geliştiriyorum, AI'ı gerçek iş akışlarına bağlıyorum ve ürünleri hızlı, sürdürülebilir ve kullanışlı tutan sistem tarafını önemsiyorum.",
            "hero-primary-action": "Projeleri Gör",
            "hero-secondary-action": "İletişime Geç",
            "hero-cv-label": "CV indir",
            "hero-cv-en": "İngilizce",
            "hero-cv-tr": "Türkçe",
            "about-title": "Hakkımda",
            "about-p1": "Mobil, full-stack ve AI sistemleri üzerinde çalışıyorum; mimariye, backend mühendisliğine ve yüksek performanslı çözümlere güçlü bir odağım var.",
            "about-p2": "Bir şeyleri sıfırdan inşa etmeyi seviyorum — ağ sunucuları, ayrıştırıcılar, CLI araçları — ve alt seviye ayrıntıları önemsiyorum: bellek yönetimi, eşzamanlılık, G/Ç protokolleri ve performans optimizasyonu.",
            "skills-title": "Beceriler",
            "skills-group-mobile": "Mobil",
            "skills-group-backend": "Backend",
            "skills-group-ai": "AI & Veri",
            "skills-group-cloud": "Cloud & DevOps",
            "skills-group-data": "Veritabanları",
            "skills-group-lang": "Diller & Araçlar",
            "work-title": "Seçili İşler",
            "status-live": "Canlı",
            "status-in-progress": "Devam ediyor",
            "cv-project1-title": "Gemini RAG Knowledge Assistant",
            "cv-project1-note": "Gemini API, FastAPI, vektör arama ve Google Cloud uyumlu mimari ile geliştirilen, üretim odaklı bir Retrieval-Augmented Generation asistanı.",
            "cv-project2-title": "Factory RAG Assistant",
            "cv-project2-note": "Fabrika dokümanlarını ve operasyonel bilgiyi aranabilir AI iş akışlarına dönüştüren asistan yaklaşımı.",
            "cv-project3-title": "Netelsan Cloud",
            "cv-project3-note": "Netelsan kullanıcıları için iOS ve Android mağazalarında yer alan mobil bulut deneyimi.",
            "cv-project4-title": "Netelsan Burglar Alarm System",
            "cv-project4-note": "Hırsız alarm süreçlerini izleme ve yönetme için üretimde kullanılan mobil alarm sistemi.",
            "cv-project5-title": "PCB Anomali Tespit Sistemi",
            "cv-project5-note": "PCB üretim kontrollerini azaltmak ve anomalileri erken yakalamak için geliştirilen görüntü işleme hattı.",
            "cv-project6-title": "Uzaktan Alarm İzleme Yazılımı",
            "cv-project7-title": "Otomatik Versiyonlama ve Dağıtım Sistemi",
            "cv-project8-title": "Araç Takip Mobil ve Web Uygulamaları",
            "cv-project9-title": "Log Yönetimi ve İzleme Sistemleri",
            "cv-project10-title": "Cisco Ağ Konfigürasyon Aracı",
            "cv-project11-title": "Pardus Geçişi ve Açık Kaynak Sunucu Yığını",
            "cv-project12-title": "Terminal Server Web Kontrol Uygulaması",
            "certifications-title": "Sertifikalar",
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
            "footer-title": "Birlikte çalışalım",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "Email",
            "footer-copy": "© 2026 İsmail ÇELİK | MIT Lisansı ile lisanslanmıştır",
            "updates-title": "Güncel",
            "follow-linkedin": "LinkedIn'de Takip Et",
            "updates-load-more": "Daha Fazlasını Oku",
            "updates-load-error": "Güncellemeler yüklenemedi. Dosyayı doğrudan açmak yerine siteyi yerel sunucu üzerinden aç.",
            "command-trigger": "Hızlı Geçiş",
            "command-title": "Hızlı Geçiş",
            "command-placeholder": "Bölüm veya komut ara...",
            "command-empty": "Eşleşen komut yok.",
            "command-go-updates": "Güncel bölümüne git",
            "command-go-projects": "Çalışmalara git",
            "command-go-certifications": "Sertifikalara git",
            "command-go-skills": "Yeteneklere git",
            "command-go-about": "Hakkımda bölümüne git",
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
            "hero-title": "Systèmes full-stack, mobiles et IA avec une architecture pratique.",
            "hero-bio": "Je construis des expériences web et mobiles fiables, j'intègre l'IA dans des flux de travail réels et je soigne les systèmes qui rendent les produits rapides, maintenables et utiles.",
            "hero-primary-action": "Voir les projets",
            "hero-secondary-action": "Discuter",
            "hero-cv-label": "Télécharger le CV",
            "hero-cv-en": "Anglais",
            "hero-cv-tr": "Turc",
            "about-title": "À propos",
            "about-p1": "Je travaille sur des systèmes mobiles, full-stack et IA, avec un fort accent sur l’architecture, l’ingénierie backend et les solutions haute performance.",
            "about-p2": "J’aime construire à partir de zéro — serveurs réseau, parseurs, outils CLI — et je soigne les détails bas niveau : gestion de la mémoire, concurrence, protocoles E/S et optimisation des performances.",
            "skills-title": "Compétences",
            "skills-group-mobile": "Mobile",
            "skills-group-backend": "Backend",
            "skills-group-ai": "IA & Données",
            "skills-group-cloud": "Cloud & DevOps",
            "skills-group-data": "Bases de données",
            "skills-group-lang": "Langages & Outils",
            "work-title": "Travaux sélectionnés",
            "status-live": "En ligne",
            "status-in-progress": "En cours",
            "cv-project1-title": "Gemini RAG Knowledge Assistant",
            "cv-project1-note": "Assistant Retrieval-Augmented Generation orienté production, construit avec Gemini API, FastAPI, la recherche vectorielle et une architecture compatible Google Cloud.",
            "cv-project2-title": "Factory RAG Assistant",
            "cv-project2-note": "Concept d'assistant transformant documents d'usine et savoir opérationnel en workflows IA consultables.",
            "cv-project3-title": "Netelsan Cloud",
            "cv-project3-note": "Expérience cloud mobile pour les utilisateurs Netelsan, disponible sur iOS et Android.",
            "cv-project4-title": "Netelsan Burglar Alarm System",
            "cv-project4-note": "Système mobile d'alarme en production pour surveiller et gérer les flux d'alarme intrusion.",
            "cv-project5-title": "Système de détection d'anomalies PCB",
            "cv-project5-note": "Pipeline de vision conçu pour réduire les contrôles PCB manuels et détecter les anomalies plus tôt.",
            "cv-project6-title": "Logiciel de supervision d'alarmes à distance",
            "cv-project7-title": "Système de versioning et distribution automatiques",
            "cv-project8-title": "Applications mobiles et web de suivi de véhicules",
            "cv-project9-title": "Systèmes de gestion et supervision des logs",
            "cv-project10-title": "Outil de configuration réseau Cisco",
            "cv-project11-title": "Migration Pardus et stack serveur open source",
            "cv-project12-title": "Application web de contrôle Terminal Server",
            "certifications-title": "Certifications",
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
            "footer-title": "Travaillons ensemble",
            "footer-linkedin": "LinkedIn",
            "footer-website": "GitHub",
            "footer-email": "E-mail",
            "footer-copy": "© 2026 İsmail ÇELİK | Sous licence MIT",
            "updates-title": "Actualités",
            "follow-linkedin": "Suivre sur LinkedIn",
            "updates-load-more": "Lire plus",
            "updates-load-error": "Les actualités n'ont pas pu être chargées. Ouvrez le site via un serveur local plutôt que le fichier directement.",
            "command-trigger": "Accès",
            "command-title": "Accès Rapide",
            "command-placeholder": "Rechercher une section ou une commande...",
            "command-empty": "Aucune commande correspondante.",
            "command-go-updates": "Aller aux actualités",
            "command-go-projects": "Aller aux projets",
            "command-go-certifications": "Aller aux certifications",
            "command-go-skills": "Aller aux compétences",
            "command-go-about": "Aller à propos",
            "command-go-contact": "Aller au contact",
            "command-toggle-theme": "Changer le thème",
            "command-open-linkedin": "Ouvrir LinkedIn"
        }
    };

    let currentLang = localStorage.getItem('selectedLang') || 'en';

    const certificationGroupOrder = ['AWS', 'Google', 'Anthropic', 'LinkedIn', 'IBM', 'Other'];
    const featuredCertificationIds = [
        'aws-cloud-quest',
        'aws-cloud-quest-generative-ai',
        'google-gen-ai-agents',
        'linkedin-career-essentials-genai',
        'anthropic-building-with-claude-api',
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
            id: 'aws-cloud-quest-generative-ai',
            title: 'AWS Cloud Quest: Generative AI Practitioner - Training Badge',
            provider: 'Amazon Web Services',
            group: 'AWS',
            verifyUrl: 'https://www.credly.com/badges/b5cf2640-d25d-415d-88e2-551df8e29618/linked_in_profile',
            credentialId: 'b5cf2640-d25d-415d-88e2-551df8e29618',
            issued: {
                en: 'Issued May 2026',
                tr: 'May 2026 tarihinde verildi',
                fr: 'Délivré en mai 2026'
            },
            skills: {
                en: 'Amazon Web Services (AWS), Generative AI and 4 more skills',
                tr: 'Amazon Web Hizmetleri (AWS), Generative AI ve +4 yetenek',
                fr: 'Amazon Web Services (AWS), IA générative et 4 autres compétences'
            },
            logo: {
                type: 'image',
                src: 'assets/aws-logo.png',
                alt: 'Amazon Web Services'
            },
            badgeImage: 'https://images.credly.com/size/340x340/images/15fa08e6-ca73-4fa3-94ed-c36f7f157313/blob',
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
        const issuedMarkup = cert.issued
            ? `<p class="cert-issued">${getLocalizedValue(cert.issued)}</p>`
            : '';
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
            <article class="cert-shell card certification-card${isCompact}">
                <div class="cert-row">
                    <div class="cert-main">
                        ${getCertificationLogoMarkup(cert)}
                        <div class="cert-content">
                            <h3>${cert.title}</h3>
                            <p class="cert-org">${cert.provider}</p>
                            ${issuedMarkup}
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
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to load posts.json: ${res.status}`);
                }
                return res.json();
            })
            .then(posts => {
                updatesContainer.innerHTML = '';
                const validPosts = Array.isArray(posts)
                    ? posts.filter((post) => post && post.date && post.content)
                    : [];
                const localeMap = { en: 'en-GB', tr: 'tr-TR', fr: 'fr-FR' };
                const formatPostDate = (dateString) => new Intl.DateTimeFormat(
                    localeMap[lang] || 'en-GB', { month: 'short', year: 'numeric' }
                ).format(new Date(dateString));
                const visiblePosts = validPosts.slice().reverse().slice(0, visibleUpdateCount);

                visiblePosts.forEach((post) => {
                    const card = document.createElement('article');
                    card.className = 'update-entry card';

                    const relativeTime = getRelativeTime(post.date, lang);
                    card.innerHTML = `
                        <time class="update-date" datetime="${post.date}">${formatPostDate(post.date)}</time>
                        <div class="update-body">
                            <div class="update-content">${post.content}</div>
                            ${post.tags ? `
                                <div class="update-tags">
                                    ${post.tags.map(tag => `<span class="update-tag">#${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${post.linkPreview && post.link ? `
                                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="link-preview" onclick="event.stopPropagation()">
                                    <div class="preview-title">${post.linkPreview.title}</div>
                                    <div class="preview-desc">${post.linkPreview.description}</div>
                                </a>
                            ` : ''}
                        </div>
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
                            ${post.linkPreview && post.link ? `
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

                if (updatesLoadMoreBtn) {
                    updatesLoadMoreBtn.hidden = visibleUpdateCount >= validPosts.length;
                    updatesLoadMoreBtn.disabled = visibleUpdateCount >= validPosts.length;
                }

                if (window.lucide) lucide.createIcons();
            })
            .catch(err => {
                console.error('Error fetching posts:', err);
                updatesContainer.innerHTML = `<div class="updates-load-error">${translations[lang]?.["updates-load-error"] || translations.en["updates-load-error"]}</div>`;
                if (updatesLoadMoreBtn) updatesLoadMoreBtn.hidden = true;
            });
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
            themeColorMeta.setAttribute('content', theme === 'dark' ? '#1f1e1b' : '#faf9f5');
        }
        setShaderTheme(theme);
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observeRevealElements = (root = document) => {
        if (prefersReducedMotion.matches) return;
        root.querySelectorAll('.card, .section-header').forEach(el => {
            if (el.dataset.revealBound === 'true') return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
            el.dataset.revealBound = 'true';
        });
    };

    observeRevealElements();

    setTheme(getPreferredTheme());
    initHeroShader();
    updateLanguage(currentLang);

    if (updateModalCloseBtn) {
        updateModalCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            closeUpdateModal();
        });
    }

    if (updatesLoadMoreBtn) {
        updatesLoadMoreBtn.addEventListener('click', () => {
            visibleUpdateCount += updatesPageSize;
            renderUpdates(currentLang);
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
