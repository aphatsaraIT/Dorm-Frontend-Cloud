import {
  Avatar,
  Button,
  Divider,
  IndexPath,
  Layout,
  Popover,
  Select,
  SelectItem,
  Icon
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderBackground from "../../component/background/HeaderBackground";
import ReportCard from "../../component/card/ReportCard";
import { REPORT } from "../../dummy/REPORT";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Card, Input, List, Text } from "@ui-kitten/components";
import FooterBackground from "../../component/background/FooterBackground";
import {baseUrl} from "@env"
import axios from "axios";
import AddReport from "../../component/card/AddReport";
let h = Dimensions.get('window').height
let height;
if (h > 1000) {
  height = h / 2.5
}
else {
  height = h / 3.5
}
// let room_number = "A203"
// let username = "gotenlnwZa";
const Report = () => {

  const user = useSelector((state) => state.user)
    
  const [selectItem, setSelectItem] = useState(new IndexPath(0));
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState([]);
 
  const [loading, setLoading] = useState(false);
  const [allReport, setAllReport] = useState([]);
  const [listBySelect, setListBySelect] = useState([]);
  const [selectStatus, setSelectStatus] = useState("all")
  // const [username, setUsername] = useState("")
  // const [roomNumber,setRoomNumber] = useState("")

  useEffect(() => {
    const getReport = async () => {
      const reports = await axios.get(`https://wkbem4h9ag.execute-api.us-east-1.amazonaws.com/dev/report/getall/`)
      let sortDate = reports.data.data
      sortDate.sort((a, b) => {
        function convertDate(text) {
          const date = text.replace(",", "")
          const arr = date.split(" ")
          const arrDate = arr[0].split("/")
          const arrTime = arr[1].split(":")
          return new Date(arrDate[2], arrDate[1], arrDate[0], arrTime[0], arrTime[1], arrTime[2])
        }

        return convertDate(b.date) - convertDate(a.date)
      }
        );
      setAllReport(sortDate)
      setListBySelect(sortDate)
    }
    getReport()
    
  }, [])
  
  useEffect(() => {
    const queryByStatus = async() => {
      console.log(selectStatus)
      const response = await axios.get(`https://wkbem4h9ag.execute-api.us-east-1.amazonaws.com/dev/report/status/${selectStatus}`)
      let sortDate = response.data.data
      sortDate.sort((a, b) => {
        function convertDate(text) {
          const date = text.replace(",", "")
          const arr = date.split(" ")
          const arrDate = arr[0].split("/")
          const arrTime = arr[1].split(":")
          return new Date(arrDate[2], arrDate[1], arrDate[0], arrTime[0], arrTime[1], arrTime[2])
        }
        console.log(convertDate(b.date))
        return convertDate(b.date) - convertDate(a.date)
      }
      );
      setListBySelect(sortDate)
    }
    if (selectStatus == "all") {
      setListBySelect(allReport)
    }
    else {
      queryByStatus();
    }
    // console.log(selectStatus)
  },[selectStatus])
  class report  {
    constructor() {
      this.room_number = user.room_number;
      this.name = user.username;
      this.content = "";
      this.date =0;
      this.topic = "";
      this.status = false;
      this.comments = [];
      this.image = []
    }
    room_number;
    name;
    content;
    date;
    topic;
    status;
    comments;
    image;
    
  }

  const sendReport = async (content, topic) => {
    setLoading(true)
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
      console.log("base64 "+base64)
      return axios.post(`https://ezomcce76h.execute-api.us-east-1.amazonaws.com/dev/images/upload`, {file: base64}).then(response => {
        console.log("listImg "+response.data.data);
        let createReport = new report();
        let date = new Date().toLocaleString()
        createReport.topic = topic
        createReport.content = content
        createReport.image = response.data.data
        createReport.date = date
    
        axios.post(`https://wkbem4h9ag.execute-api.us-east-1.amazonaws.com/dev/report/add`, createReport).then(res => {
          console.log("add report "+ res.data.message)
          Alert.alert(res.data.message, undefined, [
          {
            text: "Yes", onPress: () => {
              
              setImage([])
              setVisible(false);}
          },
        ])
        })
        
        setLoading(false)
        
      });
});
    const getReport = async() => {
      const reports = await axios.get(`https://wkbem4h9ag.execute-api.us-east-1.amazonaws.com/dev/report/getall/`)
      let sortDate = reports.data.data
      sortDate.sort((a, b) => {
        function convertDate(text) {
          const date = text.replace(",", "")
          const arr = date.split(" ")
          const arrDate = arr[0].split("/")
          const arrTime = arr[1].split(":")
          return new Date(arrDate[2], arrDate[1], arrDate[0], arrTime[0], arrTime[1], arrTime[2])
        }

        return convertDate(b.date) - convertDate(a.date)
      }
        );
      setAllReport(sortDate)
      setListBySelect(sortDate)
    }
    let temp = { ...selectItem }
    temp.row = 0
    setSelectItem(temp)
    setSelectStatus("all")
    getReport()
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      let list = [...image];
      list.unshift(result);
      setImage(list);
    }
  };
  const deleteImage = (index) => {
    let list = [...image];
    list.splice(index, 1);

    setImage(list);
  };
  const renderToggleButton = () => (
    <View style={{ width: "98%", marginTop: "2%" }}>
      <Button onPress={() => {
        setVisible(true);
      }
        
      } status="warning">
        Let us know about your problem.
      </Button>
    </View>
  );
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#fff" }}>
      <HeaderBackground image={require("../../assets/bg_invoice.png")} />
      <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      <Popover
        backdropStyle={styles.backdrop}
        visible={visible}
        anchor={renderToggleButton}
        fullWidth={true}
        onBackdropPress={() => setVisible(false)}
      >
        <AddReport room_number={user.room_number} name={user.username} sendReport={sendReport} image={image} setImage={setImage} pickImage={pickImage} deleteImage={deleteImage} />
      </Popover>

      <View style={{ flex: 1, marginTop: "5%",width:"100%" }}>
        <View style={styles.filter}>
          <Text category="h6">รายการแจ้งทั้งหมด</Text>

          <Select
            value={
              selectItem.row === 0
                ? "ทั้งหมด"
                : selectItem.row === 1
                ? "ยังไม่ซ่อม"
                : "ซ่อมแล้ว"
            }
            style={{ width: 150 }}
            selectedIndex={selectItem}
            onSelect={(index) => {
              setSelectItem(index);
              if (index.row == 0) {
                setSelectStatus("all")
              } else if (index.row == 1) {
                setSelectStatus(false)
              } else {
                setSelectStatus(true)
              }
            }}
            placeholder={"ทั้งหมด"}
          >
            <SelectItem title="ทั้งหมด"  />

            <SelectItem title="ยังไม่ซ่อม" />
            <SelectItem title="ซ่อมแล้ว" />
          </Select>
        </View>
        <Divider
          style={{
            marginHorizontal: "5%",
            marginBottom: 2,
            backgroundColor: "#777",
            height: 3,
          }}
        ></Divider>
        
          <ReportCard data={listBySelect} page={"report"} name={user.username} />
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  roomName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    // marginTop: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  formReport: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: "3%",
    paddingTop: "5%",
    display: "flex",
    alignItems: "center",
    margin: "5%",
    backgroundColor: "rgba(256, 256, 256, 0.5)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filter: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: "5%",
    alignItems: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  },
  content2: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  avatar: {
    marginHorizontal: 4,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
export default Report;
