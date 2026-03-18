"use client";

import { ActivitySquare, Users, CalendarHeart, LogOut, Stethoscope, Search, Bell, FileText, Pencil, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function MedicoDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("agenda");
  const [citas, setCitas] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pacienteExpedienteId, setPacienteExpedienteId] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [notas, setNotas] = useState("");
  const [editingExpedienteId, setEditingExpedienteId] = useState<number | null>(null);
  const [pacienteModal, setPacienteModal] = useState<any | null>(null);

  const getAuthHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [citRes, pacRes, expRes] = await Promise.all([
        axios.get("http://localhost:4000/api/v1/citas"),
        axios.get("http://localhost:4000/api/v1/pacientes"),
        axios.get("http://localhost:4000/api/v1/expedientes", { headers: getAuthHeaders() })
      ]);
      setCitas(citRes.data);
      setPacientes(pacRes.data);
      setExpedientes(expRes.data);
    } catch (e) {
      console.error(e);
    }
  }, [getAuthHeaders]);

  const cleanExpedienteForm = () => {
    setPacienteExpedienteId("");
    setDiagnostico("");
    setTratamiento("");
    setNotas("");
    setEditingExpedienteId(null);
  };

  const handleGuardarExpediente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        paciente_id: Number(pacienteExpedienteId),
        diagnostico,
        tratamiento,
        notas,
      };

      if (editingExpedienteId) {
        await axios.put(`http://localhost:4000/api/v1/expedientes/${editingExpedienteId}`, payload, {
          headers: getAuthHeaders(),
        });
        alert("Expediente actualizado correctamente");
      } else {
        await axios.post("http://localhost:4000/api/v1/expedientes", payload, {
          headers: getAuthHeaders(),
        });
        alert("Expediente creado correctamente");
      }

      cleanExpedienteForm();
      await loadData();
    } catch (error: any) {
      alert(error?.response?.data?.error || "No se pudo guardar el expediente");
    }
  };

  const prepareEditExpediente = (expediente: any) => {
    setEditingExpedienteId(expediente.id_expediente);
    setPacienteExpedienteId(String(expediente.paciente_id));
    setDiagnostico(expediente.diagnostico || "");
    setTratamiento(expediente.tratamiento || "");
    setNotas(expediente.notas || "");
    setActiveTab("expedientes");
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch { /* ignore */ }
    loadData();
  }, [activeTab, loadData]);

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
            <button onClick={() => setActiveTab("expedientes")} className={`w-full flex items-center p-3 rounded-xl transition-all font-semibold ${activeTab === 'expedientes' ? 'bg-white/10 text-emerald-300' : 'hover:bg-white/5 text-slate-400'}`}>
              <FileText className="h-5 w-5 mr-3" /> Expedientes
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
                            <button
                              type="button"
                              onClick={() => {
                                const pac = pacientes.find((p) => p.id_paciente === cita.paciente_id) || cita.paciente;
                                const exps = expedientes.filter((e) => e.paciente_id === cita.paciente_id);
                                setPacienteModal({ ...pac, expedientes: exps });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                              title="Ver expediente del paciente"
                            >
                              <Eye className="h-4 w-4" /> Ver expediente
                            </button>
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
                {pacientes.map((p) => {
                  const expsPaciente = expedientes.filter((e) => e.paciente_id === p.id_paciente);
                  return (
                    <div key={p.id_paciente} className="border border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-indigo-900">{p.nombre}</h3>
                        <div className="mt-2 text-sm text-slate-600">
                          <p><strong>Tel:</strong> {p.telefono || "S/N"}</p>
                          <p><strong>Nacimiento:</strong> {new Date(p.fecha_nacimiento).toLocaleDateString()}</p>
                          <p><strong>Alergias:</strong> {p.alergias || "Ninguna registrada"}</p>
                        </div>
                      </div>

                      {expsPaciente.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Sin expedientes registrados aún</p>
                      ) : (
                        <p className="text-xs text-emerald-600 font-semibold">{expsPaciente.length} expediente{expsPaciente.length > 1 ? "s" : ""} registrado{expsPaciente.length > 1 ? "s" : ""}</p>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setPacienteExpedienteId(String(p.id_paciente));
                          setActiveTab("expedientes");
                        }}
                        className="mt-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                      >
                        <FileText className="h-4 w-4" /> Ver expedientes
                      </button>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {activeTab === "expedientes" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{editingExpedienteId ? "Editar Expediente" : "Crear Expediente"}</h2>
              <form onSubmit={handleGuardarExpediente} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Paciente</label>
                  <select
                    required
                    value={pacienteExpedienteId}
                    onChange={(e) => setPacienteExpedienteId(e.target.value)}
                    disabled={Boolean(editingExpedienteId)}
                    className="w-full border-2 border-slate-200 p-3 rounded-lg text-black"
                  >
                    <option value="" disabled>Selecciona un paciente</option>
                    {pacientes.map((p) => (
                      <option key={p.id_paciente} value={p.id_paciente}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Diagnóstico</label>
                  <textarea
                    required
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    className="w-full border-2 border-slate-200 p-3 rounded-lg text-black h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tratamiento</label>
                  <textarea
                    value={tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    className="w-full border-2 border-slate-200 p-3 rounded-lg text-black h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notas</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full border-2 border-slate-200 p-3 rounded-lg text-black h-24"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3 justify-end">
                  {editingExpedienteId && (
                    <button
                      type="button"
                      onClick={cleanExpedienteForm}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                    >
                      Cancelar edición
                    </button>
                  )}
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold">
                    {editingExpedienteId ? "Guardar cambios" : "Crear expediente"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Expedientes Registrados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expedientes.map((exp) => (
                  <article key={exp.id_expediente} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <p className="text-sm text-slate-500">Paciente</p>
                    <h3 className="font-bold text-slate-900 mb-3">{exp.paciente?.nombre}</h3>
                    <p className="text-sm text-slate-500">Diagnóstico</p>
                    <p className="text-slate-700 mb-3">{exp.diagnostico}</p>
                    <p className="text-sm text-slate-500">Tratamiento</p>
                    <p className="text-slate-700 mb-3">{exp.tratamiento || "Sin tratamiento registrado"}</p>
                    <p className="text-xs text-slate-400 mb-4">Actualizado: {new Date(exp.fecha_actualizacion).toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={() => prepareEditExpediente(exp)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                    >
                      <Pencil className="h-4 w-4" /> Editar
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal de expediente del paciente */}
      {pacienteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Expediente de {pacienteModal.nombre}</h2>
              <button onClick={() => setPacienteModal(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Datos del paciente */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Datos del Paciente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Teléfono:</span></div>
                  <div className="font-medium text-slate-800">{pacienteModal.telefono || "S/N"}</div>
                  <div><span className="text-slate-500">Nacimiento:</span></div>
                  <div className="font-medium text-slate-800">{pacienteModal.fecha_nacimiento ? new Date(pacienteModal.fecha_nacimiento).toLocaleDateString() : "S/N"}</div>
                  <div><span className="text-slate-500">Tipo de sangre:</span></div>
                  <div className="font-medium text-slate-800">{pacienteModal.tipo_sangre || "No registrado"}</div>
                  <div><span className="text-slate-500">Alergias:</span></div>
                  <div className="font-medium text-slate-800">{pacienteModal.alergias || "Ninguna registrada"}</div>
                </div>
              </section>

              {/* Expedientes */}
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de Expedientes</h3>
                {pacienteModal.expedientes?.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Este paciente aún no tiene expedientes registrados.</p>
                ) : (
                  <div className="space-y-3">
                    {pacienteModal.expedientes?.map((exp: any) => (
                      <article key={exp.id_expediente} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">Diagnóstico</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">{exp.diagnostico}</p>
                        <p className="text-xs text-slate-400 mb-1">Tratamiento</p>
                        <p className="text-sm text-slate-700 mb-2">{exp.tratamiento || "Sin tratamiento registrado"}</p>
                        <p className="text-xs text-slate-400 mb-1">Notas</p>
                        <p className="text-sm text-slate-700 mb-2">{exp.notas || "Sin notas"}</p>
                        <p className="text-xs text-slate-400">Actualizado: {new Date(exp.fecha_actualizacion).toLocaleString()}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="p-6 pt-0 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPacienteExpedienteId(String(pacienteModal.id_paciente));
                  setPacienteModal(null);
                  setActiveTab("expedientes");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
              >
                <FileText className="h-4 w-4" /> Crear / Editar expediente
              </button>
              <button onClick={() => setPacienteModal(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
