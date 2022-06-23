// Mustache.registerHelper("showNiceDate", (dueDate) => {
//     const locale = navigator.language;
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//
//     const date = new Date(dueDate).toLocaleDateString(locale);
//     if (date === new Date().toLocaleDateString(locale)) {
//         return "Heute fällig.";
//     }
//     if (date === new Date(tomorrow).toLocaleDateString(locale)) {
//         return "Morgen fällig."
//     }
//     return `Fällig am ${date}`;
// });
//
// // Set a checkbox to checked if conditions is met
// Handlebars.registerHelper("boxChecker", (done) => {if (!done) { return "" } return "checked"});
