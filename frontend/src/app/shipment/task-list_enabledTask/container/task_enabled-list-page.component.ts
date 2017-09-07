import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";
import {EnabledTaskListModel, EnabledTaskListRowModel} from "./task_enabled-list-page.model";
import {State} from "../../../app.reducers";
import {Address} from "../../../customer/customer-common/api/datastructures/address.datastructure";
import {Router} from "@angular/router";
import {EnabledTaskListSlice} from "../../shipment-common/store/tasks_enabled/task_enabled-list-page.slice";
import {InitializeEnabledTaskListAction,
        RequestEnabledTasksAction} from "../../shipment-common/store/tasks_enabled/task_enabled-list-page.actions";


@Component({
    selector: "educama-task-list-page",
    templateUrl: `./task_enabled-list-page.component.html`
})
export class EnabledTaskListPageComponent implements OnInit, OnDestroy {

    // relevant slice of store and subscription for this slice
    public enabledTaskListSlice: Observable<EnabledTaskListSlice>;
    public enabledTaskListSliceSubscription: Subscription;

    // model for the page
    public enabledTaskListModel: EnabledTaskListModel = new EnabledTaskListModel();

    constructor(private _router: Router,
                private _store: Store<State>) {

        this.enabledTaskListSlice = this._store.select(state => state.enabledTaskListSlice);
        this.enabledTaskListSliceSubscription = this.enabledTaskListSlice
            .subscribe(enabledTaskListSlice => this.updateEnabledTaskListModel(enabledTaskListSlice));
    }

    public ngOnInit() {
        this._store.dispatch(new RequestEnabledTasksAction());
    }
D
    public ngOnDestroy() {
        this._store.dispatch(new InitializeEnabledTaskListAction());
        this.enabledTaskListSliceSubscription.unsubscribe();
    }

    // ***************************************************
    // Event Handler
    // ***************************************************

    public onTaskSelectedEvent(trackingId: string) {
        // todo: Add new service
    }

    // ***************************************************
    // Data Retrieval
    // ***************************************************

    private updateEnabledTaskListModel(enabledTaskListSlice: EnabledTaskListSlice) {
        this.enabledTaskListModel.enabledTaskList =
          enabledTaskListSlice.enabledTaskList.map(
                taskResource => new EnabledTaskListRowModel(
                    taskResource.trackingId,
                    taskResource.name,
                    taskResource.description,
                    this.formatAddress(taskResource.sender.address),
                    this.formatAddress(taskResource.receiver.address))
            );

    }
    private formatAddress(address: Address): string {
        let formatedAddress = "";
        formatedAddress += address.street + " ";
        formatedAddress += address.streetNo + ", ";
        formatedAddress += address.zipCode + " ";
        formatedAddress += address.city;
        return formatedAddress;
    }
}
