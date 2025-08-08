import { convexSchemaInterface, NoteDataInterface } from "@/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//convex entry

import { api } from "@/convex/_generated/api";
import { showSuccessToast } from "@/notes.controller/CRUDnotes";
import { useMutation, useQuery } from "convex/react";

// Mock data and interface for the FlatList
// In a real app, this would likely be fetched from an API or storage

/**
 * Component to render a single note item in the FlatList.
 */

function RenderComponent({
  item,
  onDelete,
  onTaskUpdate,
}: {
  item: convexSchemaInterface;
  onDelete: (item: convexSchemaInterface) => void;
  onTaskUpdate: (id: string) => void;
}) {
  return (
    <View className={`p-2 ${item.isCompleted && "bg-zinc-400"} flex flex-row `}>
      <View className="w-1/2 pl-4">
        <Text
          className={`${item.isCompleted && "line-through"}`}
          style={styles.noteTitle}
        >
          {item.title}
        </Text>
        <Text
          className={`${item.isCompleted && "line-through"}`}
          style={styles.noteContent}
        >
          {item.content}
        </Text>
      </View>
      <View className="w-1/2 justify-end">
        <View className="flex flex-row gap-8 justify-end pr-4">
          <Pressable onPress={() => onTaskUpdate(item._id)}>
            {({ pressed }) => {
              return (
                <AntDesign
                  name={`${item.isCompleted ? "minus" : "check"}`}
                  size={20}
                  color={pressed ? "white" : "black"}
                />
              );
            }}
          </Pressable>
          <Pressable onPress={() => onDelete(item)}>
            {({ pressed }) => {
              return (
                <AntDesign
                  name="delete"
                  size={20}
                  color={pressed ? "white" : "black"}
                />
              );
            }}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// Modal
function Modal({
  isOpen,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  submitHandler,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle?: (text: string) => void;
  content: string;
  setContent?: (text: string) => void;
  submitHandler: ({ title, content }: NoteDataInterface) => void;
}) {
  if (!isOpen) return null;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Note</Text>
            <Pressable onPress={onClose} style={styles.modalClose}>
              <AntDesign name="close" size={32} color={"black"} />
            </Pressable>
            <TextInput
              placeholder="Title"
              style={styles.input}
              placeholderTextColor={"#444"}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              multiline={true}
              numberOfLines={2}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              placeholderTextColor={"#444"}
              style={[styles.input, styles.contentInput]}
            />
            <Pressable
              onPress={() => submitHandler({ title, content })}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * Sidebar component that slides in from the right.
 * It is conditionally rendered based on the `isOpen` prop.
 */
function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <>
      <TouchableWithoutFeedback>
        <View
          style={[
            styles.sidebar,
            isOpen ? styles.sidebarOpen : styles.sidebarClosed,
          ]}
          className="absolute top-3 right-1 h-1/4 bg-amber-500 w-1/3 gap-2 border-black p-4 z-50 border-l"
        >
          <View>
            <Pressable onPress={onClose} className="self-end p-2">
              <AntDesign name="close" size={32} color="black" />
            </Pressable>
            <Text className="text-white font-quicksand-bold text-xl font-bold">
              Sidebar
            </Text>
            <Text className="text-white text-lg ml-4 font-quicksand-bold mt-4">
              Profile
            </Text>
            <Text className="text-white text-lg ml-4 font-quicksand-bold mt-2">
              Logout
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

/**
 * Main application component.
 */
export default function App() {
  const colorSchema = useColorScheme();
  const tasks = useQuery(api.notes.get);
  const deleteNote = useMutation(api.notes.deleteTask);
  const createNote = useMutation(api.notes.createTask);
  const updateIsCompleted = useMutation(api.notes.updateIsCompletedTask);

  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Function to capture a photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo captured:", photo);

        // For now, just log the photo data
        // In a real app, you might want to save or display the photo
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  // Function to toggle the floating plus menu
  const togglePlusMenu = () => {
    setIsPlusOpen((prev) => !prev);
  };

  // Function to toggle the sidebar menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  async function onSubmitHandler({ title, content }: NoteDataInterface) {
    const newNote = await createNote({ title, content });
    if (newNote.success) {
      // console.log(newNote);
      setIsPlusOpen(false);
      setIsModalOpen(false);
      showSuccessToast("success", "note created successfully");
      // toast("success", "note created successfully");
      setTitle("");
      setContent("");
    } else {
      console.log("error creating note");
    }
  }

  async function DeleteFromConvexDB(item: convexSchemaInterface) {
    try {
      console.log("Attempting to delete item with ID:", item._id);
      const deleted = await deleteNote({ id: item._id });
      console.log("Delete response:", deleted);
      showSuccessToast(
        "success",
        `successfully delete note" with title:  ${item.title}`
      );
      // Alert.alert(`Success! ${item.title} successfully deleted`);
      return deleted;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }

  async function updateIsCompleteInConvexDB(itemID: any) {
    try {
      console.log("Attempting to update the item with ID", itemID);
      const updated = await updateIsCompleted({ id: itemID });
      console.log("updated response:", updated);
      return updated;
    } catch (error) {
      console.log("Update error", error);
    }
  }

  function FallbackComponent() {
    return (
      <View className="flex items-center justify-center size-full animate-spin">
        <AntDesign name="loading1" size={48} color="black" />
      </View>
    );
  }

  const EmptyListComponent = React.useMemo(() => {
    const Component = () => (
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={require("@/assets/images/Notebook.png")}
          style={{ width: 400, height: 400 }}
          resizeMode="contain"
        />
        <Text className="text-black text-4xl">Create your first note!</Text>
      </View>
    );
    return Component;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={"default"} />
      <View
        className={`flex-1 ${colorSchema === "dark" ? "bg-black" : "bg-white-100"}`}
      >
        {/* Header */}
        <View className="offer-card w-full flex-row items-center justify-between p-4">
          <View className="w-1/2">
            <Text className="text-4xl font-bold text-[#2780FD] tracking-wider">
              Notes
            </Text>
          </View>
          <View className="w-1/2 flex flex-row gap-4 justify-end pr-4">
            {/* Search Icon */}
            <Pressable onPress={() => console.log("Search pressed")}>
              {({ pressed }) => (
                <AntDesign
                  name="search1"
                  size={32}
                  style={styles.icons}
                  color={"#2780FD"}
                />
              )}
            </Pressable>

            {/* Menu Icon */}
            <Pressable onPress={toggleMenu}>
              {({ pressed }) => (
                <Entypo
                  name="menu"
                  size={32}
                  style={styles.icons}
                  color={"#2780FD"}
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* Main Content Area */}

        <View className={`flex-1 bg-white-100 rounded-xl m-2 overflow-hidden`}>
          {tasks === undefined ? (
            <FallbackComponent />
          ) : (
            // <View className="flex">
            <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <RenderComponent
                  key={item._id}
                  item={item}
                  onDelete={() => DeleteFromConvexDB(item)}
                  onTaskUpdate={() => updateIsCompleteInConvexDB(item._id)}
                />
              )}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={EmptyListComponent}
            />
            // </View>
          )}
        </View>

        {/* Camera View */}
        {showCamera && !isPlusOpen && (
          <View style={styles.cameraContainer}>
            <Pressable
              style={{ position: "absolute", top: 40, right: 20, zIndex: 2 }}
              onPress={() => setShowCamera(false)}
            >
              <AntDesign name="close" size={32} color="white" />
            </Pressable>
            {permission === undefined ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.message}>
                  Requesting camera permission...
                </Text>
              </View>
            ) : permission === null || permission.granted === false ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.message}>
                  We need your permission to show the camera
                </Text>
                <Button
                  onPress={() => {
                    console.log("Request permission button pressed");
                    requestPermission();
                  }}
                  title="Grant Permission"
                />
              </View>
            ) : (
              <CameraView
                ref={cameraRef}
                style={styles.cameraView}
                facing={facing}
              >
                <Pressable style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </Pressable>
              </CameraView>
            )}
          </View>
        )}

        {/* Floating Add Note Button with Sub-menu */}
        <View
          className={`${showCamera ? "hidden" : "absolute"} bottom-6 right-6 z-40`}
        >
          {isPlusOpen && !isModalOpen && (
            <View
              className="w-20 absolute -left-2 -bottom-48 p-4 bg-white rounded-2xl border-black border-2 gap-4 shadow-lg"
              style={styles.plusMenu}
            >
              <Pressable
                onPress={() => {
                  console.log("Camera button pressed in UI");
                  console.log("Current permission status:", permission);
                  setShowCamera(true);
                  setIsPlusOpen(false);
                }}
              >
                <Ionicons name="camera" size={36} color={"#2780FD"} />
              </Pressable>
              <Pressable onPress={toggleModal}>
                <Ionicons name="create-outline" size={36} color={"#2780FD"} />
              </Pressable>
            </View>
          )}

          <Pressable onPress={togglePlusMenu}>
            {({ pressed }) => (
              <View className="bg-[#2780FD] rounded-full p-2 shadow-lg">
                <AntDesign
                  name={isPlusOpen ? "minuscircleo" : "pluscircleo"}
                  size={42}
                  color="white"
                />
              </View>
            )}
          </Pressable>
        </View>

        {/* Sidebar component is conditionally rendered here */}
        <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />

        {/* Move Modal here, outside of the plus menu */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            onClose={toggleModal}
            submitHandler={onSubmitHandler}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// StyleSheet for non-Tailwind styles or more complex styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  noteContent: {
    fontSize: 16,
    color: "black",
  },
  icons: {
    padding: 4,
  },
  sidebar: {
    // Add a transition for a smooth animation
    transform: [{ translateX: 0 }],
    transitionProperty: "transform",
    transitionDuration: "0.3s",
    transitionTimingFunction: "ease-in-out",
    borderRadius: 20,
  },
  sidebarClosed: {
    transform: [{ translateX: 150 }], // Off-screen
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }], // On-screen
  },
  plusMenu: {
    // Style for the floating menu's position and appearance
    position: "absolute",
    bottom: 80, // Position above the plus button
    right: 0,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Increased to ensure it's above everything
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 400, // Added to control maximum width
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalContent: {
    fontSize: 16,
    color: "gray",
    marginBottom: 24,
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  input: {
    fontSize: 16, // Increased from default
    fontWeight: "500",
    width: 200,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 80, // Increased height for multiple lines
    paddingTop: 10, // Add some padding at the top for better text alignment
  },
  button: {
    textAlign: "center",
    backgroundColor: "#2780FD",
    paddingVertical: 10,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  cameraView: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});
