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

const isActiveOnDay = (task: Task, day: Date) => {
    return task.start <= day && task.end >= day;
};

export const TasksBurndown = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const minDate = new Date(Math.min(...tasks.map(t => t.start.getTime())));
    const maxDate = new Date(Math.max(...tasks.map(t => t.end.getTime())));

    const days = generateDays(minDate, maxDate);

    // 🔴 Burndown por Task (subtasks incluídas)
    const burndownTasks = days.map(day => {
        const active = tasks.filter(t => isActiveOnDay(t, day));
        return {
            date: day.toISOString().slice(5, 10),
            open: active.length
        };
    });

    // 🔵 Burndown por Responsible
    const responsibles = [...new Set(tasks.map(t => t.responsible))];

    const burndownResponsible = days.map(day => {
        const entry: any = {
            date: day.toISOString().slice(5, 10)
        };

        responsibles.forEach(r => {
            entry[r] = tasks.filter(t =>
                t.responsible === r && isActiveOnDay(t, day)
            ).length;
        });

        return entry;
    });

    return (
        <div style={{ padding: 20 }}>
            <h2>Burndown</h2>

            {/* 🔴 Burndown por Task */}
            <h3>Por Tarefa (Escopo Dinâmico)</h3>
            <LineChart width={800} height={300} data={burndownTasks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="open" />
            </LineChart>

            {/* 🔵 Burndown por Responsible */}
            <h3>Por Responsável</h3>
            <LineChart width={800} height={300} data={burndownResponsible}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                {responsibles.map(r => (
                    <Line key={r} type="monotone" dataKey={r} />
                ))}
            </LineChart>
        </div>
    );
};