import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null);
      setCarregando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evento, sessao) => {
        setUsuario(sessao?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function cadastrar(email, senha) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });
    return { data, error };
  }

  async function entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    return { data, error };
  }

  async function entrarComGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  }

  async function sair() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, cadastrar, entrar, entrarComGoogle, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}
