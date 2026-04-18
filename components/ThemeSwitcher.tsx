'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const currentTheme = theme ?? 'system';

  return (
    <Tabs value={currentTheme} onValueChange={setTheme}>
      <TabsList className='border rounded-md bg-muted/50 p-1'>
        <TabsTrigger value='light' aria-label='Use light theme'>
          <SunIcon className='h-[1.2rem] w-[1.2rem]' />
        </TabsTrigger>
        <TabsTrigger value='dark' aria-label='Use dark theme'>
          <MoonIcon className='h-[1.2rem] w-[1.2rem] rotate-90 transition-transform dark:rotate-0' />
        </TabsTrigger>
        <TabsTrigger value='system' aria-label='Use system theme'>
          <DesktopIcon className='h-[1.2rem] w-[1.2rem]' />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ThemeSwitcher;
