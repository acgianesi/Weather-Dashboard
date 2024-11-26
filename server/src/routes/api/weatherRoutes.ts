import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
const router = Router();

// done: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // done: GET weather data from city name
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required.' });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // done: save city to search history
    const savedCity = await HistoryService.addCity(cityName);
    return res.status(200).json({
      message: 'Weather data fetched and city saved to history.',
      weatherData,
      savedCity,
    });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: 'Error fetching weather data.', error });
  }
});

// done: GET search history
router.get('/history', async (_,res) => {
  try{
    const searchHistory = await HistoryService.getCities();
   res.status(200).json(searchHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving search history.', error });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => { });

export default router;
