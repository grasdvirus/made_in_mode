

import FooterNav from '@/components/footer-nav';
import Header from '@/components/header-parallax';

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header title="Search" />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-32 -mt-16">
        <div className="bg-background rounded-t-3xl p-6 min-h-[80vh] shadow-2xl">
         <p className="text-muted-foreground mt-4">This is the search page. Content coming soon!</p>
        </div>
      </main>
      <FooterNav />
    </div>
  );
}
