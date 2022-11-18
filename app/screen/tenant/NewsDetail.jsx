import React, { useState } from "react";
import { View, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { Button, Card, Text, Modal, Input } from "@ui-kitten/components";
import { FontAwesome } from "@expo/vector-icons";
import { NEWS } from "../../dummy/NEWS";
// import News from "../../component/AnnouceNews/news";
// import Modal from "../../component/AnnouceNews/createdPost";

const NewsDetail = ({ route, navigation }) => {
  const data = route.params.data;
  const [title, setTitle] = React.useState(data.title);
  const [text, setText] = React.useState(data.text);
  const [created_date, setCreated_byId] = useState(data.created_date);

  console.log("--------\n", data);

  const Edited = () => {
    console.log("title : " + title);
    console.log("text : " + text);
  };

  const Header = () => (
    <View
      style={[
        { borderBottomColor: "#90AACB", borderBottomWidth: 2, padding: 15 },
      ]}
    >
      <Text category="h6">{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/bg_login.jpg")}
        style={styles.background}
      ></Image>
      <View style={[styles.shadow]}>
        <Card style={styles.card} header={Header}>
          <Text style={styles.text} category="p1">
            {text}
          </Text>
          <Image
            source={require("../../assets/user.jpg")}
            style={styles.image}
          ></Image>
          <Text
            style={{
              fontSize: 12,
              color: "#626567",
              textAlign: "right",
              marginTop: 20,
            }}
          >
            สร้างเมื่อ : {created_date}
          </Text>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    felx: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  background: {
    width: "100%",
    height: "80%",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    position: "absolute",
    alignSelf: "flex-start",
    top: -100,
  },
  card: {
    flex: 1,
    margin: 2,
    borderRadius: 10,
    backgroundColor: "rgba(230, 248, 253, 0.9)",
    width: 300,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerControl: {
    marginHorizontal: 2,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shadow: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 15,
  },
});

export default NewsDetail;
