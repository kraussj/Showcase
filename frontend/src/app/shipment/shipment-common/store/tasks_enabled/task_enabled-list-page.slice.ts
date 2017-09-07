import {TaskResource} from "../../api/resources/task.resource";

export interface EnabledTaskListSlice {
  enabledTaskList: TaskResource[];
  loading: boolean;
}
