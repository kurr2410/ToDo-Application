export class Task {
    id:number;
    taskName: String;
    dateCreated: String;
    lastDate: String;
    status: String ;
    priority: String ;
    constructor(date) {
        this.id=Math.random();
        this.taskName="";
        this.dateCreated = date;
        this.lastDate = date;
        this.status="";
        this.priority="";
    }
}