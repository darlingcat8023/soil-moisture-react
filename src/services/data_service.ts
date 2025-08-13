import {api_client} from "@/lib/http_client";
import {
  DataSourceSets,
  DateRangeSets,
  ObservationStationsGeoJSON,
  StationStatisticalInfo,
} from "./response/data_response";
import {
  DataCompareRequest,
  DateRangeRequest,
  ObservationStatisticalRequest,
} from "./request/data_request";

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

  public async getStatisticalData(
    request: ObservationStatisticalRequest
  ): Promise<StationStatisticalInfo> {
    return await api_client.get<StationStatisticalInfo>(
      "/api/observation/statistic",
      {
        params: request,
      }
    );
  }
}

export const dataService = new DataService();
