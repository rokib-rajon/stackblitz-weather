export interface WeatherData {
  properties: {
    timeseries: Array<{
      time: string;
      data: {
        instant: {
          details: {
            air_temperature: number;
            relative_humidity: number;
            wind_speed: number;
            wind_from_direction: number;
          };
        };
        next_1_hours?: {
          summary: {
            symbol_code: string;
          };
          details: {
            precipitation_amount: number;
          };
        };
      };
    }>;
  };
}

export interface WeatherError {
  message: string;
  code?: number;
}