'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Subject({ subject = 'Mathematics', isUpload = false }) {
  const navItems = [
    { path: !isUpload ? '/subject/0' : '/upload/0', label: 'Syllabus' },
    { path: !isUpload ? '/subject/1' : '/upload/1', label: 'Lesson Plan' },
    { path: !isUpload ? '/subject/2' : '/upload/2', label: 'Theory' },
    { path: !isUpload ? '/subject/3' : '/upload/3', label: 'Labs' },
    { path: !isUpload ? '/subject/4' : '/upload/4', label: 'Assignments' },
    { path: !isUpload ? '/subject/5' : '/upload/5', label: 'Model QP' },
    { path: !isUpload ? '/subject/6' : '/upload/6', label: 'Tutorial Video' },
  ];

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : navItems[0].label;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#fe965e]">{subject}</h1>
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