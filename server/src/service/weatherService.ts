import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

// interface Coordinates {
//   lat: number;
//   lon: number;
// }
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey: string = process.env.API_KEY || '';

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}

  private async fetchWeatherData(city: string): Promise<any> {
    const url = `${this.baseURL}?q=${city}&appid=${this.apiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
// added forecastdata
  private async fetchForecastData(city: string): Promise<any[]> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching forecast data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.list;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}

  private parseCurrentWeather(response: any): Weather {
    const city = response.name;
    const date = new Date().toLocaleDateString();
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    const tempF = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;

    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast: Weather[] = weatherData.map((data: any) => {
      const date = new Date(data.dt * 1000).toLocaleDateString();
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const tempF = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;

      return new Weather(
        currentWeather.city,
        date,
        icon,
        iconDescription,
        tempF,
        windSpeed,
        humidity
      );
    });
    return forecast;
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const weatherData = await this.fetchWeatherData(city);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastData = await this.fetchForecastData(city);
      const forecastArray = this.buildForecastArray(currentWeather, forecastData);
      return [currentWeather, ...forecastArray];
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw new Error('Failed to get weather for city');
    }
  }
}

export default new WeatherService();
