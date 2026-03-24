import { initialHateoas, type Identifiable } from "./identifiable";

export interface Task extends Identifiable {
    status: 'TO DO'| 'DOING'| 'DONE',
    description: string,
    difficulty: string,
    priority: string,
	responsible: 'GAD' | 'PRI' | 'JES' | 'DIE' | 'AUG' | 'JEF' | 'CLA',
}

export const initialTask : Task = {
    id: '',
    links: initialHateoas,
    status: 'TO DO',
    description: '',
    difficulty: '',
    priority: '',
	responsible: 'GAD',
}