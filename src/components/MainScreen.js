import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import axios from 'axios';

locationIQkey = 'fb9f3683ba3b81';
city = 'budapest';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    // set states for fields so they could be rendered later on
    this.state = {
      locate: '',
      temp: '-',
      cond: '',
      low: '',
      high: '',
      cloud: '',
      message: '',
      forecast: [],
      rainPercentage: '',
      sunriseTime: '',
      sunsetTime: '',
      dayOne: '',
      dayTwo: '',
      dayThree: '',
      dayFour: '',
      dayFive: '',
      daySix: '',
      daySeven: '',
      dayEight: '',
      dayNine: '',
      dayTen: '',
      dayEleven: '',
      dayTwelve: '',
      value: 'London',
      allData: {},
      weeklyWeather: {},
      lat: 0,
      lon: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchAllData = this.fetchAllData.bind(this);
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.fetchWeeklyWeatherData = this.fetchWeeklyWeatherData.bind(this);
  }

  parseResponse(parsed_json) {
    var location = parsed_json.name;
    var temp_c = parsed_json.main.temp;
    var conditions = parsed_json.weather[0].description;
    var temp_min = parsed_json.main.temp_min;
    var temp_max = parsed_json.main.temp_max;
    var clouds = parsed_json.clouds.all;
    var sunrise = parsed_json.sys.sunrise;
    var sunset = parsed_json.sys.sunset;
    var rain = 0;

    // set states for fields so they could be rendered later on
    this.setState({
      locate: location,
      temp: temp_c,
      cond: conditions,
      low: temp_min,
      high: temp_max,
      cloud: clouds,
      message: '',
      forecast: [],
      rainPercentage: rain,
      sunriseTime: sunrise,
      sunsetTime: sunset,
    });
  }

  parseWeekResponse(parsed_json) {
    var dayOne = Math.round(parsed_json.list[1].main.temp);
    var dayTwo = Math.round(parsed_json.list[2].main.temp);
    var dayThree = Math.round(parsed_json.list[3].main.temp);
    var dayFour = Math.round(parsed_json.list[4].main.temp);
    var dayFive = Math.round(parsed_json.list[5].main.temp);
    var daySix = Math.round(parsed_json.list[6].main.temp);
    var daySeven = Math.round(parsed_json.list[7].main.temp);
    var dayEight = Math.round(parsed_json.list[8].main.temp);
    var dayNine = Math.round(parsed_json.list[9].main.temp);
    var dayTen = Math.round(parsed_json.list[10].main.temp);
    var dayEleven = Math.round(parsed_json.list[11].main.temp);
    var dayTwelve = Math.round(parsed_json.list[12].main.temp);
    this.setState({
      dayOne: dayOne,
      dayTwo: dayTwo,
      dayThree: dayThree,
      dayFour: dayFour,
      dayFive: dayFive,
      daySix: daySix,
      daySeven: daySeven,
      dayEight: dayEight,
      dayNine: dayNine,
      dayTen: dayTen,
      dayEleven: dayEleven,
      dayTwelve: dayTwelve,
    });
  }

  handleChange = text => {
    this.setState({ value: text });
  };

  async handleSubmit(event) {
    this.fetchAllData(this.state.value);
  }

  async fetchWeatherData(city) {
    // API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
    try {
      var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=a34c043683201d4526b5ff31a18c0d53`;
      const response = await axios.get(url);
      this.setState({
        allData: response.data,
      });
      this.parseResponse(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchWeeklyWeatherData(city) {
    /*		var weeklyurl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=a9ab5f92919286301907695dec776ea7`;
		$.ajax({
			url: weeklyurl,
			dataType: 'jsonp',
			success: this.parseWeekResponse,
			error: function(req, err) {
				console.log('API call failed ' + err);
			},
		});
		// once the data grabbed, hide the button
        this.setState({ display: false });
        */
    try {
      var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=a34c043683201d4526b5ff31a18c0d53`;
      const response = await axios.get(url);
      this.setState({
        weeklyWeather: response.data,
      });
      this.parseWeekResponse(response.data);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  fetchAllData(city) {
    this.fetchWeeklyWeatherData(city);
    this.fetchWeatherData(city);
  }

  async componentDidMount() {
    try {
      navigator.geolocation.getCurrentPosition(position => {
        var lat = Math.round(position.coords.latitude);
        var lon = Math.round(position.coords.longitude);
        this.setState({
          lat: lat,
          lon: lon,
        });
      });
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${
          this.state.lat
        }&lon=${this.state.lon}&appid=a34c043683201d4526b5ff31a18c0d53`
      );
      this.setState({
        allData: response.data,
      });
      this.parseResponse(response.data);
      this.fetchWeeklyWeatherData(response.data.name);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // CONVERT DATA
    var sunriseTimeFormat = new Date(this.state.sunriseTime * 1000);
    var sunsetTimeFormat = new Date(this.state.sunsetTime * 1000);
    var sunriseDateHours = sunriseTimeFormat.getHours();
    var sunriseDateMinutes = sunriseTimeFormat.getMinutes();
    sunriseDateMinutes =
      sunriseDateMinutes > 9 ? sunriseDateMinutes : '0' + sunriseDateMinutes;
    var sunsetDateHours = sunsetTimeFormat.getHours();
    var sunseteDateMinutes = sunsetTimeFormat.getMinutes();
    sunseteDateMinutes =
      sunseteDateMinutes > 9 ? sunseteDateMinutes : '0' + sunseteDateMinutes;
    var sunriseTime = sunriseDateHours + ':' + sunseteDateMinutes;
    var sunsetTime = sunsetDateHours + ':' + sunseteDateMinutes;
    var low = Math.round(this.state.low) + '°';
    var high = Math.round(this.state.high) + '°';
    var temp = Math.round(this.state.temp);
    let todaysDay = [
      'Sunday',
      'Monday',
      'Tueday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][new Date().getDay()];
    var message = 'Beautiful day for photography';
    var today = new Date();
    var time = today.getHours();

    return JSON.stringify(this.state.weeklyWeather) === '{}' ? (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {time > sunriseDateHours && time < sunsetDateHours ? (
            <Image
              source={require('../assets/Sun.png')}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Image
              source={require('../assets/Blood.png')}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          <Text style={styles.textCloud}>Loading....</Text>
        </View>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {time > sunriseDateHours && time < sunsetDateHours ? (
            <Image
              source={require('../assets/Sun.png')}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Image
              source={require('../assets/Blood.png')}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          <TextInput
            placeholder={this.state.locate}
            style={styles.textInput}
            placeholderTextColor="rgba(155,155,155,1)"
            onChangeText={this.handleChange}
            onSubmitEditing={this.handleSubmit}
          />
          <Text style={styles.textLow}>Low</Text>
          <Text style={styles.textHigh}>High</Text>
          <Text style={styles.textTemp}>{temp}°C</Text>
          <Text style={styles.textLowTemp}>{low}</Text>
          <Text style={styles.textHighTemp}>{high}</Text>

          <Image
            source={require('../assets/clouds-512.png')}
            style={styles.cloudImg}
          />
          <Text style={styles.textCloud}>Cloud cover:</Text>
          <Text style={styles.textCloudTemp}>{this.state.cloud} %</Text>

          <Image
            source={require('../assets/rain-512.png')}
            style={styles.rainImg}
          />
          <Text style={styles.textRain}>Chance of rain:</Text>
          <Text style={styles.textRainTemp}>{this.state.rainPercentage} %</Text>

          <Image
            source={require('../assets/camera.png')}
            style={styles.cameraImg}
          />
          <Text style={styles.textCamera}>{message}</Text>

          <Text style={styles.sunrise}>Sunrise:</Text>
          <Text style={styles.sunriseTime}>{sunriseTime}</Text>
          <Text style={styles.sunset}>Sunset:</Text>
          <Text style={styles.sunsetTime}>{sunsetTime}</Text>

          <View style={styles.scrollViewHolder}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Text style={styles.scrollitem}>
                +3 Hours{'\n'}
                {this.state.dayOne}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +6 Hours{'\n'}
                {this.state.dayTwo}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +9 Hours{'\n'}
                {this.state.dayThree}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +12 Hours{'\n'}
                {this.state.dayFour}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +15 Hours{'\n'}
                {this.state.dayFive}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +18 Hours{'\n'}
                {this.state.daySix}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +21 Hours{'\n'}
                {this.state.daySeven}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +24 Hours{'\n'}
                {this.state.dayEight}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +27 Hours{'\n'}
                {this.state.dayNine}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +30 Hours{'\n'}
                {this.state.dayTen}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +33 Hours{'\n'}
                {this.state.dayEleven}°C
              </Text>
              <View style={styles.separator} />
              <Text style={styles.scrollitem}>
                +36 Hours{'\n'}
                {this.state.dayTwelve}°C
              </Text>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textLow: {
    top: 80,
    position: 'absolute',
    paddingLeft: 10,
    backgroundColor: 'transparent',
    fontSize: 30,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    left: 0,
  },
  textHigh: {
    top: 80,
    position: 'absolute',
    paddingRight: 10,
    backgroundColor: 'transparent',
    fontSize: 30,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    right: 0,
  },
  textTemp: {
    top: 80,
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 60,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
  },
  textLowTemp: {
    top: 120,
    position: 'absolute',
    paddingLeft: 10,
    backgroundColor: 'transparent',
    fontSize: 30,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    left: 0,
  },

  textHighTemp: {
    top: 120,
    position: 'absolute',
    paddingRight: 10,
    backgroundColor: 'transparent',
    fontSize: 30,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    right: 0,
  },

  textInput: {
    height: 51,
    width: '100%',
    top: 20,
    position: 'absolute',
    fontFamily: 'AvenirNext-BoldItalic',
    fontSize: 40,
    color: 'rgba(255,255,255,1)',
    textAlign: 'center',
  },
  cloudImg: {
    height: 30,
    width: 30,
    top: 200,
    left: 0,
    marginLeft: 10,
    position: 'absolute',
  },

  textCloud: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    top: 200,
  },
  textCloudTemp: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingRight: 10,
    right: 0,
    top: 200,
  },

  rainImg: {
    height: 30,
    width: 30,
    left: 0,
    marginLeft: 10,
    position: 'absolute',
    top: 240,
  },

  textRain: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    top: 240,
  },

  textRainTemp: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingRight: 10,
    right: 0,
    top: 240,
  },
  cameraImg: {
    height: 30,
    width: 30,
    left: 0,
    marginLeft: 10,
    position: 'absolute',
    top: 280,
  },

  textCamera: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingRight: 10,
    right: 0,
    top: 280,
  },

  sunrise: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingLeft: 10,
    left: 0,
    top: 340,
  },

  sunriseTime: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingLeft: 10,
    left: 0,
    top: 365,
  },

  sunset: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingRight: 10,
    right: 0,
    top: 340,
  },

  sunsetTime: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'AvenirNext-BoldItalic',
    color: 'rgba(255,255,255,1)',
    paddingRight: 10,
    right: 0,
    top: 365,
  },

  scrollViewHolder: {
    flex: 1,
    position: 'absolute',
    borderTopWidth: 2,
    backgroundColor: 'rgba(45, 38, 90, 0.3)',
    borderBottomWidth: 2,
    borderTopColor: 'rgba(45, 38, 90,0.5)',
    borderBottomColor: 'rgba(45, 38, 90,0.5)',
    top: 450,
  },

  scrollitem: {
    padding: 15,
    color: 'white',
    fontSize: 18,
  },

  separator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
