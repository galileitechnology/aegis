"use client";

import { useCallback } from "react";
import "@xyflow/react/dist/style.css";

import { NumNode } from "@/components/nodes/num-node";
import { SumNode } from "@/components/nodes/sum-node";

import { DataEdge } from "@/components/data-edge";
import {
  ReactFlow,
  OnConnect,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
} from "@xyflow/react";

const nodeTypes = {
  num: NumNode,
  sum: SumNode,
};

const initialNodes: Node[] = [
  { id: "a", type: "num", data: { value: 99999999 }, position: { x: 0, y: 0 } },
  { id: "b", type: "num", data: { value: 0 }, position: { x: 0, y: 200 } },
  { id: "c", type: "sum", data: { value: 0 }, position: { x: 300, y: 100 } },
  { id: "d", type: "num", data: { value: 0 }, position: { x: 0, y: 400 } },
  { id: "e", type: "sum", data: { value: 0 }, position: { x: 600, y: 400 } },
];

const edgeTypes = {
  data: DataEdge,
};

const initialEdges: Edge[] = [];

export default function DrawFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge({ type: "data", data: { key: "value" }, ...params }, edges)
      );
    },
    [setEdges]
  );


  return (
    <ReactFlow
      className="min-h-[90vh] relative overflow-y-hidden p-8"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
    />
  );
}
