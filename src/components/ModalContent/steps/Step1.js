import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
const { width } = Dimensions.get("window");
const ITEM_HEIGHT = 36; // Height of each picker item

const TimePickerScreen = ({ onNext }) => {
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [meridian, setMeridian] = useState("AM");

  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);
  const meridianListRef = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const meridians = ["AM", "PM"];

  const centerHighlightStyle = { top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT };

  const scrollToItem = (ref, index) => {
    ref.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
  };

  const handleScrollEnd = (event, setSelected, ref, data) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setSelected(data[index]);
    scrollToItem(ref, index);
  };

  const renderPickerItem = (item, selectedValue) => (
    <Text
      style={[
        styles.timeText,
        item === selectedValue && styles.selectedText,
      ]}
    >
      {item.toString().padStart(2, "0")}
    </Text>
  );

  useEffect(() => {
    scrollToItem(hourListRef, hours.indexOf(selectedHour));
    scrollToItem(minuteListRef, selectedMinute);
    scrollToItem(meridianListRef, meridians.indexOf(meridian));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>1/5</Text>
          <View style={styles.dotsContainer}>
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === 0 && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Picker Section */}
      <View style={styles.pickerContainer}>
        <Text style={styles.title}>Time of Birth</Text>
        <View style={{backgroundColor:"#F9F9F9",paddingVertical:10,marginVertical:15,marginHorizontal:-20 }}>
        <Text style={styles.timeDisplay}>
          {`${selectedHour.toString().padStart(2, "0")}:${selectedMinute
            .toString()
            .padStart(2, "0")} ${meridian}`}
        </Text>
        </View>

        <View style={styles.timePicker}>
          {/* Center Highlight */}
          <View style={[styles.centerHighlight, centerHighlightStyle]} />

          {/* Hour Picker */}
          <FlatList
            ref={hourListRef}
            data={hours}
            keyExtractor={(item) => item.toString()}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={(e) =>
              handleScrollEnd(e, setSelectedHour, hourListRef, hours)
            }
            onMomentumScrollEnd={(e) =>
              handleScrollEnd(e, setSelectedHour, hourListRef, hours)
            }
            renderItem={({ item }) => renderPickerItem(item, selectedHour)}
            contentContainerStyle={styles.columnStyle}
          />

          {/* Minute Picker */}
          <FlatList
            ref={minuteListRef}
            data={minutes}
            keyExtractor={(item) => item.toString()}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={(e) =>
              handleScrollEnd(e, setSelectedMinute, minuteListRef, minutes)
            }
            onMomentumScrollEnd={(e) =>
              handleScrollEnd(e, setSelectedMinute, minuteListRef, minutes)
            }
            renderItem={({ item }) => renderPickerItem(item, selectedMinute)}
            contentContainerStyle={styles.columnStyle}
          />

          {/* Meridian Picker */}
          <FlatList
            ref={meridianListRef}
            data={meridians}
            keyExtractor={(item) => item}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={(e) =>
              handleScrollEnd(e, setMeridian, meridianListRef, meridians)
            }
            onMomentumScrollEnd={(e) =>
              handleScrollEnd(e, setMeridian, meridianListRef, meridians)
            }
            renderItem={({ item }) => renderPickerItem(item, meridian)}
            contentContainerStyle={styles.columnStyle}
          />
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
    marginHorizontal: 16,
    position:'absolute',
    right:0,
    
  },
  stepContainer: {
    alignItems: "flex-end",
    
  },
  stepText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    fontFamily:'Lexend-Medium'

  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: "#FF6A00",
    width: 8,
    height:8,
  },
  pickerContainer: {
    marginVertical: "20%",
  
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginLeft: 10,
    fontFamily:'Lexend-Medium'


  },
  timeDisplay: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: 30,
    alignContent:'center',
    justifyContent:'center',
    fontFamily:'Lexend-Medium'

  },
  timePicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: ITEM_HEIGHT * 5,
  },
  columnStyle: {
    paddingVertical: ITEM_HEIGHT * 2, // Matches centerHighlight offset
  },
  timeText: {
    fontSize: 20,
    color: "#C4C4C4",
    textAlign: "center",
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
    fontFamily:'Lexend-Regular'

  },
  selectedText: {
    fontSize: 22,
    color: "#000",
    fontFamily:'Lexend-Medium'

  },
  centerHighlight: {
    position: "absolute",
    width: "130%",
    backgroundColor: "rgba(200,200,200,0.2)",
    zIndex: 1,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: "center",
    marginTop:"20%"

  },
  nextButton: {
    backgroundColor: "#FF6A00",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 24,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily:'Lexend-Medium'
  },
});

export default TimePickerScreen;
