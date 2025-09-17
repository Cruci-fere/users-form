import type { Type } from "./type";

export interface User {
  id: string;
  mark: string[];
  type: Type;
  login: string;
  password: string | null;
}