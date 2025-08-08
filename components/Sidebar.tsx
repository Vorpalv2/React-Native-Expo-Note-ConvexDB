import { StyleSheet, View } from "react-native";
export default function Sidebar() {
  return (
    <View style={styles.sidebar} className="bg-black">
      hello
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 60,
  },
});
