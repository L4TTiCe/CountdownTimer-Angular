import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';

import { FirebaseServiceService } from '../../services/firebase-service.service'

import { Event } from '../../models/event';

@Component({
  selector: 'app-create-cd',
  templateUrl: './create-cd.component.html',
  styleUrls: [
    './create-cd.component.scss',
    '../../../assets/css/bootstrap.css'
  ]
})
export class CreateCdComponent implements OnInit {
  isLinear = false;
  nameFormGroup: FormGroup;
  descriptionFormGroup: FormGroup;
  
  data: Event;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseServiceService) { }

  ngOnInit(): void { 
    this.nameFormGroup = this.fb.group({
      title: ['Preview Title'],
      subtitle: ['Sample Subtitle'],
      isFeatured: ['false']
    });

    this.descriptionFormGroup = this.fb.group({
      content: ['Sample Content'],
      tags: [''],
      datetime: [(new Date().getTime() / 1000)],
    });

    this.data = {
      title: "Preview Title",
      subtitle: "Sample Subtitle",
      count: 1,
      content: "Sample Content",
      time_unix: (new Date().getTime() / 1000) + (60*60*24),
      tags: ["Tag 1", "Tag 2"]
    }
  }

  processTags(tags: string): string[] {
    const seperatedBySpace: string[] = tags.split(' ');
    const separatedByComma: string[] = tags.split(',');
    
    // Check which delimiter has more Tags and use one with more Tags
    return (seperatedBySpace.length << separatedByComma.length) ? separatedByComma : seperatedBySpace; 
  }

  validate(data: Event): boolean{
    let flag = true;

    // Check if Required Fields are not empty.
    if (data.title == '' || data.subtitle == '' || data.time_unix == null) {
      flag = false;
    }
    return flag;
  }

  processForm(toSubmit: Boolean) {
    let nameForm = this.nameFormGroup.value;
    let descriptionForm = this.descriptionFormGroup.value;

    this.data = {
      title: nameForm['title'],
      subtitle: nameForm['subtitle'],
      isFeatured: nameForm['isFeatured'],
      count: 1,
      content: descriptionForm['content'],
      time_unix: (new Date(descriptionForm['datetime']).getTime() / 1000) + (60*60),
      tags: this.processTags(descriptionForm['tags'])
    }

    if(!toSubmit){
      console.log(this.data);
    } else {
      if (this.validate(this.data)) {
        this.firebaseService.addItem(this.data);
        console.log("Sucessfully Submitted");
      }
      else {
        console.log("Validation failed");
      }
    }

    return descriptionForm;
  }

  onSubmit() {
    this.processForm(true);
  }

  onPreview() {
    this.processForm(false);
  }

}