import type { IMenu } from "./menu.type";
type IUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  username: string;
  phone: string;
  role_id: number;
  role_name: string;
  menu: IMenu[];
};
export { type IUser };
