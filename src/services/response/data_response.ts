export interface ObservationStationProperties {
  observation_id: number;
  station_id: string;
  station_name: string;
  record_start_date: Date;
  record_end_date?: Date;
  geo_hash?: string;
  elevation: string;
  data_depth: string;
}

export interface ObservationStationFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: ObservationStationProperties;
}

export interface ObservationStationsGeoJSON {
  type: "FeatureCollection";
  features: ObservationStationFeature[];
}

export interface DataSeries {
  date: Date;
  value: number;
  is_fitting: number;
}

export interface DataSource {
  name: string;
  data_depth: string;
  date_range: Date[];
  data_series: DataSeries[];
}

export interface DataSets {
  data_sources: DataSource[];
  notice: string[];
}
