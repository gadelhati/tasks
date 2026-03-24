import { initialHateoas, type Identifiable } from "./identifiable";

export interface Task extends Identifiable {
    status: 'TO DO'| 'DOING'| 'DONE',
    description: string,
    difficulty: string,
    priority: string,
    start: Date,
    end: Date,
	responsible: 'GAD' | 'PRI' | 'JES' | 'DIE' | 'AUG' | 'JEF' | 'CLA',
    subtasks?: Task[],
}

export const initialTask : Task = {
    id: '',
    links: initialHateoas,
    status: 'TO DO',
    description: '',
    difficulty: '',
    priority: '',
    start: new Date(),
    end: new Date(),
	responsible: 'GAD',
    subtasks: [],
}
