import {
  NavigationState,
  NavigationContainer,
  NavigationActions,
  NavigationCompleteTransitionAction,
  NavigationLeafRoute,
  NavigationStateRoute
} from "react-navigation";
import cloneDeep from "lodash.clonedeep";
import { ReplacePreviousRouteToAction, ActionType } from "./actions";

type CreateOnReplacePreviousRouteToHandlerOptions = {
  navigationContainer: NavigationContainer;
};

export const createOnReplacePreviousRouteToHandler = (
  options: CreateOnReplacePreviousRouteToHandlerOptions
) => {
  const { navigationContainer } = options;

  let requireRemovePreviousRoute = false;

  return (
    state: NavigationState,
    action: ReplacePreviousRouteToAction | NavigationCompleteTransitionAction
  ) => {
    if (action.type === "Navigation/COMPLETE_TRANSITION") {
      const nextState = navigationContainer.router.getStateForAction(
        action,
        state
      );

      if (requireRemovePreviousRoute) {
        requireRemovePreviousRoute = false;

        const clonedNextState = cloneDeep(nextState);

        getCurrentRouteHelper(clonedNextState, currentRoute => {
          if (currentRoute.routes && currentRoute.index > -1) {
            const nextNestedRoute = currentRoute.routes[currentRoute.index];

            if (!nextNestedRoute.routes) {
              currentRoute.routes.splice(currentRoute.index - 1, 1);
              currentRoute.index--;

              return false;
            }
          }

          return true;
        });

        return clonedNextState;
      }

      return nextState;
    }

    if (action.type === ActionType.REPLACE_PREVIOUS_ROUTE_TO) {
      const nextState = navigationContainer.router.getStateForAction(
        NavigationActions.navigate(action),
        state
      );

      requireRemovePreviousRoute = true;

      return nextState;
    }
  };
};

export const getCurrentRouteHelper = (
  navigationState: NavigationState,
  predicate: (route: NavigationLeafRoute | NavigationStateRoute<any>) => boolean
): NavigationLeafRoute<any> | null => {
  if (!navigationState || !navigationState.routes) {
    return null;
  }

  const currentRoute = navigationState.routes[navigationState.index];

  if (predicate(currentRoute)) {
    return getCurrentRouteHelper(currentRoute as NavigationState, predicate);
  }

  return currentRoute;
};
