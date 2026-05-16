from pathlib import Path
from textwrap import wrap

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "generated-cv"
OUT_DIR.mkdir(exist_ok=True)

FONT_REGULAR = r"C:\Windows\Fonts\arial.ttf"
FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
pdfmetrics.registerFont(TTFont("Arial", FONT_REGULAR))
pdfmetrics.registerFont(TTFont("Arial-Bold", FONT_BOLD))

PAGE_W, PAGE_H = A4
MARGIN_X = 38
TOP_Y = PAGE_H - 34
ACCENT = colors.HexColor("#0f766e")
TEXT = colors.HexColor("#111827")
MUTED = colors.HexColor("#4b5563")
LIGHT = colors.HexColor("#e5f5f3")
RULE = colors.HexColor("#c7d2d9")


def sanitize(text):
    return text.replace("\u2013", "-").replace("\u2014", "-")


def tr_upper(text):
    return text.replace("i", "İ").replace("ı", "I").upper()


class ResumeCanvas:
    def __init__(self, path, lang):
        self.c = canvas.Canvas(str(path), pagesize=A4)
        self.lang = lang
        self.page_no = 0

    def page(self):
        self.page_no += 1
        if self.page_no > 1:
            self.c.showPage()
        self.c.setFillColor(colors.white)
        self.c.rect(0, 0, PAGE_W, PAGE_H, fill=True, stroke=False)

    def footer(self):
        self.c.setFont("Arial", 7.3)
        self.c.setFillColor(MUTED)
        self.c.drawRightString(PAGE_W - MARGIN_X, 18, f"{self.page_no}/2")

    def text(self, x, y, value, size=9, bold=False, color=TEXT):
        self.c.setFont("Arial-Bold" if bold else "Arial", size)
        self.c.setFillColor(color)
        self.c.drawString(x, y, sanitize(value))

    def link_text(self, x, y, value, url, size=8.5):
        self.text(x, y, value, size=size, color=ACCENT)
        width = pdfmetrics.stringWidth(value, "Arial", size)
        self.c.linkURL(url, (x, y - 2, x + width, y + size), relative=0)

    def wrapped(self, x, y, value, width=92, size=8.2, leading=10, color=TEXT, bullet=False):
        prefix = "- " if bullet else ""
        lines = wrap(sanitize(value), width=width)
        self.c.setFont("Arial", size)
        self.c.setFillColor(color)
        for idx, line in enumerate(lines):
            self.c.drawString(x, y, (prefix if idx == 0 else "  ") + line)
            y -= leading
        return y

    def section(self, x, y, title):
        display_title = tr_upper(title) if self.lang == "tr" else title.upper()
        self.c.setFillColor(ACCENT)
        self.c.roundRect(x, y - 4, 6, 14, 2, fill=True, stroke=False)
        self.text(x + 11, y, display_title, size=9.2, bold=True, color=ACCENT)
        self.c.setStrokeColor(RULE)
        self.c.line(x + 11, y - 5, PAGE_W - MARGIN_X, y - 5)
        return y - 18

    def header(self, role):
        self.c.setFillColor(LIGHT)
        self.c.rect(0, PAGE_H - 102, PAGE_W, 102, fill=True, stroke=False)
        self.text(MARGIN_X, PAGE_H - 42, "İSMAİL ÇELİK", size=22, bold=True, color=TEXT)
        self.text(MARGIN_X, PAGE_H - 60, role, size=10.5, bold=True, color=ACCENT)
        contact_y = PAGE_H - 80
        self.text(MARGIN_X, contact_y, "Ankara, Türkiye", size=8.2, color=MUTED)
        self.text(MARGIN_X + 105, contact_y, "ismailceliktr00@gmail.com", size=8.2, color=MUTED)
        links_y = contact_y - 13
        self.link_text(MARGIN_X, links_y, "https://ismailcelik-tr.github.io/", "https://ismailcelik-tr.github.io", size=7.9)
        self.link_text(MARGIN_X + 175, links_y, "https://linkedin.com/in/ismailcelik", "https://linkedin.com/in/ismailcelik", size=7.9)
        self.link_text(MARGIN_X + 365, links_y, "https://github.com/ismailcelik-tr", "https://github.com/ismailcelik-tr", size=7.9)

    def draw_bullets(self, x, y, bullets, width=93, size=8.0, leading=9.7):
        for item in bullets:
            y = self.wrapped(x, y, item, width=width, size=size, leading=leading, color=TEXT, bullet=True)
            y -= 2
        return y

    def role_block(self, x, y, title, meta, bullets):
        self.text(x, y, title, size=9.0, bold=True)
        self.text(x, y - 10, meta, size=7.8, color=MUTED)
        return self.draw_bullets(x + 8, y - 23, bullets, width=102, size=7.8, leading=9.2) - 3

    def project_card(self, x, y, title, body, tech, url=None, width=250):
        self.c.setFillColor(colors.HexColor("#f8fbfb"))
        self.c.setStrokeColor(colors.HexColor("#c9e8e3"))
        self.c.roundRect(x, y - 60, width, 62, 6, fill=True, stroke=True)
        self.text(x + 9, y - 12, title, size=8.5, bold=True)
        yy = self.wrapped(x + 9, y - 24, body, width=54, size=7.2, leading=8.2, color=MUTED)
        self.text(x + 9, yy - 1, tech, size=6.8, color=ACCENT)
        if url:
            self.link_text(x + width - 48, y - 53, "Link", url, size=7.2)


