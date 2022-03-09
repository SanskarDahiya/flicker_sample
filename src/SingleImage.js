import * as React from "react";
import { View, Text, Image, ScrollView, Dimensions } from "react-native";
const max_width = Dimensions.get("window").width - 20;
const showData = (name, value) => {
  if (!value) {
    return <></>;
  }
  return (
    <>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {name}: <Text style={{ fontSize: 18, fontWeight: "normal" }}>{value}</Text>
      </Text>
    </>
  );
};
function SingleImage(props) {
  const { route } = props;
  const { url_o, width_o, height_o, title, description, tags } = route.params.data;
  let height = height_o || width_o || max_width;
  let width = width_o;
  if (!width) {
    width = max_width;
  } else if (max_width < width) {
    width = max_width;
  }
  height = parseInt((height_o * width) / width_o);
  return (
    <ScrollView>
      <View style={{ flex: 1, margin: 10 }}>
        <Image source={{ uri: url_o }} style={{ flex: 1, height, width }} />
        {showData("title", title)}
        {showData("description", description)}
        {showData("tags", tags)}
      </View>
    </ScrollView>
  );
}

export default SingleImage;
