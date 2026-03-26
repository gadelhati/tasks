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

export const TasksBurnup = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const minDate = new Date(Math.min(...tasks.map(t => t.start.getTime())));

    // usa o maior deadline como fim do planejamento
    const maxDeadline = new Date(
        Math.max(...tasks.map(t => (t.deadline ?? t.end).getTime()))
    );

    const days = generateDays(minDate, maxDeadline);

    const totalFinal = tasks.length;

    const burnupData = days.map(day => {

        const demandas = tasks.filter(t => t.start <= day).length;

        const entregas = tasks.filter(t => t.end <= day).length;

        const elapsed =
            (day.getTime() - minDate.getTime());

        const totalDuration =
            (maxDeadline.getTime() - minDate.getTime());

        const planejado =
            totalDuration > 0
                ? (totalFinal * (elapsed / totalDuration))
                : 0;

        return {
            date: day.toISOString().slice(5, 10),
            demandas,
            entregas,
            planejado: Math.round(planejado)
        };
    });

    return (
        <div style={{ padding: 20 }}>
            <h2>Burnup</h2>

            <LineChart width={900} height={350} data={burnupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* 🔴 Demandas */}
                <Line
                    type="monotone"
                    dataKey="demandas"
                    stroke="#f44336"
                    name="Demandas"
                />

                {/* 🟡 Entregas */}
                <Line
                    type="monotone"
                    dataKey="entregas"
                    stroke="#ff9800"
                    name="Entregas"
                />

                {/* 🟢 Planejado */}
                <Line
                    type="monotone"
                    dataKey="planejado"
                    stroke="#4caf50"
                    strokeDasharray="5 5"
                    name="Planejado"
                />
            </LineChart>
        </div>
    );
};