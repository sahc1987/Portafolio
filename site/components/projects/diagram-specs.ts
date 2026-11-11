import type { DiagramId } from '@/content/types';

export interface DiagramNode {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly accent?: boolean;
}

export interface DiagramSpec {
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly (readonly [from: string, to: string])[];
}

/** viewBox is 320 × 180. Columns: clients (x 8), server (x 118), services (x 232). */
const LEFT = { x: 8, w: 92 } as const;
const MID = { x: 118, w: 96 } as const;
const RIGHT = { x: 232, w: 80 } as const;

function column(
  col: { x: number; w: number },
  labels: readonly (readonly [id: string, label: string])[],
  h: number,
): DiagramNode[] {
  const gap = (180 - labels.length * h) / (labels.length + 1);
  return labels.map(([id, label], index) => ({
    id,
    label,
    x: col.x,
    y: Math.round(gap + index * (h + gap)),
    w: col.w,
    h,
  }));
}

function hub(id: string, label: string): DiagramNode {
  return { id, label, x: MID.x, y: 72, w: MID.w, h: 36, accent: true };
}

function fanOut(
  left: readonly DiagramNode[],
  hubId: string,
  right: readonly DiagramNode[],
): DiagramSpec['edges'] {
  return [
    ...left.map((node) => [node.id, hubId] as const),
    ...right.map((node) => [hubId, node.id] as const),
  ];
}

function build(
  hubNode: DiagramNode,
  left: readonly (readonly [string, string])[],
  right: readonly (readonly [string, string])[],
): DiagramSpec {
  const leftNodes = column(LEFT, left, 32);
  const rightNodes = column(RIGHT, right, right.length > 4 ? 24 : 28);
  return {
    nodes: [...leftNodes, hubNode, ...rightNodes],
    edges: fanOut(leftNodes, hubNode.id, rightNodes),
  };
}

export const DIAGRAMS: Readonly<Record<DiagramId, DiagramSpec>> = {
  'pool-app': build(
    hub('server', 'Server layer'),
    [
      ['web', 'Next.js web'],
      ['mobile', 'Expo mobile'],
    ],
    [
      ['db', 'Postgres'],
      ['auth', 'NextAuth'],
      ['storage', 'Storage'],
      ['stripe', 'Stripe'],
    ],
  ),
  ecommerce: build(
    hub('api', 'Express API'),
    [
      ['shop', 'Web shop'],
      ['office', 'Back office'],
      ['app', 'RN app'],
    ],
    [
      ['db', 'Postgres'],
      ['redis', 'Redis'],
      ['stripe', 'Stripe'],
      ['media', 'Cloudinary'],
    ],
  ),
  centraldesk: build(
    hub('api', 'Express API'),
    [['portal', 'React portal']],
    [
      ['pos', 'POS'],
      ['clock', 'Time clock'],
      ['carriers', 'Carriers'],
      ['stripe', 'Stripe'],
      ['email', 'Email'],
    ],
  ),
  'hospital-app': build(
    hub('api', 'Spring Boot'),
    [['web', 'React SPA']],
    [
      ['perms', 'Permissions'],
      ['db', 'Postgres'],
      ['flyway', 'Flyway'],
      ['redis', 'Redis'],
    ],
  ),
};

/** Cubic curve from the right edge of `from` to the left edge of `to`. */
export function edgePath(from: DiagramNode, to: DiagramNode): string {
  const x1 = from.x + from.w;
  const y1 = from.y + from.h / 2;
  const x2 = to.x;
  const y2 = to.y + to.h / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
}
