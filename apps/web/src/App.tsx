import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import AdultVerification, { isAdultVerified } from './components/auth/AdultVerification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/common/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { seedTestAccounts } from './utils/testAccounts';

import Home from './pages/Home';

import AdDetail from './pages/AdDetail';

import PostAd from './pages/PostAd';

import AdvertiserCRM from './pages/AdvertiserCRM';
import AdminCRM from './pages/AdminCRM';
import ContentManager from './pages/admin/ContentManager';

import CommunityPage from './pages/CommunityPage';
import CommunityPostDetail from './pages/CommunityPostDetail';
import CommunityWrite from './pages/CommunityWrite';

import SearchResults from './pages/SearchResults';

import CustomerSupport from './pages/CustomerSupport';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ThemePage from './pages/ThemePage';
import UrgentPage from './pages/UrgentPage';
import IndustryPage from './pages/IndustryPage';
import RegionPage from './pages/RegionPage';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import YouthProtectionPolicy from './pages/YouthProtectionPolicy';
import JobSeekerPage from './pages/JobSeekerPage';
import JobSeekerListPage from './pages/JobSeekerListPage';
import JobSeekerDetailPage from './pages/JobSeekerDetailPage';
import AdminFloatingPanel from './components/admin/AdminFloatingPanel';


function App() {
  const [adultVerified, setAdultVerified] = useState(isAdultVerified());

  // 앱 시작 시 테스트 계정 자동 시드 (한 번만 실행)
  useEffect(() => {
    seedTestAccounts();
  }, []);

  // 성인인증 필요 시 인증 화면 표시
  if (!adultVerified) {
    return (
      <AdultVerification onVerified={() => setAdultVerified(true)} />
    );
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <ErrorBoundary>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/ad/:id" element={<AdDetail />} />
              <Route path="/post-ad" element={<PostAd />} />
              <Route path="/theme" element={<ThemePage />} />
              <Route path="/theme/:category" element={<ThemePage />} />
              <Route path="/industry" element={<IndustryPage />} />
              <Route path="/industry/:type" element={<IndustryPage />} />
              <Route path="/region" element={<RegionPage />} />
              <Route path="/region/:location" element={<RegionPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/write" element={<CommunityWrite />} />
              <Route path="/community/post/:id" element={<CommunityPostDetail />} />
              {/* Advertiser Routes - 광고주 전용 */}
              <Route path="/advertiser" element={
                <ProtectedRoute requiredRole="advertiser">
                  <AdvertiserCRM />
                </ProtectedRoute>
              } />
              <Route path="/advertiser/dashboard" element={<Navigate to="/advertiser" replace />} />
              <Route path="/advertiser/crm" element={<Navigate to="/advertiser" replace />} />

              {/* Admin Routes - 관리자 전용 */}
              <Route path="/admin" element={<Navigate to="/admin/crm" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin/crm" replace />} />
              <Route path="/admin/crm" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCRM />
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute requiredRole="admin">
                  <ContentManager />
                </ProtectedRoute>
              } />
              <Route path="urgent" element={<UrgentPage />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="support" element={<CustomerSupport />} />
              <Route path="job-seeker" element={<JobSeekerPage />} />
              <Route path="job-seeker/:id" element={<JobSeekerDetailPage />} />
              <Route path="job-seeker-list" element={<JobSeekerListPage />} />
              <Route path="job-seekers" element={<JobSeekerListPage />} />

              {/* Legal Pages */}
              <Route path="terms" element={<TermsOfService />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="youth-protection" element={<YouthProtectionPolicy />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          {/* 관리자 전용 플로팅 패널 */}
          <AdminFloatingPanel />
          </BrowserRouter>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

