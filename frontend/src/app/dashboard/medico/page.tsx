"use client";

import { ActivitySquare, Users, CalendarHeart, Settings, LogOut, Clock, CalendarDays, KeySquare, Stethoscope, Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicoDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("agenda");
  const [citas, setCitas] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadData = async () => {
    try {
      const [citRes, pacRes] = await Promise.all([
        axios.get("http://localhost:4000/api/v1/citas"),
        axios.get("http://localhost:4000/api/v1/pacientes")
      ]);
      setCitas(citRes.data);
      setPacientes(pacRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch { /* ignore */ }
    loadData();
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      
      {/* Barra Lateral Profesional - Médico */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-md">
              <ActivitySquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-white">
              MediSystem
            </h2>
          </div>
          <nav className="space-y-3">
            <button onClick={() => setActiveTab("agenda")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'agenda' ? 'bg-white/10 text-emerald-300' : 'hover:bg-white/5 text-slate-400'}`}>
               <CalendarHeart className="h-5 w-5 mr-3" /> Mi Agenda
            </button>
            <button onClick={() => setActiveTab("pacientes")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'pacientes' ? 'bg-white/10 text-emerald-300' : 'hover:bg-white/5 text-slate-400'}`}>
               <Users className="h-5 w-5 mr-3" /> Base de Pacientes
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-700/50">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center w-full p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
          >
            <LogOut className="h-5 w-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-10 overflow-y-auto w-full relative">
        <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel Médico</h1>
            <p className="text-slate-500 font-medium">Gestión de consultas y atención a pacientes</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Campana de Notificaciones */}
             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative"
                >
                  <Bell className="h-6 w-6 text-slate-600" />
                  <span className="absolute top-2 right-2 h-3 w-3 bg-orange-500 rounded-full border-2 border-white"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50">
                      <h3 className="font-bold text-slate-900">Notificaciones del Sistema</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                        <p className="text-sm font-bold text-emerald-600">Nueva Cita Agendada</p>
                        <p className="text-xs text-slate-500">El paciente Carlos Lopez agendó una cita para mañana.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Hace 2 min</p>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                        <p className="text-sm font-bold text-slate-700">Actualización de Software</p>
                        <p className="text-xs text-slate-500">Se han optimizado los tiempos de carga del dashboard.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Hace 3 horas</p>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <button className="text-xs font-bold text-emerald-500 hover:text-emerald-700">Marcar todas como leídas</button>
                    </div>
                  </div>
                )}
             </div>

             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900">{currentUser?.nombre || "Médico"}</p>
               <p className="text-xs text-slate-500">{currentUser?.email || ""}</p>
             </div>
             <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 border-2 border-white shadow flex items-center justify-center text-white font-bold text-xl">
                {(currentUser?.nombre?.[0] || "M").toUpperCase()}
             </div>
          </div>
        </header>

        {activeTab === "agenda" && (
          <div className="animate-in fade-in zoom-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Citas en el Sistema</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl font-black text-slate-900">{citas.length}</h3>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-emerald-50`}>
                    <Stethoscope className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pacientes Atendidos</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl font-black text-slate-900">{pacientes.length}</h3>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-indigo-50`}>
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
             </div>
             
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Agenda de Consultas (En vivo)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-100 text-slate-500 text-sm font-bold uppercase tracking-wider">
                        <th className="pb-4 pt-2 px-4">Fecha</th>
                        <th className="pb-4 pt-2 px-4">Paciente</th>
                        <th className="pb-4 pt-2 px-4">Motivo de Consulta</th>
                        <th className="pb-4 pt-2 px-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {citas.map((cita) => (
                        <tr key={cita.id_cita} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">{cita.fecha ? new Date(cita.fecha).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-4 text-slate-800">{cita.paciente?.nombre}</td>
                          <td className="py-4 px-4 text-slate-500 text-sm">{cita.motivo}</td>
                          <td className="py-4 px-4">
                             <span className="text-slate-400 text-xs italic">Sin acciones</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === "pacientes" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">
             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Search className="mr-2" /> Directorio Médico de Pacientes</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pacientes.map((p) => (
                  <div key={p.id_paciente} className="border border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <h3 className="font-bold text-lg text-indigo-900">{p.nombre}</h3>
                    <div className="mt-2 text-sm text-slate-600">
                      <p><strong>Tel:</strong> {p.telefono || "S/N"}</p>
                      <p><strong>Nacimiento:</strong> {new Date(p.fecha_nacimiento).toLocaleDateString()}</p>
                      <p><strong>Alergias:</strong> {p.alergias || "Ninguna registrada"}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
