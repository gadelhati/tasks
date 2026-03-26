import ReactFlow, {
    Background,
    Controls,
    MiniMap
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import data from '../data.json';

const nodeWidth = 200;
const nodeHeight = 80;
import { normalizeTasks, flattenTasks } from '../utils/converter';

// 🔥 Layout com DAGRE
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: 'TB', // Top-Bottom
        nodesep: 80,
        ranksep: 120
    });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map(node => {
        const nodeWithPosition = dagreGraph.node(node.id);

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2
            }
        };
    });

    return { nodes: layoutedNodes, edges };
};

export const TasksDependencies = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const getTaskById = (id: string) => tasks.find(t => t.id === id);

    // 🔹 Nodes
    let nodes: Node[] = tasks.map(task => {

        const isBlocked = task.subtasks?.some(depId =>
            getTaskById(depId.description)?.status !== 'DONE'
        );

        const color =
            task.status === 'DONE' ? '#4caf50' :
            task.status === 'DOING' ? '#2196f3' :
            isBlocked ? '#f44336' :
            '#9e9e9e';

        return {
            id: task.id,
            data: { label: task.description },
            position: { x: 0, y: 0 }, // será calculado
            style: {
                background: color,
                color: '#fff',
                padding: 10,
                borderRadius: 6,
                fontSize: 12,
                width: nodeWidth
            }
        };
    });

    // 🔹 Edges
    let edges: Edge[] = [];

    tasks.forEach(task => {

        // dependências explícitas
        task.subtasks?.forEach(depId => {
            edges.push({
                id: `${depId}-${task.id}`,
                source: depId.description,
                target: task.id,
                animated: true
            });
        });

        // subtasks → task (dependência implícita)
        task.subtasks?.forEach(sub => {
            edges.push({
                id: `${sub.id}-${task.id}`,
                source: sub.id,
                target: task.id,
                style: { stroke: '#999' }
            });
        });
    });

    // 🔥 aplica layout automático
    const layouted = getLayoutedElements(nodes, edges);

    return (
        <div style={{ height: 700, padding: 20 }}>
            <h2>Mapa de Dependências</h2>

            <ReactFlow
                nodes={layouted.nodes}
                edges={layouted.edges}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};