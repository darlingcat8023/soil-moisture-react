import {api_client} from "@/lib/http_client";
import {DataSets, ObservationStationsGeoJSON} from "./response/data_response";
import {DataCompareRequest} from "./request/data_request";

class DataService {
  public async getObservationStations(): Promise<ObservationStationsGeoJSON> {
    return await api_client.get<ObservationStationsGeoJSON>(
      "/api/data/observation/list",
      {}
    );
  }

  public async getObservationData(
    request: DataCompareRequest
  ): Promise<DataSets> {
    return await api_client.get<DataSets>("/api/data/observation/data", {
      params: request,
    });
  }
}

export const dataService = new DataService();
