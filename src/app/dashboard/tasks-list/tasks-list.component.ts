import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bucket } from 'src/app/models/bucket';
import { Task } from 'src/app/models/task';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  bucketName: String;
  taskList: Array<Task> = [];
  task: Task;
  tasks_selected = new Set<string>();
  sort: boolean = true;
  filterKey: String = "None";
  editToggle: boolean = true;
  tempTaskList: Array<Task> = [];
  keyList: any;
  constructor(private dataService: DataService, private route: ActivatedRoute) {
    //Getting the bucketName as param via routing
    this.route.params.subscribe(params => {
      this.bucketName = params.bucketName;
      this.fetchTaskList(this.bucketName);
    });
  }

  ngOnInit() {
    this.task = new Task(this.cleanDate());   // A blank task when is initialized
  }

  //Formatting th date in the form of YYYY-MM-DD
  cleanDate(): String {
    var date = new Date(Date.now())
    var newdate: String = "";
    var yr = date.getFullYear();
    var mn = date.getMonth() + 1;
    var day = date.getDate();
    if (mn < 10 && day < 10) {
      newdate = yr + "-0" + (mn) + "-0" + day;
    } else if (mn < 10) {
      newdate = yr + "-0" + (mn) + "-" + day;
    } else if (day < 10) {
      newdate = yr + "-" + (mn) + "-0" + day;
    } else {
      newdate = yr + "-" + (mn) + "-" + day;
    }
    return newdate;
  }

  //Fetching the list of tasks of a particular bucket
  fetchTaskList(bucketName) {
    this.taskList = [];
    let data = this.dataService.getData();
    data.forEach(element => {
      if (element.bucketName && element.bucketName == bucketName) {
        let tasks = element.task;
        tasks.forEach(task => {
          this.taskList.push(task);
        });
        this.tempTaskList=this.taskList;
        this.keyList = Object.keys(new Task(this.cleanDate()));
        this.keyList.splice(0, 1)
      }
    });
  }

  //Called on click of Add task button
  addClicked() {
    this.editToggle = true;
    if (this.task.taskName && this.task.status && this.task.priority) {
      this.addTask(this.task);
    }
  }

  //Adds the task in the current bucket
  addTask(task) {
    this.dataService.addNewTask(task, this.bucketName);
    this.task = new Task(this.cleanDate());
    this.fetchTaskList(this.bucketName);
    return;
  }

  //Called when task is editted
  editTask(task, i) {
    this.editToggle = false;      //disables other task for editing until current edit is completed
    this.taskList.splice(i, 1);
    this.dataService.removeTask(task, this.bucketName);
    this.fetchTaskList(this.bucketName);
    this.task = task;
  }

  //this function is storing the list of tasks being selected for deletion
  selectedTasks(e) {
    if (e.target.checked) {
      let value = e.target.value;
      this.tasks_selected.add(value);
    }
  }

  //Deletes the elected task
  deleteTasks() {
    this.dataService.removeMultipleTask(this.tasks_selected, this.bucketName);
    this.tasks_selected.clear();
    this.fetchTaskList(this.bucketName);
  }

  //List of tasks will be sorted based on the dateCreated attribute.
  sortOnDateCreated() {
    this.sort = !this.sort;     // a boolean variable to toggle asc/desc order
    if (this.sort) {
      this.taskList.sort(function (a, b) {
        let x = a.dateCreated.toLowerCase();
        let y = b.dateCreated.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
      })
    } else {
      this.taskList.sort(function (a, b) {
        let x = a.dateCreated.toLowerCase();
        let y = b.dateCreated.toLowerCase();
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
      })
    }
  }

  //Tasks are being filtered based on selected priority type
  filter() {
    this.taskList=[];
    if (this.filterKey == "None") {
      this.taskList=this.tempTaskList;
    } else {
      this.tempTaskList.forEach(task => {
        if (task.priority == this.filterKey) {
          this.taskList.push(task);
        }
      });
    }
  }
}