import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

// --- PACIENTES ---
router.get("/pacientes", async (req, res) => {
  const pacientes = await prisma.paciente.findMany();
  res.json(pacientes);
});

router.post("/pacientes", async (req, res) => {
  const { nombre, fecha_nacimiento, telefono, tipo_sangre, alergias } =
    req.body;
  const paciente = await prisma.paciente.create({
    data: {
      nombre,
      fecha_nacimiento: new Date(fecha_nacimiento),
      telefono,
      tipo_sangre,
      alergias,
    },
  });
  res.json(paciente);
});

router.delete("/pacientes/:id", async (req, res) => {
  await prisma.paciente.delete({
    where: { id_paciente: Number(req.params.id) },
  });
  res.json({ success: true });
});

router.put("/pacientes/:id", async (req, res) => {
  const pacienteId = Number(req.params.id);
  const { nombre, fecha_nacimiento, telefono, tipo_sangre, alergias } = req.body;
  try {
    const pacienteActualizado = await prisma.paciente.update({
      where: { id_paciente: pacienteId },
      data: {
        nombre,
        fecha_nacimiento: new Date(fecha_nacimiento),
        telefono,
        tipo_sangre,
        alergias,
      },
    });
    res.json(pacienteActualizado);
  } catch (error) {
    console.error("Error ruta PUT /pacientes/:id ->", error);
    res.status(400).json({ error: "Error al actualizar paciente." });
  }
});

// --- MEDICOS ---
router.get("/medicos", async (req, res) => {
  const medicos = await prisma.medico.findMany();
  res.json(medicos);
});

router.post("/medicos", async (req, res) => {
  const {
    nombre,
    especialidad,
    cedula_profesional,
    email,
    telefono,
    password,
  } = req.body;

  try {
    const medicoRole = await prisma.role.findFirst({
      where: { nombre: "Medico" },
    });
    if (!medicoRole)
      return res.status(500).json({ error: "Rol no encontrado" });

    const hashedPassword = await bcrypt.hash(password || "doctor123", 10);

    // Crear usuario para login
    await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol_id: medicoRole.id_rol,
      },
    });

    // Crear perfil medico
    const medico = await prisma.medico.create({
      data: { nombre, especialidad, cedula_profesional, email, telefono },
    });
    res.json(medico);
  } catch (error) {
    res
      .status(400)
      .json({
        error: "Error al crear médico. Valida que el correo/cédula no existan.",
      });
  }
});

router.delete("/medicos/:id", async (req, res) => {
  try {
    const medicoId = Number(req.params.id);
    // Borrar perfil (en una app real se manejaría el logico o on cascade para evitar conflicto con citas)
    await prisma.cita.deleteMany({ where: { medico_id: medicoId } });
    await prisma.medico.delete({ where: { id_medico: medicoId } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "No se pudo eliminar el médico" });
  }
});

router.put("/medicos/:id", async (req, res) => {
  const medicoId = Number(req.params.id);
  const { nombre, especialidad, cedula_profesional, email, telefono } = req.body;

  try {
    // Buscar medico actual
    const oldMedico = await prisma.medico.findUnique({
      where: { id_medico: medicoId }
    });

    // Actualizar perfil de medico
    const medicoActualizado = await prisma.medico.update({
      where: { id_medico: medicoId },
      data: { nombre, especialidad, cedula_profesional, email, telefono },
    });

    // Intentar actualizar el usuario asociado si es que el email o nombre cambio
    if (oldMedico && oldMedico.email && (oldMedico.email !== email || oldMedico.nombre !== nombre)) {
      await prisma.usuario.updateMany({
        where: { email: oldMedico.email },
        data: { email: email, nombre: nombre }
      }).catch(e => console.error("Error al actualizar usuario asociado", e));
    }

    res.json(medicoActualizado);
  } catch (error) {
    console.error("Error ruta PUT /medicos/:id ->", error);
    res.status(400).json({ error: "Error al actualizar médico." });
  }
});

// --- CITAS ---
router.get("/citas", async (req, res) => {
  const citas = await prisma.cita.findMany({
    include: { medico: true, paciente: true },
  });
  res.json(citas);
});

router.post("/citas", async (req, res) => {
  const { medico_id, paciente_id, fecha, hora, motivo } = req.body;
  const cita = await prisma.cita.create({
    data: {
      medico_id: Number(medico_id),
      paciente_id: Number(paciente_id),
      fecha: new Date(fecha),
      hora: new Date(hora),
      motivo,
    },
  });
  res.json(cita);
});

router.delete("/citas/:id", async (req, res) => {
  await prisma.cita.delete({ where: { id_cita: Number(req.params.id) } });
  res.json({ success: true });
});

router.put("/citas/:id", async (req, res) => {
  const citaId = Number(req.params.id);
  const { medico_id, paciente_id, fecha, hora, motivo, estado } = req.body;
  try {
    const citaActualizada = await prisma.cita.update({
      where: { id_cita: citaId },
      data: {
        medico_id: Number(medico_id),
        paciente_id: Number(paciente_id),
        fecha: new Date(fecha),
        hora: new Date(hora),
        motivo,
        estado,
      },
      include: { medico: true, paciente: true },
    });
    res.json(citaActualizada);
  } catch (error) {
    console.error("Error ruta PUT /citas/:id ->", error);
    res.status(400).json({ error: "Error al actualizar cita." });
  }
});

export default router;
