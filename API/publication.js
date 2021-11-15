const { Publication } = require("../database");

const Router = require("express").Router();
const PublicationModel = require("../schema/publication");
const BookModel = require("../schema/book");

//TODO: Student Task
/*
Route           /publication/new
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
});

// Route    - /:id
// Des      - To get a publication based on publication
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
Router.get("/:id", async (req, res) => {
    const getSpecificPub = await PublicationModel.findOne({
        id: parseInt(req.params.id),
    });

    if (!getSpecificPub) {
        return res.json({
            error: `No book found fot the ISBN of ${req.params.id}`,
        });
    }

    return res.json({ publication: getSpecificPub });
});

// Route    - /new
// Des      - To add new publication
// Access   - Public
// Method   - Post
// Params   - none
// Body     - none
Router.post("/new", async (req, res) => {
    try {
        const { newPublication } = req.body;

        await PublicationModel.create(newPublication);
        return res.json({ message: "Publication added to the database" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

// Route           /updateName
// Description     update title of a book
// Access          PUBLIC
// Parameters      isbn
// Method          PUT
Router.put("/updateName/:id", async (req, res) => {
    const { name } = req.body;
    const updatedPublication = await PublicationModel.findOneAndUpdate(
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

    return res.json({ publication: updatedPublication });
});

// Route       /book/updatePublication/:isbn
// Description update/add new author to a book
// Access      Public
// Paramteters isbn
// Method      put

Router.put("/book/updatePublication/:isbn", async (req, res) => {
    const { newPublication } = req.body;
    const { isbn } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            publication: parseInt(newPublication)
        },
        {
            new: true,
        }
    );

    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(newPublication),
        },
        {
            $addToSet: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        books: updatedBook,
        publication: updatedPublication,
        message: "New publication was added into the database",
    });
});

//TODO: Student Task
/*
Route               /publication/delete
Description         delete an publication
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    const updatedPublication = await PublicationModel.findOneAndDelete({
        id: parseInt(id)
    })

    return res.json({message:"Publication deleted is", publication: updatedPublication});
});

//TODO: Student Task
/*
Route               /publication/delete/book
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
Router.delete("/delete/book/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            publication : null
        },
        {
            new: true,
        }
    );

    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull: {
                books: isbn,
            },
        },
        {
            new: true,
        }
    );

    return res.json({
        message: "Publication was deleted",
        book: updatedBook,
        publication: updatedPublication,
    });
});

module.exports = Router;
