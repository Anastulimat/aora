import {useState} from "react";
import {useVideoPlayer, VideoView} from "expo-video";
import * as Animatable from "react-native-animatable";
import {FlatList, Image, ImageBackground, TouchableOpacity, View, StyleSheet} from "react-native";
import {icons} from "../constants";

const zoomIn = {0: {scale: 0.9}, 1: {scale: 1.1}};
const zoomOut = {0: {scale: 1}, 1: {scale: 0.9}};

const TrendingItem = ({activeItem, item}) => {
    const [play, setPlay] = useState(false);
    const player = useVideoPlayer(item.video, (player) => {
        player.loop = false;
        player.play();
    });

    return (
        <Animatable.View animation={activeItem === item.$id ? zoomIn : zoomOut} duration={500}
                         style={{marginRight: 20}}>
            {play ? (
                <View style={styles.videoContainer}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        allowsFullscreen
                        allowsPictureInPicture
                    />
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.thumbnailContainer}
                    activeOpacity={0.7}
                    onPress={() => {
                        setPlay(true);
                        player.play();
                    }}
                >
                    <ImageBackground source={{uri: item.thumbnail}} style={styles.thumbnail} resizeMode="cover"/>
                    <Image source={icons.play} style={styles.playIcon} resizeMode="contain"/>
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

const Trending = ({posts}) => {
    const [activeItem, setActiveItem] = useState(posts[0]?.$id || "");

    const viewableItemsChanged = ({viewableItems}) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    };

    return (
        <FlatList
            data={posts}
            horizontal
            keyExtractor={(item) => item.$id}
            renderItem={({item}) => <TrendingItem activeItem={activeItem} item={item}/>}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{itemVisiblePercentThreshold: 70}}
            contentOffset={{x: 170}}
        />
    );
};

const styles = StyleSheet.create({
    videoContainer: {
        width: 200,
        height: 300,
        borderRadius: 20,
        marginTop: 10,
        overflow: "hidden",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    thumbnailContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    thumbnail: {
        width: 200,
        height: 300,
        borderRadius: 20,
        overflow: "hidden",
    },
    playIcon: {
        width: 50,
        height: 50,
        position: "absolute",
    },
});

export default Trending;
