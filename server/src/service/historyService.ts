import fs from 'fs/promises';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


// TODO: Define a City class with name and id properties

class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = Date.now().toString();
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, '../../db/searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      console.error(error);
      throw new Error('Failed to read search history.');
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error(error);
      throw new Error('Failed to write to search history.');
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  public async getCities(): Promise<City[]> {
    try {
      return await this.read();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get cities.');
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  public async addCity(cityName: string): Promise<City> {
    try {
      const cities = await this.read();
      const newCity = new City(cityName);

      cities.push(newCity);
      await this.write(cities);

      return newCity;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add city.');
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

  public async removeCity(id: string): Promise<void> {
    try {
      const cities = await this.read();
      const updatedCities = cities.filter(city => city.id !== id);
      await this.write(updatedCities);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to remove city.');
    }
  }
}

export default new HistoryService();
