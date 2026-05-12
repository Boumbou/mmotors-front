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
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import { useState } from "react"

export function RegisterForm({
  className,
  handleSubmit,
  ...props
}: React.ComponentProps<"div"> & { handleSubmit: (email: string, password: string, name: string, lastName: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(email, password, name, lastName);
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenue chez MMotors</h1>
            <FieldDescription>
              Déjà inscrit ? <a href="/auth/login">Connectez-vous</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="lastname">Nom</FieldLabel>
            <Input
              id="lastname"
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              // required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Prénom</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Votre prénom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // required
            />
          </Field>
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
            <Button type="submit" disabled={!email || !password || !name || !lastName}>S'inscrire</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        En cliquant sur continuer, vous acceptez nos <a href="#">Conditions d'utilisation</a>{" "}
        et notre <a href="#">Politique de confidentialité</a>.
      </FieldDescription>
    </div>
  )
}
