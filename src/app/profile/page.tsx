
import FooterNav from '@/components/footer-nav';
import Header from '@/components/header';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-28 pb-32">
        <h1 className="text-4xl font-extrabold tracking-tighter leading-tight font-headline uppercase">
          Profile
        </h1>
        <p className="text-muted-foreground mt-4">This is the profile page. Content coming soon!</p>
      </main>
      <FooterNav />
    </div>
  );
}
