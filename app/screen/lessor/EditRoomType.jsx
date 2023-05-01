import { useEffect, useState } from "react"
import RoomFormEdit from "../../component/form/RoomFormEdit"
import {baseUrl} from "@env"
import axios from "axios"
const EditRoomType = ({ route, navigation }) => {
    const [data, setData] = useState("")
    const { id } = route.params;
    useEffect(() => {
        axios
        .get(`https://hmmy4mdej9.execute-api.us-east-1.amazonaws.com/dev/room2/getbyid`, {
          params: {
            id : id
        } })
        .then((response) => {
          setData(response.data.data.Item);
        })
        .catch((err) => {
          console.log(err);
        });
    },[])
    return (
        <RoomFormEdit navigation={navigation} route={route} data={data} />
    )
}
export default EditRoomType