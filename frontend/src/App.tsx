import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import MentorPage from "./pages/MentorPage"
import RoadmapPage from "./pages/RoadmapPage"
import AssessmentsPage from "./pages/AssessmentsPage"
import PersonalityAssessment from "./pages/PersonalityAssessment"
import AptitudeAssessment from "./pages/AptitudeAssessment"
import BehavioralAnalysis from "./pages/BehavioralAnalysis"
import AssessmentResults from "./pages/AssessmentResults"
import CoursesPage from "./pages/CoursesPage"
import CourseWorkspace from "./pages/CourseWorkspace"
import PlacementsPage from "./pages/PlacementsPage"
import InterviewWorkspacePage from "./pages/InterviewWorkspacePage"
import CompanyReadinessPage from "./pages/CompanyReadinessPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/personality" element={<PersonalityAssessment />} />
          <Route path="/assessments/aptitude" element={<AptitudeAssessment />} />
          <Route path="/assessments/behavioral" element={<BehavioralAnalysis />} />
          <Route path="/assessments/results" element={<AssessmentResults />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseWorkspace />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/placements/interview" element={<InterviewWorkspacePage />} />
          <Route path="/placements/company" element={<CompanyReadinessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
