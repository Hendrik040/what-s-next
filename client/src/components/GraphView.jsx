import { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GraphView.css';

function GraphView({ data, onDeletePerson, onDeleteEvent, onDeleteConnection }) {
  const graphRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphSize, setGraphSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.graph-container');
      if (container) {
        setGraphSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Transform data for react-force-graph
  const graphData = {
    nodes: [
      ...data.people.map(p => ({
        id: p.id,
        name: p.name,
        type: 'person',
        color: '#4CAF50',
        ...p,
      })),
      ...data.events.map(e => ({
        id: e.id,
        name: e.name,
        type: 'event',
        color: '#2196F3',
        ...e,
      })),
    ],
    links: data.connections.map(c => ({
      source: c.from,
      target: c.to,
      id: c.id,
      ...c,
    })),
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleDelete = () => {
    if (selectedNode) {
      if (selectedNode.type === 'person') {
        onDeletePerson(selectedNode.id);
      } else if (selectedNode.type === 'event') {
        onDeleteEvent(selectedNode.id);
      }
      setSelectedNode(null);
    }
  };

  const closePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="graph-view">
      <div className="graph-container">
        {graphData.nodes.length === 0 ? (
          <div className="empty-state">
            <h2>Your Knowledge Graph is Empty</h2>
            <p>Start by adding people and events using the tabs above!</p>
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={graphSize.width}
            height={graphSize.height}
            nodeLabel="name"
            nodeAutoColorBy="type"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

              // Draw node circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();

              // Draw label background
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y + 8,
                bckgDimensions[0],
                bckgDimensions[1]
              );

              // Draw label text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';
              ctx.fillText(label, node.x, node.y + 8 + fontSize / 2);
            }}
            onNodeClick={handleNodeClick}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.1}
            d3VelocityDecay={0.3}
          />
        )}
      </div>

      {selectedNode && (
        <div className="details-panel">
          <div className="panel-header">
            <h3>{selectedNode.name}</h3>
            <button className="close-btn" onClick={closePanel}>×</button>
          </div>
          <div className="panel-content">
            <p className="node-type">Type: {selectedNode.type}</p>

            {selectedNode.type === 'person' && (
              <>
                {selectedNode.profession && <p><strong>Profession:</strong> {selectedNode.profession}</p>}
                {selectedNode.company && <p><strong>Company:</strong> {selectedNode.company}</p>}
                {selectedNode.location && <p><strong>Location:</strong> {selectedNode.location}</p>}
                {selectedNode.email && <p><strong>Email:</strong> {selectedNode.email}</p>}
                {selectedNode.phone && <p><strong>Phone:</strong> {selectedNode.phone}</p>}
                {selectedNode.notes && <p><strong>Notes:</strong> {selectedNode.notes}</p>}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div className="tags">
                    <strong>Tags:</strong>
                    {selectedNode.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedNode.type === 'event' && (
              <>
                {selectedNode.date && (
                  <p><strong>Date:</strong> {new Date(selectedNode.date).toLocaleDateString()}</p>
                )}
                {selectedNode.location && <p><strong>Location:</strong> {selectedNode.location}</p>}
                {selectedNode.description && <p><strong>Description:</strong> {selectedNode.description}</p>}
              </>
            )}

            <button className="delete-btn" onClick={handleDelete}>
              Delete {selectedNode.type}
            </button>
          </div>
        </div>
      )}

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
          <span>People</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
          <span>Events</span>
        </div>
      </div>
    </div>
  );
}

export default GraphView;
