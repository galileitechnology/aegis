import '@xyflow/react/dist/style.css';
 
import { ReactFlow, Position, useNodesState, Node } from '@xyflow/react';
 
import { TooltipNode, TooltipContent, TooltipTrigger } from '@/components/tooltip-node';
 
export default function Tooltip() {
  return (
    <TooltipNode>
      <TooltipContent position={Position.Top}>Hidden Content</TooltipContent>
      <TooltipTrigger>meu pau</TooltipTrigger>
    </TooltipNode>
  );
}