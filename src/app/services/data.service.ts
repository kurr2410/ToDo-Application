import { Injectable } from '@angular/core';
import { Bucket } from '../models/bucket';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  //Fetching the data from local storage
  getData() {
    const data = JSON.parse(localStorage.getItem('myData'))
    return data;
  }

  //Adding new bucket to the bucket list
  addNewBucket(bucketName) {
    let bucket = new Bucket();
    bucket.bucketName = bucketName;
    bucket.task = new Array<Task>();
    var data = JSON.parse(localStorage.getItem('myData'))
    if(data==null){
      data=[];
    }
    data.push(bucket);
    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)
    return data;
  }

  //Adds new task to a bucket
  addNewTask(task, bucket) {
    const data = JSON.parse(localStorage.getItem('myData'))
    data.forEach(element => {
      if (element.bucketName == bucket) {
        element.task.push(task);
      }
    })
    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)
    return data;
  }

  //Removes task from a bucket
  removeTask(task, bucket) {
    const data = JSON.parse(localStorage.getItem('myData'))
    data.forEach(element => {
      if (element.bucketName == bucket) {
        for (let i = 0; i < element.task.length; i++) {
          if (element.task[i].id == task.id) {
            element.task.splice(i, 1);
          }
        }
      }
    })
    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)
    return data;
  }

  //Removes multiple tasks from the bucket
  removeMultipleTask(tasks_selected: Set<string>, bucket) {
    const data = JSON.parse(localStorage.getItem('myData'))
    data.forEach(element => {
      if (element.bucketName == bucket) {
        tasks_selected.forEach((id) => {
          let n = element.task.length;
          for (let i = 0; i < n; i++) {
            if (element.task[i] && id == element.task[i].id.toString()) {
              element.task.splice(i, 1);
              i = 0;
            }
          }
        })
      }
    })
    const jsonData = JSON.stringify(data)
    localStorage.setItem('myData', jsonData)
    return data;
  }
}

