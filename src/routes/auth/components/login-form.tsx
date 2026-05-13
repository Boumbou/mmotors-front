"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router"

export function LoginForm({
  className,
  handleLogin,
  destination,
  ...props
}: React.ComponentProps<"div"> & { handleLogin: (email: string, password: string) => void , destination: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  }

  return (
    <div className={cn("flex basis-full flex-col gap-6 md:min-w-100", className)} {...props}>
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-20 items-center justify-center rounded-md">
                <img src="/MMotorsLogo.png" alt="MMotorsLogo" />
              </div>
              <span className="sr-only">MMotors</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenue chez MMotors</h1>
            <FieldDescription>
              Pas encore inscrit ? <Button variant="link" onClick={() => navigate("/auth/register", { state: { from: destination } })}>Inscrivez-vous</Button>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="saisissez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={!email || !password}>Se connecter</Button>
          </Field>
        </FieldGroup>
      </form>
    
    </div>
  )
}
