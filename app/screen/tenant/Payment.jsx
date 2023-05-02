import React, { useState, useEffect} from "react";
import { Text, View, TextInput, FlatList, ScrollView } from "react-native";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity, Alert
} from "react-native";
import { Datepicker, Icon, Layout, IndexPath,
  Popover,
  Select,
  SelectItem, } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Choice from "../../component/invoice/choice";
import Time from "../../component/invoice/time";
import Date from "../../component/invoice/date";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "@env";
import axios from "axios";
import { StackActions } from "@react-navigation/native";


const Payment = ({ route, navigation }) => {
  const { total, id, categoryTitle, month, year } = route.params;
  const [ totalPay, setTotalPay] = useState(0);
  const [ date, setDate] = useState("");
  const [ time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [statusPay, setStatusPay] = useState("checking_payment");
  const [urlImg, setUrlImg] = useState([]);

  console.log(totalPay);
  const onChangeDateHandler = (date) => {
    setDate(date);
    console.log(date)
    // console.log(reserve_date.toISOString());
  };
  const onChangeTimeHandler = (time) => {
    setTime(time);
    console.log('po' + time)
    // console.log(reserve_date.toISOString());
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //   aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const list = [...image];
      list.unshift(result);
      setShowSlip(false);
      setImage(list);
      console.log('test----')
      console.log(list)
      console.log('test----')
    // let unexistedImage = list.filter(
    //   (img) => img.uri != undefined
    // );
    // console.log(list)
    // Promise.all(unexistedImage.map(img => {
    //   return fetch(img.uri).then(response => response.blob())
    //     .then(blob => {
    //       let reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       return new Promise(resolve => {
    //         reader.onload = function(event) {
    //           // console.log("eve " + event.target.result.substring(0, 20));
    //           resolve(event.target.result);
    //         }
    //       });
    //     })
    // })).then(base64 => {
    //   console.log(base64)
    //   return axios.post(`https://ezomcce76h.execute-api.us-east-1.amazonaws.com/dev/images/upload`, {file: base64}).then(response => {
    //     // console.log("listImg "+response.data.data);
    //     // return response.data.data;
    //     setUrlImg(response.data.data)
    //   console.log(response.data.data);
    //   // const res = await axios.post(`https://s5qcfq9sp0.execute-api.us-east-1.amazonaws.com/dev/payment/addpayment`, {
    //   //   payment_date : date,
    //   //   payment_time : time,
    //   //   payment_note : note,
    //   //   idInvoice : id,
    //   //   url : response.data.data,
    //   //   amount : totalPay,
    //   //   room_number : categoryTitle,
    //   //   payment_status : statusPay
    //   // });
    //   // setLoading(false);
    //   // alert('ส่งสลีปเรียบร้อย')
    //   // navigation.navigate("InvoiceDetail", {  id:  id,
    //   // categoryTitle:  categoryTitle, month: month, year: year});
    //   });
    // });
    }
    

  };
  const deleteImage = (index) => {
    let list = [...image];
    list.splice(index, 1);

    setImage(list);
  };
  let h = Dimensions.get("window").height;
let height;
if (h > 1000) {
  height = h / 2.5;
} else {
  height = h / 3.5;
}
  const sendReport = async () => {
    if (image.length > 0 && totalPay != ""){
        setLoading(true);
        const list = [...image];
        
        console.log(list)
        let unexistedImage = list.filter(
          (img) => img.uri != undefined
        );
        console.log(unexistedImage)
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
            setUrlImg(response.data.data)
          console.log(response.data.data);
          const res = axios.post(`https://s5qcfq9sp0.execute-api.us-east-1.amazonaws.com/dev/payment/addpayment`, {
            payment_date : date,
            payment_time : time,
            payment_note : note,
            idInvoice : id,
            url : response.data.data,
            amount : totalPay,
            room_number : categoryTitle,
            payment_status : statusPay
          });
          setLoading(false);
          alert('ส่งสลีปเรียบร้อย')
          navigation.navigate("InvoiceDetail", {  id:  id,
          categoryTitle:  categoryTitle, month: month, year: year});
          });
        });

        // try {
        //   const re = await axios.post(`${baseUrl}/file/upload`, formData, config);
        //   setUrlImg(re.data)
        //   console.log(re.data);
        //   const res = await axios.post(`https://s5qcfq9sp0.execute-api.us-east-1.amazonaws.com/dev/payment/addpayment`, {
        //     payment_date : date,
        //     payment_time : time,
        //     payment_note : note,
        //     idInvoice : id,
        //     url : re.data[0],
        //     amount : totalPay,
        //     room_number : categoryTitle,
        //     payment_status : statusPay
        //   });
        //   setLoading(false);
        //   alert('ส่งสลีปเรียบร้อย')
        //   navigation.navigate("InvoiceDetail", {  id:  id,
        //   categoryTitle:  categoryTitle, month: month, year: year});
        // } catch (err) {
        //   console.log(err);
        // }

    try {
      const response = await axios.put(`https://e8ngsalefa.execute-api.us-east-1.amazonaws.com/dev/invoice/updatestatus-invoice/${id}/${statusPay}`);
    } catch (err) {
      console.log(err);
    }

    }else{
      if(totalPay == ""){
        setShowTotal(true);
      }if(image.length <= 0){
        setShowSlip(true);
      }else{
        setShowTotal(false);
        setShowSlip(false);
      }
    }
  };

  return (
    <View style={styles.view}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={{ color: "#FFF" }}
      />
      <View style={styles.bg_money}>
        <Text
          style={{
            color: "#656464",
            margin: 10,
            marginLeft: 20,
            fontWeight: "bold",
          }}
        >
          ยอดชำระเงินทั้งหมด
        </Text>
        <Text
          style={{
            color: "#1C5DB8",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "32px",
            top: 6,
          }}
        >
          ฿{total}
        </Text>
      </View>
      <Image
        source={require("../../assets/bg_payment.png")}
        style={styles.background}
      ></Image>
      <View style={[styles.choice, { position: "absolute" }]}>
        <Text
          style={{
            color: "#656464",
            margin: 10,
            marginLeft: 20,
            fontWeight: "bold",
          }}
        >
          ช่องทางการชำระเงิน
        </Text>
        <Choice />
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            top: "42%",
          }}
        >
          ชื่อบัญชี : บจก.หอพัก A5
        </Text>
      </View>
      <View style={[styles.slip, { position: "absolute" }]}>
        <Text
          style={{
            color: "#656464",
            margin: 10,
            marginLeft: 20,
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          แจ้งหลักฐานการโอนเงิน
        </Text>
        <Text style={[styles.txt, { left: "4%" }]}>จำนวนเงิน</Text>
        <TextInput onChangeText={(totalPay) => {setTotalPay(totalPay)
      setShowTotal(false);
        }}
          style={[styles.inputInfo, { width: "80%", paddingLeft: "5%" }]}
          keyboardType="numeric"
        ></TextInput>
           { showTotal && (
        <Text style={{fontSize: "8px", fontWeight: "bold", color: 'red', top: 5, left: "10%"}}> กรุนากรอกจำนวนเงินที่โอน </Text>
        )}
        <View style={styles.timeDate}>
          <Text style={[styles.txt, { position: "absolute", top: 10 }]}>
            วันที่โอนเงิน
          </Text>
          {/* <TextInput style={[styles.inputInfo, {position: 'absolute', top: '10%', right: '12.5%', width: '33%', marginLeft: '13%'}]}></TextInput> */}
          <DatepickerAccessoriesShowcase onDate={onChangeDateHandler} />
          <Text
            style={[
              styles.txt,
              { position: "absolute", marginLeft: "50%", top: 10 },
            ]}
          >
            เวลาที่โอนเงิน
          </Text>
          {/* <TextInput style={[styles.inputInfo, {position: 'absolute', top: '10%', right: '12.5%', width: '33%', marginLeft: '13%'}]}></TextInput> */}
          <TimePicker  onTime={onChangeTimeHandler} />

          <Text style={[styles.txt, { marginTop: 72 }]}>หมายเหตุ(ถ้ามี)</Text>
          <TextInput onChangeText={(note) => setNote(note)}
            style={[
              styles.inputInfo,
              {
                width: "80%",
                marginTop: 88,
                position: "absolute",
                paddingLeft: "5%",
                marginLeft: "6%",
              },
            ]}
          ></TextInput>
          
          {/* <Button style={styles.btnUp} title="click">กดเพื่อแนบสลิป</Button> */}
          
          <TouchableOpacity
            style={[
              styles.btnUp,
              { justifyContent: "center", marginLeft: "6%" },
            ]}   onPress={pickImage}
          >
            <Text
              style={{
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              
              Upload Slip
            </Text>
          </TouchableOpacity>
          {image.length > 0 && (
          <Text style={{fontSize: "12px", fontWeight: "bold", position: "absolute",  marginVertical: 140,  marginLeft: "43%", color: 'gray' }}> {image[0].uri.slice(0, 25)}... </Text>
          )}
          { showSlip && (
          <Text
            style={{
              color: "red",
              position: "absolute",
              fontSize: "10px",
              fontWeight: "bold",
              marginVertical: 140,
              marginLeft: "45%",
            }}
          >
            
            กรุณาแนบสลิปทุกครั้ง!!
          </Text>
          )}
        </View>
        <TouchableOpacity
            style={[
              styles.btnSend,
              { justifyContent: "center"},
            ]}
            onPress={sendReport}
          >
            <Text
              style={{
                color: "white",
                fontSize: "13px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              แจ้งหลักฐานการชำระเงิน
            </Text>
          </TouchableOpacity>
      </View>
      
    </View>
  );
};

const DatepickerAccessoriesShowcase = ({onDate}) => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout style={[styles.date, {}]} level="1">
      <Date onDate={onDate} />
    </Layout>
  );
};

const TimePicker = ({onTime}) => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout
      style={[styles.date, { left: "42%", marginRight: "55%" }]}
      level="1"
    >
      <Time onTime={onTime}/>
    </Layout>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "white",
    alignItems: "center",
  },
  background: {
    height: "85%",
    width: "100%",
    borderRadius: "50px",
    borderBottomEndRadius: "0px",
    borderBottomLeftRadius: "0px",
  },
  bg_money: {
    backgroundColor: "#E5F8FE",
    width: "75%",
    height: "13%",
    alignSelf: "center",
    bottom: 7,
  },
  choice: {
    backgroundColor: "#E5F8FE",
    position: "absolute",
    borderRadius: "15px",
    width: "85%",
    height: "36%",
    top: "17%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  slip: {
    backgroundColor: "#E5F8FE",
    position: "absolute",
    borderRadius: "15px",
    width: "85%",
    height: "43%",
    top: "54.5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  inputInfo: {
    borderWidth: 1,
    borderColor: "#D8D4D4",
    backgroundColor: "white",
    borderRadius: "5px",
    top: "1%",
    height: "9%",
    alignSelf: "center",
  },
  date: {
    position: "absolute",
    marginLeft: "6%",
    top: 28,
    alignSelf: "center",
    width: "32%",
  },
  timeDate: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    left: "5%",
    right: "25%",
    height: "100%",
  },
  txt: {
    color: "#646262",
    fontSize: "11px",
    marginLeft: 33,
    fontWeight: "bold",
  },
  btnUp: {
    backgroundColor: "#FFB085",
    position: "absolute",
    width: "30%",
    height: 30,
    color: "white",
    top: 120,
    marginTop: "3%",
    borderRadius: "50%",
  },
  btnSend: {
    display: "flex",
    flexDirection: "column",
    alignSelf: 'center',
    backgroundColor: "#7DC2FB",
    position: "absolute",
    width: "80%",
    height: "12%",
    color: "white",
    top: '80%',
    borderRadius: "10%",
  }
});
export default Payment
