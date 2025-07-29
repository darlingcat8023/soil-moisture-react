import {CompositeLayer} from "@deck.gl/core";
import {IconLayer, IconLayerProps} from "@deck.gl/layers";
import Supercluster from "supercluster";

import type {
  PointFeature,
  ClusterFeature,
  ClusterProperties,
} from "supercluster";
import type {UpdateParameters, PickingInfo} from "@deck.gl/core";

export type IconClusterLayerPickingInfo<DataT> = PickingInfo<
  DataT | (DataT & ClusterProperties),
  {
    objects?: DataT[];
    cluster?: {
      expansionZoom: number;
      center: [number, number];
    };
  }
>;

function getIconName(size: number): string {
  if (size === 0) {
    return "";
  }
  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`;
  }
  return "marker-100";
}

function getIconSize(size: number): number {
  return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer<
  DataT extends {[key: string]: any} = any,
  ExtraProps extends Record<string, any> = {}
> extends CompositeLayer<
  Required<IconLayerProps<DataT>> &
    ExtraProps & {
      onClickRef?: (info: PickingInfo<DataT>) => void;
      onHoverRef?: (info: PickingInfo<DataT>) => void;
      onViewChange?: (
        longitude: number,
        latitude: number,
        zoom: number
      ) => void;
    }
> {
  state!: {
    data: (PointFeature<DataT> | ClusterFeature<DataT>)[];
    index: Supercluster<DataT, DataT>;
    z: number;
  };

  shouldUpdateState({changeFlags}: UpdateParameters<this>) {
    return changeFlags.somethingChanged;
  }

  updateState({props, oldProps, changeFlags}: UpdateParameters<this>) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster<DataT, DataT>({
        maxZoom: 16,
        radius: props.sizeScale * Math.sqrt(2),
      });
      index.load(
        // @ts-ignore Supercluster expects proper GeoJSON feature
        (props.data as DataT[]).map((d) => ({
          geometry: {coordinates: (props.getPosition as Function)(d)},
          properties: d,
        }))
      );
      this.setState({index});
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z,
      });
    }
  }

  getClusterExpansionZoom(clusterId: number): number {
    return this.state.index.getClusterExpansionZoom(clusterId);
  }

  getClusterCenter(cluster: ClusterFeature<DataT>): [number, number] {
    return cluster.geometry.coordinates as [number, number];
  }

  getPickingInfo({
    info,
    mode,
  }: {
    info: PickingInfo<PointFeature<DataT> | ClusterFeature<DataT>>;
    mode: string;
  }): IconClusterLayerPickingInfo<DataT> {
    const pickedObject = info.object?.properties;
    if (pickedObject) {
      let objects: DataT[] | undefined;
      if (pickedObject.cluster) {
        objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map((f) => f.properties);
      }
      return {
        ...info,
        object: pickedObject,
        objects,
        cluster: pickedObject.cluster
          ? {
              expansionZoom: this.getClusterExpansionZoom(
                pickedObject.cluster_id
              ),
              center: this.getClusterCenter(
                info.object as ClusterFeature<DataT>
              ),
            }
          : undefined,
      };
    }
    return {...info, object: undefined};
  }

  onClick(info: PickingInfo, pickingEvent: any): boolean {
    const {onClickRef, onViewChange} = this.props;
    const clusterInfo = this.getPickingInfo({info, mode: "click"});
    if (clusterInfo.cluster) {
      onViewChange?.(
        clusterInfo.cluster.center[0],
        clusterInfo.cluster.center[1],
        Math.min(clusterInfo.cluster.expansionZoom, 16)
      );
    } else {
      onClickRef?.(info);
    }
    return true;
  }

  onHover(info: PickingInfo, pickingEvent: any): boolean {
    const {onHoverRef} = this.props;
    const clusterInfo = this.getPickingInfo({info, mode: "click"});
    if (clusterInfo.cluster) {
      return false;
    } else {
      onHoverRef?.(info);
      return true;
    }
  }

  renderLayers() {
    const {data} = this.state;
    const {iconAtlas, iconMapping, sizeScale} = this.props;

    return new IconLayer<PointFeature<DataT> | ClusterFeature<DataT>>(
      {
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: (d) => d.geometry.coordinates as [number, number],
        getIcon: (d) =>
          getIconName(d.properties.cluster ? d.properties.point_count : 1),
        getSize: (d) =>
          getIconSize(d.properties.cluster ? d.properties.point_count : 1),
      },
      this.getSubLayerProps({
        id: "icon",
      })
    );
  }
}
