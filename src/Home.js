import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Dimensions, Pressable } from "react-native";
const width = Dimensions.get("window").width;
import { fetchImages } from "./Axios";

function Home(props) {
  const [{ data: putData, loading, error }, getImages] = fetchImages();
  useEffect(() => {
    console.log("🚀 ~ file: Home.js ~ line 8 ~ useEffect ~ executePut");
    getImages();
  }, []);
  let component = <Text>Loading</Text>;
  if (!loading) {
    if (error) {
      component = <Text>Failed</Text>;
    } else {
      if (putData && putData.data && Array.isArray(putData.data)) {
        component = putData.data.map(imageData => {
          const { id, url_w } = imageData;
          const height = 100;
          const width = 100;
          return (
            <View key={id} style={{ height, width, margin: 5 }}>
              <Pressable
                onPress={() => {
                  props.navigation.navigate("Image", { data: imageData });
                }}
              >
                <Image source={{ uri: url_w }} style={{ height, width }} />
              </Pressable>
            </View>
          );
        });
        // console.log("🚀 ~ file: Home.js ~ line 25 ~ component=putData.data.map ~ putData.data", putData.data);
      }
    }
  }
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
          flexDirection: "row"
        }}
      >
        {component}
      </View>
    </ScrollView>
  );
}

export default Home;
