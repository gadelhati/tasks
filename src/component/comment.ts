import { initialHateoas, type Identifiable } from "./identifiable";

export interface Comment extends Identifiable {
    description: string,
    responsible: 'GAD' | 'PRI' | 'JES' | 'DIE' | 'AUG' | 'JEF' | 'CLA',
}

export const initialComment : Comment = {
    id: '',
    links: initialHateoas,
    description: '',
    responsible: 'GAD',
}