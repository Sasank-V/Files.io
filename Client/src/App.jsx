import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements, Navigate } from 'react-router-dom';


import Layout from './components/Layout';
import { ThemeProvider } from './components/theme-provider';
import HomePage from '@/pages/HomePage';
import LearnPage from '@/pages/LearnPage';
import { Subject } from './components/subject';
import SyllabusComponent from './components/subject/SyllabusComponent';
import LessonPlan from './components/subject/LessonPlan';
import TheoryComponent from './components/subject/TheoryComponent';
import LabsComponent from './components/subject/LabsComponent';
import AssignmentsComponent from './components/subject/AssignmentsComponent';
import ModelQPComponent from './components/subject/ModelQPComponent';
import TutorialVideosComponent from './components/subject/TutorialVideosComponent';
import NotFound from './pages/404NotFound';

const App = () => {
  const [pageNumber, setPageNumber] = useState(0)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/subject" element={<Subject pageNumber={pageNumber} setPageNumber={setPageNumber} />}>
          <Route index element={<Navigate to="/subject/0" />} />
          <Route path="0" element={<SyllabusComponent />}></Route>
          <Route path="1" element={<LessonPlan />}></Route>
          <Route path="2" element={<TheoryComponent />}></Route>
          <Route path="3" element={<LabsComponent />}></Route>
          <Route path="4" element={<AssignmentsComponent />}></Route>
          <Route path="5" element={<ModelQPComponent />}></Route>
          <Route path="6" element={<TutorialVideosComponent />}></Route>
        </Route>
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