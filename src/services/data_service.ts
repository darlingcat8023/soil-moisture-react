import {api_client} from "@/lib/http_client";

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

class DataServive {
  public async getObservationStations(): Promise<ObservationStationsGeoJSON> {
    return await api_client.get<ObservationStationsGeoJSON>(
      "/api/data/observation/list",
      {}
    );
  }
}
