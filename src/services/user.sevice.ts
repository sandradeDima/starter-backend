import { MensajeApi } from "../types/MensajeApi";
import * as UserRepo from "../repositories/user.repo";
import bcrypt from "bcryptjs";
import { logger } from "../config/logger";

export async function getUserById(id: number): Promise<MensajeApi> {
  try {
    let mensaje: MensajeApi = new MensajeApi();
    //get user by id
    const user = await UserRepo.findById(id);
    if (!user) {
      mensaje.code = 400;
      mensaje.error = true;
      mensaje.message = "Usuario no encontrado";
      return mensaje;
    }
    mensaje.code = 200;
    mensaje.error = false;
    mensaje.message = "Usuario encontrado";
    mensaje.data = user;
    return mensaje;
  } catch (error) {
    let mensaje = new MensajeApi();
    mensaje.code = 500;
    mensaje.error = true;
    mensaje.message = "Error al obtener el usuario";
    mensaje.technicalMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return mensaje;
  }
}

export async function getUserByEmail(email: string): Promise<MensajeApi> {
  try {
    let mensaje: MensajeApi = new MensajeApi();
    //get user by email
    const user = await UserRepo.findByEmail(email);
    if (!user) {
      mensaje.code = 400;
      mensaje.error = true;
      mensaje.message = "Usuario no encontrado";
      return mensaje;
    }
    mensaje.code = 200;
    mensaje.error = false;
    mensaje.message = "Usuario encontrado";
    mensaje.data = user;
    return mensaje;
  } catch (error) {
    let mensaje = new MensajeApi();
    mensaje.code = 500;
    mensaje.error = true;
    mensaje.message = "Error al obtener el usuario";
    mensaje.technicalMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return mensaje;
  }
}

export async function updateUser(
  id: number,
  email: string,
  name: string,
  password?: string
): Promise<MensajeApi> {
  try {
    let mensaje: MensajeApi = new MensajeApi();
    //update user
    const user = await UserRepo.findById(id);
    if (!user) {
      mensaje.code = 400;
      mensaje.error = true;
      mensaje.message = "Usuario no encontrado";
      return mensaje;
    }
    user.email = email;
    user.name = name;
    user.updatedAt = new Date();
    await UserRepo.updateUser(id, user.email, user.name, user.updatedAt);
    if(password){
      let passwordHash = await bcrypt.hash(password, 10);
      await UserRepo.updatePassword(passwordHash, id)
    }
    mensaje.code = 200;
    mensaje.error = false;
    mensaje.message = "Usuario actualizado correctamente";
    mensaje.data = user;
    return mensaje;
  } catch (error) {
    let mensaje = new MensajeApi();
    mensaje.code = 500;
    mensaje.error = true;
    mensaje.message = "Error al actualizar el usuario";
    mensaje.technicalMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return mensaje;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  roleId: number
): Promise<MensajeApi> {
  let mensaje: MensajeApi = new MensajeApi();
  try {
    const user = await UserRepo.findByEmail(email);
    logger.info("este es el usuario:");
    logger.info(user);
    if (user && user != null && user != undefined) {
      logger.info("el usuario existe");
      mensaje.code = 400;
      mensaje.error = true;
      mensaje.message = "Usuario con ese email ya existe";
      return mensaje;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserRepo.createUser(email, hashedPassword, name, roleId);
    mensaje.code = 201;
    mensaje.error = false;
    mensaje.message = "Usuario creado correctamente";
    return mensaje;
  } catch (error) {
    mensaje.code = 500;
    mensaje.error = true;
    mensaje.message = "Error al crear el usuario";
    mensaje.technicalMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return mensaje;
  }
}

export async function searchUsersPagination(
  page: string,
  size: string,
  name?: string,
  email?: string,
  role?: number,
  sortField?: string,
  sortOrder?: string
): Promise<MensajeApi> {
  try {
    const mensaje = new MensajeApi();

    const users = await UserRepo.searchPagination(
      parseInt(page),
      parseInt(size),
      name,
      email,
      role,
      sortField,
      sortOrder
    );
    const total = users.length;
    const pages = Math.ceil(total / parseInt(size));
    if (parseInt(page) < 1 || parseInt(page) > pages) {
      mensaje.code = 404;
      mensaje.error = true;
      mensaje.message = "Pagina no encontrada";
      return mensaje;
    }

    mensaje.code = 200;
    mensaje.error = false;
    mensaje.message = "Búsqueda realizada correctamente";
    mensaje.data = { users, total, page };
    return mensaje;
  } catch (error) {
    const mensaje = new MensajeApi();
    mensaje.code = 500;
    mensaje.error = true;
    mensaje.message = "Error al buscar usuarios";
    mensaje.technicalMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return mensaje;
  }
}
