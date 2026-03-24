import { initialHateoas, type Identifiable } from "./identifiable";

export interface Task extends Identifiable {
    status: 'TO DO'| 'DOING'| 'DONE',
    description: string,
    difficulty: string,
    gravity: number,
    urgency: number,
    tendency?: number,
    priority?: number,
    start: Date,
    end: Date,
    deadline?: Date,
	responsible: 'GAD' | 'PRI' | 'JES' | 'DIE' | 'AUG' | 'JEF' | 'CLA',
    subtasks?: Task[],
}

export const initialTask : Task = {
    id: '',
    links: initialHateoas,
    status: 'TO DO',
    description: '',
    difficulty: '',
    gravity: 0,
    urgency: 0,
    tendency: 0,
    priority: 0,
    start: new Date(),
    end: new Date(),
    deadline: new Date(),
	responsible: 'GAD',
    subtasks: [],
}
