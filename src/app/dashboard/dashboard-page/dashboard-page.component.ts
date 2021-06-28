import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
  data: any = [];
  bucketList: Array<any> = [];
  selectedBucket: String;
  list = new Array();
  pageList = new Array();
  currentPage = 1;
  numberPerPage = 5;
  numberOfPages = 1;
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.fetchData();                                //Fetching the list of buckets
    this.numberOfPages = this.getNumberOfPages();   // getting the number of pages based on numberPerPage and total buckets
    this.loadList();                                //Rendering the list of appropiate buckets
  }

  //Fetches the list of buckets
  fetchData() {
    this.bucketList = [];
    this.data = this.dataService.getData() != null ? this.dataService.getData() : [];
    this.data.forEach(element => {
      if (element.bucketName) {
        // console.log(element.bucketName);
        this.bucketList.push(element.bucketName);
      }
    });
  }

  //Adds new bucket to the bucket list
  addBucket(event) {
    let newBucket = event.target.value;
    event.target.value = "";
    if (newBucket.length > 0) {
      this.selectedBucket = newBucket;
      this.dataService.addNewBucket(this.selectedBucket);
      this.fetchData();
      this.openBucket(this.selectedBucket);
      this.numberOfPages = this.getNumberOfPages();
      this.loadList();
      // console.log(this.data);
    }
  }

  //On click of any particular bucket in the bucket list, it will render the list of its tasks.
  openBucket(bucketName) {
    this.router.navigateByUrl(`/tasks/${bucketName}`);
  }

  //Called to specify the items per page for pagination
  addPagination() {
    this.numberOfPages = this.getNumberOfPages();
    this.loadList();
  }

  //Calculates the number of pages in pagination
  getNumberOfPages() {
    return Math.ceil(this.bucketList.length / this.numberPerPage);
  }

  //Fetches the first page
  firstPage() {
    this.currentPage = 1;
    this.loadList();
  }

  //Fetches the just previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
    this.loadList();
  }

  //Fetches the just next page
  nextPage() {
    if (this.currentPage < this.numberOfPages) {
      this.currentPage += 1;
    }
    this.loadList();
  }

  //Fetches the last page
  lastPage() {
    this.currentPage = this.numberOfPages;
    this.loadList();
  }

  //Called to load the pages after any changes eg. first,last,previous,next or if pagination changes
  loadList() {
    var begin = ((this.currentPage - 1) * this.numberPerPage);
    var end = begin + parseInt(this.numberPerPage + "");
    this.pageList = this.bucketList.slice(begin, end);
    this.check();
  }

  //It is a check for the overflow/underflow when page ends. Basically disables the respective button
  check() {
    var next = <HTMLInputElement>document.getElementById("next");
    next.disabled = this.currentPage == this.numberOfPages ? true : false;
    var previous = <HTMLInputElement>document.getElementById("previous")
    previous.disabled = this.currentPage == 1 ? true : false;
    var first = <HTMLInputElement>document.getElementById("first")
    first.disabled = this.currentPage == 1 ? true : false;
    var last = <HTMLInputElement>document.getElementById("last")
    last.disabled = this.currentPage == this.numberOfPages ? true : false;
  }
}