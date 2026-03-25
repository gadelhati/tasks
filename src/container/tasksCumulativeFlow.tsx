import data from '../data.json';
import type { Task } from '../component/task';

import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

type TaskDTO = Omit<Task, 'start' | 'end' | 'subtasks'> & {
    start: string;
    end: string;
    subtasks?: TaskDTO[];
};

const mapTask = (dto: TaskDTO): Task => ({
    ...dto,
    start: new Date(dto.start),
    end: new Date(dto.end),
    subtasks: dto.subtasks?.map(mapTask)
});

const flattenTasks = (tasks: Task[]): Task[] =>
    tasks.flatMap(t => [t, ...(t.subtasks ? flattenTasks(t.subtasks) : [])]);

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

    const tasksDTO = data.tasks as TaskDTO[];
    const tasks = flattenTasks(tasksDTO.map(mapTask));

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