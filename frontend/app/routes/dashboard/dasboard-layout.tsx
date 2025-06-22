import { Header } from '@/components/layout/header';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/provider/auth-context';
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router';
import { SidebarComponent } from '@/components/layout/sidebar-component';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return navigate("/sign-in");
  }

  return (
    <div className='flex h-screen w-full'>
      <SidebarComponent />
      <div className='flex-1 flex flex-col h-full '>
        <Header />
        <main className='flex-1 overflow-y-auto h-full w-full'>
          <div className='mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout