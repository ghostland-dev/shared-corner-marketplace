
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: "Le nom complet est requis" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  
  // Form errors
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  
  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      const validatedData = loginSchema.parse(loginForm);
      setLoginErrors({});
      
      // Sign in
      const { error } = await signIn(validatedData.email, validatedData.password);
      if (!error) {
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setLoginErrors(errors);
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      const validatedData = signupSchema.parse(signupForm);
      setSignupErrors({});
      
      // Sign up
      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        { full_name: validatedData.fullName }
      );
      
      if (!error) {
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        });
        setActiveTab('login');
        setLoginForm({
          ...loginForm,
          email: validatedData.email
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setSignupErrors(errors);
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow kiwiiz-container py-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Bienvenue sur Kiwiiz
            </CardTitle>
            <CardDescription className="text-center">
              La plateforme de location entre particuliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={loginErrors.email ? "border-red-500" : ""}
                    />
                    {loginErrors.email && (
                      <p className="text-red-500 text-sm">{loginErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <a href="#" className="text-sm text-kiwiiz-primary hover:underline">
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={loginErrors.password ? "border-red-500" : ""}
                    />
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm">{loginErrors.password}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full kiwiiz-btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Nom complet</Label>
                    <Input
                      id="signup-fullname"
                      placeholder="Jean Dupont"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      className={signupErrors.fullName ? "border-red-500" : ""}
                    />
                    {signupErrors.fullName && (
                      <p className="text-red-500 text-sm">{signupErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className={signupErrors.email ? "border-red-500" : ""}
                    />
                    {signupErrors.email && (
                      <p className="text-red-500 text-sm">{signupErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className={signupErrors.password ? "border-red-500" : ""}
                    />
                    {signupErrors.password && (
                      <p className="text-red-500 text-sm">{signupErrors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className={signupErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {signupErrors.confirmPassword && (
                      <p className="text-red-500 text-sm">{signupErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full kiwiiz-btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            En vous inscrivant, vous acceptez nos{" "}
            <a href="#" className="text-kiwiiz-primary hover:underline mx-1">
              Conditions d'utilisation
            </a>
            et notre{" "}
            <a href="#" className="text-kiwiiz-primary hover:underline mx-1">
              Politique de confidentialité
            </a>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
