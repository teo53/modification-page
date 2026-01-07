import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/app/AppLayout';
import AgeGate from './components/app/AgeGate';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const AdDetail = lazy(() => import('./pages/AdDetail'));
const PostAd = lazy(() => import('./pages/PostAd'));
const AdvertiserDashboard = lazy(() => import('./pages/AdvertiserDashboard'));
const AdminCRM = lazy(() => import('./pages/AdminCRM'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const CommunityPostDetail = lazy(() => import('./pages/CommunityPostDetail'));
const CommunityWrite = lazy(() => import('./pages/CommunityWrite'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CustomerSupport = lazy(() => import('./pages/CustomerSupport'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ThemePage = lazy(() => import('./pages/ThemePage'));
const UrgentPage = lazy(() => import('./pages/UrgentPage'));
const IndustryPage = lazy(() => import('./pages/IndustryPage'));
const JobSeekersPage = lazy(() => import('./pages/JobSeekersPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const MyPageEdit = lazy(() => import('./pages/MyPageEdit'));
const MyPageViews = lazy(() => import('./pages/MyPageViews'));
const MyPageApplications = lazy(() => import('./pages/MyPageApplications'));
const MyPageNotifications = lazy(() => import('./pages/MyPageNotifications'));
const MyPagePrivacy = lazy(() => import('./pages/MyPagePrivacy'));

// Page loader
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-text-muted text-sm">로딩중...</span>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AgeGate>
          <BrowserRouter>
          <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* Main Routes */}
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="ad/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdDetail />
                </Suspense>
              }
            />
            <Route
              path="search"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SearchResults />
                </Suspense>
              }
            />

            {/* Category Routes */}
            <Route
              path="theme"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ThemePage />
                </Suspense>
              }
            />
            <Route
              path="theme/:category"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ThemePage />
                </Suspense>
              }
            />
            <Route
              path="industry"
              element={
                <Suspense fallback={<PageLoader />}>
                  <IndustryPage />
                </Suspense>
              }
            />
            <Route
              path="industry/:type"
              element={
                <Suspense fallback={<PageLoader />}>
                  <IndustryPage />
                </Suspense>
              }
            />
            <Route
              path="urgent"
              element={
                <Suspense fallback={<PageLoader />}>
                  <UrgentPage />
                </Suspense>
              }
            />

            {/* Job Seekers Routes */}
            <Route
              path="job-seekers"
              element={
                <Suspense fallback={<PageLoader />}>
                  <JobSeekersPage />
                </Suspense>
              }
            />

            {/* Community Routes */}
            <Route
              path="community"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CommunityPage />
                </Suspense>
              }
            />
            <Route
              path="community/write"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CommunityWrite />
                </Suspense>
              }
            />
            <Route
              path="community/post/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CommunityPostDetail />
                </Suspense>
              }
            />

            {/* User Routes */}
            <Route
              path="login"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="signup"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Signup />
                </Suspense>
              }
            />
            <Route
              path="favorites"
              element={
                <Suspense fallback={<PageLoader />}>
                  <FavoritesPage />
                </Suspense>
              }
            />
            <Route
              path="mypage"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPage />
                </Suspense>
              }
            />
            <Route
              path="mypage/edit"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPageEdit />
                </Suspense>
              }
            />
            <Route
              path="mypage/views"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPageViews />
                </Suspense>
              }
            />
            <Route
              path="mypage/applications"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPageApplications />
                </Suspense>
              }
            />
            <Route
              path="mypage/notifications"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPageNotifications />
                </Suspense>
              }
            />
            <Route
              path="mypage/privacy"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MyPagePrivacy />
                </Suspense>
              }
            />

            {/* Advertiser Routes */}
            <Route
              path="post-ad"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PostAd />
                </Suspense>
              }
            />
            <Route
              path="advertiser/dashboard"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdvertiserDashboard />
                </Suspense>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin/crm"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminCRM />
                </Suspense>
              }
            />

            {/* Support */}
            <Route
              path="support"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CustomerSupport />
                </Suspense>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
          </Routes>
          </BrowserRouter>
        </AgeGate>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
