export const listTemplate = `
    {{#items}}
        <article data-done="{{done}}" data-id="{{_id}}" class="todo-item">
            <h2>{{title}}</h2>
            <span class="due-date">{{dueDate}}</span>
            <div data-done="{{done}}" class="status"><input type="checkbox" class="tick" name="checkbox" {{#done}}checked{{/done}}></div>
            <div class="priority" data-priority="{{priority}}"></div>
            <div class="tool edit" data-action="edit" data-toggle-visibility="data-popup"><span class="material-icons md-24" title="Klicken um die Notiz zu bearbeiten">edit</span></div>
            <div class="tool delete" data-action="delete"><span class="material-icons md-24" title="Klicken um die Notiz zu löschen">delete</span></div>
        </article>
    {{/items}}
`;

export const emptyListTemplate = `
    <div class="no-notes">
        <span class="material-icons">sentiment_very_satisfied</span>
        Aktuell keine Pendenzen vorhanden.
    </div>
`;
