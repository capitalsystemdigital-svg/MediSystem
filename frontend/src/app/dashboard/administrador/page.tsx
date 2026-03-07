"use client";

import { ActivitySquare, Users, UserRound, CalendarHeart, Settings, LogOut, ArrowUpRight, Activity, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);

  // Medic form state
  const [medNombre, setMedNombre] = useState("");
  const [medEspecialidad, setMedEspecialidad] = useState("");
  const [medCedula, setMedCedula] = useState("");
  const [medEmail, setMedEmail] = useState("");
  const [medTelefono, setMedTelefono] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [pacRes, citRes, medRes] = await Promise.all([
        axios.get("http://localhost:4000/api/v1/pacientes"),
        axios.get("http://localhost:4000/api/v1/citas"),
        axios.get("http://localhost:4000/api/v1/medicos")
      ]);
      setPacientes(pacRes.data);
      setCitas(citRes.data);
      setMedicos(medRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleDeleteCita = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/v1/citas/${id}`);
    loadData();
  };

  const handleDeletePaciente = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/v1/pacientes/${id}`);
    loadData();
  };

  const handeCrearMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/medicos", {
        nombre: medNombre,
        especialidad: medEspecialidad,
        cedula_profesional: medCedula,
        email: medEmail,
        telefono: medTelefono
      });
      setToastMessage("✅ Médico y su cuenta de acceso creados exitosamente");
      setTimeout(() => setToastMessage(null), 4000);
      setMedNombre(""); setMedEspecialidad(""); setMedCedula(""); setMedEmail(""); setMedTelefono("");
      loadData();
    } catch (e: any) {
      alert(e.response?.data?.error || "Error al crear médico");
    }
  };

  const handleDeleteMedico = async (id: number) => {
    if(confirm("¿Estás seguro de eliminar este médico? También se borrarán sus citas asignadas.")) {
      await axios.delete(`http://localhost:4000/api/v1/medicos/${id}`);
      loadData();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
              <ActivitySquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              MediSystem
            </h2>
          </div>
          <nav className="space-y-3">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'dashboard' ? 'bg-white/10 text-blue-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <Activity className="h-5 w-5 mr-3" /> Dashboard
            </button>
            <button onClick={() => setActiveTab("medicos")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'medicos' ? 'bg-white/10 text-blue-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <UserRound className="h-5 w-5 mr-3" /> Plantilla Médica
            </button>
            <button onClick={() => setActiveTab("pacientes")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'pacientes' ? 'bg-white/10 text-blue-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <Users className="h-5 w-5 mr-3" /> Pacientes (CRUD)
            </button>
            <button onClick={() => setActiveTab("citas")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'citas' ? 'bg-white/10 text-blue-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <CalendarHeart className="h-5 w-5 mr-3" /> Citas (CRUD)
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-700/50">
          <button onClick={() => router.push("/")} className="flex items-center w-full p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium">
            <LogOut className="h-5 w-5 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto w-full">
        <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Administración</h1>
            <p className="text-slate-500 font-medium">Resumen general y control de base de datos</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-900">Admin. Ejecutivo</p>
               <p className="text-xs text-slate-500">admin@medisystem.com</p>
             </div>
             <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-white font-bold text-xl">A</div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 w-full animate-in fade-in zoom-in duration-300">
            <StatsCard title="Total de Médicos" value={medicos.length.toString()} icon={<UserRound />} bg="bg-indigo-50" color="text-indigo-600" />
            <StatsCard title="Pacientes" value={pacientes.length.toString()} icon={<Users />} bg="bg-blue-50" color="text-blue-600" />
            <StatsCard title="Citas Programadas" value={citas.length.toString()} icon={<CalendarHeart />} bg="bg-emerald-50" color="text-emerald-600" />
          </div>
        )}

        {activeTab === "pacientes" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
               Directorio de Pacientes
             </h2>
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                   <th className="pb-4 px-4">ID</th><th className="pb-4 px-4">Nombre</th><th className="pb-4 px-4">Teléfono</th><th className="pb-4 px-4">Eliminar</th>
                 </tr>
               </thead>
               <tbody>
                 {pacientes.map((p) => (
                   <tr key={p.id_paciente} className="border-b hover:bg-slate-50">
                     <td className="py-4 px-4">{p.id_paciente}</td><td className="py-4 px-4 font-bold">{p.nombre}</td>
                     <td className="py-4 px-4">{p.telefono || 'N/A'}</td>
                     <td className="py-4 px-4">
                       <button onClick={() => handleDeletePaciente(p.id_paciente)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg">
                         <Trash size={16} />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === "citas" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-xl font-bold text-slate-900 mb-6">Citas Generales</h2>
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                   <th className="pb-4 px-4">Paciente</th><th className="pb-4 px-4">Médico</th><th className="pb-4 px-4">Motivo</th><th className="pb-4 px-4">Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {citas.map((c) => (
                   <tr key={c.id_cita} className="border-b hover:bg-slate-50">
                     <td className="py-4 px-4 font-bold">{c.paciente?.nombre}</td>
                     <td className="py-4 px-4">{c.medico?.nombre}</td><td className="py-4 px-4">{c.motivo}</td>
                     <td className="py-4 px-4">
                       <button onClick={() => handleDeleteCita(c.id_cita)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg">
                         <Trash size={16} />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === "medicos" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             {/* Formulario de creación */}
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
               <h2 className="text-xl font-bold text-slate-900 mb-6">➕ Dar de Alta Nuevo Médico</h2>
               <form onSubmit={handeCrearMedico} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input required placeholder="Nombre Completo" value={medNombre} onChange={e=>setMedNombre(e.target.value)} className="border p-3 rounded-lg w-full text-black"/>
                 <input required placeholder="Especialidad (Ej: Pediatría)" value={medEspecialidad} onChange={e=>setMedEspecialidad(e.target.value)} className="border p-3 rounded-lg w-full text-black"/>
                 <input required placeholder="Cédula Profesional" value={medCedula} onChange={e=>setMedCedula(e.target.value)} className="border p-3 rounded-lg w-full text-black"/>
                 <input required type="email" placeholder="Correo (Para iniciar sesión)" value={medEmail} onChange={e=>setMedEmail(e.target.value)} className="border p-3 rounded-lg w-full text-black"/>
                 <input placeholder="Teléfono" value={medTelefono} onChange={e=>setMedTelefono(e.target.value)} className="border p-3 rounded-lg w-full text-black"/>
                 
                 <div className="flex items-end">
                   <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-colors">
                     Guardar Médico y Generar Accesos
                   </button>
                 </div>
               </form>
               <p className="text-xs text-slate-500 mt-4">* Todos los médicos nuevos reciben la contraseña por defecto: <code className="bg-slate-100 px-1 rounded">doctor123</code></p>
             </div>

             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold text-slate-900 mb-6">Plantilla Médica Activa</h2>
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                     <th className="pb-4 px-4">Médico</th>
                     <th className="pb-4 px-4">Especialidad</th>
                     <th className="pb-4 px-4">Cédula</th>
                     <th className="pb-4 px-4">Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                   {medicos.map((m) => (
                     <tr key={m.id_medico} className="border-b hover:bg-slate-50">
                       <td className="py-4 px-4 font-bold">{m.nombre}</td>
                       <td className="py-4 px-4">{m.especialidad}</td>
                       <td className="py-4 px-4 font-mono">{m.cedula_profesional}</td>
                       <td className="py-4 px-4">
                         <button onClick={() => handleDeleteMedico(m.id_medico)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg">
                           <Trash size={16} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in zoom-in fade-in slide-in-from-bottom-5 duration-300 z-50">
            <span className="font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-white/70 hover:text-white transition-colors">
              &times;
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

function StatsCard({ title, value, icon, bg, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md">
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
    </div>
  );
}
