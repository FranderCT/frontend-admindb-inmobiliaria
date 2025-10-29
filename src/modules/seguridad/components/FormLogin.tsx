import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { extractServerErrors } from "@/utils/serverExtract";
import { useLogin } from "../hooks/usuariosHooks";
import { loginUserSchema } from "../schema/userSchema";
import { initialValuesLogin } from "../types/userTypes";
import { Card, CardDescription } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";

const FormLogin = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const login = useLogin();
  const nav = useNavigate();

  const form = useForm({
    defaultValues: initialValuesLogin,
    onSubmit: async ({ value, formApi }) => {
      setFormErrors({});
      setFormError(null);

      const result = loginUserSchema.safeParse(value);
      if (!result.success) {
        const errs: Record<string, string> = {};
        for (const i of result.error.issues) {
          const k = i.path.join(".");
          if (!errs[k]) errs[k] = i.message;
        }
        setFormErrors(errs);
        return;
      }

      try {
        await login.mutateAsync({ user: value });
        formApi.reset();
        toast.success("Inicio de sesión exitoso. Bienvenido, " + value.email);
        nav({ to: "/" });
      } catch (err) {
        const { fieldErrors, formError } = extractServerErrors(err);
        setFormErrors(fieldErrors);
        setFormError(formError ?? null);
      }
    },
  });

  return (
    <div className="min-h-screen grid place-items-center">
          <Card
              className="
          w-full max-w-4xl 
          grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]
          overflow-hidden p-0
        "
          >
              <div className="relative hidden md:block ">
                  <img
            src="https://i.pinimg.com/736x/70/29/5a/70295ac1a86e4a1a0fe325c09ee34598.jpg"
                      alt="Banner"
                      className="h-[522px] w-full object-cover"
                  />
              </div>

        <div className=" h-full p-10 flex flex-col justify-center gap-6">
          <header className="mb-6 flex items-center flex-col gap-4">
            <img src="/AltosDelValleLogo.png" alt="Altos del Valle" className="w-24 h-auto" />
            <CardDescription>
              ¡Bienvenido de nuevo! Inicia sesión en tu cuenta.
            </CardDescription>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="username"
                      className="rounded-xl"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-slate-400 shrink-0" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      autoComplete="current-password"
                      className="rounded-xl"
                    />
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.password}</p>
                  )}
                </div>
              )}
            </form.Field>

            {Object.keys(formErrors).length === 0 && formError && (
              <p className="text-xs text-center text-rose-600">{formError}</p>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={login.isPending} className="rounded-xl hover:cursor-pointer">
                {login.isPending ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default FormLogin;
