import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/Auth/RegisterPage';
import LoginPage from './pages/Auth/LoginPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import FlashcardListPage from './pages/Flashcards/flashcardListPage';
import DocumentsDetailPage from './pages/Documents/DocumentsDetailPage';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardPage from './pages/Dashboard/DashboardPage';

const App = () => {
  const isAuthenticated = true;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* If user is authenticated, redirect to dashboard otherwise, redirect to login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}></Route>

        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentsDetailPage />} />
          <Route path="/flashcards" element={<FlashcardListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
