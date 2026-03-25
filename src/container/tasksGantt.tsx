import type { Task } from '../component/task';
import data from '../data.json';

const getDaysDiff = (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
};

const projectStart = "2026-03-01";
const DAY_WIDTH = 30;

interface TaskRowProps {
    task: Task;
    depth?: number;
}

const TaskRow = ({ task, depth = 0 }: TaskRowProps) => {
    const offset = getDaysDiff(projectStart, task.start);
    const duration = getDaysDiff(task.start, task.end);

    return (
        <>
            <div style={{ marginBottom: 8 }}>
                <div style={{
                    marginLeft: depth * 20,
                    fontSize: depth === 0 ? 14 : 12
                }}>
                    {task.description} ({task.responsible})
                </div>

                <div style={{
                    position: "relative",
                    height: 10,
                    borderRadius: 4,
                    background: "#eee",
                    marginLeft: depth * 20
                }}>
                    <div style={{
                        position: "absolute",
                        left: `${offset * DAY_WIDTH}px`,
                        width: `${duration * DAY_WIDTH}px`,
                        height: "100%",
                        background: depth === 0 ? "#4caf50" : "#2196f3",
                        borderRadius: 4
                    }} />
                </div>
            </div>

            {task.subtasks?.map(sub => (
                <TaskRow key={sub.id} task={sub} depth={depth + 1} />
            ))}
        </>
    );
};

export const TasksGantt = () => {
    return (
        <div style={{ padding: 20 }}>
            <h2>Gantt Minimalista</h2>

            {data.tasks.map((task: any) => (
                <TaskRow key={task.id} task={task} />
            ))}
        </div>
    );
};