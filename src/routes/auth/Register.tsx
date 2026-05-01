import { useNavigate } from "react-router";
import useStore  from "./userStore";
import { RegisterForm } from "@/components/register-form";

export default function Register() {
  const register = useStore((state: any) => state.login);
  const navigate = useNavigate();
  const destinationPage = "/profile";
  
  const handleRegister = () => {
    register();
    navigate(destinationPage);
  }
  return (
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <RegisterForm handleSubmit={handleRegister} />
      </div>
  )
}