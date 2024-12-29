import { api } from "./api";
import { User } from "@/types/User";

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post("/users/login", { email, password });
  const { token, id, name, email: userEmail } = response.data;
  return { token, id, name, email: userEmail };
};

type signupData = {
  name: string;
  email: string;
  password: string;
  plan?: "Standard" | "Gold" | "Platinum";
};

export const signup = async ({
  name,
  email,
  password,
  plan = "Standard",
}: signupData): Promise<User> => {
  const response = await api.post("/users/signup", {
    name,
    email,
    password,
    plan,
  });
  const { token, id, name: userName, email: userEmail } = response.data;
  return { token, id, name: userName, email: userEmail };
};
