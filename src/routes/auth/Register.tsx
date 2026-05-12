import { useNavigate } from "react-router";
import useStore  from "./userStore";
import { RegisterForm } from "@/components/register-form";

export default function Register() {
  const register = useStore((state: any) => state.register);
  const navigate = useNavigate();
  const destinationPage = "/profile";
  
  const handleRegister = async (email: string, password: string, name: string, lastName: string) => {
    try {
      await register(email, password, name, lastName).catch((error: Error) => {
        throw new Error(`Erreur lors de l'inscription : ${error.message}`);
      });
      navigate(destinationPage);
    } catch (error) {
      console.error(error);
    }
  };


  return (
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <RegisterForm handleSubmit={handleRegister} />
      </div>
  )
}