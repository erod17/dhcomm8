import { Input, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallCenterService } from '../services/call-center.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../globals';

@Component({
  selector: 'app-org-structure',
  templateUrl: './org-structure.component.html',
  styleUrls: ['./org-structure.component.css']
})

export class OrgStructureComponent implements OnInit {

  showSuccess = false;
  saveMsg = '';
  orgAlertClosed = true;
  varOrgAction = 'Edit';
  glob: Globals;
  varToken: any;
  varOrgStruct = [];

  orgStructForm = new FormGroup({
    deptUUID: new FormControl(''),
    deptDependUUID: new FormControl(''),
    completeName: new FormControl(''),
    shortName: new FormControl(''),
    extension: new FormControl(''),
    phoneNumber: new FormControl(''),
    accountCode: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private CCService: CallCenterService,
    glob: Globals
  ) {
    this.glob = glob;
    this.varToken = window.localStorage.getItem('token');
  }

  ngOnInit() {
    setTimeout(() => this.orgAlertClosed = true, 1000);

    this.orgStructForm = this.formBuilder.group({
      deptUUID: ['', Validators.nullValidator],
      deptDependUUID: ['', Validators.nullValidator],
      completeName: ['', Validators.required],
      shortName: ['', Validators.required],
      accountCode: ['', Validators.required],
      extension: [{value: '', disabled: true}, Validators.nullValidator],
      phoneNumber: ['', Validators.required]
    });

    const orgPayload = {
      deptUUID: this.orgStructForm.controls.deptUUID.value
    };

    this.CCService.getOrganizationStructure(this.varToken, orgPayload).subscribe((data: any) => {
      if (data) {
        console.log(data.data);
        this.varOrgStruct = data.data;
        // save data into localStorage

      }

    }, err => {

        if (err.status === 401) {
          console.log(err.status);
          alert(err.status);
        }
      });

  }

  onSubmit() {

    if (this.orgStructForm.invalid) {
      return;
    }
    const orgPayload = {
      deptUUID: (this.orgStructForm.controls.deptUUID.value !== '' ? this.orgStructForm.controls.deptUUID.value : null),
      completeName: this.orgStructForm.controls.completeName.value,
      shortName: this.orgStructForm.controls.shortName.value,
      deptDependUUID: (this.orgStructForm.controls.deptDependUUID.value !== '' ? this.orgStructForm.controls.deptDependUUID.value : null),
      phoneNumber: this.orgStructForm.controls.phoneNumber.value,
      extension: this.orgStructForm.controls.extension.value,
      accountCode: this.orgStructForm.controls.accountCode.value
    };

    console.log(orgPayload);

    this.CCService.saveOrganizationStructure(this.varToken, orgPayload).subscribe((data: any) => {

      if (data.code === '200') {
        // save data into locaStorage
        this.CCService.getOrganizationStructure(this.varToken, orgPayload).subscribe((callback: any) => {
          if (callback) {
            this.varOrgStruct = callback.data;
            // save data into localStorage
          }
        });
        this.orgAlertClosed = false;
        this.saveMsg = data.message;
        this.orgStructForm.controls['extension'].setValue(data.data.extension);
      }
      setTimeout(() => this.orgAlertClosed = true, 4000);
    }, err => {
        this.orgAlertClosed = false;
        this.saveMsg = err.status;

        if (err.status === 401) {
          console.log(err);
          alert(err.status);
        }
    });
  }

  orgAction() {

    this.orgStructForm.reset();
    this.orgAlertClosed = true;

    if (this.varOrgAction === 'Edit') {
      this.varOrgAction = 'New';

    } else {
      this.varOrgAction = 'Edit';

    }
  }


  getValues(orgUUID: any) {

    const getOrg =  this.varOrgStruct.find(dept => dept.department_uuid === orgUUID.value);

    this.orgStructForm.controls['deptDependUUID'].setValue(getOrg.department_dependant_uuid);
    this.orgStructForm.controls['completeName'].setValue(getOrg.complete_name);
    this.orgStructForm.controls['shortName'].setValue(getOrg.short_name);
    this.orgStructForm.controls['accountCode'].setValue(getOrg.account_code);
    this.orgStructForm.controls['extension'].setValue(getOrg.extension);
    this.orgStructForm.controls['phoneNumber'].setValue(getOrg.phone_number);


  }

}
