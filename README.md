# 🧬 Hygeia  
**AI-Powered Medicine Authenticity & Allergy Safety Platform**

Hygeia is a healthcare-grade, AI-driven web application designed to protect patients from **counterfeit medicines** and **life-threatening allergic reactions**. By combining **Computer Vision**, **OCR**, and **clinical risk analysis**, Hygeia delivers fast, reliable, and explainable medication safety checks.

---

##  Problem Statement

Millions of patients worldwide face a dangerous dual risk:
- **Counterfeit medicines** that fail to treat disease
- **Hidden allergens** in genuine drugs that cause severe or fatal reactions

In many regions, there is **no real-time infrastructure** to verify medicine authenticity *and* personalize safety checks for individual patients.

---

## 💡 Solution Overview

Hygeia introduces a **dual-path verification system** that allows users to independently check:

1. **Fake Medicine Detection**
2. **Allergy Risk Analysis**

Both workflows are accessible through a clean, intuitive web interface.

---

## ⚙️ Core Features

### 🔍 Fake Medicine Detection (Visual AI)
- Upload an image of a medicine strip or box
- AI analyzes:
  - Packaging quality
  - Typography & print consistency
  - Manufacturer markings
- Outputs a clear verdict:
  - 🟢 Authentic  
  - 🔴 Counterfeit  
- Confidence score displayed for transparency

---

### 🧪 Allergy Safety Check (Clinical AI)
- OCR extracts drug name and ingredients
- Maps drug to **pharmacological families** (e.g., Penicillins, NSAIDs)
- Cross-references with user allergy profile
- Generates:
  - ⚠️ Allergy warnings
  - Severity-based side-effect insights
  - Final **Safe / Unsafe** recommendation

---

## 🖥️ User Experience

- Clean medical-grade UI (Teal / Slate palette)
- Glassmorphism design for trust & clarity
- Separate pages for:
  - Fake medicine verification
  - Allergy analysis
- Hover-based descriptions for intuitive navigation
- Privacy-first design (no forced data storage)

---

## 🧠 Technical Architecture

- **Frontend:** React + Vite + Tailwind CSS
- **AI Models:**  
  - CNN for visual authenticity detection  
  - OCR for drug text extraction
- **Logic Layer:**  
  - Drug-family mapping  
  - Allergy conflict detection
- **Design Philosophy:** Explainable AI, user safety first

---

## 🚀 Use Cases

- Patients verifying medicines before consumption  
- Healthcare workers in low-resource settings  
- NGOs and global health organizations  
- Anti-counterfeit pharmaceutical initiatives  

---

## 🛡️ Ethics & Privacy

- No mandatory user accounts
- Local handling of sensitive allergy data
- Transparent AI confidence indicators
- Designed for responsible clinical decision support (not diagnosis)

---

## 🧭 Roadmap

- Offline-first inference support
- Expanded drug databases
- Multi-language OCR
- Public health analytics dashboard
- Regulatory alignment (WHO / FDA frameworks)

---

## 👨‍💻 Author

**Roshan Thomas**  
Creator & Lead Developer  
Healthcare AI | Computer Vision | Full-Stack Systems

---

## 📜 License

This project is released under the **MIT License**.  
Free to use, modify, and distribute with attribution.

---

> **Hygeia** — *One scan. Zero fakes. Zero allergic surprises.*

