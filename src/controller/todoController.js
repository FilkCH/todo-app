export default class TodoController {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async searchTodo(req, res) {
    const { host } = req.headers;
    const includeDoneTodos = req.query.include_done === "true";
    const dbRecords = await this.#database.find(
      includeDoneTodos ? {} : { done: false }
    );
    const { sortBy, sortOrder } = req.query;

    if (sortBy) {
      dbRecords.sort((a, b) => a[sortBy] - b[sortBy]);
    }

    if (sortOrder) {
      if (sortOrder === "asc") dbRecords.reverse();
    }

    const response = {
      total: dbRecords.length,
      items: dbRecords.map((record) =>
        this.constructor.transformDbRecord(host, record)
      ),
    };

    res.send(response);
  }

  async saveTodo(req, res) {
    if (!req.body) {
      res.status(400).json({ message: "Missing request data 🤔" });
      return;
    }

    if (!req.body.title) {
      res.status(400).json({ message: 'Missing "title" 🤔' });
      return;
    }

    if (typeof req.body.title !== "string") {
      res.status(400).json({ message: 'Property "title" must be a string 😠' });
      return;
    }

    if (!req.body.dueDate) {
      res.status(400).json({ message: 'Missing "dueDate" 🤔' });
      return;
    }

    const dueDate = new Date(req.body.dueDate);

    if (Number.isNaN(dueDate)) {
      res
        .status(400)
        .json({
          message: 'Property "dueDate" must be a valid RFC 3339 date 😠',
        });
      return;
    }

    if (!req.body.priority) {
      res.status(400).json({ message: 'Missing "priority" 🤔' });
      return;
    }

    if (typeof req.body.priority !== "number") {
      res
        .status(400)
        .json({ message: 'Property "priority" must be a number 😠' });
      return;
    }
    const { _id } = req.body;

    await this.#database
      .update(
        {
          _id,
        },
        {
          creationDate: Date.now(),
          dueDate: req.body.priority.dueDate?.getTime() || Date.now(),
          title: req.body.title,
          done: false,
          priority: req.body.priority,
        },
        {
          upsert: true,
          returnUpdatedDocs: true,
        }
      )
      .then((data) => {
        res.header("Location", `http://${req.headers.host}/todos/${data._id}`);
        res.status(201).send(data);
      });
  }

  async getTodo(req, res) {
    const { host } = req.headers;
    const { todoId } = req.params;

    if (todoId?.length < 1) {
      res.status(404).json({ message: "Not found 😱" });
      return;
    }

    const record = await this.#database.find({ _id: todoId });
    if (!record.length) {
      res.status(404).json({ message: "Not found 😱" });
      return;
    }

    res.send(this.constructor.transformDbRecord(host, record[0]));
  }

  async deleteTodo(req, res) {
    const { todoId } = req.params;

    if (todoId?.length < 1) {
      res.status(404).json({ message: "Not found 😱" });
      return;
    }

    const totalDeletedRecords = await this.#database.remove({ _id: todoId });

    if (totalDeletedRecords === 0) {
      res.status(404).json({ message: "Not found 😱" });
      return;
    }

    res.status(204).send();
  }

  static transformDbRecord(host, record) {
    return {
      _id: record._id,
      creationDate: new Date(record.creationDate).toISOString(),
      dueDate: new Date(record.dueDate).toISOString(),
      title: record.title,
      done: record.done,
      priority: record.priority,
      _links: {
        self: {
          href: `http://${host}/todos/${record._id}`,
        },
      },
    };
  }
}
