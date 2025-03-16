export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  confirmed?: boolean | null;
  confirmToken?: string | null;
  createdAt: string;
};