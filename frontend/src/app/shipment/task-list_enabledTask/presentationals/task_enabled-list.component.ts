import {Component, Input, Output, EventEmitter} from "@angular/core";
import {TaskResource} from "../../shipment-common/api/resources/task.resource";
import {EnabledTaskListRowModel} from "../container/task_enabled-list-page.model";

@Component({
    selector: "educama-enabled-task-list",
    templateUrl: "./task_enabled-list.component.html"
})
export class EnabledTaskListComponent {

    @Input()
    public enabledTaskList: EnabledTaskListRowModel[];

    @Output()
    public selectedEnabledTask: TaskResource = new TaskResource();

    @Output()
    public taskSelectedEvent: EventEmitter<string> = new EventEmitter();

    public onRowSelect(event: Event) {
      // todo: Add new service
    }
}
