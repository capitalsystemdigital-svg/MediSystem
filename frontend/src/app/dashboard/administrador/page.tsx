"use client";

import { ActivitySquare, Users, UserRound, CalendarHeart, Settings, LogOut, ArrowUpRight, Activity, Trash, Edit, Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Medicos search and pagination
  const [medicoSearchTerm, setMedicoSearchTerm] = useState("");
  const [medicoCurrentPage, setMedicoCurrentPage] = useState(1);
  const medicosPerPage = 10;

  // Medicos modal & edit
  const [isMedicoModalOpen, setIsMedicoModalOpen] = useState(false);
  const [editingMedicoId, setEditingMedicoId] = useState<number | null>(null);

  // Citas form state
  const [citaMedicoId, setCitaMedicoId] = useState("");
  const [citaPacienteId, setCitaPacienteId] = useState("");
  const [citaFecha, setCitaFecha] = useState("");
  const [citaHora, setCitaHora] = useState("");
  const [citaMotivo, setCitaMotivo] = useState("");
  const [citaEstado, setCitaEstado] = useState("Pendiente");

  // Citas search, pagination, modal & edit
  const [citaSearchTerm, setCitaSearchTerm] = useState("");
  const [citaCurrentPage, setCitaCurrentPage] = useState(1);
  const citasPerPage = 10;
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false);
  const [editingCitaId, setEditingCitaId] = useState<number | null>(null);

  // Pacientes form state
  const [pacNombre, setPacNombre] = useState("");
  const [pacFechaNacimiento, setPacFechaNacimiento] = useState("");
  const [pacTelefono, setPacTelefono] = useState("");
  const [pacTipoSangre, setPacTipoSangre] = useState("");
  const [pacAlergias, setPacAlergias] = useState("");

  // Pacientes search, pagination, modal & edit
  const [pacSearchTerm, setPacSearchTerm] = useState("");
  const [pacCurrentPage, setPacCurrentPage] = useState(1);
  const pacientesPerPage = 10;
  const [isPacienteModalOpen, setIsPacienteModalOpen] = useState(false);
  const [editingPacienteId, setEditingPacienteId] = useState<number | null>(null);

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

  const filteredMedicos = medicos.filter(m => 
    m.nombre.toLowerCase().includes(medicoSearchTerm.toLowerCase()) ||
    m.especialidad.toLowerCase().includes(medicoSearchTerm.toLowerCase()) ||
    m.cedula_profesional.toLowerCase().includes(medicoSearchTerm.toLowerCase())
  );
  const indexOfLastMedico = medicoCurrentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const currentMedicos = filteredMedicos.slice(indexOfFirstMedico, indexOfLastMedico);
  const totalMedicoPages = Math.ceil(filteredMedicos.length / medicosPerPage);

  const resetMedicoForm = () => {
    setMedNombre(""); setMedEspecialidad(""); setMedCedula(""); setMedEmail(""); setMedTelefono("");
    setEditingMedicoId(null);
  };

  const openAddMedicoModal = () => {
    resetMedicoForm();
    setIsMedicoModalOpen(true);
  };

  const openEditMedicoModal = (medico: any) => {
    setMedNombre(medico.nombre);
    setMedEspecialidad(medico.especialidad);
    setMedCedula(medico.cedula_profesional);
    setMedEmail(medico.email);
    setMedTelefono(medico.telefono || "");
    setEditingMedicoId(medico.id_medico);
    setIsMedicoModalOpen(true);
  };

  const closeMedicoModal = () => {
    setIsMedicoModalOpen(false);
    resetMedicoForm();
  };

  // --- Citas helpers ---
  const filteredCitas = citas.filter(c =>
    (c.paciente?.nombre || "").toLowerCase().includes(citaSearchTerm.toLowerCase()) ||
    (c.medico?.nombre || "").toLowerCase().includes(citaSearchTerm.toLowerCase()) ||
    (c.motivo || "").toLowerCase().includes(citaSearchTerm.toLowerCase())
  );
  const indexOfLastCita = citaCurrentPage * citasPerPage;
  const indexOfFirstCita = indexOfLastCita - citasPerPage;
  const currentCitas = filteredCitas.slice(indexOfFirstCita, indexOfLastCita);
  const totalCitaPages = Math.ceil(filteredCitas.length / citasPerPage);

  const resetCitaForm = () => {
    setCitaMedicoId(""); setCitaPacienteId(""); setCitaFecha("");
    setCitaHora(""); setCitaMotivo(""); setCitaEstado("Pendiente");
    setEditingCitaId(null);
  };

  const openAddCitaModal = () => { resetCitaForm(); setIsCitaModalOpen(true); };

  const openEditCitaModal = (cita: any) => {
    setCitaMedicoId(String(cita.medico_id));
    setCitaPacienteId(String(cita.paciente_id));
    // fecha y hora vienen como ISO string, tomamos solo la parte de fecha/hora local
    setCitaFecha(cita.fecha ? cita.fecha.split("T")[0] : "");
    setCitaHora(cita.hora ? cita.hora.split("T")[1]?.slice(0,5) : "");
    setCitaMotivo(cita.motivo || "");
    setCitaEstado(cita.estado || "Pendiente");
    setEditingCitaId(cita.id_cita);
    setIsCitaModalOpen(true);
  };

  const closeCitaModal = () => { setIsCitaModalOpen(false); resetCitaForm(); };

  // --- Pacientes helpers ---
  const filteredPacientes = pacientes.filter(p =>
    (p.nombre || "").toLowerCase().includes(pacSearchTerm.toLowerCase()) ||
    (p.telefono || "").toLowerCase().includes(pacSearchTerm.toLowerCase()) ||
    (p.tipo_sangre || "").toLowerCase().includes(pacSearchTerm.toLowerCase())
  );
  const indexOfLastPaciente = pacCurrentPage * pacientesPerPage;
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(indexOfFirstPaciente, indexOfLastPaciente);
  const totalPacientePages = Math.ceil(filteredPacientes.length / pacientesPerPage);

  const resetPacienteForm = () => {
    setPacNombre(""); setPacFechaNacimiento(""); setPacTelefono("");
    setPacTipoSangre(""); setPacAlergias("");
    setEditingPacienteId(null);
  };

  const openAddPacienteModal = () => { resetPacienteForm(); setIsPacienteModalOpen(true); };

  const openEditPacienteModal = (p: any) => {
    setPacNombre(p.nombre || "");
    setPacFechaNacimiento(p.fecha_nacimiento ? p.fecha_nacimiento.split("T")[0] : "");
    setPacTelefono(p.telefono || "");
    setPacTipoSangre(p.tipo_sangre || "");
    setPacAlergias(p.alergias || "");
    setEditingPacienteId(p.id_paciente);
    setIsPacienteModalOpen(true);
  };

  const closePacienteModal = () => { setIsPacienteModalOpen(false); resetPacienteForm(); };

  const handleDeletePaciente = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
      await axios.delete(`http://localhost:4000/api/v1/pacientes/${id}`);
      loadData();
    }
  };

  const handleSavePaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    const fechaISO = new Date(pacFechaNacimiento + "T00:00:00").toISOString();
    try {
      if (editingPacienteId) {
        await axios.put(`http://localhost:4000/api/v1/pacientes/${editingPacienteId}`, {
          nombre: pacNombre, fecha_nacimiento: fechaISO,
          telefono: pacTelefono, tipo_sangre: pacTipoSangre, alergias: pacAlergias
        });
        setToastMessage("✅ Paciente actualizado exitosamente");
      } else {
        await axios.post("http://localhost:4000/api/v1/pacientes", {
          nombre: pacNombre, fecha_nacimiento: fechaISO,
          telefono: pacTelefono, tipo_sangre: pacTipoSangre, alergias: pacAlergias
        });
        setToastMessage("✅ Paciente registrado exitosamente");
      }
      setTimeout(() => setToastMessage(null), 4000);
      closePacienteModal();
      loadData();
    } catch (e: any) {
      alert(e.response?.data?.error || `Error al ${editingPacienteId ? 'actualizar' : 'crear'} paciente`);
    }
  };

  const handleDeleteCita = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta cita?")) {
      await axios.delete(`http://localhost:4000/api/v1/citas/${id}`);
      loadData();
    }
  };

  const handleSaveCita = async (e: React.FormEvent) => {
    e.preventDefault();
    // Construir fecha y hora combinadas
    const fechaISO = new Date(citaFecha + "T00:00:00").toISOString();
    const horaISO = new Date(`1970-01-01T${citaHora}:00`).toISOString();
    try {
      if (editingCitaId) {
        await axios.put(`http://localhost:4000/api/v1/citas/${editingCitaId}`, {
          medico_id: citaMedicoId, paciente_id: citaPacienteId,
          fecha: fechaISO, hora: horaISO, motivo: citaMotivo, estado: citaEstado
        });
        setToastMessage("✅ Cita actualizada exitosamente");
      } else {
        await axios.post("http://localhost:4000/api/v1/citas", {
          medico_id: citaMedicoId, paciente_id: citaPacienteId,
          fecha: fechaISO, hora: horaISO, motivo: citaMotivo, estado: citaEstado
        });
        setToastMessage("✅ Cita creada exitosamente");
      }
      setTimeout(() => setToastMessage(null), 4000);
      closeCitaModal();
      loadData();
    } catch (e: any) {
      alert(e.response?.data?.error || `Error al ${editingCitaId ? 'actualizar' : 'crear'} cita`);
    }
  };

  const handeCrearMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicoId) {
        await axios.put(`http://localhost:4000/api/v1/medicos/${editingMedicoId}`, {
          nombre: medNombre,
          especialidad: medEspecialidad,
          cedula_profesional: medCedula,
          email: medEmail,
          telefono: medTelefono
        });
        setToastMessage("✅ Médico actualizado exitosamente");
      } else {
        await axios.post("http://localhost:4000/api/v1/medicos", {
          nombre: medNombre,
          especialidad: medEspecialidad,
          cedula_profesional: medCedula,
          email: medEmail,
          telefono: medTelefono
        });
        setToastMessage("✅ Médico y su cuenta de acceso creados exitosamente");
      }
      setTimeout(() => setToastMessage(null), 4000);
      closeMedicoModal();
      loadData();
    } catch (e: any) {
      alert(e.response?.data?.error || `Error al ${editingMedicoId ? 'actualizar' : 'crear'} médico`);
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
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono o tipo de sangre..."
                  value={pacSearchTerm}
                  onChange={(e) => { setPacSearchTerm(e.target.value); setPacCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
              </div>
              <button
                onClick={openAddPacienteModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center transition-colors w-full md:w-auto shadow-sm"
              >
                <Plus className="mr-2 h-5 w-5" /> Agregar Paciente
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                    <th className="pb-4 px-4">Nombre</th>
                    <th className="pb-4 px-4">Teléfono</th>
                    <th className="pb-4 px-4">Tipo Sangre</th>
                    <th className="pb-4 px-4">Alergias</th>
                    <th className="pb-4 px-4">Fecha Nac.</th>
                    <th className="pb-4 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPacientes.map((p) => (
                    <tr key={p.id_paciente} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold max-w-[180px] truncate">{p.nombre}</td>
                      <td className="py-4 px-4">{p.telefono || <span className="text-slate-400">N/A</span>}</td>
                      <td className="py-4 px-4">
                        {p.tipo_sangre ? (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">{p.tipo_sangre}</span>
                        ) : <span className="text-slate-400">-</span>}
                      </td>
                      <td className="py-4 px-4 max-w-[160px] truncate">{p.alergias || <span className="text-slate-400">Ninguna</span>}</td>
                      <td className="py-4 px-4 text-sm">{p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString("es-MX") : "-"}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditPacienteModal(p)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors" title="Editar">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeletePaciente(p.id_paciente)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentPacientes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">No se encontraron pacientes.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPacientePages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t pt-6 gap-4">
                  <p className="text-sm text-slate-500">
                    Mostrando <span className="font-bold text-slate-900">{indexOfFirstPaciente + 1}</span> a <span className="font-bold text-slate-900">{Math.min(indexOfLastPaciente, filteredPacientes.length)}</span> de <span className="font-bold text-slate-900">{filteredPacientes.length}</span> pacientes
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPacCurrentPage(prev => Math.max(prev - 1, 1))} disabled={pacCurrentPage === 1} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPacientePages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setPacCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${pacCurrentPage === page ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}>{page}</button>
                      ))}
                    </div>
                    <button onClick={() => setPacCurrentPage(prev => Math.min(prev + 1, totalPacientePages))} disabled={pacCurrentPage === totalPacientePages} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "citas" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por paciente, médico o motivo..."
                  value={citaSearchTerm}
                  onChange={(e) => { setCitaSearchTerm(e.target.value); setCitaCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
              </div>
              <button
                onClick={openAddCitaModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center transition-colors w-full md:w-auto shadow-sm"
              >
                <Plus className="mr-2 h-5 w-5" /> Agregar Cita
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                    <th className="pb-4 px-4">Paciente</th>
                    <th className="pb-4 px-4">Médico</th>
                    <th className="pb-4 px-4">Fecha</th>
                    <th className="pb-4 px-4">Estado</th>
                    <th className="pb-4 px-4">Motivo</th>
                    <th className="pb-4 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCitas.map((c) => (
                    <tr key={c.id_cita} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold max-w-[150px] truncate">{c.paciente?.nombre}</td>
                      <td className="py-4 px-4 max-w-[150px] truncate">{c.medico?.nombre}</td>
                      <td className="py-4 px-4 text-sm">{c.fecha ? new Date(c.fecha).toLocaleDateString("es-MX") : "-"}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          c.estado === "Programada" ? "bg-blue-100 text-blue-700" :
                          c.estado === "Completada" ? "bg-emerald-100 text-emerald-700" :
                          c.estado === "Cancelada" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{c.estado || "Pendiente"}</span>
                      </td>
                      <td className="py-4 px-4 max-w-[180px] truncate">{c.motivo}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditCitaModal(c)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors" title="Editar">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteCita(c.id_cita)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentCitas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">No se encontraron citas.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalCitaPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t pt-6 gap-4">
                  <p className="text-sm text-slate-500">
                    Mostrando <span className="font-bold text-slate-900">{indexOfFirstCita + 1}</span> a <span className="font-bold text-slate-900">{Math.min(indexOfLastCita, filteredCitas.length)}</span> de <span className="font-bold text-slate-900">{filteredCitas.length}</span> citas
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setCitaCurrentPage(prev => Math.max(prev - 1, 1))} disabled={citaCurrentPage === 1} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalCitaPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCitaCurrentPage(page)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${citaCurrentPage === page ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}>{page}</button>
                      ))}
                    </div>
                    <button onClick={() => setCitaCurrentPage(prev => Math.min(prev + 1, totalCitaPages))} disabled={citaCurrentPage === totalCitaPages} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "medicos" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {/* Toolbar */}
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o especialidad..." 
                    value={medicoSearchTerm}
                    onChange={(e) => { setMedicoSearchTerm(e.target.value); setMedicoCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  />
                </div>
                <button 
                  onClick={openAddMedicoModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center transition-colors w-full md:w-auto shadow-sm"
                >
                  <Plus className="mr-2 h-5 w-5" /> Agregar Usuario
                </button>
             </div>

             <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
                 <thead>
                   <tr className="border-b-2 text-slate-500 text-sm font-bold uppercase">
                     <th className="pb-4 px-4">Médico</th>
                     <th className="pb-4 px-4">Especialidad</th>
                     <th className="pb-4 px-4">Cédula</th>
                     <th className="pb-4 px-4 text-center">Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                   {currentMedicos.map((m) => (
                     <tr key={m.id_medico} className="border-b hover:bg-slate-50 transition-colors">
                       <td className="py-4 px-4 font-bold max-w-[200px] truncate">{m.nombre}</td>
                       <td className="py-4 px-4">{m.especialidad}</td>
                       <td className="py-4 px-4 font-mono">{m.cedula_profesional}</td>
                       <td className="py-4 px-4">
                         <div className="flex items-center justify-center gap-2">
                           <button onClick={() => openEditMedicoModal(m)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-lg transition-colors" title="Editar">
                             <Edit size={16} />
                           </button>
                           <button onClick={() => handleDeleteMedico(m.id_medico)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                             <Trash size={16} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {currentMedicos.length === 0 && (
                     <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">No se encontraron médicos.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
               
               {/* Pagination Controls */}
               {totalMedicoPages > 1 && (
                 <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t pt-6 gap-4">
                    <p className="text-sm text-slate-500">
                      Mostrando <span className="font-bold text-slate-900">{indexOfFirstMedico + 1}</span> a <span className="font-bold text-slate-900">{Math.min(indexOfLastMedico, filteredMedicos.length)}</span> de <span className="font-bold text-slate-900">{filteredMedicos.length}</span> médicos
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setMedicoCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={medicoCurrentPage === 1}
                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalMedicoPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setMedicoCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-bold transition-colors ${medicoCurrentPage === page ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setMedicoCurrentPage(prev => Math.min(prev + 1, totalMedicoPages))}
                        disabled={medicoCurrentPage === totalMedicoPages}
                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Medico */}
        {isMedicoModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
              <button onClick={closeMedicoModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingMedicoId ? "✏️ Editar Médico" : "➕ Dar de Alta Nuevo Médico"}
              </h2>
              
              <form onSubmit={handeCrearMedico} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                    <input required value={medNombre} onChange={e=>setMedNombre(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Especialidad</label>
                    <input required placeholder="Ej: Pediatría" value={medEspecialidad} onChange={e=>setMedEspecialidad(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cédula Profesional</label>
                    <input required value={medCedula} onChange={e=>setMedCedula(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                    <input required type="email" value={medEmail} onChange={e=>setMedEmail(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input value={medTelefono} onChange={e=>setMedTelefono(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                  </div>
                </div>
                
                {!editingMedicoId && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center gap-2">
                    <span>⚠️</span> Todos los médicos nuevos reciben la contraseña por defecto: <code className="bg-amber-100 px-1 rounded font-bold">doctor123</code>
                  </p>
                )}
                
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button type="button" onClick={closeMedicoModal} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                    {editingMedicoId ? "Guardar Cambios" : "Guardar Médico"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Cita */}
        {isCitaModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
              <button onClick={closeCitaModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingCitaId ? "✏️ Editar Cita" : "➕ Nueva Cita"}
              </h2>
              <form onSubmit={handleSaveCita} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                    <select required value={citaMedicoId} onChange={e => setCitaMedicoId(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                      <option value="">Seleccionar médico...</option>
                      {medicos.map(m => <option key={m.id_medico} value={m.id_medico}>{m.nombre} - {m.especialidad}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                    <select required value={citaPacienteId} onChange={e => setCitaPacienteId(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                      <option value="">Seleccionar paciente...</option>
                      {pacientes.map(p => <option key={p.id_paciente} value={p.id_paciente}>{p.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                    <input required type="date" value={citaFecha} onChange={e => setCitaFecha(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                    <input required type="time" value={citaHora} onChange={e => setCitaHora(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                    <select value={citaEstado} onChange={e => setCitaEstado(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                      <option value="Pendiente">Pendiente</option>
                      <option value="Programada">Programada</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
                    <input value={citaMotivo} onChange={e => setCitaMotivo(e.target.value)} placeholder="Ej: Revisión mensual" className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button type="button" onClick={closeCitaModal} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                    {editingCitaId ? "Guardar Cambios" : "Crear Cita"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Paciente */}
        {isPacienteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
              <button onClick={closePacienteModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingPacienteId ? "✏️ Editar Paciente" : "➕ Registrar Nuevo Paciente"}
              </h2>
              <form onSubmit={handleSavePaciente} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                    <input required value={pacNombre} onChange={e => setPacNombre(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de nacimiento</label>
                    <input required type="date" value={pacFechaNacimiento} onChange={e => setPacFechaNacimiento(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input value={pacTelefono} onChange={e => setPacTelefono(e.target.value)} placeholder="Ej: 555-0101" className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Sangre</label>
                    <select value={pacTipoSangre} onChange={e => setPacTipoSangre(e.target.value)} className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                      <option value="">Seleccionar...</option>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                    <input value={pacAlergias} onChange={e => setPacAlergias(e.target.value)} placeholder="Ej: Penicilina, Ninguna" className="border border-slate-200 p-3 rounded-xl w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button type="button" onClick={closePacienteModal} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                    {editingPacienteId ? "Guardar Cambios" : "Registrar Paciente"}
                  </button>
                </div>
              </form>
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
