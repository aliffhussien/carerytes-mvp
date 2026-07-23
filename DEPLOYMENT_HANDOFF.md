# CareRytes MVP v0.1 — Deployment Handoff

## Live URLs

**GitHub Repository:**
https://github.com/aliffhussien/carerytes-mvp

**Vercel Deployment (Production):**
https://cancer-support-mobile-a11y-86fb53.vercel.app

## Deployment Details

**Branch Deployed:** `claude/cancer-support-mobile-a11y-86fb53`

**Build Command:** `npm run build`

**Framework:** Next.js 16.2.11 (Turbopack)

**Environment Variables:** None required

## Current MVP Features

### Core Flow
- **Structured Questionnaire** (4 questions, one per screen)
  - Q1: Support need (4 options)
  - Q2: Household income band (3 options: B40, M40, unknown)
  - Q3: Treatment facility (4 options: government, private, both, not-sure)
  - Q4: State selection (16 states + 3 territories, **optional**)
  - Back/Next navigation with progress bar

### Results Display
- **3 Mock Routes** returned based on answers:
  1. MAKNA Bursary (cancer treatment support)
  2. mySalam (B40 critical illness support)
  3. PeKa B40 (B40 health screening)
- Each route includes: summary, verification note, missing info, documents needed, final decision maker, official source link

### Safety & Verification
- **DISCLAIMER BOX**: "CareRytes shows possible routes based on your answers. The final decision always belongs to the official agency or provider."
- **Safe Wording Enforcement**: No forbidden terms (eligible, approval, guarantee, qualify, etc.)
- **Rules-Based Matching Engine** (RYTS Engine): No AI/ML, pure deterministic rules

### Platform Context
- **Landing Page** (8 support areas):
  - Cancer treatment cost: **Available** (clickable, linked to questionnaire)
  - Dialysis, Accident/PERKESO, Disability, Zakat, NGO medical aid, Insurance/takaful, KWSP: **Coming soon** (grayed, disabled)
  
### Floating RYTS Assistant Bar
- Toggle button (💬 emoji) at bottom-left
- Context-aware helper messages
- Local navigation commands:
  - `start` — restart questionnaire
  - `home` — navigate to home page
  - `restart` — reset questionnaire
- Mic button (🎤) placeholder for future voice support (no real STT/TTS yet)

## Known Limits

1. **No Real Voice Support** — Mic button is placeholder only
2. **Mock Data Only** — 3 hardcoded routes, not connected to actual support database
3. **No User Accounts** — Stateless, no data persistence
4. **No Personalization** — Same routes for same answers, no learning
5. **No Admin Interface** — No way to update routes or questions without code changes
6. **No API** — All logic client-side
7. **No Search/Filter** — Users must go through questionnaire
8. **No Multilingual** — English only
9. **No Analytics** — No tracking of user flows

## Next Recommended Work

### Phase 2: Expansion
- [ ] Add more support categories (dialysis, disability, etc.)
- [ ] Connect to real support database (replace mock routes)
- [ ] Implement real matching engine with multiple rules
- [ ] Add route verification workflow (official sources checklist)

### Phase 3: UX Polish
- [ ] Implement voice input (STT) for questionnaire
- [ ] Add voice output (TTS) for routes
- [ ] Mobile responsiveness refinement
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Dark mode support

### Phase 4: Scaling
- [ ] User accounts and history
- [ ] Save favorite routes
- [ ] Share routes via link/email
- [ ] Admin dashboard (manage routes, monitor usage)
- [ ] Analytics and user insights
- [ ] Multilingual support (BM, Chinese, Tamil)

## Branch & Tag Strategy

**Current Branch:** `claude/cancer-support-mobile-a11y-86fb53`

**Recommended Tag:** `v0.1-demo`
- Marks this stable MVP checkpoint
- Ready for review and feedback
- Foundation for Phase 2 expansion

## Technical Stack

- **Frontend:** Next.js 16.2.11, React 19, TypeScript, Tailwind CSS
- **Hosting:** Vercel (auto-deploys from GitHub main/branches)
- **Version Control:** GitHub
- **Code Quality:** ESLint, TypeScript strict mode

## Deployment Notes

- Vercel automatically detected Next.js and configured build
- No custom environment variables or secrets needed
- Static site generation for all pages (optimal performance)
- Zero cold starts on Vercel

---

**Deployed:** 2026-07-23
**Status:** ✅ Production Ready
**Access:** https://cancer-support-mobile-a11y-86fb53.vercel.app
