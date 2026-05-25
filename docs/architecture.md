# LearnPath System Architecture

## Overview

LearnPath is an AI-powered personalized learning and career roadmap platform for engineering students.

The platform combines:

* Personalized roadmap generation
* Psychometric intelligence
* AI recommendations
* Skill-gap analytics
* Adaptive learning
* AI chatbot mentorship
* Progress tracking
* Career guidance

---

# High-Level Architecture

Frontend (React + Vite + Tailwind)
↓
Backend API Layer (Spring Boot)
↓
PostgreSQL Database

Additional AI Services:

* ML Recommendation Engine (Python FastAPI)
* Psychometric Analysis Engine
* AI Chatbot Service

---

# Core System Components

## 1. Frontend Layer

Technology:

* React
* TypeScript
* TailwindCSS
* ShadCN UI
* Framer Motion

Responsibilities:

* User interface
* Dashboard rendering
* Data visualization
* Chat interface
* Assessment interfaces
* API communication

---

## 2. Backend Layer

Technology:

* Spring Boot
* JWT Authentication
* REST APIs

Responsibilities:

* Authentication
* Business logic
* User management
* Progress tracking
* Recommendation orchestration
* API gateway

---

## 3. Database Layer

Technology:

* PostgreSQL

Responsibilities:

* User data
* Assessments
* Courses
* Recommendations
* Progress tracking
* Psychometric results

---

## 4. ML Recommendation Engine

Technology:

* Python
* FastAPI
* Scikit-learn
* Pandas

Responsibilities:

* Skill-gap analysis
* Recommendation generation
* Personalized roadmap creation
* Career alignment analysis

---

## 5. Psychometric Engine

Responsibilities:

* Personality analysis
* Aptitude analysis
* Learning behavior analysis
* Career compatibility analysis
* Strengths/weaknesses evaluation

---

## 6. AI Chatbot

Responsibilities:

* Career guidance
* Roadmap explanation
* Learning assistance
* Resource recommendations
* Resume/interview support

---

# User Roles

## Student

* Access roadmap
* Take assessments
* Chat with AI mentor
* Track progress

## Admin

* Manage users
* Manage analytics
* Moderate platform

## Instructor

* Upload resources
* Manage courses
* Track learners

---

# Deployment Architecture

Frontend:

* Vercel

Backend:

* Render

Database:

* Supabase PostgreSQL

ML Services:

* Render/Docker

---

# Communication Flow

Frontend → Backend APIs
Backend → PostgreSQL
Backend → ML Engine
Backend → Chatbot APIs
ML Engine → Recommendation Response
Backend → Frontend
