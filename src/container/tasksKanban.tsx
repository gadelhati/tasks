import data from '../data.json';
import { type Task } from '../component/task';

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

const flattenTasks = (tasks: Task[]): Task[] => {
    return tasks.flatMap(task => [
        task,
        ...(task.subtasks ? flattenTasks(task.subtasks) : [])
    ]);
};

export const TasksKanban = () => {

    const tasksDTO = data.tasks as TaskDTO[];
    const tasks = tasksDTO.map(mapTask);
    const allTasks = flattenTasks(tasks);

    const columns = {
        "TO DO": [] as Task[],
        "DOING": [] as Task[],
        "DONE": [] as Task[],
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
                        G:{task.gravity ?? 0} U:{task.urgency ?? 0}
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
