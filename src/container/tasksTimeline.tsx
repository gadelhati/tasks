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

const DAY_WIDTH = 40;

const generateDays = (start: Date, end: Date): Date[] => {
    const days: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
};

const getDaysDiff = (start: Date, end: Date) => {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
};

export const TasksTimeline = () => {

    const tasksDTO = data.tasks as TaskDTO[];
    const tasks = flattenTasks(tasksDTO.map(mapTask));

    // range global
    const minDate = new Date(Math.min(...tasks.map(t => t.start.getTime())));
    const maxDate = new Date(Math.max(...tasks.map(t => t.end.getTime())));

    const days = generateDays(minDate, maxDate);

    return (
        <div style={{ padding: 20 }}>
            <h2>Timeline</h2>

            <div style={{
                overflowX: 'auto',
                border: '1px solid #ccc'
            }}>
                <div style={{ minWidth: days.length * DAY_WIDTH }}>

                    {/* Header (datas) */}
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: 200 }} />
                        {days.map((day, i) => (
                            <div key={i} style={{
                                width: DAY_WIDTH,
                                fontSize: 10,
                                textAlign: 'center',
                                borderLeft: '1px solid #eee'
                            }}>
                                {day.getDate()}
                            </div>
                        ))}
                    </div>

                    {/* Linhas */}
                    {tasks.map(task => {
                        const offset = getDaysDiff(minDate, task.start);
                        const duration = getDaysDiff(task.start, task.end);

                        return (
                            <div key={task.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 30,
                                borderTop: '1px solid #eee'
                            }}>
                                {/* Nome */}
                                <div style={{
                                    width: 200,
                                    paddingLeft: 5,
                                    fontSize: 12
                                }}>
                                    {task.description}
                                </div>

                                {/* Linha */}
                                <div style={{
                                    position: 'relative',
                                    flex: 1,
                                    height: '100%'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: offset * DAY_WIDTH,
                                        width: duration * DAY_WIDTH,
                                        height: 16,
                                        background: '#4caf50',
                                        borderRadius: 4,
                                        top: 7
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};