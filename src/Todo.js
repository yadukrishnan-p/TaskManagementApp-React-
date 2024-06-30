import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Todo() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    // const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // form validation
    const [valid, setValid] = useState(true);
    const [editTitleValid, setEditTitleValid] = useState(true);
    const [editDescriptionValid, setEditDescriptionValid] = useState(true);

    // Search items
    const [searchItems, setSearchItems] = useState("");

    // Edit

    const [edittitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";



    const handleSubmit = () => {
        // setError("")
        // check inputs
        if (title.trim() !== '' && description.trim() !== '') {
            setValid(true);
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    // add item to list
                    setTodos([...todos, { title, description }]);
                    // clear inputs before posted!
                    setTitle("");
                    setDescription("");
                    toast.success("Item added successfully!")
                    // setTimeout(() => {
                    //     toast.success("");
                    // }, 3000)
                } else {

                    // set error
                    toast.error("Unable to  create Todo Item")
                }

            }).catch(() => {
                toast.error("Unable to  create Todo Item")
            })


        }
        setValid(false);

    }


    useEffect(() => {
        getItems();
    }, [])

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json()
                .then((res) => {
                    setTodos(res);
                })
            )
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        // setError("")

        // Validate inputs before updating
        if (edittitle.trim() === '') {
            setEditTitleValid(false);
        } else {
            setEditTitleValid(true);
        }

        if (editDescription.trim() === '') {
            setEditDescriptionValid(false);
        } else {
            setEditDescriptionValid(true);
        }
        // check inputs before updated!
        if (edittitle.trim() !== '' && editDescription.trim() !== '') {
            setEditTitleValid(true);
            setEditDescriptionValid(true);
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: edittitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    // update item to list
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = edittitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    // clear inputs
                    setEditTitle("");
                    setEditDescription("");
                    toast.success("Item updated successfully!")
                    // setTimeout(() => {
                    //     setMessage("");
                    // }, 3000)

                    setEditId(-1)
                } else {
                    // set error
                    toast.error("Unable to  create Todo Item")
                }

            }).catch(() => {
                toast.error("Unable to  create Todo Item")
            })


        }
        // setEditTitleValid(false);
        // setEditDescriptionValid(false);
    }

    const handleEditCancel = () => {
        setEditId(-1);
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                })
        }
    }

    // search items 
    const handleSearchChange = (event) => {
        setSearchItems(event.target.value);
    };

    const filteredTodos = todos.filter(todo =>
        todo.title?.toLowerCase().includes(searchItems.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchItems.toLowerCase())
    );



    return (
        <>
            {/* navbar */}


            <nav className='navbar navbar-expand-lg navbar-light'>
                <form action="d-flex align-items-center">
                    <input id='searchInputs' className='form-control ms-5 bg-light' type="text" value={searchItems} placeholder='Search here!...' onChange={handleSearchChange} />
                </form>
            </nav>

<hr />
            <div className='row p-3 bg-success text-light text-center'>
                <h1>TASK MANAGEMENT APP  WITH MERN STACK</h1>
            </div>
            <div className="row my-2">
                <h3 style={{ fontFamily: 'fantacy', color: "#837f0c" }}>Add Item</h3>
                {/* {message && <p className='text-success'>{message}</p>} */}
                <div className="form-group d-flex gap-2">
                    <div className='w-50'>
                        <input placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='form-control' type="text" />
                        {!valid && title.trim() === '' && (
                            <div className='d-flex flex-column'>
                                <p className='text-danger' style={{ fontFamily: 'Times, "Times New Roman", Georgia, serif' }}>Title is required!</p>
                            </div>
                        )}
                    </div>
                    <div className='w-50'>
                        <input placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} className='form-control' type="text" />
                        {!valid && description.trim() === '' && (
                            <div className='d-flex flex-column'>
                                <p className='text-danger' style={{ fontFamily: 'Times, "Times New Roman", Georgia, serif' }}>Description is required!</p>
                            </div>
                        )}
                    </div>
                    <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
                </div>
                {error &&
                    <p className='text-danger'>{error}</p>
                }
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {filteredTodos ?
                            filteredTodos.map((item) => <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2' key={item._id}>
                                <div className="d-flex flex-column me-2">
                                    {
                                        editId == -1 || editId !== item._id ?
                                            <>
                                                <span className='fw-bold'>{item.title}</span>
                                                <span style={{ fontFamily: "Courier" }}>{item.description}</span>
                                            </> : <>
                                                <div className="form-group d-flex gap-2">
                                                    <div>
                                                        <input placeholder='Title' value={edittitle} onChange={(e) => setEditTitle(e.target.value)} className='form-control' type="text" />
                                                        {!editTitleValid && title.trim() === '' && (
                                                            <div className='d-flex flex-column'>
                                                                <p className='text-danger' style={{ fontFamily: "fantacy" }}>Title is required!</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='text-center align-items-center'>
                                                        <input placeholder='Description' value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className='form-control' type="text" />
                                                        {!editDescriptionValid && description.trim() === '' && (
                                                            <div className='d-flex flex-column'>
                                                                <p className='text-danger' style={{ fontFamily: "fantacy" }}>Description is required!</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                                <div className='d-flex gap-2'>
                                    {
                                        editId == -1 || editId !== item._id ?
                                            <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={handleUpdate}>Update</button>
                                    }
                                    {editId == -1 ? <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button> :
                                        <button className='btn btn-danger' onClick={handleEditCancel}>Cencel</button>
                                    }
                                </div>
                            </li>
                            ) : <h1>No datas!</h1>
                        }
                    </ul>
                </div>

            </div>
        </>
    )
}

export default Todo