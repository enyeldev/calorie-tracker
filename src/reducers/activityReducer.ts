import { Activity } from "../types";

export type ActivityActions =
  | {
      type: "save-activity";
      payload: { newActivity: Activity };
    }
  | { type: "save-activeIde"; payload: { id: Activity["id"] } }
  | { type: "delete-activity"; payload: { id: Activity["id"] } }
  | { type: "restart-app" };

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

const localStorageActivity = (): Activity[] => {
  const activities = localStorage.getItem("activities");
  return activities ? JSON.parse(activities) : [];
};

export const initialState: ActivityState = {
  activities: localStorageActivity(),
  activeId: "",
};

export const activityReducer = (
  state: ActivityState = initialState,
  action: ActivityActions
) => {
  if (action.type === "save-activity") {
    let updatedActivities: Activity[] = [
      ...state.activities,
      action.payload.newActivity,
    ];
    if (state.activeId) {
      updatedActivities = state.activities.map((activity) =>
        activity.id === state.activeId ? action.payload.newActivity : activity
      );
    } else {
      updatedActivities = [...state.activities, action.payload.newActivity];
    }

    return {
      ...state,
      activities: updatedActivities,
      activeId: "",
    };
  }

  if (action.type === "save-activeIde") {
    return {
      ...state,
      activeId: action.payload.id,
    };
  }

  if (action.type === "delete-activity") {
    const newArr = state.activities.filter((e) => e.id != action.payload.id);

    if (!newArr) {
      return {
        ...state,
      };
    }

    return {
      ...state,
      activities: newArr,
    };
  }

  if (action.type === "restart-app") {
    return {
      activities: [],
      activeId: "",
    };
  }

  return state;
};
