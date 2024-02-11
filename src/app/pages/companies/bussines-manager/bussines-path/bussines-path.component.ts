import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { S3ManagerService } from 'src/app/services/s3-manager.service';
import { AddFlowCompanyComponent } from './add-flow-company/add-flow-company.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

const LIMIT_TRENDING_COURSE = 10

@Component({
  selector: 'app-bussines-path',
  templateUrl: './bussines-path.component.html',
  styleUrls: ['./bussines-path.component.sass']
})
export class BussinesPathComponent implements OnInit {

  trendingPath: any[] = []
  hasLimitCourse = false
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    center: false,
    autoWidth: false,
    margin: 25,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  idBussines: any
  filterForm: FormGroup;
  attr = ["id", "tag", "nombre"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['name', 'inscribed', 'completed', 'deserts',];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthCompanies = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: APIService,
    private storage: S3ManagerService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public utils: UtilsService,
  ) {
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })

    this.route.paramMap.subscribe(async params => {
      this.idBussines = params.get('id');
    });

  }

  async ngOnInit() {
    // trendings
    this.getTrending()
    
    // Own learnig paths
    this.getCompanyPaths("")

  }

  getCompanyPaths(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListFlowCompanybyCompanyID(this.idBussines, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;

      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthCompanies = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthCompanies = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  getTrending() {
    this.api.ListLearningPaths(undefined, LIMIT_TRENDING_COURSE, undefined).then((data) => {
      data.items.forEach(async (item) => {
        if (item != null) {
          item.keyImagePresentation = await this.storage.getUrlFile(item?.keyImagePresentation?.replace("public/",""))
          this.trendingPath.push(item)
          if (this.trendingPath.length > 4) {
            this.hasLimitCourse = true
          }
        }
      })
    })
  }

  openPathCatalog(path?) {
    const dialogRef = this.dialog.open(AddFlowCompanyComponent,
      {
        data: {
          companyId: this.idBussines,
          ...(path && { path })
        },
        width: "720px"
      })

    dialogRef.afterClosed().subscribe((result) => {

      if (result != "" && result != undefined && result != null) {
        const pathID = result
        const payload = {
          companyID: this.idBussines,
          pathID: pathID,
          inscribed: 0,
          completed: 0,
          deserts: 0,
        }
        this.api.CreateFlowCompany(payload).catch((err) => {
          console.error(err)
        }).finally(() => {
          this.utils.resetComponent()
        })
      }
    });
  }
}
