import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CursorGlow from './components/CursorGlow'

import AdminLayout from './layout/AdminLayout'

import Home from './pages/Home'
import News from './pages/News'
import Teams from './pages/Teams'
import Creators from './pages/Creators'
import Partners from './pages/Partners'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NewsDetails from './pages/NewsDetails'

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
  <ScrollToTop />
  <CursorGlow />

  <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <Home />
            </SiteLayout>
          }
        />

        <Route
          path="/news"
          element={
            <SiteLayout>
              <News />
            </SiteLayout>
          }
        />

        <Route
          path="/news/:id"
          element={
            <SiteLayout>
              <NewsDetails />
            </SiteLayout>
          }
        />

        <Route
          path="/teams"
          element={
            <SiteLayout>
              <Teams />
            </SiteLayout>
          }
        />

        <Route
          path="/streamers"
          element={
            <SiteLayout>
              <Creators />
            </SiteLayout>
          }
        />

        <Route
          path="/creators"
          element={
            <SiteLayout>
              <Creators />
            </SiteLayout>
          }
        />

        <Route
          path="/partners"
          element={
            <SiteLayout>
              <Partners />
            </SiteLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <SiteLayout>
              <Contact />
            </SiteLayout>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/news"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/preview"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App