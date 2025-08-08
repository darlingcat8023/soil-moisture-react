import {api_client} from "@/lib/http_client";
import {
  DataSourceSets,
  DateRangeSets,
  ObservationStationsGeoJSON,
} from "./response/data_response";
import {DataCompareRequest, DateRangeRequest} from "./request/data_request";

class DataService {
  public async getObservationStations(): Promise<ObservationStationsGeoJSON> {
    return await api_client.get<ObservationStationsGeoJSON>(
      "/api/observation/list",
      {}
    );
  }

  public async getDataBySets(
    request: DataCompareRequest
  ): Promise<DataSourceSets> {
    return await api_client.get<DataSourceSets>("/api/data/compare/bysource", {
      params: request,
    });
  }

  public async getDataByRange(
    request: DateRangeRequest
  ): Promise<DateRangeSets> {
    return await api_client.postJson<DateRangeSets>(
      "/api/data/compare/byrange",
      request,
      {}
    );
  }
}

export const dataService = new DataService();
