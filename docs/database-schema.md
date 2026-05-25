# LearnPath Database Schema

## Core Tables

### users

* id
* name
* email
* password_hash
* role
* created_at

---

### student_profiles

* id
* user_id
* branch
* year
* interests
* career_goal
* learning_style

---

### psychometric_results

* id
* user_id
* personality_type
* aptitude_score
* emotional_score
* leadership_score
* analytical_score
* creativity_score
* generated_at

---

### skills

* id
* skill_name
* category

---

### student_skills

* id
* user_id
* skill_id
* proficiency_level

---

### roadmaps

* id
* user_id
* title
* completion_percentage
* generated_by_ai
* created_at

---

### roadmap_nodes

* id
* roadmap_id
* title
* status
* order_index

---

### courses

* id
* title
* provider
* difficulty
* duration
* category

---

### recommendations

* id
* user_id
* recommendation_type
* recommendation_data
* generated_at

---

### chatbot_history

* id
* user_id
* message
* sender
* timestamp

---

### progress_tracking

* id
* user_id
* completed_courses
* streak_days
* readiness_score

---

### assessments

* id
* title
* type
* difficulty
* created_by

---

### assessment_results

* id
* assessment_id
* user_id
* score
* completed_at
