"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ActivitySquare } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", { 
        nombre, 
        email, 
        password 
      });
      
      setSuccessMsg(response.data.mensaje);
      
      // Esperar 2 segundos y redirigir al login
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Error al conectar con el servidor para el registro.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center py-10">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-indigo-600 p-12 text-white">
          <ActivitySquare className="h-24 w-24 mb-6 text-white" />
          <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">Regístrate</h1>
          <p className="text-indigo-100 text-center text-lg max-w-xs">
            Únete a MediSystem y toma el control de tu historial médico, citas y recetas de forma digital.
          </p>
        </div>

        <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta de Paciente</h2>
            <p className="text-gray-500 mb-4">Ingresa tus datos personales para darte de alta.</p>

            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700 mb-4">
                <strong>Error: </strong> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md text-sm text-emerald-700 mb-4">
                <strong>¡Éxito!: </strong> {successMsg}
              </div>
            )}
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-black"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>

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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-black"
                  placeholder="tucorreo@ejemplo.com"
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors text-black"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.01]"
            >
              Crear mi cuenta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta? {" "}
              <button onClick={() => router.push("/")} className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
