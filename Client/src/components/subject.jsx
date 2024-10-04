'use client';

import { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs'
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSubjects from '@/hooks/useSubjects';
import axios from '@/api/axios';

export function Subject() {
  const location = useLocation();
  const [subject, setSubject] = useState({});

  const subjectId = new URLSearchParams(location.search).get("id");

  const queryParams = new URLSearchParams({
    id: subjectId,
  }).toString();

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const res = await axios.get(`/learn/${subjectId}`);

      setSubject(res.data.data);
    }

    fetchSubjectDetails();
  }, []);


  const navItems = [
    { path: `/subject/0?${queryParams}`, label: 'Syllabus' },
    { path: `/subject/1?${queryParams}`, label: 'Lesson Plan' },
    { path: `/subject/2?${queryParams}`, label: 'Theory' },
    { path: `/subject/3?${queryParams}`, label: 'Labs' },
    { path: `/subject/4?${queryParams}`, label: 'Assignments' },
    { path: `/subject/5?${queryParams}`, label: 'Model QP' },
    { path: `/subject/6?${queryParams}`, label: 'Tutorial Video' },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : navItems[0].label;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#fe965e]">{subject.name}</h1>
      <Tabs defaultValue="syllabus">
        <div className="md:hidden mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-[#222222] text-white border-[#fe965e] hover:bg-[#333333] hover:text-[#fe965e] p-6"
              >
                {activeTab} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] bg-[#222222] border-[#fe965e]">
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  className="focus:bg-[#fe965e] focus:text-white"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full p-2 ${isActive ? 'text-[#fe965e]' : 'text-white'} hover:text-white`
                    }
                    onClick={() => setActiveTab(item.label)}
                  >
                    {item.label}
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:grid w-full grid-cols-7 bg-[#222222] text-white p-[5px] rounded-xl border-[1px] border-[#fe965e] text-center mb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'bg-[#fe965e] shadow-lg p-3 rounded-lg' : 'p-3 hover:bg-[#333333] hover:text-[#fe965e]'
              }
              onClick={() => setActiveTab(item.label)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </Tabs>

      <Outlet />
    </div>
  );
}