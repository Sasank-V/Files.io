'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Outlet, NavLink } from 'react-router-dom';
import SyllabusComponent from '@/components/subject/SyllabusComponent';


export function Subject({ subject = 'Mathematics' }) {

  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{subject}</h1>
      <Tabs defaultValue="syllabus">
        <div className="grid w-full grid-cols-3 md:grid-cols-7 bg-[#222222] text-white p-[5px] rounded-xl border-[1px]v text-center mb-2">
          <NavLink
            to="/subject/0"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Syllabus
          </NavLink>
          <NavLink
            to="/subject/1"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Lesson Plan
          </NavLink>
          <NavLink
            to="/subject/2"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Theory
          </NavLink>
          <NavLink
            to="/subject/3"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Labs
          </NavLink>
          <NavLink
            to="/subject/4"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Assignments
          </NavLink>
          <NavLink
            to="/subject/5"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Model QP
          </NavLink>
          <NavLink
            to="/subject/6"
            className={({ isActive }) => isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3'}>
            Tutorial Video
          </NavLink>
        </div>
      </Tabs>

      <Outlet />
    </div>)
  );
}