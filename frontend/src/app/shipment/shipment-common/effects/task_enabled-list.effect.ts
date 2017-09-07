import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {State} from "../../../app.reducers";
import * as actions from "../store/tasks_enabled/task_enabled-list-page.actions";
import {EnabledTaskListSlice} from "../store/tasks_enabled/task_enabled-list-page.slice";
import {Observable} from "rxjs/Observable";
import {TaskService} from "../api/task.service";
import {RequestEnabledTasksFailedAction, RequestEnabledTasksSuccessfulAction} from "../store/tasks_enabled/task_enabled-list-page.actions";

@Injectable()
export class EnabledTaskListEffect {

  constructor(private _actions: Actions,
              private _taskService: TaskService,
              private _store: Store<State>) {
  }

  @Effect() loadEnabledTasks = this._actions
    .ofType(actions.REQUEST_ENABLED_TASKS)
    .withLatestFrom(this._store, (action, state) => state.enabledTaskListSlice)
    .switchMap((enabledTaskListSlice: EnabledTaskListSlice) => {
      return this._taskService.findEnabledTasks();
    })
    .map(enabledTaskListSlice => new RequestEnabledTasksSuccessfulAction(enabledTaskListSlice))
    .catch(() => Observable.of(new RequestEnabledTasksFailedAction()));

}
