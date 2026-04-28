import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import useStore from "./userStore";

export default function Login() {
  const login = useStore((state: any) => state.login);
  const location = useLocation();
  // récupérer la dernière page visitée
  const previousPage = location.state?.from || "/profile";
  const navigate = useNavigate();


  const handleLogin = () => {
    login();

    // Rediriger vers la page profile après la connexion
    navigate(previousPage);
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Link to="/"><Button variant="ghost" >Retour à l'accueil</Button></Link>
        </div>
        <div>
          <h1 className="font-medium">Se connecter</h1>
          <p>Page de connexion / ouverture de compte</p>
        </div>
          <Button variant="default" onClick={handleLogin}>Se connecter</Button>
      </div>
    </div>
  )
}