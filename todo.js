const router = require("express").Router();
const fs = require("fs/promises");
const moment = require("moment");

router.get("/", todosGet);
router.post("/", createTodo);
router.get("/delete/:id", deleteTodo)
router.patch("/:id", updateTodo)

async function todosGet(req, res) {
    const data = await fs.readFile("./data.json", "utf8");
    const todos = JSON.parse(data);

    todos.map(todo => {
        todo.createdAt = moment(todo.createdAt).locale("uz-latn").format("LLL")
    })

    res.render("todo", {
        todos
    })
}

async function createTodo(req, res) {
    const { title, description } = req.body;
    const data = await fs.readFile("./data.json", "utf8");
    const todos = JSON.parse(data);
    const newTodo = {
        id: todos.length + 1,
        title,
        description,
        createdAt: new Date(),
        completed: false
    }

    todos.push(newTodo);
    await fs.writeFile('./data.json', JSON.stringify(todos))
    res.redirect("/todos")
}

async function deleteTodo(req, res) {
    const { id } = req.params;

    const data = await fs.readFile("./data.json", "utf8");
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex(el => el.id == id);

    if (todoIndex < 0) { }

    todos.splice(todoIndex, 1);

    await fs.writeFile('./data.json', JSON.stringify(todos))
    res.redirect("/todos")
}

async function updateTodo(req, res) {
    const { id } = req.params;

    const data = await fs.readFile("./data.json", "utf8");
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex(el => el.id == id);

    todos[todoIndex] = {
        ...todos[todoIndex],
        ...req.body
    }

    await fs.writeFile("./data.json", JSON.stringify(todos));

    res.json({
        ok: true
    })
}

module.exports = router