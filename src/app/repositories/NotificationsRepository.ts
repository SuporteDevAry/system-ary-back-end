import { AppDataSource } from "../../database/data-source";
import { Notifications } from "../entities/Notifications";

export const notificationsRepository = AppDataSource.getRepository(Notifications);

export const getNotifications = (): Promise<Notifications[]> => notificationsRepository.find();