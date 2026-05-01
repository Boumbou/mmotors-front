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

export function RegisterForm({
  className,
  handleSubmit,
  ...props
}: React.ComponentProps<"div"> & { handleSubmit: () => void }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
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
            <FieldLabel htmlFor="name">Nom d'utilisateur</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Votre nom d'utilisateur"
              // required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              // required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="saisissez votre mot de passe"
              // required
            />
          </Field>
          <Field>
            <Button type="submit" onClick={handleSubmit}>S'inscrire</Button>
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
