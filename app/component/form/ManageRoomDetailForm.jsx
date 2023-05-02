import { Image, StyleSheet,  TouchableOpacity, View,Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import React,{ useEffect, useState} from "react";
import { Icon, Input,Text, Tooltip ,Select, SelectItem, IndexPath,Button} from "@ui-kitten/components";
import RoomCard from "../card/RoomCard";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
const ManageRoomForm = (props) => {
  const [image, setImage] = useState([]);
  const [selectedIndexBuilding, setSelectedIndexBuilding] = useState(new IndexPath(0));
  const [selectedIndexFloor, setSelectedIndexFloor] = useState(new IndexPath(0));
  const [addBuildingable,setAddBuildingable] = useState(false)
  const [newBuilding, setNewBuilding] = useState()
  const [newFloor, setNewFloor] = useState()
  useEffect(async () => {
    console.log(props)
    setImage(props.allData.image);
    await getBuilding();
    
  }, []);
  const [visibleConv, setVisibleConv] = useState(false)
  const [visible, setVisible] = useState(false);
  const [listBuilding, setListBuliding] = useState([])
  const [loadingAddBuilding,setLoadingAddBuilding] = useState(true)
  const getBuilding =(async ()=>{
    try{
      const res = await axios.get(`https://8osppnevf7.execute-api.us-east-1.amazonaws.com/dev/building/getall`)
      console.log(res.data.data)
      setListBuliding(res.data.data)
      setSelectedIndexBuilding(0)
    }catch(err){
      console.log(err.message)
    }
  })
  const addBuilding =( async ()=>{
    try{
      setLoadingAddBuilding(true)
      const res = await axios.post(`https://8osppnevf7.execute-api.us-east-1.amazonaws.com/dev/building/add`,{
        building_name : newBuilding,
        number_of_floors:newFloor
      })
    if(res.data.message == "Add building Successfully"){
      setLoadingAddBuilding(false)
      setNewBuilding("")
      setNewFloor("")
      Alert.alert("เพิ่มตึกเรียบร้อยแล้ว", "ตึก : "+res.data.data.building_name+"  จำนวนชั้น : "+res.data.data.number_of_floors, [
        {
          text: "OK",
        },
      ]);
      getBuilding();
    }
    }catch(err){
      console.log(err.message)
    }
    
    
  })
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
      props.changeInput(list, "image");
      setImage(list);
    }
  };
  const deleteImage = (index) => {
    let list = [...image];
    list.splice(index, 1);
    props.changeInput(list, "image");
    setImage(list);
  };
  const renderToggleButton = () => (
    <TouchableOpacity onPress={() => setVisible(true)} style={{justifyContent:'flex-end'}}>
      <Icon
        style={{ width: 20, height: 20 }}
        fill="#8F9BB3"
        name="alert-circle-outline"
      />
    </TouchableOpacity>
  );
  const renderToggleButtonConv = () => (
    <TouchableOpacity onPress={() =>setVisibleConv(true)} style={{justifyContent:'flex-end'}}>
      <Icon
        style={{ width: 20, height: 20 }}
        fill="#8F9BB3"
        name="alert-circle-outline"
      />
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      <Spinner
          visible={loadingAddBuilding}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      <View style={{ flex: 1, paddingHorizontal: "10%", marginBottom:20 }}>
        <Input
          style={{ marginBottom: 10 }}
          label="คำแนะนำ"
          placeholder="Place your Text"
          value={props.allData.suggestion}
          onChangeText={(nextValue) => props.changeInput(nextValue, "suggest")}
        />
        <Input
          label="Information"
          style={{ marginBottom: 10 }}
          placeholder="Place your Text"
          multiline={true}
          textStyle={{ minHeight: 64 }}
          value={props.allData.information}
          onChangeText={(nextValue) => props.changeInput(nextValue, "inform")}
        />
        <Input
          label="Convenience"
          style={{ marginBottom: 10 }}
          placeholder="Place your Text"
          multiline={true}
          textStyle={{ minHeight: 64 }}
          value={props.allData.convenience.join(",")}
          onChangeText={(nextValue) => props.changeInput(nextValue, "conve")}
        /><View style={{display:'flex',alignItems:'flex-end'}}>
        <Tooltip
        anchor={renderToggleButtonConv}
        visible={visibleConv}
        onBackdropPress={() => setVisibleConv(false)}
        style={{display:'flex', flexWrap: "wrap",width:700,}}
      >
        - ใช้สัญลักษณ์ "," ในการแบ่งสิ่งอำนวยความสะดวก เช่น โต๊ะ,เก้าอี้,พัดลม {'\n'}
       
          </Tooltip></View>
        {(props.screen == 'add' && listBuilding.length > 0 )&&
        <View>
        <Text category="c1" status='danger' style={{ textAlign: 'center', marginBottom: 8 }}>
          *กรุณตรวจสอบข้อมูลตึก ชั้น และห้องก่อนส่ง เนื่องจากจะไม่สามารถลบหรือแก้ไขได้*</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
          <Select
            label="ตึก"
            selectedIndex={selectedIndexBuilding}
            value={listBuilding[selectedIndexBuilding.row]?.building_name}
            onSelect={index => {
              setSelectedIndexBuilding(index)
              console.log("building "+listBuilding[index]?.building_name)
              props.changeRoomInput(listBuilding[selectedIndexBuilding.row]?.building_name, "build")
              }}
            style={{ width: 100, marginRight: 10 }}
            
          >
            {listBuilding.map((item, index) => {
              console.log("item "+item.building_name+index)
              return <SelectItem title={item.building_name+""} key={index} />;
            })}
          </Select>
          <Select
            label="ชั้น"
            selectedIndex={selectedIndexFloor}
            value={props.rent.floor}
            onSelect={index => {
              setSelectedIndexFloor(index)
              props.changeRoomInput(parseInt(index), "floor")
            }}
            style={{ width: 100, marginRight: 10 }}
          >
            {true &&
              listBuilding[selectedIndexBuilding.row]?.number_of_floors &&
              Array.from(
                { length: listBuilding[selectedIndexBuilding.row]?.number_of_floors },
                (_, index) => (
                  <SelectItem title={index + 1} key={index} />
                )
              )}
          </Select>
          <TouchableOpacity
            style={{display:'flex',alignSelf:"flex-end"}}
            onPress={() => setAddBuildingable(true)}
          >
            <Icon
              fill="#47C5FC"
              style={{ width: 35, height: 35,}}
              name="plus-circle"
            ></Icon>
          </TouchableOpacity>
          </View>
          {addBuildingable &&
          <View>
            <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>

            <Input
            label="ตึก"
            placeholder="ชื่อตึก"
            style={{ width: 100, marginRight: 10 }}
            value={newBuilding}
            onChangeText={(nextValue) =>
              setNewBuilding(nextValue)
            }
          />
          <Input
            label="ชั้น"
            placeholder="จำนวนชั้น"
            style={{ width: 100 ,marginRight: 10 }}
            value={newFloor}
            onChangeText={(nextValue) =>
              setNewFloor(parseInt(nextValue))
            }
          />
          </View>
            <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop:10
          }}>
            <Button
            style={{ marginRight: 20}}
            onPress={() => {
              Alert.alert(
                "ต้องการบันทึกการเพิ่มตึกหรือไม่",
                "ถ้าดำเนินการแล้วจะไม่สามารถลบหรือแก้ไขได้",
               
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("cancel"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: async() => {
                  await addBuilding()
                  setAddBuildingable(false) }},
                ]
              );
            }}
            status="primary"
          >
            Save
          </Button>
          <Button
            style={{ marginRight: 20 }}
            onPress={() => {
              Alert.alert(
                "ต้องการยกเลิกการเพิ่มตึกหรือไม่", undefined,
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("cancel"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => {setAddBuildingable(false)
                    setNewBuilding("")
                    setNewFloor("")}
                  },
                ]
              );
            }}
            status="danger"
          >
            Cancle
          </Button>
          </View>
          </View>
          }
          {!addBuildingable &&
          <View >
          <Input
            label="ห้อง"
            placeholder="Place your Text"
            style={{ width: 100 }}
            value={props.rent.room_number}
            onChangeText={(nextValue) =>
              props.changeRoomInput(nextValue, "roomNo")}
          />
          <Tooltip
            anchor={renderToggleButton}
            visible={visible}
            onBackdropPress={() => setVisible(false)}
            style={{display:'flex', flexWrap: "wrap",width:250}}
          >
            - ถ้าต้องการระบุเจาะจงห้องให้ใช้สัญลักษณ์ "," เช่น 05,08 {'\n'}
            - แต่ถ้าต้องการระบุตั้งแต่ห้องไหนถึงห้องไหนให้ใช้สัญลักษณ์ "-" เช่น 11-20
          </Tooltip>
          </View>
          }
          </View>
          </View>
          }
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        {props.allData.image.length === 0 &&
          <Text catagory="c1" status='danger'>*ต้องใส่รูปอย่างน้อย 1 รูป*</Text>
        }
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(71, 197, 252, 0.1)",
            padding: 20,
            borderRadius: 20,
            marginTop:5
          }}
          onPress={pickImage}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Icon
              name="cloud-upload-outline"
              fill="#000"
              style={{ width: 50, height: 50 }}
            />
            <Text>UPLOAD YOUR IMAGE</Text>
          </View>
        </TouchableOpacity>

        {image.length > 0 &&
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
          })}
          
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
export default ManageRoomForm;
