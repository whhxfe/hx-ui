import { withInstall } from '../../utils/install'
import _HxRelationGraph from './RelationGraph.vue'

export const HxRelationGraph = withInstall(_HxRelationGraph, 'HxRelationGraph')

export default HxRelationGraph

export type {
  RelationGraphProps,
  RelationNode,
  RelationEdge,
  RelationNodeStyle,
  RelationEdgeData,
  RelationGraphIconConfig,
  RelationNodeClickEvent,
  RelationGraphLayoutType,
  AccountType,
  ContactAccount,
} from './types'