def build_en():
    path = OUT_DIR / "ismail-celik-cv-en.pdf"
    r = ResumeCanvas(path, "en")
    r.page()
    r.header("Full-Stack, Mobile & AI Systems Engineer")
    y = PAGE_H - 124
    y = r.section(MARGIN_X, y, "Profile")
    y = r.wrapped(
        MARGIN_X,
        y,
        "Full-stack and mobile developer with experience across React Native, React, Node.js, Spring Boot, Java, cloud infrastructure and AI/RAG systems. Builds production-minded mobile, web and backend systems with clean architecture, automation and operational reliability.",
        width=122,
        size=8.2,
        leading=10,
    )
    y -= 10
    y = r.section(MARGIN_X, y, "Core Skills")
    skills = [
        "Frontend & Mobile: React, React Native, Flutter, TypeScript, JavaScript, HTML5, CSS3",
        "Backend & APIs: Node.js, Express.js, Spring Boot, Java, REST APIs, WebSocket / realtime systems",
        "Data & AI: MongoDB, PostgreSQL, MySQL, MSSQL, ChromaDB, Qdrant, Gemini API, RAG, LLM workflows",
        "Cloud & DevOps: AWS, Google Cloud, Docker, Kubernetes, GitHub Actions, CI/CD automation, Linux",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, skills, width=118, size=7.8, leading=9.2)
    y -= 6
    y = r.section(MARGIN_X, y, "Experience")
    y = r.role_block(
        MARGIN_X,
        y,
        "Computer Engineer - Netelsan Elektrik Elektronik",
        "Dec 2025 - Present | Ankara | R&D",
        [
            "Developing React Native mobile applications and Node.js server-side components for burglar alarm systems.",
            "Built PCB anomaly detection workflows with Python, OpenCV and TensorFlow to reduce manual production checks.",
            "Developed automatic versioning and distribution workflows to reduce production-line installation errors.",
            "Building remote monitoring software with React and JavaScript; managing alarm data and control-center access.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Mobile Application Developer - Freelancer",
        "Jan 2023 - Nov 2025 | Ankara",
        [
            "Delivered user-focused mobile applications across platforms using modern UI, feedback-driven iteration and production-quality practices.",
            "Worked with clients on mobile architecture, usability, delivery planning and continuous improvement.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Mobile Application Developer - Netelsan Elektrik Elektronik",
        "Mar 2021 - Jan 2023 | Ankara | R&D",
        [
            "Developed React Native mobile apps and Node.js services for Netelsan alarm products published on app stores.",
            "Built React-based remote monitoring tools; supported MongoDB operations, Linux/Windows servers, networks and ERP integrations.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Full-Stack / Mobile / Systems Roles",
        "2013 - 2021 | Freelance, Bitcraft, Alfa E-Ticaret, Pearl Sprout, Turkish Naval Forces",
        [
            "Built web and mobile apps with React, Flutter, Spring Boot, Java, .NET and C#; delivered vehicle tracking and enterprise workflows.",
            "Managed Windows/Linux servers, firewalls, Active Directory, network devices, e-commerce systems and secure file-sharing platforms.",
        ],
    )
    r.footer()

    r.page()
    y = TOP_Y
    y = r.section(MARGIN_X, y, "Selected Projects")
    projects = [
        ("Gemini RAG Knowledge Assistant", "Production-oriented RAG assistant built with Gemini API, FastAPI, vector search and Google Cloud-ready architecture.", "Gemini, FastAPI, RAG, Vector Search, Google Cloud", "https://github.com/ismailcelik-tr/gemini-rag-knowledge-assistant"),
        ("Factory RAG Assistant", "Factory knowledge assistant concept for turning operational documents into searchable AI workflows.", "RAG, AI Agents, Python, Gemma 4, Qdrant", "https://github.com/ismailcelik-tr/factory-rag-assistant"),
        ("Netelsan Cloud", "Mobile cloud application for Netelsan users, published on iOS and Android.", "React Native, Node.js, PostgreSQL, Realtime", "https://apps.apple.com/tr/app/netelsan-cloud/id6757862775?l=en"),
        ("Netelsan Burglar Alarm System", "Production mobile alarm system for monitoring and managing burglar alarm workflows.", "React Native, Node.js, MongoDB, Realtime", "https://play.google.com/store/apps/details?id=tr.com.netelsan.arge.hirsizalarm&hl=en"),
        ("PCB Anomaly Detection System", "Computer vision pipeline to detect PCB production defects and reduce manual checks.", "Python, OpenCV, TensorFlow, Manufacturing AI", None),
        ("Automatic Versioning & Distribution", "Internal release automation reducing installation mistakes and improving production-line software access.", "CI/CD, GitHub Actions, Automation", None),
    ]
    x_positions = [MARGIN_X, MARGIN_X + 270]
    for idx, project in enumerate(projects):
        x = x_positions[idx % 2]
        if idx % 2 == 0 and idx > 0:
            y -= 76
        r.project_card(x, y, *project)
    y -= 88
    y = r.section(MARGIN_X, y, "Education")
    edu = [
        "Istanbul University - Management Information Systems, Bachelor's Degree, 2024 - Ongoing",
        "Anadolu University - Business Administration, Bachelor's Degree, 2022 - 2025, GPA 3.75/4",
        "Karadeniz Technical University - Computer Engineering, Bachelor's Degree, 2008 - 2013",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, edu, width=118, size=7.8, leading=9.2)
    y -= 7
    y = r.section(MARGIN_X, y, "Certifications & Learning")
    certs = [
        "AWS Cloud Quest: Cloud Practitioner - AWS, 2026",
        "Building with the Claude API; Model Context Protocol; Claude Code 101 - Anthropic, 2026",
        "Introduction to Generative AI; Gen AI Apps; Gen AI Agents - Google, 2026",
        "Career Essentials in Generative AI - Microsoft & LinkedIn, 2026",
        "Python 101 for Data Science - IBM, 2026",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, certs, width=118, size=7.7, leading=9.1)
    y -= 6
    y = r.section(MARGIN_X, y, "Languages")
    r.text(MARGIN_X, y, "Turkish: Advanced | English: Advanced | French: Basic", size=8.2)
    r.footer()
    r.c.save()
    return path


def build_tr():
    path = OUT_DIR / "ismail-celik-cv-tr.pdf"
    r = ResumeCanvas(path, "tr")
    r.page()
    r.header("Full-Stack, Mobil ve AI Sistemleri Mühendisi")
    y = PAGE_H - 124
    y = r.section(MARGIN_X, y, "Profil")
    y = r.wrapped(
        MARGIN_X,
        y,
        "React Native, React, Node.js, Spring Boot, Java, bulut altyapıları ve AI/RAG sistemleri üzerinde çalışan full-stack ve mobil geliştirici. Temiz mimari, otomasyon ve operasyonel güvenilirlik odağıyla üretime dönük mobil, web ve backend sistemleri geliştirir.",
        width=122,
        size=8.2,
        leading=10,
    )
    y -= 10
    y = r.section(MARGIN_X, y, "Ana Yetkinlikler")
    skills = [
        "Frontend & Mobil: React, React Native, Flutter, TypeScript, JavaScript, HTML5, CSS3",
        "Backend & API: Node.js, Express.js, Spring Boot, Java, REST API, WebSocket / gerçek zamanlı sistemler",
        "Veri & AI: MongoDB, PostgreSQL, MySQL, MSSQL, ChromaDB, Qdrant, Gemini API, RAG, LLM iş akışları",
        "Cloud & DevOps: AWS, Google Cloud, Docker, Kubernetes, GitHub Actions, CI/CD otomasyonu, Linux",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, skills, width=118, size=7.8, leading=9.2)
    y -= 6
    y = r.section(MARGIN_X, y, "Deneyim")
    y = r.role_block(
        MARGIN_X,
        y,
        "Bilgisayar Mühendisi - Netelsan Elektrik Elektronik",
        "Aralık 2025 - Devam | Ankara | Ar-Ge",
        [
            "Hırsız alarm sistemleri için React Native mobil uygulamalar ve Node.js sunucu bileşenleri geliştiriyor.",
            "PCB üretim kontrollerini azaltmak için Python, OpenCV ve TensorFlow ile anomali tespit iş akışları geliştirdi.",
            "Üretim hattındaki manuel kurulum hatalarını azaltan otomatik versiyonlama ve dağıtım akışları geliştirdi.",
            "React ve JavaScript ile uzaktan izleme yazılımları; alarm verisi ve kontrol merkezi erişim süreçleri üzerinde çalışıyor.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Mobil Uygulama Geliştirici - Freelancer",
        "Ocak 2023 - Kasım 2025 | Ankara",
        [
            "Farklı platformlar için kullanıcı odaklı mobil uygulamalar geliştirdi; modern UI, geri bildirim ve sürekli iyileştirme süreçleri yürüttü.",
            "Mobil mimari, kullanılabilirlik, teslim planlaması ve üretim kalitesinde uygulama geliştirme konularında çalıştı.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Mobil Uygulama Geliştirici - Netelsan Elektrik Elektronik",
        "Mart 2021 - Ocak 2023 | Ankara | Ar-Ge",
        [
            "App Store ve Google Play'de yayınlanan Netelsan alarm ürünleri için React Native uygulamalar ve Node.js servisler geliştirdi.",
            "React tabanlı uzaktan izleme araçları geliştirdi; MongoDB, Linux/Windows sunucular, ağ sistemleri ve ERP entegrasyonlarını destekledi.",
        ],
    )
    y = r.role_block(
        MARGIN_X,
        y,
        "Full-Stack / Mobil / Sistem Rolleri",
        "2013 - 2021 | Freelance, Bitcraft, Alfa E-Ticaret, Pearl Sprout, Deniz Kuvvetleri",
        [
            "React, Flutter, Spring Boot, Java, .NET ve C# ile web/mobil uygulamalar; araç takip ve kurumsal iş akışları geliştirdi.",
            "Windows/Linux sunucular, firewall, Active Directory, ağ cihazları, e-ticaret sistemleri ve güvenli dosya paylaşım platformları yönetti.",
        ],
    )
    r.footer()

    r.page()
    y = TOP_Y
    y = r.section(MARGIN_X, y, "Seçili Projeler")
    projects = [
        ("Gemini RAG Knowledge Assistant", "Gemini API, FastAPI, vektör arama ve Google Cloud uyumlu mimari ile geliştirilen üretim odaklı RAG asistanı.", "Gemini, FastAPI, RAG, Vector Search, Google Cloud", "https://github.com/ismailcelik-tr/gemini-rag-knowledge-assistant"),
        ("Factory RAG Assistant", "Fabrika dokümanlarını ve operasyonel bilgiyi aranabilir AI iş akışlarına dönüştüren asistan yaklaşımı.", "RAG, AI Agents, Python, Gemma 4, Qdrant", "https://github.com/ismailcelik-tr/factory-rag-assistant"),
        ("Netelsan Cloud", "Netelsan kullanıcıları için iOS ve Android'de yayınlanan mobil bulut uygulaması.", "React Native, Node.js, PostgreSQL, Realtime", "https://apps.apple.com/tr/app/netelsan-cloud/id6757862775?l=en"),
        ("Netelsan Burglar Alarm System", "Hırsız alarm süreçlerini izlemek ve yönetmek için üretimde kullanılan mobil alarm sistemi.", "React Native, Node.js, MongoDB, Realtime", "https://play.google.com/store/apps/details?id=tr.com.netelsan.arge.hirsizalarm&hl=en"),
        ("PCB Anomali Tespit Sistemi", "PCB üretim hatalarını tespit etmek ve manuel kontrolleri azaltmak için görüntü işleme hattı.", "Python, OpenCV, TensorFlow, Manufacturing AI", None),
        ("Otomatik Versiyonlama ve Dağıtım", "Kurulum hatalarını azaltan ve üretim hattı yazılım erişimini iyileştiren iç dağıtım otomasyonu.", "CI/CD, GitHub Actions, Automation", None),
    ]
    x_positions = [MARGIN_X, MARGIN_X + 270]
    for idx, project in enumerate(projects):
        x = x_positions[idx % 2]
        if idx % 2 == 0 and idx > 0:
            y -= 76
        r.project_card(x, y, *project)
    y -= 88
    y = r.section(MARGIN_X, y, "Eğitim")
    edu = [
        "İstanbul Üniversitesi - Yönetim Bilişim Sistemleri, Lisans, 2024 - Devam",
        "Anadolu Üniversitesi - İşletme, Lisans, 2022 - 2025, Ortalama 3.75/4",
        "Karadeniz Teknik Üniversitesi - Bilgisayar Mühendisliği, Lisans, 2008 - 2013",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, edu, width=118, size=7.8, leading=9.2)
    y -= 7
    y = r.section(MARGIN_X, y, "Sertifikalar ve Gelişim")
    certs = [
        "AWS Cloud Quest: Cloud Practitioner - AWS, 2026",
        "Building with the Claude API; Model Context Protocol; Claude Code 101 - Anthropic, 2026",
        "Introduction to Generative AI; Gen AI Apps; Gen AI Agents - Google, 2026",
        "Career Essentials in Generative AI - Microsoft & LinkedIn, 2026",
        "Python 101 for Data Science - IBM, 2026",
    ]
    y = r.draw_bullets(MARGIN_X + 6, y, certs, width=118, size=7.7, leading=9.1)
    y -= 6
    y = r.section(MARGIN_X, y, "Diller")
    r.text(MARGIN_X, y, "Türkçe: İleri | İngilizce: İleri | Fransızca: Temel", size=8.2)
    r.footer()
    r.c.save()
    return path


if __name__ == "__main__":
    print(build_en())
    print(build_tr())
