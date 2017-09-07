import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {EnabledTaskListPageComponent} from "./container/task_enabled-list-page.component";
import {EnabledTaskListComponent} from "./presentationals/task_enabled-list.component";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EnabledTaskListPageComponent,
    EnabledTaskListComponent
  ],
  exports: [
    EnabledTaskListPageComponent
  ]
})
export class EnabledTaskListModule {
}
