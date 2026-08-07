import { AsyncLocalStorage } from "async_hooks";

export type RequestUserContext = {
  id: string;
  email: string;
  name: string;
};

const storage = new AsyncLocalStorage<RequestUserContext>();

export function runWithUserContext<T>(
  user: RequestUserContext,
  fn: () => T
): T {
  return storage.run(user, fn);
}

export function getCurrentUser(): RequestUserContext | undefined {
  return storage.getStore();
}
