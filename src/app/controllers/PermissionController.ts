import { Request, Response } from "express";
import { permissionRepository } from "../repositories/PermissionRepository";

export class PermissionController {
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { rules } = req.body;

    // Encontre a permissão pelo ID
    const permission = await permissionRepository.findOneBy({ id });

    if (!permission) {
      return res.status(404).json({ error: "Permissão não encontrada" });
    }

    // Atualize as regras
    permission.rules = rules;

    // Salve a permissão atualizada
    const updatedPermission = await permissionRepository.save(permission);

    return res.json(updatedPermission);
  }
}
