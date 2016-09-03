import { Component } from 'angular2/core';
import { Headers, Http } from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { UserComponent } from './user.component.js';
import { AdminComponent } from './admin.component.js';

// Register routers
@RouteConfig([
    {path: '/user', component: UserComponent, name: 'User', useAsDefault: true},
    {path: '/admin', component: AdminComponent, name: 'Admin'}
])

@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/views/landing/index.html'
})

export class AppComponent {

}