import {api_client} from "@/lib/http_client";
import {
  DataSourceSets,
  ObservationStationsGeoJSON,
} from "./response/data_response";
import {DataCompareRequest} from "./request/data_request";

class DataService {
  public async getObservationStations(): Promise<ObservationStationsGeoJSON> {
    return await api_client.get<ObservationStationsGeoJSON>(
      "/api/observation/list",
      {}
    );
  }

  public async getObservationData(
    request: DataCompareRequest
  ): Promise<DataSourceSets> {
    return await api_client.get<DataSourceSets>("/api/data/compare/bysource", {
      params: request,
    });
  }
}

export const dataService = new DataService();
