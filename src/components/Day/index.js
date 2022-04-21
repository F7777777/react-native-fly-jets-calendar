import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { height } from "../../modules";

const Day = ({
  selected,
  disabled,
  select,
  selectedStyle,
  selectedTextStyle,
  disabledStyle,
  dayStyle,
  dayTextStyle,
  disabledTextStyle,
  empty,
  date,
}) => {
  const selectThis = () => {
    if (!disabled) {
      select(date);
    }
  };
  const dayStyles = {
    ...styles.day,
    ...dayStyle,
  };
  const dayTextStyles = {
    ...styles.dayText,
    ...dayTextStyle,
  };
  const disabledStyles = {
    ...styles.disabled,
    ...disabledStyle,
  };
  const disabledTextStyles = {
    ...styles.disabledText,
    ...disabledTextStyle,
  };
  const selectedStyles = {
    ...styles.selected,
    ...selectedStyle,
  };
  const selectedTextStyles = {
    ...styles.selectedText,
    ...selectedTextStyle,
  };
  return (
    <TouchableOpacity
      style={styles.dayContainer}
      key={"day-" + date.unix()}
      onPress={empty ? null : selectThis}
    >
      <View
        style={{
          ...dayStyles,
          ...(selected && selectedStyles),
          ...(disabled && disabledStyles),
        }}
      >
        <Text
          style={{
            ...dayTextStyles,
            ...(selected && selectedTextStyles),
            ...(disabled && disabledTextStyles),
          }}
        >
          {date.format("D")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  dayContainer: {
    flexGrow: 1,
    height: height * 0.065,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  day: {
    flexGrow: 1,
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    width: 20,
    textAlign: "center",
    color: "black",
  },
  selected: {
    backgroundColor: "#3b83f7",
    height: "80%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    color: "white",
  },
  disabledText: {
    opacity: 0.3,
  },
  disabled: {},
});
