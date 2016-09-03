import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'app-content',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/views/applications/admin/index.html'
})

export class AdminComponent {

    title:string = "Admin page";
}