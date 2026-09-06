import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function Shell() {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#111111] text-[#F0F0F0] overflow-hidden">
      {/* 48px Topbar */}
      <Topbar />

      {/* Main viewport with 56px Sidebar + Content Outlet */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden bg-[#111111]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
