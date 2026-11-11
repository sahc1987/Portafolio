import type { DiagramId } from '@/content/types';
import { DIAGRAMS, edgePath, type DiagramNode } from './diagram-specs';

interface ArchitectureDiagramProps {
  id: DiagramId;
  label: string;
}

export function ArchitectureDiagram({ id, label }: ArchitectureDiagramProps) {
  const spec = DIAGRAMS[id];
  const byId = new Map(spec.nodes.map((node) => [node.id, node]));

  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
        {spec.edges.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          return (
            <path
              key={`${fromId}-${toId}`}
              d={edgePath(from, to)}
              pathLength={1}
              className="draw"
            />
          );
        })}
      </g>
      {spec.nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </svg>
  );
}

function Node({ node }: { node: DiagramNode }) {
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={8}
        fill={node.accent ? 'var(--accent-soft)' : 'var(--surface)'}
        stroke={node.accent ? 'var(--accent)' : 'var(--border)'}
        strokeWidth={node.accent ? 1.5 : 1}
      />
      <text
        x={node.x + node.w / 2}
        y={node.y + node.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={node.accent ? 11 : 10}
        fontWeight={node.accent ? 600 : 500}
        fill={node.accent ? 'var(--accent-soft-text)' : 'var(--text)'}
      >
        {node.label}
      </text>
    </g>
  );
}
