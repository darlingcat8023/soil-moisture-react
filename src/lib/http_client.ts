import config from "@/config";
import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

class APIClient {
  private client_instance: AxiosInstance;

  constructor() {
    this.client_instance = this.createInstance(config.apiBase);
  }

  private createInstance(base: string): AxiosInstance {
    const client = axios.create({
      baseURL: base,
      timeout: 10000,
    });
    return client;
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client_instance.get<T>(url, config);
    return response.data;
  }

  public async postJson<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client_instance.post<T>(url, data, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });
    return response.data;
  }

  public async postForm<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client_instance.post<T>(url, data, {
      ...config,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...config?.headers,
      },
    });
    return response.data;
  }
}

export const api_client = new APIClient();
