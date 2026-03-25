import ReactFlow, {
    Background,
    Controls,
    MiniMap
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

import data from '../data.json';
import type { Task } from '../component/task';

type TaskDTO = Omit<Task, 'start' | 'end' | 'deadline' | 'subtasks'> & {
    start: string;
    end: string;
    deadline?: string;
    dependencies?: string[];
    subtasks?: TaskDTO[];
};

const mapTask = (dto: TaskDTO): Task => ({
    ...dto,
    start: new Date(dto.start),
    end: new Date(dto.end),
    deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    subtasks: dto.subtasks?.map(mapTask)
});

const flattenTasks = (tasks: Task[]): Task[] =>
    tasks.flatMap(t => [t, ...(t.subtasks ? flattenTasks(t.subtasks) : [])]);

export const TasksDependencies = () => {

    const tasksDTO = data.tasks as TaskDTO[];
    const tasks = flattenTasks(tasksDTO.map(mapTask));

    // 🔹 Função auxiliar
    const getTaskById = (id: string) => tasks.find(t => t.id === id);

    // 🔹 Nodes
    const nodes: Node[] = tasks.map((task, index) => {

        const isBlocked = task.subtasks?.some(sub =>
            getTaskById(sub.id)?.status !== 'DONE'
        );

        const color =
            task.status === 'DONE' ? '#4caf50' :
            task.status === 'DOING' ? '#2196f3' :
            isBlocked ? '#f44336' :
            '#9e9e9e';

        return {
            id: task.id,
            data: {
                label: `${task.description}`
            },
            position: {
                x: (index % 5) * 250,
                y: Math.floor(index / 5) * 120
            },
            style: {
                background: color,
                color: '#fff',
                padding: 10,
                borderRadius: 6,
                fontSize: 12,
                width: 180
            }
        };
    });

    // 🔹 Edges
    const edges: Edge[] = [];

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

        // dependência implícita (subtask → task)
        task.subtasks?.forEach(sub => {
            edges.push({
                id: `${sub.id}-${task.id}`,
                source: sub.id,
                target: task.id,
                style: { stroke: '#999' }
            });
        });
    });

    return (
        <div style={{ height: 600, padding: 20 }}>
            <h2>Mapa de Dependências</h2>

            <ReactFlow nodes={nodes} edges={edges} fitView>
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};