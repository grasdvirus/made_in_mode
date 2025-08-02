
'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-24 right-4 z-50 rounded-full bg-white/20 backdrop-blur-sm text-white transition-opacity duration-300 hover:bg-white/30',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}
