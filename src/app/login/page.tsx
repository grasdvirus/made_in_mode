
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import './login.css';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
        }
      }
      router.push('/');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Cette adresse e-mail est déjà utilisée.');
          break;
        case 'auth/invalid-email':
          setError('Adresse e-mail invalide.');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect.');
          break;
        case 'auth/user-not-found':
            setError('Aucun utilisateur trouvé avec cet e-mail.');
            break;
        case 'auth/weak-password':
            setError('Le mot de passe doit comporter au moins 6 caractères.');
            break;
        default:
          setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      setError('Une erreur est survenue lors de la connexion avec Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="container">
        <div className="login-box">
          <form className="form" onSubmit={handleAuthAction}>
            <div className="logo"></div>
            <span className="header">{isLoginMode ? 'Bon retour !' : 'Créer un compte'}</span>
            
            {!isLoginMode && (
                 <input 
                    type="text" 
                    placeholder="Nom complet" 
                    className="input" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}

            <input 
              type="email" 
              placeholder="Email" 
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="input-group">
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Mot de passe" 
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="password-toggle"
                >
                    {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
            </div>
            
            <button type="submit" className="button sign-in" disabled={loading}>
              {loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'Créer le compte')}
            </button>
            
            <button type="button" className="button google-sign-in" onClick={handleGoogleSignIn} disabled={loading}>
              <svg
                className="icon"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
                <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
                <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
                <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
              </svg>
              <span> Se connecter avec Google </span>
            </button>

            {error && <p className="error-message">{error}</p>}

            <p className="footer">
              {isLoginMode ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}
              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="link">
                {isLoginMode ? "Inscrivez-vous, c'est gratuit !" : "Connectez-vous"}
              </button>
              <br />
              <a href="#" className="link">Mot de passe oublié ?</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
