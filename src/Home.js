import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, Pressable } from "react-native";
import { fetchImages } from "./Axios";

function Home(props) {
  const [{ data: imageResult, loading, error }, getImages] = fetchImages();
  useEffect(() => {
    getImages();
  }, []);
  let component = <Text>Loading</Text>;
  if (!loading) {
    if (error) {
      component = <Text>Failed</Text>;
    } else {
      if (imageResult && imageResult.data && Array.isArray(imageResult.data)) {
        const renderData = ({ item: imageData }) => {
          const { id, title, url_w } = imageData;
          const height = 180;
          const width = 180;
          const max_length = title.length;
          return (
            <View key={id} style={{ height, width, margin: 5, position: "relative" }}>
              <Pressable
                onPress={() => {
                  props.navigation.navigate("Image", { data: imageData });
                }}
              >
                <Image source={{ uri: url_w }} style={{ height, width }} />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    bottom: 0,
                    left: 0
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "400" }}>{title}</Text>
                </View>
              </Pressable>
            </View>
          );
        };
        component = (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: "space-evenly",
              alignItems: "center"
            }}
            numColumns={2}
            data={imageResult.data}
            renderItem={renderData}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => {
              page = Number(imageResult.page) + 1;
              getImages({});
            }}
          />
        );
      }
    }
  }
  return (
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
  );
}

export default Home;
