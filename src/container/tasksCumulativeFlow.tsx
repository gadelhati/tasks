import type { Task } from '../component/task';
import data from '../data.json';

import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { normalizeTasks, flattenTasks } from '../utils/converter';

const generateDays = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
};

const isActiveOnDay = (task: Task, day: Date) =>
    task.start <= day && task.end >= day;

export const TasksCumulativeFlow = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const minDate = new Date(Math.min(...tasks.map(t => t.start.getTime())));
    const maxDate = new Date(Math.max(...tasks.map(t => t.end.getTime())));

    const days = generateDays(minDate, maxDate);

    const cfdData = days.map(day => {

        const entry: any = {
            date: day.toISOString().slice(5, 10),
            "TO DO": 0,
            "DOING": 0,
            "DONE": 0
        };

        tasks.forEach(task => {
            if (isActiveOnDay(task, day)) {
                entry[task.status]++;
            }
        });

        return entry;
    });

    return (
        <div style={{ padding: 20 }}>
            <h2>Cumulative Flow Diagram (CFD)</h2>

            <LineChart width={800} height={350} data={cfdData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="TO DO" />
                <Line type="monotone" dataKey="DOING" />
                <Line type="monotone" dataKey="DONE" />
            </LineChart>
        </div>
    );
};