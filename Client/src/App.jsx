import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, Navigate } from 'react-router-dom';


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

const App = () => {
  const isAdmin = 1;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={isAdmin ? <TeacherHomePage /> : <HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/subject" element={<Subject />}>
          {
            !isAdmin ?
              <>
                <Route index element={<Navigate to="/subject/0" />} />
                <Route path=":id" element={<DynamicSubjectComponent />}></Route>
              </>
              :
              <>
                <Route index element={<Navigate to="/upload/0" />} />
                <Route path=":id" element={<Navigate to="/upload/0" />}></Route>
              </>
          }
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/queries" element={isAdmin ? <QueriesAdminPage /> : <QueriesPage />} />
        {
          isAdmin &&
          <Route path="/upload" element={<Subject isUpload={true} />} >
            <Route index element={<Navigate to="/upload/0" />} />
            <Route path=":id" element={<DynamicUploadPage />} />
          </Route>
        }

        <Route path="*" element={<NotFound />} />
      </Route >
    )
  )

  return (
    <ThemeProvider defaultTheme='light'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App