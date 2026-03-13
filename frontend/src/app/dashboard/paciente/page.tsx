"use client";

import { ActivitySquare, CalendarHeart, FileText, Settings, LogOut, Clock, CalendarDays, KeySquare, PlusCircle, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PacienteDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("citas");
  const [citasDelPaciente, setCitas] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Formularios de reserva de cita
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [medicoSeleccionado, setMedico] = useState("");

  const loadData = async () => {
    try {
      const [citRes, medRes] = await Promise.all([
        axios.get("http://localhost:4000/api/v1/citas"),
        axios.get("http://localhost:4000/api/v1/medicos")
      ]);
      setCitas(citRes.data);
      setMedicos(medRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/citas", {
        medico_id: medicoSeleccionado,
        paciente_id: 1, 
        fecha: fecha,
        hora: fecha,
        motivo: motivo
      });
      alert("✅ Cita programada exitosamente");
      setMotivo(""); setFecha(""); setMedico("");
      setActiveTab("citas");
    } catch(err) {
       alert("Error al agendar cita");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      
      {/* Barra Lateral Profesional - Paciente */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
              <ActivitySquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white">
              MediSystem
            </h2>
          </div>
          <nav className="space-y-3">
            <button onClick={() => setActiveTab("citas")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'citas' ? 'bg-white/10 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <CalendarHeart className="h-5 w-5 mr-3" /> Mis Citas
            </button>
            <button onClick={() => setActiveTab("agendar")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'agendar' ? 'bg-white/10 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}>
               <PlusCircle className="h-5 w-5 mr-3" /> Solicitar Cita
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portal del Paciente</h1>
            <p className="text-slate-500 font-medium">Gestiona tu salud de forma rápida y segura</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Campana de Notificaciones */}
             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative"
                >
                  <Bell className="h-6 w-6 text-slate-600" />
                  <span className="absolute top-2 right-2 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50">
                      <h3 className="font-bold text-slate-900">Notificaciones del Sistema</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                        <p className="text-sm font-bold text-indigo-600">Nueva Cita Disponible</p>
                        <p className="text-xs text-slate-500">Hay nuevos horarios para Medicina General.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Hace 5 min</p>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                        <p className="text-sm font-bold text-slate-700">Recordatorio de Cita</p>
                        <p className="text-xs text-slate-500">Tu próxima consulta es en 3 días.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Hace 1 hora</p>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Marcar todas como leídas</button>
                    </div>
                  </div>
                )}
             </div>

             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900">Paciente Local</p>
               <p className="text-xs text-slate-500">MediSystem Cloud</p>
             </div>
             <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-white shadow flex items-center justify-center text-white font-bold text-xl">
                PL
             </div>
          </div>
        </header>

        {activeTab === "citas" && (
           <div className="animate-in fade-in zoom-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Citas Activas</p>
                    <div className="flex items-end gap-3"><h3 className="text-3xl font-black text-slate-900">{citasDelPaciente.length}</h3></div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-indigo-50`}><CalendarDays className="h-8 w-8 text-indigo-600" /></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Estatus del Sistema</p>
                     <div className="flex items-end gap-3"><h3 className="text-3xl font-black text-emerald-500">Online</h3></div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-emerald-50`}><ActivitySquare className="h-8 w-8 text-emerald-600" /></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Historial de Mis Citas (DB Vivo)</h2>
                  <button onClick={() => setActiveTab("agendar")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    Solicitar Cita Ahora
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                        <th className="pb-4 px-4">Fecha Programada</th>
                        <th className="pb-4 px-4">Especialista (Médico)</th>
                        <th className="pb-4 px-4">Motivo de Consulta</th>
                        <th className="pb-4 px-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citasDelPaciente.map((c) => (
                        <tr key={c.id_cita} className="border-b hover:bg-slate-50">
                          <td className="py-4 px-4 font-bold text-slate-700">{c.fecha ? new Date(c.fecha).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4 px-4">{c.medico?.nombre} <span className="text-xs text-indigo-500 ml-2">({c.medico?.especialidad})</span></td>
                          <td className="py-4 px-4 text-slate-600 text-sm">{c.motivo}</td>
                           <td className="py-4 px-4">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700`}>{c.estado}</span>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        )}

        {activeTab === "agendar" && (
           <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <CalendarDays className="mr-3 text-indigo-500" /> Formulario de Reserva 
             </h2>
             <hr className="mb-6"/>
             <form onSubmit={handleAgendar} className="max-w-xl space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">1. Selecciona a tu Médico Especialista</label>
                   <select required value={medicoSeleccionado} onChange={(e) => setMedico(e.target.value)} className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-indigo-500 text-black">
                     <option value="" disabled>-- Elige un Médico --</option>
                     {medicos.map(m => (
                       <option key={m.id_medico} value={m.id_medico}>{m.nombre} - {m.especialidad}</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">2. Elige la Fecha y Hora</label>
                   <input required type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-indigo-500 text-black" />
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">3. Motivo de la Consulta</label>
                   <textarea required value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: Dolor estomacal, Revisión de laboratorios..." className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-indigo-500 text-black h-32" />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-indigo-600 font-bold text-white px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                    Confirmar Reservación Médica
                  </button>
                </div>
             </form>
           </div>
        )}
      </main>
    </div>
  );
}
