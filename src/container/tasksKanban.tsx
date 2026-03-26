import { normalizeTasks, flattenTasks } from '../utils/converter';
import { type Task } from '../component/task';
import data from '../data.json';

export const TasksKanban = () => {

    const tasks = normalizeTasks(data);
    const allTasks = flattenTasks(tasks);

    const columns: Record<Task['status'], Task[]> = {
        "TO DO": [],
        "DOING": [],
        "DONE": [],
    };

    allTasks.forEach(task => {
        columns[task.status].push(task);
    });

    const renderColumn = (title: string, list: Task[]) => (
        <div style={{
            flex: 1,
            background: "#f5f5f5",
            padding: 10,
            borderRadius: 6,
            minHeight: 300
        }}>
            <h3>{title}</h3>

            {list.map(task => (
                <div key={task.id} style={{
                    background: "#fff",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <strong>{task.description}</strong>
                    <div style={{ fontSize: 12 }}>
                        {task.responsible}
                    </div>

                    <div style={{ fontSize: 11, marginTop: 4 }}>
                        G:{task.gravity} U:{task.urgency}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{
            display: "flex",
            gap: 10,
            padding: 20
        }}>
            {renderColumn("TO DO", columns["TO DO"])}
            {renderColumn("DOING", columns["DOING"])}
            {renderColumn("DONE", columns["DONE"])}
        </div>
    );
};
