"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const PermissionRepository_1 = require("../repositories/PermissionRepository");
class PermissionController {
    async update(req, res) {
        const { id } = req.params;
        const { rules } = req.body;
        const permission = await PermissionRepository_1.permissionRepository.findOneBy({ id });
        if (!permission) {
            return res.status(404).json({ error: "Permissão não encontrada" });
        }
        permission.rules = rules;
        const updatedPermission = await PermissionRepository_1.permissionRepository.save(permission);
        return res.json(updatedPermission);
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=PermissionController.js.map