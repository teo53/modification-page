import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';

import AdDetail from './pages/AdDetail';

import PostAd from './pages/PostAd';

import AdvertiserDashboard from './pages/AdvertiserDashboard';
import AdminCRM from './pages/AdminCRM';

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


function App() {
  return (
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
            <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin/crm" replace />} />
            <Route path="/admin/crm" element={<AdminCRM />} />
            <Route path="urgent" element={<UrgentPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
