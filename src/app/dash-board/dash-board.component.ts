import { Component } from '@angular/core';
import { AppConfigService } from '../service/app-config.service';
import { IDivisions, IRole } from '../models/Ilocation';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-dash-board',
    imports: [],
    templateUrl: './dash-board.component.html',
    styleUrl: './dash-board.component.scss'
})
export class DashBoardComponent {
    divisions: IDivisions[] = [];
    roles: IRole[] = [];
    constructor(
        private appConfigService: AppConfigService,
        private dbService: NgxIndexedDBService
    ) {
        this.divisions = this.appConfigService.divisions;
        this.dbService.getAll('Dr_Reddys_roles').subscribe((result: any) => {
            this.roles = result || [];
        });
    }
}
