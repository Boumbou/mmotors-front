import { useNavigate } from "react-router";
import useStore from "./userStore";
import { LoginForm } from "@/components/login-form";
import { useState } from "react";

export default function Login() {
  const login = useStore((state: any) => state.login);
  // récupérer la dernière page visitée
  const previousPage = "/profile";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    try {
      login(email, password).catch((error: Error) => {
        throw new Error(`Erreur lors de la connexion : ${error.message}`);
      }).then(() => {
        // Rediriger vers la page profile après la connexion
        navigate(previousPage);
      });
    }catch{
      alert("Oops nous n'avons pas pu vous connecter, veuillez vérifier vos identifiants et réessayer.");
    } finally {
      setLoading(false);
    }

  }

  return (
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <LoginForm handleLogin={handleLogin} />
        {loading && <p>Connexion en cours...</p>}
      </div>
  )
}