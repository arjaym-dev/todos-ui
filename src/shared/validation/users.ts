/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { object, string, number, date, InferType } from "yup";

export let createUserSchema = object({
  username: string().required("Username is required"),
  password: string()
    .min(6, "Password is min. of 6 chars.")
    .max(16, "Password is max. of 16 chars.")
    .required("Password is required"),
  roleId: string().required("Role is required"),
});

export type CreateUser = InferType<typeof createUserSchema>;
