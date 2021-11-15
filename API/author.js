const Router = require("express").Router();
const AuthorModel = require("../schema/author");

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

// Route     /author/new
// Description add new author
// Access PUBLIC
// Parameters NONE
// METHOD POST
Router.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "Author added to the database" });
});

//TODO: Studen Task
// Route       /author/updateName/:id
// Description Update name of the author
// Access      Public
// Parameters  id
// Method      Put
// Params in the req.body are always in string format
Router.put("/author/updateName/:id", async (req, res) => {
    const { name } = req.body;
    console.log(name);
    console.log(parseInt(req.params.id))
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id),
            
        },
        {
            name: name,
        },
        {
            new: true,
        }
    );
    return res.json({ author: updatedAuthor });
});

//TODO: Student Task
/*
Route               /author/delete
Description         delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/author/delete/:id", async (req, res) => {
    const { id } = req.params;

    const updatedAuthor = await AuthorModel.findOneAndDelete
    (
        {
            id: parseInt(id)
        }
    )
    return res.json({message: "Author deleted is", author: updatedAuthor});
});

module.exports = Router;
