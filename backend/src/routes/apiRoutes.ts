import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

const MEDICO_ROLE_NAME = "Medico";
const PACIENTE_ROLE_NAME = "Paciente";
const DEFAULT_MEDICO_ESPECIALIDAD = "General";
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

type AuthContext = {
  id_usuario: number;
  email: string;
  rol: string;
};

const getAuthContext = async (authHeader?: string): Promise<AuthContext | null> => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: decoded.id },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      return null;
    }

    return {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol.nombre,
    };
  } catch {
    return null;
  }
};

const buildGeneratedCedula = (userId: number) => `AUTO-MED-${userId}`;

const deactivateMedicoProfileByEmail = async (email?: string | null) => {
  if (!email) {
    return;
  }

  await prisma.medico.updateMany({
    where: { email },
    data: { activo: false },
  });
};

const syncMedicoProfiles = async () => {
  const usuariosMedico = await prisma.usuario.findMany({
    where: { rol: { nombre: MEDICO_ROLE_NAME } },
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
      activo: true,
    },
  });

  if (usuariosMedico.length === 0) {
    return;
  }

  const medicos = await prisma.medico.findMany({
    select: {
      id_medico: true,
      nombre: true,
      email: true,
      activo: true,
    },
  });

  const emailsUsuariosMedico = new Set(usuariosMedico.map((usuario) => usuario.email));

  const medicosPorEmail = new Map(
    medicos.filter((medico) => medico.email).map((medico) => [medico.email as string, medico]),
  );

  for (const medico of medicos) {
    if (medico.email && !emailsUsuariosMedico.has(medico.email) && medico.activo) {
      await prisma.medico.update({
        where: { id_medico: medico.id_medico },
        data: { activo: false },
      });
    }
  }

  for (const usuario of usuariosMedico) {
    const medicoExistente = medicosPorEmail.get(usuario.email);

    if (!medicoExistente) {
      await prisma.medico.create({
        data: {
          nombre: usuario.nombre,
          especialidad: DEFAULT_MEDICO_ESPECIALIDAD,
          cedula_profesional: buildGeneratedCedula(usuario.id_usuario),
          email: usuario.email,
          activo: usuario.activo,
        },
      });
      continue;
    }

    if (
      medicoExistente.nombre !== usuario.nombre ||
      medicoExistente.activo !== usuario.activo
    ) {
      await prisma.medico.update({
        where: { id_medico: medicoExistente.id_medico },
        data: {
          nombre: usuario.nombre,
          activo: usuario.activo,
        },
      });
    }
  }
};

const syncMedicoProfileForUser = async (usuario: {
  id_usuario: number;
  nombre: string;
  email: string;
  activo: boolean;
  rol: { nombre: string };
}) => {
  if (usuario.rol.nombre !== MEDICO_ROLE_NAME) {
    return;
  }

  const medicoExistente = await prisma.medico.findFirst({
    where: { email: usuario.email },
  });

  if (!medicoExistente) {
    await prisma.medico.create({
      data: {
        nombre: usuario.nombre,
        especialidad: DEFAULT_MEDICO_ESPECIALIDAD,
        cedula_profesional: buildGeneratedCedula(usuario.id_usuario),
        email: usuario.email,
        activo: usuario.activo,
      },
    });
    return;
  }

  await prisma.medico.update({
    where: { id_medico: medicoExistente.id_medico },
    data: {
      nombre: usuario.nombre,
      email: usuario.email,
      activo: usuario.activo,
    },
  });
};

const syncPacienteProfileForUser = async (usuario: {
  id_usuario: number;
  nombre: string;
  email: string;
  activo: boolean;
  rol: { nombre: string };
}) => {
  if (usuario.rol.nombre !== PACIENTE_ROLE_NAME) {
    return;
  }

  const pacienteExistente = await prisma.paciente.findFirst({
    where: {
      OR: [{ usuario_id: usuario.id_usuario }, { email: usuario.email }],
    },
  });

  if (!pacienteExistente) {
    await prisma.paciente.create({
      data: {
        usuario_id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_nacimiento: new Date("2000-01-01T00:00:00Z"),
        activo: usuario.activo,
      },
    });
    return;
  }

  await prisma.paciente.update({
    where: { id_paciente: pacienteExistente.id_paciente },
    data: {
      usuario_id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      activo: usuario.activo,
    },
  });
};

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
  await syncMedicoProfiles();
  const medicos = await prisma.medico.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });
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

// --- EXPEDIENTES ---
router.get("/expedientes", async (req, res) => {
  const auth = await getAuthContext(req.headers.authorization);

  if (!auth) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    if (auth.rol === PACIENTE_ROLE_NAME) {
      const paciente = await prisma.paciente.findFirst({
        where: { usuario_id: auth.id_usuario },
      });

      if (!paciente) {
        return res.json([]);
      }

      const expedientes = await prisma.expediente.findMany({
        where: { paciente_id: paciente.id_paciente },
        include: { medico: true, paciente: true },
        orderBy: { fecha_actualizacion: "desc" },
      });

      return res.json(expedientes);
    }

    if (auth.rol === MEDICO_ROLE_NAME) {
      const expedientes = await prisma.expediente.findMany({
        include: { medico: true, paciente: true },
        orderBy: { fecha_actualizacion: "desc" },
      });

      return res.json(expedientes);
    }

    return res.status(403).json({ error: "Rol sin permisos para consultar expedientes" });
  } catch (error) {
    console.error("Error ruta GET /expedientes ->", error);
    return res.status(500).json({ error: "No se pudieron obtener los expedientes" });
  }
});

