
import React from 'react';
import { Route, Outlet } from 'react-router-dom';
import WelcomePage from '@/pages/WelcomePage';
import AboutPage from '@/pages/website/AboutPage';
import ServicesPage from '@/pages/website/ServicesPage';
import ContactPage from '@/pages/website/ContactPage';
import WebsiteLayout from '@/components/website/WebsiteLayout';

export const WebsiteRoutes = [
  <Route key="website-root" path="/" element={<WebsiteLayout><Outlet /></WebsiteLayout>}>
    <Route index element={<WelcomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="contact" element={<ContactPage />} />
  </Route>
];
