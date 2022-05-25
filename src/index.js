import momentDefault from "moment";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import Button from "./components/Button";
import Day from "./components/Day";
import Header from "./components/Header";
import { height, width } from "./modules";
import chevronL from "./assets/chevronL.png";
import chevronR from "./assets/chevronR.png";

const DateRangePicker = ({
  moment,
  startDate,
  endDate,
  onChange,
  displayedDate,
  minDate,
  date,
  maxDate,
  range,
  dayHeaderTextStyle,
  dayHeaderStyle,
  backdropStyle,
  containerStyle,
  selectedStyle,
  selectedTextStyle,
  disabledStyle,
  dayStyle,
  dayAnotherMonthStyle,
  dayTextStyle,
  disabledTextStyle,
  headerTextStyle,
  monthButtonsStyle,
  headerStyle,
  monthPrevButton,
  monthNextButton,
  children,
  buttonContainerStyle,
  buttonStyle,
  buttonTextStyle,
  presetButtons,
  open,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [dayHeaders, setDayHeaders] = useState([]);
  const _moment = moment || momentDefault;
  const mergedStyles = {
    backdrop: {
      ...styles.backdrop,
      ...backdropStyle,
    },
    container: {
      ...styles.container,
      ...containerStyle,
    },
    header: {
      ...styles.header,
      ...headerStyle,
    },
    headerText: {
      ...styles.headerText,
      ...headerTextStyle,
    },
    monthButtons: {
      ...styles.monthButtons,
      ...monthButtonsStyle,
    },
    buttonContainer: {
      ...styles.buttonContainer,
      ...buttonContainerStyle,
    },
  };

  const _onOpen = () => {
    if (typeof open !== "boolean") {
      onOpen();
    }
  };

  const _onClose = () => {
    if (typeof open !== "boolean") {
      onClose();
    }
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelecting(false);
    if (!endDate) {
      onChange({
        endDate: startDate,
      });
    }
  };

  const previousMonth = () => {
    onChange({
      displayedDate: _moment(displayedDate).subtract(1, "months"),
    });
  };

  const nextMonth = () => {
    onChange({
      displayedDate: _moment(displayedDate).add(1, "months"),
    });
  };

  const selected = useCallback((_date, _startDate, _endDate, __date) => {
    return (
      (_startDate &&
        _endDate &&
        _date.isBetween(_startDate, _endDate, null, "[]")) ||
      (_startDate && _date.isSame(_startDate, "day")) ||
      (_endDate && _date.isSame(_endDate, "day"))
    );
  }, []);

  const getRangeDayClass = useCallback(
    (_date, _startDate, _endDate, __date) => {
      if (
        !_endDate ||
        _endDate?.format("Y-M-D") === _startDate?.format("Y-M-D")
      ) {
        return {};
      }

      if (_startDate && _date.isSame(_startDate, "day")) {
        switch (_date.isoWeekday()) {
          case 1:
            return styles.rangeStart;
            break;
          case 7:
            return {};
            break;
          default:
            return styles.rangeStart;
            break;
        }
      }

      if (_endDate && _date.isSame(_endDate, "day")) {
        switch (_date.isoWeekday()) {
          case 1:
            return {};
            break;
          case 7:
            return styles.rangeEnd;
            break;
          default:
            return styles.rangeEnd;
            break;
        }
      }

      if (
        _startDate &&
        _endDate &&
        _date.isBetween(_startDate, _endDate, null, "[]")
      ) {
        switch (_date.isoWeekday()) {
          case 1:
            return styles.rangeStart;
            break;
          case 7:
            return styles.rangeEnd;
            break;
          default:
            return styles.rangeBetween;
            break;
        }
      }
    },
    []
  );

  const disabled = useCallback((_date, _minDate, _maxDate) => {
    return (
      (_minDate && _date.isBefore(_minDate, "day")) ||
      (_maxDate && _date.isAfter(_maxDate, "day"))
    );
  }, []);

  const today = () => {
    if (range) {
      setSelecting(true);
      onChange({
        date: null,
        startDate: _moment(),
        endDate: null,
        selecting: true,
        displayedDate: _moment(),
      });
    } else {
      setSelecting(false);
      onChange({
        date: _moment(),
        startDate: null,
        endDate: null,
        displayedDate: _moment(),
      });
    }
  };

  const thisWeek = () => {
    setSelecting(false);
    onChange({
      date: null,
      startDate: _moment().startOf("week"),
      endDate: _moment().endOf("week"),
      displayedDate: _moment(),
    });
  };

  const thisMonth = () => {
    setSelecting(false);
    onChange({
      date: null,
      startDate: _moment().startOf("month"),
      endDate: _moment().endOf("month"),
      displayedDate: _moment(),
    });
  };

  const select = useCallback(
    (_date) => {
      if (range) {
        if (selecting) {
          if (_date.isBefore(startDate, "day")) {
            setSelecting(true);
            onChange({ startDate: _date });
          } else {
            setSelecting(!selecting);
            onChange({ endDate: _date });
          }
        } else {
          setSelecting(!selecting);
          onChange({
            date: null,
            endDate: null,
            startDate: _date,
          });
        }
      } else {
        onChange({
          date: _date,
          startDate: null,
          endDate: null,
        });
      }
    },
    [_moment, displayedDate, onChange, range, selecting, startDate]
  );

  useEffect(() => {
    if (typeof open === "boolean") {
      if (open && !isOpen) {
        onOpen();
      } else if (!open && isOpen) {
        onClose();
      }
    }
  }, [open]);

  useEffect(() => {
    function populateHeaders() {
      let _dayHeaders = [];
      for (let i = 0; i <= 6; ++i) {
        let day = _moment(displayedDate).weekday(i).format("dddd").substr(0, 2);
        _dayHeaders.push(
          <Header
            key={`dayHeader-${i}`}
            day={day}
            index={i}
            dayHeaderTextStyle={dayHeaderTextStyle}
            dayHeaderStyle={dayHeaderStyle}
          />
        );
      }
      return _dayHeaders;
    }

    function populateWeeks() {
      let _weeks = [];
      let week = [];
      let daysInMonth = displayedDate.daysInMonth();
      let startOfMonth = _moment(displayedDate).set("date", 1);
      let offset = startOfMonth.weekday();
      week = week.concat(
        Array.from({ length: offset }, (x, i) => {
          let _date = _moment(displayedDate)
            .set("date", i + 1)
            .add(-offset, "day");
          let _selected = selected(_date, startDate, endDate, date);
          let _rangeStyle = getRangeDayClass(_date, startDate, endDate, date);
          let _disabled = disabled(_date, minDate, maxDate);
          return (
            <Day
              key={_date.format("Y-M-D")}
              selectedStyle={{ ...selectedStyle, ..._rangeStyle }}
              selectedTextStyle={selectedTextStyle}
              disabledStyle={disabledStyle}
              dayStyle={dayStyle}
              dayTextStyle={{ ...dayTextStyle, ...dayAnotherMonthStyle }}
              disabledTextStyle={disabledTextStyle}
              selected={_selected}
              disabled={_disabled}
              select={select}
              date={_date}
            />
          );
        })
      );
      for (let i = 1; i <= daysInMonth; ++i) {
        let _date = _moment(displayedDate).set("date", i);
        let _selected = selected(_date, startDate, endDate, date);
        let _rangeStyle = getRangeDayClass(_date, startDate, endDate, date);
        let _disabled = disabled(_date, minDate, maxDate);

        week.push(
          <Day
            key={_date.format("Y-M-D")}
            selectedStyle={{ ...selectedStyle, ..._rangeStyle }}
            selectedTextStyle={selectedTextStyle}
            disabledStyle={disabledStyle}
            dayStyle={dayStyle}
            dayTextStyle={dayTextStyle}
            disabledTextStyle={disabledTextStyle}
            selected={_selected}
            disabled={_disabled}
            select={select}
            date={_date}
          />
        );
        if ((i + offset) % 7 === 0 || i === daysInMonth) {
          if (week.length < 7) {
            week = week.concat(
              Array.from({ length: 7 - week.length }, (x, index) => {
                let _date = _moment(displayedDate)
                  .set("date", index + 1)
                  .add(1, "month");
                let _selected = selected(_date, startDate, endDate, date);
                let _rangeStyle = getRangeDayClass(
                  _date,
                  startDate,
                  endDate,
                  date
                );
                let _disabled = disabled(_date, minDate, maxDate);

                return (
                  <Day
                    key={_date.format("Y-M-D")}
                    selectedStyle={{ ...selectedStyle, ..._rangeStyle }}
                    selectedTextStyle={selectedTextStyle}
                    disabledStyle={disabledStyle}
                    dayStyle={dayStyle}
                    dayTextStyle={{ ...dayTextStyle, ...dayAnotherMonthStyle }}
                    disabledTextStyle={disabledTextStyle}
                    selected={_selected}
                    disabled={_disabled}
                    select={select}
                    date={_date}
                  />
                );
              })
            );
          }
          _weeks.push(
            <View key={"weeks-" + i} style={styles.week}>
              {week}
            </View>
          );
          week = [];
        }
      }
      return _weeks;
    }

    function populate() {
      let _dayHeaders = populateHeaders();
      let _weeks = populateWeeks();
      setDayHeaders(_dayHeaders);
      setWeeks(_weeks);
    }

    populate();
  }, [
    startDate,
    endDate,
    date,
    _moment,
    displayedDate,
    dayHeaderTextStyle,
    dayHeaderStyle,
    selected,
    disabled,
    minDate,
    maxDate,
    selectedStyle,
    selectedTextStyle,
    disabledStyle,
    dayStyle,
    dayTextStyle,
    disabledTextStyle,
    select,
  ]);

  return (
    <View style={mergedStyles.container}>
      <View style={mergedStyles.header}>
        <TouchableOpacity
          style={styles.monthButtonContainer}
          onPress={previousMonth}
        >
          {monthPrevButton || (
            <Image
              resizeMode="contain"
              style={mergedStyles.monthButtons}
              source={chevronL}
            />
          )}
        </TouchableOpacity>
        <Text
          style={mergedStyles.headerText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {displayedDate.format("MMMM")}
        </Text>
        <TouchableOpacity
          style={styles.monthButtonContainer}
          onPress={nextMonth}
        >
          {monthNextButton || (
            <Image
              resizeMode="contain"
              style={mergedStyles.monthButtons}
              source={chevronR}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.calendar}>
        {dayHeaders && (
          <View style={styles.dayHeaderContainer}>{dayHeaders}</View>
        )}
        {weeks}
      </View>
      {presetButtons && (
        <View style={mergedStyles.buttonContainer}>
          <Button
            buttonStyle={buttonStyle}
            buttonTextStyle={buttonTextStyle}
            onPress={today}
          >
            Today
          </Button>
          {range && (
            <>
              <Button
                buttonStyle={buttonStyle}
                buttonTextStyle={buttonTextStyle}
                onPress={thisWeek}
              >
                This Week
              </Button>
              <Button
                buttonStyle={buttonStyle}
                buttonTextStyle={buttonTextStyle}
                onPress={thisMonth}
              >
                This Month
              </Button>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default DateRangePicker;

DateRangePicker.defaultProps = {
  dayHeaders: true,
  range: false,
  buttons: false,
  presetButtons: false,
};

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  displayedDate: PropTypes.object,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  backdropStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  headerTextStyle: PropTypes.object,
  monthButtonsStyle: PropTypes.object,
  dayTextStyle: PropTypes.object,
  dayStyle: PropTypes.object,
  headerStyle: PropTypes.object,
  buttonTextStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  buttonContainerStyle: PropTypes.object,
  presetButtons: PropTypes.bool,
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: width,
  },
  closeTrigger: {
    width: width,
    height: height,
  },
  closeContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  calendar: {
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    minHeight: 400,
  },
  headerText: {
    fontSize: 16,
    color: "black",
    flexBasis: 50,
    flexGrow: 1,
    textAlign: "center",
  },
  monthButtons: {
    fontSize: 16,
    color: "black",
    width: 32,
    height: 32,
  },
  dayHeaderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 10,
  },
  week: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  rangeBetween: {
    borderRadius: 0,
  },
  rangeStart: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rangeEnd: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  monthButtonContainer: {
    flexGrow: 1,
    flexBasis: 50,
  },
});