router.post("/expedientes", async (req, res) => {
  const auth = await getAuthContext(req.headers.authorization);

  if (!auth) {
    return res.status(401).json({ error: "No autorizado" });
  }

  if (auth.rol !== MEDICO_ROLE_NAME) {
    return res.status(403).json({ error: "Solo los médicos pueden crear expedientes" });
  }

  try {
    const medico = await prisma.medico.findFirst({ where: { email: auth.email, activo: true } });
    if (!medico) {
      return res.status(403).json({ error: "No se encontró el perfil médico asociado" });
    }

    const { paciente_id, diagnostico, tratamiento, notas } = req.body;
    if (!paciente_id || !diagnostico) {
      return res.status(400).json({ error: "paciente_id y diagnostico son obligatorios" });
    }

    const expediente = await prisma.expediente.create({
      data: {
        paciente_id: Number(paciente_id),
        medico_id: medico.id_medico,
        diagnostico,
        tratamiento,
        notas,
      },
      include: { medico: true, paciente: true },
    });

    return res.status(201).json(expediente);
  } catch (error) {
    console.error("Error ruta POST /expedientes ->", error);
    return res.status(400).json({ error: "No se pudo crear el expediente" });
  }
});

router.put("/expedientes/:id", async (req, res) => {
  const auth = await getAuthContext(req.headers.authorization);

  if (!auth) {
    return res.status(401).json({ error: "No autorizado" });
  }

  if (auth.rol !== MEDICO_ROLE_NAME) {
    return res.status(403).json({ error: "Solo los médicos pueden modificar expedientes" });
  }

  try {
    const expedienteId = Number(req.params.id);
    const medico = await prisma.medico.findFirst({ where: { email: auth.email, activo: true } });

    if (!medico) {
      return res.status(403).json({ error: "No se encontró el perfil médico asociado" });
    }

    const expedienteExistente = await prisma.expediente.findUnique({
      where: { id_expediente: expedienteId },
    });

    if (!expedienteExistente) {
      return res.status(404).json({ error: "Expediente no encontrado" });
    }

    if (expedienteExistente.medico_id !== medico.id_medico) {
      return res.status(403).json({ error: "Solo puedes editar expedientes creados por ti" });
    }

    const { diagnostico, tratamiento, notas } = req.body;

    const expedienteActualizado = await prisma.expediente.update({
      where: { id_expediente: expedienteId },
      data: {
        diagnostico,
        tratamiento,
        notas,
      },
      include: { medico: true, paciente: true },
    });

    return res.json(expedienteActualizado);
  } catch (error) {
    console.error("Error ruta PUT /expedientes/:id ->", error);
    return res.status(400).json({ error: "No se pudo actualizar el expediente" });
  }
});

// --- ROLES ---
router.get("/roles", async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

router.post("/system-sync", async (req, res) => {
  try {
    await syncMedicoProfiles();

    const [usuarios, medicos, citas] = await Promise.all([
      prisma.usuario.count(),
      prisma.medico.count({ where: { activo: true } }),
      prisma.cita.count(),
    ]);

    res.json({
      ok: true,
      resumen: {
        usuarios,
        medicos_activos: medicos,
        citas,
      },
    });
  } catch (error) {
    console.error("Error ruta POST /system-sync ->", error);
    res.status(500).json({ error: "No se pudo sincronizar la información del sistema." });
  }
});

// --- USUARIOS ---
router.get("/usuarios", async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: { rol: true },
    orderBy: { fecha_creacion: "desc" },
  });
  res.json(usuarios);
});

router.post("/usuarios", async (req, res) => {
  const { nombre, email, password, rol_id, activo } = req.body;
  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }
    const hashedPassword = await bcrypt.hash(password || "usuario123", 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol_id: Number(rol_id),
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      include: { rol: true },
    });
    await syncMedicoProfileForUser(usuario);
    await syncPacienteProfileForUser(usuario);
    res.json(usuario);
  } catch (error) {
    console.error("Error ruta POST /usuarios ->", error);
    res.status(400).json({ error: "Error al crear el usuario." });
  }
});

router.put("/usuarios/:id", async (req, res) => {
  const usuarioId = Number(req.params.id);
  const { nombre, email, password, rol_id, activo } = req.body;
  try {
    const usuarioAnterior = await prisma.usuario.findUnique({
      where: { id_usuario: usuarioId },
      include: { rol: true },
    });
    const dataToUpdate: any = {
      nombre,
      email,
      rol_id: Number(rol_id),
      activo: Boolean(activo),
    };
    // Solo actualizar password si se envió una nueva
    if (password && password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    const usuarioActualizado = await prisma.usuario.update({
      where: { id_usuario: usuarioId },
      data: dataToUpdate,
      include: { rol: true },
    });

    if (usuarioAnterior?.rol.nombre === MEDICO_ROLE_NAME && usuarioAnterior.email !== email) {
      await prisma.medico.updateMany({
        where: { email: usuarioAnterior.email },
        data: { email },
      });
    }

    if (
      usuarioAnterior?.rol.nombre === MEDICO_ROLE_NAME &&
      usuarioActualizado.rol.nombre !== MEDICO_ROLE_NAME
    ) {
      await deactivateMedicoProfileByEmail(usuarioAnterior.email);
    }

    await syncMedicoProfileForUser(usuarioActualizado);
    await syncPacienteProfileForUser(usuarioActualizado);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error ruta PUT /usuarios/:id ->", error);
    res.status(400).json({ error: "Error al actualizar el usuario." });
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: Number(req.params.id) },
      include: { rol: true },
    });

    await prisma.usuario.delete({
      where: { id_usuario: Number(req.params.id) },
    });

    if (usuario?.rol.nombre === MEDICO_ROLE_NAME) {
      await deactivateMedicoProfileByEmail(usuario.email);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error ruta DELETE /usuarios/:id ->", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario." });
  }
});

export default router;

