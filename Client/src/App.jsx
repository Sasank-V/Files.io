import { createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, Navigate, useNavigate } from 'react-router-dom';


import Layout from './components/Layout';
import { ThemeProvider } from './components/theme-provider';
import HomePage from '@/pages/HomePage';
import LearnPage from '@/pages/LearnPage';
import { Subject } from './components/subject';
import NotFound from './pages/404NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QueriesPage from './pages/QueriesPage';
import QueriesAdminPage from './pages/QueriesAdminPage';
import TeacherHomePage from './pages/TeacherHomePage';
import DynamicSubjectComponent from './pages/DynamicSubjectPage';
import DynamicUploadPage from './pages/DynamicUploadPage';
import RequireAuth from './pages/RequireAuth';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import axios from '@/api/axios';
import PersistentLogin from './pages/PersistentLogin';

const App = () => {
  const isAdmin = 0;
  const { auth } = useAuth()

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={auth?.isAdmin ? <TeacherHomePage /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/learn" element={<LearnPage />} />
        {
          !auth?.isAdmin &&
          <Route element={<Subject />}>
            <Route path="/subject/:id" element={<DynamicSubjectComponent />}>
            </Route>
          </Route>
        }

        <Route element={<PersistentLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/queries" element={auth?.isAdmin ? <QueriesAdminPage /> : <QueriesPage />} />
            {
              auth.isAdmin === true &&
              <Route path="/upload" element={<Subject isUpload={true} />} >
                <Route index element={<Navigate to="/upload/0" />} />
                <Route path=":id" element={<DynamicUploadPage />} />
              </Route>
            }
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

      </Route>
    )
  )



  return (

    <ThemeProvider defaultTheme='light'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App