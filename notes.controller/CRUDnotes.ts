import { noteDataArray, NoteDataInterface } from "@/constants";
import Toast from "react-native-toast-message";
// import * as Burnt from "burnt";

function CreateNewNote({ title, content }: NoteDataInterface) {
  try {
    noteDataArray.push({
      title,
      content,
    });
    console.log(
      noteDataArray[noteDataArray.length - 1],
      "has been added into the array"
    );
    return {
      status: true,
      message:
        (noteDataArray[noteDataArray.length - 1],
        "has been added into the array"),
    };
  } catch (error) {
    return {
      status: false,
      message: (error as Error).message,
    };
  }
}

export { CreateNewNote };

export const showSuccessToast = (type: "success", text1: string) => {
  Toast.show({
    autoHide: true,
    visibilityTime: 6000,
    type: type,
    text1,
    position: "bottom",
  });
};
export const showErrorToast = (type: "error", text1: string) => {
  Toast.show({
    autoHide: true,
    visibilityTime: 6000,
    type: type,
    text1,
  });
};
