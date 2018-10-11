export class Task {
    id: number;
    name: string;
    description: string;
    estimate: number;
    state: string;

    constructor(name: string, description: string, estimatedTime: number, state: string) {
        this.name = name;
        this.description = description;
        this.estimate = estimatedTime;
        this.state = state;
    }
}
