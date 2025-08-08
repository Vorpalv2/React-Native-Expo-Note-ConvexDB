import { NoteDataInterface } from "@/constants";
import { CreateNewNote } from "./CRUDnotes";

function onSubmitHandler({ title, content }: NoteDataInterface) {
  console.log(title, content);
  CreateNewNote({ title, content });
}

export { onSubmitHandler };
