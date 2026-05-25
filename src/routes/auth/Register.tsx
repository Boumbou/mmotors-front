import { useLocation, useNavigate } from "react-router";
import useStore  from "./userStore";
import { RegisterForm } from "@/routes/auth/components/register-form";

export default function Register() {
  const register = useStore((state: any) => state.register);
  const navigate = useNavigate();
  const location = useLocation();
  const destinationPage = location.state?.from || "/profile";
  
  const handleRegister = async (email: string, password: string, name: string, lastName: string) => {
    try {
      const response = await register(email, password, name, lastName).catch((error: Error) => {
        alert("Erreur lors de l'inscription : veuillez vérifier vos informations et réessayer.");
        throw new Error(`Erreur lors de l'inscription : ${error.message}`);
      });
      if (response !== "Inscription réussie") {
        alert("Erreur lors de l'inscription : veuillez vérifier vos informations et réessayer.");
        throw new Error(response);
      }
      navigate(destinationPage);
    } catch (error) {
      console.error(error);
    }
  };


  return (
      <div className="flex max-w-md min-w-full flex-col gap-4 text-sm leading-loose">
        <RegisterForm handleSubmit={handleRegister} destination={destinationPage} />
      </div>
  )
}