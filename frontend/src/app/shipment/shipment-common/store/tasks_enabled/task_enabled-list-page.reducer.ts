import {ActionReducer, Action} from "@ngrx/store";
import * as actions from "./task_enabled-list-page.actions";
import {ENABLED_TASK_LIST_SLICE_INITIAL_STATE} from "./task_enabled-list-page.initial-state";
import {EnabledTaskListSlice} from "./task_enabled-list-page.slice";

export function enabledTaskListPageReducer(state: EnabledTaskListSlice = ENABLED_TASK_LIST_SLICE_INITIAL_STATE,
                                    action: Action): EnabledTaskListSlice {
    switch (action.type) {
      case actions.INITIALIZE_ENABLED_TASK_LIST:
        return ENABLED_TASK_LIST_SLICE_INITIAL_STATE;
      case actions.REQUEST_ENABLED_TASKS:
        return Object.assign({}, state, {
          loading: true
        });
      case actions.REQUEST_ENABLED_TASKS_SUCCESSFUL:
        const requestEnabledTasksSuccessfulAction = action as actions.RequestEnabledTasksSuccessfulAction;
        return Object.assign({}, state, {
          enabledTaskList: requestEnabledTasksSuccessfulAction.payload.tasks,
          loading: false
        });
      case actions.REQUEST_ENABLED_TASKS_FAILED:
        return Object.assign({}, state, {
          loading: false
        });
      default:
        return state;
    }
  }

export const ENABLED_TASK_LIST_PAGE_REDUCER: ActionReducer<EnabledTaskListSlice> = enabledTaskListPageReducer;
