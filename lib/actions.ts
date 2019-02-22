import { NavigationNavigateActionPayload } from "react-navigation";

export enum ActionType {
  REPLACE_PREVIOUS_ROUTE_TO = "REPLACE_PREVIOUS_ROUTE_TO"
}

export type ReplacePreviousRouteToAction = {
  type: ActionType.REPLACE_PREVIOUS_ROUTE_TO;
} & NavigationNavigateActionPayload;

export const replacePreviousRouteTo = (
  payload: NavigationNavigateActionPayload
): ReplacePreviousRouteToAction => ({
  type: ActionType.REPLACE_PREVIOUS_ROUTE_TO,
  ...payload
});
