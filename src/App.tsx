import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Home from './pages/Home';

import AdDetail from './pages/AdDetail';

import PostAd from './pages/PostAd';

import AdvertiserDashboard from './pages/AdvertiserDashboard';
import AdminCRM from './pages/AdminCRM';

import CommunityPage from './pages/CommunityPage';
import CommunityPostDetail from './pages/CommunityPostDetail';

import SearchResults from './pages/SearchResults';

import CustomerSupport from './pages/CustomerSupport';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ThemePage from './pages/ThemePage';
import UrgentPage from './pages/UrgentPage';
import IndustryPage from './pages/IndustryPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/ad/:id" element={<AdDetail />} />
          <Route path="/post-ad" element={<PostAd />} />
          <Route path="/theme/:category" element={<ThemePage />} />
          <Route path="/industry/:type" element={<IndustryPage />} />
          {/* <Route path="/region/:location" element={<RegionPage />} /> */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/post/:id" element={<CommunityPostDetail />} />
          <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />

          {/* Admin Routes */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin/crm" element={<AdminCRM />} />
          <Route path="urgent" element={<UrgentPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
