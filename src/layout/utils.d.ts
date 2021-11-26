type Extent = [min: number, max: number];

export type GraphExtent = {
  x: Extent;
  y: Extent;
};

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Camera extends Coordinates {
  angle: number;
  ratio: number;
}

type ConversionFunctionOptions = {
  camera?: Camera;
  padding?: number;
};

export type CoordinateConversionFunction = (
  coordinates: Coordinates,
  camera?: Camera
) => Coordinates;

export function createGraphToViewportConversionFunction(
  graphExtent: GraphExtent,
  viewportDimensions: Dimensions,
  options?: ConversionFunctionOptions
): CoordinateConversionFunction;
