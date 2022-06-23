export const errorClassToggler = (value) => {
  const titleClasses = document.querySelector("#title").classList;

  if (value) {
    titleClasses.add("error");
  } else {
    titleClasses.remove("error");
  }
};
