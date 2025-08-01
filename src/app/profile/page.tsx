'use client';
import { useState, useEffect } from 'react';
import FooterNav from '@/components/footer-nav';
import Header from '@/components/header-parallax';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function ProfilePage() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header title="Mon Profil" />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 -mt-16">
        <div className="bg-background rounded-t-3xl p-6 min-h-[80vh] shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paramètres</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-switch" className="text-lg">
                Thème Sombre
              </Label>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      </main>
      <FooterNav />
    </div>
  );
}
