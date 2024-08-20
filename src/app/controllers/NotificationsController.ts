import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import {
  getNotifications,
  notificationsRepository,
} from "../repositories/NotificationsRepository";

export class NotificationController {
  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getNotifications(req: Request, res: Response) {
    const notifications = await getNotifications();

    return res.status(200).json(notifications);
  }

  async getNotificationsByUser(req: Request, res: Response) {
    const { user } = req.params;

    if (!user) {
      throw new BadRequestError("Usuário não informado.");
    }

    const notificationsSearched = await notificationsRepository.findBy({
      user,
    });

    return res.status(200).json(notificationsSearched);
  }

  async getNotificationById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("ID de notificação não informado.");
    }

    const notificationsSearched = await notificationsRepository.findOneBy({
      id,
    });

    if (!notificationsSearched) {
      throw new BadRequestError("ID de notificação não encontrado.");
    }
    return res.status(200).json(notificationsSearched);
  }

  async create(req: Request, res: Response) {
    const { id, user, read, content, type, isLoading } = req.body;

    const notificationsExists = await notificationsRepository.findOneBy({ id });

    // if (notificationsExists) {
    //     throw new BadRequestError("ID de notificação já existente.");
    // }

    const newNotification = notificationsRepository.create({
      id,
      user,
      read,
      content,
      type,
      isLoading,
    });

    await notificationsRepository.save(newNotification);

    const { ...notification } = newNotification;

    return res.status(201).json(notification);
  }

  async updateNotification(req: Request, res: Response) {
    const { id } = req.params;
    const { read } = req.body;

    if (!id) {
      throw new BadRequestError("ID da notificação não informado.");
    }

    const notificationToUpdate = await notificationsRepository.findOneBy({
      id,
    });

    if (!notificationToUpdate) {
      throw new BadRequestError("Notificação não encontrada.");
    }

    if (typeof read === "boolean") {
      notificationToUpdate.read = read;
    }

    if (read) notificationToUpdate.read = read;

    await notificationsRepository.save(notificationToUpdate);

    const { ...updatedNotification } = notificationToUpdate;

    return res.status(200).json(updatedNotification);
  }

  async deleteNotification(req: Request, res: Response) {
    const { id } = req.params;

    const notificationToDelete = await notificationsRepository.findOneBy({
      id,
    });

    if (!notificationToDelete) {
      throw new BadRequestError("ID de notificação não encontrada.");
    }

    await notificationsRepository.remove(notificationToDelete);

    return res.status(204).send();
  }
}
