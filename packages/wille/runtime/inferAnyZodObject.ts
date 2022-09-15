import { AnyZodObject } from "zod";

export type inferAnyZodObject<T> = T extends AnyZodObject ? T : never;
