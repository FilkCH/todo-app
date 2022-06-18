export default class TodoController {
    #database;

    constructor(database) {
        this.#database = database;
    }

    async searchTodo(req, res) {
        const { host } = req.headers;
        const includeDoneTasks = req.query.include_done === 'true';
        const dbRecords = await this.#database.find(includeDoneTasks ? {} : { done: false });

        const response = {
            total: dbRecords.length,
            items: dbRecords.map(record => this.#transformDbRecord(host, record))
        }

        res.send(response);
    }

    async createTodo(req, res) {
        if (!req.body) {
            res.status(400).json({ message: 'Missing request data' })
            return;
        }

        if (!req.body.title || typeof req.body.title !== "string") {
            res.status(400).json({ message: 'Missing "title", which must be a string' })
            return;
        }

        if (!req.body.dueDate) {
            res.status(400).json({ message: 'Missing "dueDate"'});
            return;
        }

        const dueDate = new Date(req.body.dueDate);
        if (Number.isNaN(dueDate)) {
            res.status(400).json({ message: 'Property "dueDate" must be a valid RFC3339 date'});
            return;
        }

        if (!req.body.priority || typeof req.body.priority !== "number") {
            res.status(400).json({ message: 'Missing "priority", which must be a number' })
            return;
        }

        const newRecord = await this.#database.insert({
            creationDate: Date.now(),
            dueDate: dueDate.getTime(),
            title: req.body.title,
            done: false,
            priority: req.body.priority
        })

        res.header("Location", `http://${req.headers.host}/todos/${newRecord._id}`)
        res.status(201).send();
    }

    async getTodo(req, res) {
        const { host } = req.headers;
        const { taskId } = req.params;
        if (taskId?.length < 1) {
            res.status(404).json({message: 'Not found'});
            return;
        }

        const record = await this.#database.find({ _id: taskId });
        if (!record.length) {
            res.status(404).json({message: 'Not found'});
            return;
        }

        res.send(this.#transformDbRecord(host, record[0]))
    }

    patchTodo(req, res) {

    }

    async deleteTodo(req, res) {
        const { taskId } = req.params;
        if (taskId?.length < 1) {
            res.status(404).json({message: 'Not found'});
            return;
        }

        const totalDeletedRecords = await this.#database.remove({ _id: taskId });
        if (totalDeletedRecords === 0) {
            res.status(404).json({message: 'Not found'});
            return;
        }

        res.status(204).send();
    }

    // eslint-disable-next-line class-methods-use-this
    #transformDbRecord(host, record) {
        return {
            id: record._id,
            creationDate: new Date(record.creationDate).toISOString(),
            dueDate: new Date(record.dueDate).toISOString(),
            title: record.title,
            done: record.done,
            priority: record.priority,
            _links: {
                self: {
                    href: `http://${host}/todos/${record._id}`
                }
            }
        }
    }
}
