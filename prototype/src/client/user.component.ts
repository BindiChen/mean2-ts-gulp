import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'app-content',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/views/applications/user/index.html'
})

export class UserComponent {

    title:string = "User page";
}