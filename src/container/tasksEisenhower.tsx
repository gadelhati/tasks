import type { Task } from '../component/task';
import data from '../data.json';

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

const classify = (task: Task) => {
    const isUrgent = (task.urgency ?? 0) >= 5;
    const isImportant = (task.gravity ?? 0) >= 5;

    if (isUrgent && isImportant) return 'DO_NOW';
    if (!isUrgent && isImportant) return 'SCHEDULE';
    if (isUrgent && !isImportant) return 'DELEGATE';
    return 'ELIMINATE';
};

export const TasksEisenhower = () => {

    const tasksDTO = data.tasks as TaskDTO[];
    const tasks = tasksDTO.map(mapTask);
    const allTasks = flattenTasks(tasks);

    const quadrants = {
        DO_NOW: [] as Task[],
        SCHEDULE: [] as Task[],
        DELEGATE: [] as Task[],
        ELIMINATE: [] as Task[],
    };

    allTasks.forEach(task => {
        quadrants[classify(task)].push(task);
    });

    const renderList = (list: Task[]) => (
        <ul>
            {list.map(t => (
                <li key={t.id}>
                    {t.description} ({t.responsible})
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            padding: 20
        }}>
            <div>
                <h3>🔴 Fazer agora</h3>
                {renderList(quadrants.DO_NOW)}
            </div>

            <div>
                <h3>🟡 Planejar</h3>
                {renderList(quadrants.SCHEDULE)}
            </div>

            <div>
                <h3>🟢 Delegar</h3>
                {renderList(quadrants.DELEGATE)}
            </div>

            <div>
                <h3>⚪ Eliminar</h3>
                {renderList(quadrants.ELIMINATE)}
            </div>
        </div>
    );
};