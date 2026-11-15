import { week1 } from "./week1.ts";
import { week2 } from "./week2.ts";
import { week3 } from "./week3.ts";
import { unpack } from "../../features/curriculum/types.ts";
export const lessons = [...week1, ...week2, ...week3].map(unpack);
export const getLesson = (day: number) => lessons.find((l) => l.day === day);
