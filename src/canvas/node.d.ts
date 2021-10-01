import Graph, {Attributes} from 'graphology-types';
import {CanvasRendererSettings} from './';

export function renderToPNG<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph,
  outputPath: string,
  settings: CanvasRendererSettings<NodeAttributes, EdgeAttributes>,
  callback?: () => void
): void;
