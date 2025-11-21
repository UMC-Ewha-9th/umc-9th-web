import type { z } from "zod";
import type { signupSchema } from "../pages/SignupPage";

export type SignupFormFields = z.infer<typeof signupSchema>;
