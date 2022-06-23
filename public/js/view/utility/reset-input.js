import { dataFormElements, doneCheckbox, priorityThree } from "./selectors.js";
import { errorClassToggler } from "./error-handler.js";

// Reset all data from input elements and reset the errors
export const resetInputFields = () => {
  dataFormElements.setid.value = "";
  dataFormElements.title.value = "";
  dataFormElements.duedate.value = new Date().toISOString().slice(0, 10);
  doneCheckbox.checked = false;
  priorityThree.checked = true;
  errorClassToggler(false);
};
