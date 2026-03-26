import type { Task } from '../component/task';

export const normalizeTasks = (tasks: any[]): Task[] => {
    return tasks.map(task => ({
        ...task,
        start: new Date(task.start),
        end: new Date(task.end),
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        subtasks: task.subtasks ? normalizeTasks(task.subtasks) : []
    }));
};

export const flattenTasks = (tasks: Task[]): Task[] => {
    return tasks.flatMap(task => [
        task,
        ...(task.subtasks ? flattenTasks(task.subtasks) : [])
    ]);
};