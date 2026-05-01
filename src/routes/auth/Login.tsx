import { useNavigate } from "react-router";
import useStore from "./userStore";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  const login = useStore((state: any) => state.login);
  // récupérer la dernière page visitée
  const previousPage = "/profile";
  const navigate = useNavigate();


  const handleLogin = () => {
    login();

    // Rediriger vers la page profile après la connexion
    navigate(previousPage);
  }

  return (
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <LoginForm handleLogin={handleLogin} />
      </div>
  )
}