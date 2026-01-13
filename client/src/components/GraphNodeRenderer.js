/**
 * GraphNodeRenderer - Reusable node rendering utilities for react-force-graph-2d
 *
 * Usage:
 * import { drawNode, nodeRelSize } from './GraphNodeRenderer';
 *
 * <ForceGraph2D
 *   nodeCanvasObject={(node, ctx, scale) => drawNode(ctx, node, scale, options)}
 *   nodeRelSize={(node) => nodeRelSize(node, options)}
 * />
 *
 * Options shape:
 * {
 *   type: 'person' | 'event' | 'custom',
 *   label: boolean,
 *   hover: boolean,
 *   click: boolean,
 *   size: 'auto' | number,
 *   highlight: boolean,
 *   colors?: {
 *     person?: string,
 *     event?: string,
 *     custom?: string,
 *     stroke?: string,
 *     text?: string,
 *     labelBg?: string
 *   }
 * }
 */

// Default options
const DEFAULT_OPTIONS = {
  type: 'custom',
  label: true,
  hover: true,
  click: true,
  size: 'auto',
  highlight: true,
  colors: {
    person: '#4CAF50',
    event: '#2196F3',
    custom: '#9E9E9E',
    stroke: '#fff',
    text: '#000',
    labelBg: 'rgba(255, 255, 255, 0.8)',
  },
};

/**
 * Calculate node size based on options
 * @param {Object} node - The node object
 * @param {Object} options - Rendering options
 * @returns {number} - Node radius in pixels
 */
export function nodeRelSize(node, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (opts.size === 'auto') {
    // Dynamic sizing based on node connections (degree) or value
    const degree = node.degree || node.val || 1;
    const minSize = 3;
    const maxSize = 10;
    // Scale size logarithmically for better visual distribution
    const size = minSize + Math.log(degree + 1) * 2;
    return Math.min(Math.max(size, minSize), maxSize);
  }

  // Fixed size
  return typeof opts.size === 'number' ? opts.size : 5;
}

/**
 * Draw a graph node on canvas with labels and styling
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} node - Node object with x, y, type, name, etc.
 * @param {number} globalScale - Current zoom scale
 * @param {Object} options - Rendering options
 */
export function drawNode(ctx, node, globalScale, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options, colors: { ...DEFAULT_OPTIONS.colors, ...(options.colors || {}) } };

  // Determine node color based on type
  let nodeColor = node.color || opts.colors.custom;
  if (node.type === 'person') {
    nodeColor = opts.colors.person;
  } else if (node.type === 'event') {
    nodeColor = opts.colors.event;
  }

  // Calculate node size
  const nodeSize = nodeRelSize(node, opts);

  // Draw node circle
  ctx.beginPath();
  ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
  ctx.fillStyle = nodeColor;
  ctx.fill();

  // Add highlight/hover effect
  if (opts.highlight && (node.__highlighted || node.__hovered)) {
    ctx.strokeStyle = opts.colors.stroke;
    ctx.lineWidth = 2 / globalScale;
    ctx.stroke();

    // Subtle glow effect
    ctx.shadowColor = nodeColor;
    ctx.shadowBlur = 10 / globalScale;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize + 1, 0, 2 * Math.PI, false);
    ctx.strokeStyle = nodeColor;
    ctx.lineWidth = 2 / globalScale;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw label if enabled
  if (opts.label && node.name) {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

    // Draw label background
    ctx.fillStyle = opts.colors.labelBg;
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y + nodeSize + 3,
      bckgDimensions[0],
      bckgDimensions[1]
    );

    // Draw label text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = opts.colors.text;
    ctx.fillText(label, node.x, node.y + nodeSize + 3 + fontSize / 2);
  }
}

/**
 * Parse command-line style arguments into options object
 * @param {string} args - Argument string (e.g., "--type person --size 6 --label on")
 * @returns {Object} - Options object
 */
export function parseArguments(args = '') {
  const options = { ...DEFAULT_OPTIONS };

  if (!args) return options;

  const tokens = args.match(/--\w+\s+\S+/g) || [];

  tokens.forEach(token => {
    const [flag, value] = token.split(/\s+/);
    const key = flag.replace('--', '');

    switch (key) {
      case 'type':
        if (['person', 'event', 'custom'].includes(value)) {
          options.type = value;
        }
        break;
      case 'label':
      case 'hover':
      case 'click':
      case 'highlight':
        options[key] = value === 'on';
        break;
      case 'size':
        options.size = value === 'auto' ? 'auto' : parseFloat(value);
        break;
      default:
        break;
    }
  });

  return options;
}
