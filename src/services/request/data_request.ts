export interface DataCompareRequest {
  station_id: string[];
  start_date: string;
  end_date: string;
  data_source: string[];
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface DateRangeRequest {
  station_id: string;
  first_range: DateRange;
  second_range: DateRange;
  data_source: string[];
}

export interface ObservationStatisticalRequest {
  station_id: string;
  years: string[];
}
