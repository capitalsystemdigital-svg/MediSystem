"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ActivitySquare } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      
      if (response.data.token) {
        // Guardar token en localStorage (o cookies en prod)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.usuario));

        const rol = response.data.usuario.rol;
        
        if (rol === "Administrador") {
          router.push("/dashboard/administrador");
        } else if (rol === "Medico") {
          router.push("/dashboard/medico");
        } else if (rol === "Paciente") {
          router.push("/dashboard/paciente");
        } else {
          setErrorMsg("Rol no reconocido");
        }
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Error al conectar con el servidor. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-blue-600 p-12 text-white">
          <ActivitySquare className="h-24 w-24 mb-6 text-white" />
          <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">MediSystem</h1>
          <p className="text-blue-100 text-center text-lg max-w-xs">
            Gestión inteligente de clínicas médicas, control de roles, pacientes y citas en un solo lugar.
          </p>
        </div>

        <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h2>
            <p className="text-gray-500 mb-4">Ingresa tus credenciales para acceder a tu panel.</p>
            
            {/* Nota informativa */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-sm text-left mb-4">
              <strong className="text-blue-700 block mb-1">💡 Acceso al sistema:</strong>
              <span className="block text-blue-600">Ingresa con el correo y contraseña de tu cuenta. Los usuarios y credenciales son gestionados por el Administrador.</span>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700 mb-4">
                <strong>Error: </strong> {errorMsg}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-black"
                  placeholder="admin@medisystem.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors text-black"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.01]"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              ¿Eres un paciente nuevo? {" "}
              <button 
                onClick={() => router.push("/register")}
                className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                Crea tu cuenta aquí
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
