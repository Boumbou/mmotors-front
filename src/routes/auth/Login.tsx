import { useLocation, useNavigate } from "react-router";
import useStore from "./userStore";
import { LoginForm } from "@/routes/auth/components/login-form";
import { useState } from "react";

export default function Login() {
  const login = useStore((state: any) => state.login);
  const location = useLocation();
  // récupérer la dernière page visitée
  const previousPage = location.state?.from || "/profile";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login(email, password).catch((error: Error) => {
        throw new Error(`Erreur lors de la connexion : ${error.message}`);
      });
      //check if is logged in        const user = useStore.getState().user;
      if (response !== "Connexion réussie") {
        alert("Erreur lors de la connexion : identifiants incorrects.");
        throw new Error(response);
      }
      // Rediriger vers la page précédente après la connexion
      navigate(previousPage);
    } catch (error) {
      alert("Oops nous n'avons pas pu vous connecter, veuillez vérifier vos identifiants et réessayer.");
    } finally {
      setLoading(false);
    }

  }

  return (
      <div className="flex min-w-100 flex-col gap-4 text-sm leading-loose">
        <LoginForm handleLogin={handleLogin} destination={previousPage} />
        {loading && <p>Connexion en cours...</p>}
      </div>
  )
}