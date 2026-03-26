import data from '../data.json';
import type { Task } from '../component/task';
import {
    ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { normalizeTasks, flattenTasks } from '../utils/converter';

const getCycleTime = (task: Task) => {
    return (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
};

export const TasksCycleTime = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const dataChart = tasks.map(task => ({
        date: task.end.toISOString().slice(0, 10),
        cycleTime: getCycleTime(task),
        responsible: task.responsible,
        description: task.description
    }));

    return (
        <div style={{ padding: 20 }}>
            <h2>Cycle Time Chart</h2>

            <ScatterChart width={800} height={350}>
                <CartesianGrid />

                <XAxis dataKey="date" name="Conclusão" />
                <YAxis dataKey="cycleTime" name="Dias" />

                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => [
                        `${value} dias`,
                        props.payload.description
                    ]}
                />

                <Scatter data={dataChart} />
            </ScatterChart>
        </div>
    );
};