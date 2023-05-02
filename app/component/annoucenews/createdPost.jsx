import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Modal, Text, Input, Icon } from "@ui-kitten/components";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "@env";
import axios from "axios";

const CreatedPost = () => {
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [created_date, setCreated_date] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);

  class news {
    constructor() {
      this.title = "";
      this.text = "";
      this.created_date = "";
      this.url = "";
    }
    title;
    text;
    created_date;
    created_byId;
    url;
  }

  useState(() => {
    let currentDate = new Date();
    let d = currentDate.getDate();
    let m = currentDate.getMonth();
    let y = currentDate.getFullYear();
    setCreated_date(y + "-" + m + "-" + d);
  }, []);

  const Created = async () => {
    // try {
      let unexistedImage = image.filter(
        (img) => img.uri != undefined
      );
      Promise.all(unexistedImage.map(img => {
        return fetch(img.uri).then(response => response.blob())
          .then(blob => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise(resolve => {
              reader.onload = function(event) {
                // console.log("eve " + event.target.result.substring(0, 20));
                resolve(event.target.result);
              }
            });
          })
      })).then(base64 => {
        console.log(base64)
        return axios.post(`https://ezomcce76h.execute-api.us-east-1.amazonaws.com/dev/images/upload`, {file: base64}).then(response => {
          // console.log("listImg "+response.data.data);
          // return response.data.data;
          let record = new news();
          record.title = title;
          record.text = text;
          record.created_date = created_date;
          record.created_byId = 1;
          record.url = response.data.data; // Assuming there's only one image
          const res = axios.put(`https://m4nb34jkya.execute-api.us-east-1.amazonaws.com/dev/news/add`,record);
          Alert.alert(res.data.data.message, undefined, [
            {
              text: "Yes",
              onPress: () => {
                setTitle("");
                setText("");
                setVisible(false);
              },
            },
          ]);
        });
      });
    // } catch (err) {
    //   console.log("error "+err.message )
    // }
  };
  // .then(base64 => {
  //   console.log(base64)
  //   console.log("bese64 "+base64.substring(0, 30))
  //   return axios.post(`https://ezomcce76h.execute-api.us-east-1.amazonaws.com/dev/images/upload`, {file: [base64]}).then(response => {
  //     // console.log("listImg "+response.data.data);
  //     // return response.data.data;
  //     let record = new news();
  //     record.title = title;
  //     record.text = text;
  //     record.created_date = created_date;
  //     record.created_byId = 1;
  //     record.url = response.data.data; // Assuming there's only one image
  //     // const res = await axios.put(`https://m4nb34jkya.execute-api.us-east-1.amazonaws.com/dev/news/add`,record);
  //     // Alert.alert(res.data.message, undefined, [
  //     //   {
  //     //     text: "Yes",
  //     //     onPress: () => {
  //     //       setTitle("");
  //     //       setText("");
  //     //       setVisible(false);
  //     //     },
  //     //   },
  //     // ]);
  //   });
  // });
  

  const sendImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let list = [...image];
      list.unshift(result);
      // props.changeInput(list, "image");
      setImage(list);
    }
  };

  const deleteImage = (index) => {
    let list = [...image];
    list.splice(index, 1);
    setImage(list);
  };

  return (
    <View style={styles.search}>
      <TextInput
        multiline
        placeholder="type...."
        fontSize={20}
        // onChangeText={setText}
        // value={value}
        editable={false}
        style={[styles.input]}
      ></TextInput>

      <FontAwesome
        name="pencil-square-o"
        color={"grey"}
        size={25}
        onPress={() => setVisible(true)}
      ></FontAwesome>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true} style={{ width: 300 }}>
          <Icon
            fill="grey"
            style={{ width: 20, height: 20, alignSelf: "flex-end" }}
            name="close-circle-outline"
            onPress={() => {
              setVisible(false);
            }}
          ></Icon>
          <Input
            style={{ marginBottom: 10, marginTop: 10 }}
            textStyle={{ minHeight: 20, fontSize: 17 }}
            placeholder="หัวข้อ"
            onChangeText={setTitle}
          />
          <Input
            multiline={true}
            textStyle={{ minHeight: 100, fontSize: 17 }}
            placeholder="เนื้อหา"
            onChangeText={setText}
          />
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              },
            ]}
          >
            <Icon
              fill="#626567"
              style={{
                width: 30,
                height: 30,
                alignSelf: "center",
                marginTop: 20,
                marginHorizontal: 5,
              }}
              name="image"
              onPress={() => {
                sendImg();
              }}
            ></Icon>
            {/* {image.length > 0 &&
          image.map((item, index) => {
            console.log(item)
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                  position: "relative",
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: 20,
                  padding: 5,
                  width: "80%",
                }}
              >
                {item.uri == undefined && (
                  <Image
                    source={{ width: "100%", height: 300, uri: item }}
                    resizeMode="cover"
                  />
                )}
                {item.uri != undefined && (
                  <Image
                    source={{ width: "100%", height: 300, uri: item.uri }}
                    resizeMode="cover"
                  />
                )}
                
                <TouchableOpacity
                  onPress={() => deleteImage(index)}
                  style={{
                    backgroundColor: "pink",
                    position: "absolute",
                    top: -10,
                    right: -10,
                    borderRadius: 50,
                    padding: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                >
                  <Icon
                    style={styles.icon}
                    fill="#000"
                    name="trash-2-outline"
                  />
                </TouchableOpacity>
              </View>
            );
          })} */}
            <Button
              style={{ alignSelf: "center", marginTop: 20 }}
              size="small"
              onPress={() => {
                setVisible(false);
                Created();
              }}
            >
              POST!
            </Button>
            {/* <Button
              style={{ alignSelf: "center", marginTop: 20 }}
              size="small"
              onPress={() => {
                setVisible(false);
              }}
            >
              CANCEL
            </Button> */}
          </View>
          {image.length > 0 &&
            image.map((item, index) => {
              console.log(item);
              return (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    position: "relative",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 20,
                    marginLeft: 15,
                    padding: 5,
                    width: "100%",
                  }}
                >
                  {item.uri == undefined && (
                    <Image
                      source={{ width: "100%", height: 150, uri: item }}
                      resizeMode="cover"
                    />
                  )}
                  {item.uri != undefined && (
                    <Image
                      source={{ width: "100%", height: 150, uri: item.uri }}
                      resizeMode="cover"
                    />
                  )}
                  <Icon
                    fill="#EC1212"
                    style={{ width: 30, height: 30, left: -20, top: -15 }}
                    name="close-circle-outline"
                    onPress={() => deleteImage(index)}
                  ></Icon>
                </View>
              );
            })}
        </Card>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    height: 45,
    width: 250,
    padding: 15,
    fontSize: 18,
    marginBottom: 2,
    borderRightColor: "white",
  },
  search: {
    position: "absolute",
    alignItems: "center",
    top: 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    paddingRight: 10,
    borderColor: "#90AACB",
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: "white",
  },
});

export default CreatedPost;
