import { createListenerMiddleware } from "@reduxjs/toolkit";
import { ipcRenderer } from "electron";
import { RootState } from "../store";

const operations = ["__rtkq", "data"];

// Create the middleware instance and methods
const listenerMiddleware = createListenerMiddleware();

// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
listenerMiddleware.startListening({
  predicate: (action) => {
    const { type = "" } = action;
    const [prefix] = type.split("/");
    console.log("predicate", prefix);
    // console.log("operation", type);
    return operations.includes(prefix);
    // console.log("listener predicate", action, currentState, previousState);
    // return true;
  },
  effect: async (action, listenerApi) => {
    const { type = "", payload } = action;
    const [prefix, operation]: [keyof RootState | "__rtkq", string] = type.split("/");
    // console.log("effect opt", action);
    const currentState = listenerApi.getState() as RootState;
    const state = prefix == "__rtkq" ? null : currentState[prefix];
    console.log("effect", prefix, payload);
    switch (prefix) {
      case "__rtkq":
        {
          // rtkqHandler({
          //   operation,
          //   payload,
          //   dispatch: listenerApi.dispatch
          // });
        }
        break;
      case "data":
        {
          switch (operation) {
            case "updateAddModalVisible":
              {
                ipcRenderer.send("add-view-modal", { visible: payload });
                console.log("effect updateAddModalVisible");
              }
              break;
            case "addServer":
              {
                ipcRenderer.send("add-view", { data: payload });
                console.log("effect add server");
              }
              break;
            case "removeServer":
              {
                ipcRenderer.send("remove-view", { url: payload });
                console.log("effect remove server");
              }
              break;
            case "switchServer":
              {
                ipcRenderer.send("switch-view", { url: payload });
                console.log("effect switch server");
              }
              break;

            default:
              break;
          }
        }
        break;

      default:
        break;
    }
  }
});

export default listenerMiddleware;
