export interface ObservationStationProperties {
  observation_id: number;
  station_id: string;
  station_name: string;
  record_start_date: Date;
  record_end_date?: Date;
  elevation: string;
  data_depth: string;
  field_capacity: number;
  wilting_point: number;
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
  date: string;
  value: number;
  unit: string;
  is_fitting: number;
}

export interface DataSource {
  display_name: string;
  date_range: string[];
  data_depth: string;
  data_series: DataSeries[];
}

export interface DataStation {
  station_id: string;
  station_name: string;
  station_data_source: Record<string, DataSource>;
}

export interface DataSourceSets {
  stations: Record<string, DataStation>;
  notice: string[];
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface RangeData {
  date_range: DateRange;
  data_sources: Record<string, DataSource>;
}

export interface DateRangeSets {
  station_id: string;
  station_name: string;
  ranges: Record<string, RangeData>;
  notice: string[];
}
