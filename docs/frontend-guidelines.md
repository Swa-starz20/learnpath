# LearnPath Frontend Guidelines

## Frontend Stack

* React
* TypeScript
* Vite
* TailwindCSS
* ShadCN UI
* Framer Motion
* React Router DOM
* Axios
* React Query
* Zustand

---

# Architecture Philosophy

The frontend must follow:

* Modular architecture
* Reusable component system
* Clean folder hierarchy
* Responsive-first design
* API-first communication
* Dashboard-centric layouts

---

# Layout System

## Main Layouts

### 1. Public Layout

Used for:

* Landing page
* About
* Authentication pages

Includes:

* Public navbar
* Footer

---

### 2. Dashboard Layout

Used for:

* Student dashboard
* AI mentor
* Assessments
* Recommendations

Includes:

* Sidebar
* Top navbar
* Notification center

---

### 3. Admin Layout

Used for:

* Admin dashboard
* Reports
* Analytics

---

### 4. Instructor Layout

Used for:

* Instructor workspace
* Content management

---

# Sidebar Navigation

## Student Sidebar

* Dashboard
* Roadmap
* AI Mentor
* Assessments
* Courses
* Placements
* Settings

## Admin Sidebar

* Dashboard
* Users
* Analytics
* Courses
* Reports

## Instructor Sidebar

* Dashboard
* Courses
* Learners
* Resources

---

# Component Guidelines

## Reusable Components

### UI Components

* Button
* Input
* Modal
* Card
* Badge
* Tooltip
* Tabs
* Dropdown

### Dashboard Components

* Sidebar
* Navbar
* Analytics cards
* Progress widgets
* Charts
* Timeline cards

### AI Components

* AI insight cards
* Recommendation cards
* Chat bubbles
* Typing indicators

---

# State Management

## Zustand

Used for:

* Authentication
* Sidebar state
* Theme state
* User state

## React Query

Used for:

* API caching
* Async requests
* Server state management

---

# API Communication

## Axios Client

Create centralized API service.

Structure:

* authApi
* userApi
* roadmapApi
* assessmentApi
* recommendationApi
* chatbotApi

---

# Theme System

Support:

* Dark mode
* Light mode

Default:

* Dark mode

---

# Animation Rules

Use:

* Framer Motion

Animation Style:

* Smooth
* Minimal
* Premium
* AI-native

Avoid:

* Over-animated interfaces

---

# Chart Standards

Use:

* Recharts

Chart Types:

* Radar charts
* Line charts
* Progress charts
* Heatmaps

---

# Responsiveness

## Desktop

* Expanded sidebar

## Tablet

* Collapsible sidebar

## Mobile

* Bottom navigation or drawer

---

# Folder Structure

frontend/src/

* components/
* layouts/
* pages/
* routes/
* hooks/
* services/
* store/
* context/
* utils/
* assets/
* animations/
* types/

---

# Coding Standards

* Use TypeScript strictly
* Avoid duplicated logic
* Create reusable hooks
* Keep components modular
* Use environment variables securely
* Use proper naming conventions
