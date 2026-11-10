# KAAMSETU — "Talent deserves an opportunity"

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E)](https://supabase.com/)
[![OmniVoice](https://img.shields.io/badge/TTS-OmniVoice%20(k2--fsa)-FF6B00)](https://github.com/k2-fsa/OmniVoice)
[![Hindsight Memory](https://img.shields.io/badge/Memory-Hindsight%20AI-6366F1)]()

---

## 🌟 Core Mission
**KAAMSETU** connects people across all economic backgrounds—from daily-wage and unskilled workers to artisans, tailors, carpenters, tech professionals, and budding micro-entrepreneurs—directly to verified livelihoods, without demanding an expensive physical store or office.

### Strict Non-Negotiable Integrity Rules
1. **Zero Fabricated Data**: No fake companies, mock HR contacts, fabricated vacancies, or false funding promises.
2. **Mandatory Sourcing**: Every single job listing displays its source name, source URL, date last checked, and verification status (`Officially Sourced`, `Verified`, `Employer Submitted`, `Not Verified`, or `Expired`).
3. **Transparent Empty States**: If no verified records match a query, the platform explicitly displays that no verified openings exist.
4. **Voice Safety & Consent**: Real OmniVoice voice cloning is only executed with explicit, verified user consent. Impersonation is strictly prevented.

---

## 🚀 Key Modules & Architecture

### 1. Cinematic Opening Experience
- Fullscreen obsidian black (`#050608`) and electric orange (`#FF6B00`) stage.
- Central singularity point expands into the **Bridge Emblem** (symbolizing the connection between talent and opportunity).
- Letter-by-letter kinetic typography reveal for **KAAMSETU**.
- Dynamic collection of original, authentic Hindi and English quotes randomly selected on every fresh visit.
- Procedural Web Audio API sound synthesis (sub-drone, harmonic shimmer chime, and kinetic enter whoosh) with a mute/unmute control.
- Accessibility: Respects `prefers-reduced-motion` and includes a "Skip Intro" button, along with a "Replay Intro" button in the navigation bar.

### 2. KAAMSETU JARVIS (OmniVoice Assistant)
- **Speech Input**: Microphone capture with Web Speech Recognition supporting Hindi (`hi-IN`) and English (`en-IN`), with instant fallback to text chat.
- **Visual Interface**:
  - `IDLE`: Subtle breathing orange orb.
  - `LISTENING`: Real-time audio waveform reacting to user microphone input via Web Audio API `AnalyserNode`.
  - `THINKING`: Dual pulsating energy processing rings.
  - `SPEAKING`: Waveform reacting dynamically to speech playback.
  - `ERROR`: Transparent diagnostics and recovery steps.
- **Audio Output & OmniVoice Backend**:
  - Connects to dedicated Python FastAPI service powered by the official [k2-fsa/OmniVoice](https://github.com/k2-fsa/OmniVoice) model.
  - If the OmniVoice service is offline, automatically and gracefully falls back to browser speech synthesis and text, clearly informing the user without faking audio generation.

### 3. Hindsight Long-Term Memory
- Implements genuine **Retain**, **Recall**, and **Reflect** workflows.
- Retains user skills, constraints, and past application outcomes with explicit consent.
- **Reflection Engine**: Learns from unresponded corporate applications to intelligently recommend accredited PSU apprenticeships (UPPTCL Aligarh) and zero-rent digital storefront funding (PM Vishwakarma / Mudra).
- **User Privacy Controls**: Live Hindsight Memory Center allowing users to inspect every stored memory, edit inaccurate entries, delete items, or execute a permanent wipe.

### 4. Employment Hub
- Filters for Government, PSU, Private, Apprenticeship, Remote, and Daily-wage opportunities.
- Real-time search by skills, locations (e.g. Aligarh, Agra, Delhi NCR), and employment type.
- Full detail modal with published compensation, official application links, and audit timestamps.

### 5. Company Directory
- Only reliable, publicly verified corporate and institutional profiles (NSDC, UPPTCL, NCS).
- Official careers URLs and public recruitment helplines only.

### 6. Skill Showcase (Digital Rozgar Card)
- Digital professional profiles for grassroots artisans and modern professionals.
- Transparent standard rates (e.g. ₹600/visit, ₹800/day) and shareable public profile links.
- Phone number sharing only with explicit user consent.

### 7. Business Hub (Zero-Rent Digital Dukaan)
- Digital storefront creation without commercial shop rent.
- Product listings, service delivery radius, and direct customer enquiry inbox.

### 8. Opportunity & Scheme Network
- Verified links to PM Vishwakarma Yojana, Pradhan Mantri Mudra Yojana, and ODOP (One District One Product).

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ (Node.js 24 recommended)
- Python 3.10+ (for dedicated OmniVoice service)

### 1. Frontend Setup (Next.js)
```bash
# Clone the repository
git clone https://github.com/your-username/kaamsetu.git
cd kaamsetu

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run production build
npm run build

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Dedicated OmniVoice Service Setup (Python)
The voice synthesis backend is located in `backend/voice/`:

```bash
cd backend/voice

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install PyTorch (CUDA recommended for GPU acceleration)
pip install torch soundfile --index-url https://download.pytorch.org/whl/cu121

# Install OmniVoice and API dependencies
pip install -r requirements.txt

# Start OmniVoice FastAPI Service
python main.py
```
The OmniVoice service runs on `http://localhost:8000`. The Next.js frontend will automatically detect its active status!

---

### 3. Database & Supabase Setup
1. Create a project on [Supabase](https://supabase.com).
2. Open the SQL Editor in Supabase.
3. Run the migration script located at:
   `supabase/migrations/20261109000000_kaamsetu_schema.sql`
4. Copy your **Project URL** and **Anon Key** into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🧪 Running Automated Integrity Tests
Run the standalone verification test suite:
```bash
node scripts/verify-core.mjs
```
Validates:
- Original motivational quotes (authenticity and lack of fake attribution)
- Data sourcing and verification badge compliance
- Hindsight memory retain/recall/reflect logic
- JARVIS search and empty-state handling

---

## 📄 License
MIT License. Built for human dignity and economic empowerment.
