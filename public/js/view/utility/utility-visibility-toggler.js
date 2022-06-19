export const toggleVisiblity = (target, hiddenClass) => {
    const element = document.querySelector(target).classList;
    element.toggle(hiddenClass);
};
