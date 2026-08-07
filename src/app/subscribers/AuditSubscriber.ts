import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { AuditLog } from "../entities/AuditLog";
import { getCurrentUser } from "../helpers/requestContext";

const SKIP_ENTITIES = new Set(["AuditLog", "LoginHistory", "ActiveSession"]);

function sanitize(entity: unknown, entityName: string): Record<string, unknown> | null {
  if (!entity) return null;

  const plain = JSON.parse(JSON.stringify(entity));

  if (entityName === "User") {
    delete plain.password;
  }

  return plain;
}

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private async record(
    event: { manager: InsertEvent<any>["manager"] },
    entityName: string,
    action: "INSERT" | "UPDATE" | "REMOVE",
    entityId: string | null,
    before: Record<string, unknown> | null,
    after: Record<string, unknown> | null
  ) {
    try {
      const currentUser = getCurrentUser();

      const auditLog = new AuditLog();
      auditLog.user_id = currentUser?.id ?? null;
      auditLog.user_email = currentUser?.email ?? "system";
      auditLog.user_name = currentUser?.name ?? "system";
      auditLog.action = action;
      auditLog.entity_name = entityName;
      auditLog.entity_id = entityId;
      auditLog.before = before;
      auditLog.after = after;

      await event.manager.save(AuditLog, auditLog);
    } catch (error) {
      console.error("Falha ao gravar audit_log:", error);
    }
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    const entityName = event.metadata.name;
    if (SKIP_ENTITIES.has(entityName)) return;

    const entityId = (event.entity as any)?.id ?? null;

    await this.record(
      event,
      entityName,
      "INSERT",
      entityId,
      null,
      sanitize(event.entity, entityName)
    );
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    const entityName = event.metadata.name;
    if (SKIP_ENTITIES.has(entityName)) return;

    const entityId =
      (event.entity as any)?.id ?? (event.databaseEntity as any)?.id ?? null;

    await this.record(
      event,
      entityName,
      "UPDATE",
      entityId,
      sanitize(event.databaseEntity, entityName),
      sanitize(event.entity, entityName)
    );
  }

  async beforeRemove(event: RemoveEvent<any>): Promise<void> {
    const entityName = event.metadata.name;
    if (SKIP_ENTITIES.has(entityName)) return;

    const entityId = (event.entity as any)?.id ?? (event.entityId as any) ?? null;

    await this.record(
      event,
      entityName,
      "REMOVE",
      entityId,
      sanitize(event.entity, entityName),
      null
    );
  }
}
