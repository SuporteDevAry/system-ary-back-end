import { Request, Response } from "express";
import { permissionRepository } from "../repositories/PermissionRepository";

export class PermissionController {
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { rules } = req.body;

    const permission = await permissionRepository.findOneBy({ id });

    if (!permission) {
      return res.status(404).json({ error: "Permissão não encontrada" });
    }

    permission.rules = rules;

    const updatedPermission = await permissionRepository.save(permission);

    return res.json(updatedPermission);
  }
}
