import { normalizeTasks, flattenTasks } from '../utils/converter';
import type { Task } from '../component/task';
import data from '../data.json';

const getGUT = (task: Task) =>
    (task.gravity ?? 0) *
    (task.urgency ?? 0) *
    (task.tendency ?? 0);

export const TasksGUT = () => {

    const tasksDTO = data;
    const tasks = flattenTasks(normalizeTasks(tasksDTO));

    const sorted = [...tasks]
        .map(task => ({
            ...task,
            gut: getGUT(task)
        }))
        .sort((a, b) => b.gut - a.gut);

    return (
        <div style={{ padding: 20 }}>
            <h2>Priorização GUT</h2>

            <ul>
                {sorted.map(task => (
                    <li key={task.id} style={{ marginBottom: 8 }}>
                        <strong>{task.description}</strong> — {task.gut}
                        <div style={{ fontSize: 12 }}>
                            G:{task.gravity ?? 0} | U:{task.urgency ?? 0} | T:{task.tendency ?? 0}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};