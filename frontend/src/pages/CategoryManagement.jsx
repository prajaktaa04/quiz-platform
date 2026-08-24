import { useEffect, useState } from "react";

import API_URL from "../config";

function CategoryManagement() {
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH CATEGORIES
    // ==========================================

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch categories"
                );
            }

            setCategories(
                data.categories || []
            );

        } catch (err) {
            console.error(
                "Fetch categories error:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);


    // ==========================================
    // CREATE / UPDATE CATEGORY
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            setError(
                "Category name is required"
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const url = editingId
                ? `${API_URL}/categories/${editingId}`
                : `${API_URL}/categories`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        description:
                            description.trim()
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save category"
                );
            }

            if (editingId) {

                setCategories(
                    previous =>
                        previous.map(
                            category =>
                                category._id ===
                                editingId
                                    ? data.category
                                    : category
                        )
                );

            } else {

                setCategories(
                    previous => [
                        data.category,
                        ...previous
                    ]
                );
            }

            resetForm();

        } catch (err) {
            console.error(
                "Save category error:",
                err
            );

            setError(err.message);

        } finally {
            setSaving(false);
        }
    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setName("");
        setDescription("");
        setEditingId(null);
        setError("");
    };


    // ==========================================
    // EDIT CATEGORY
    // ==========================================

    const handleEdit = (category) => {
        setEditingId(category._id);
        setName(category.name);
        setDescription(
            category.description || ""
        );

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // DELETE CATEGORY
    // ==========================================

    const handleDelete = async (category) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${category.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/categories/${category._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete category"
                );
            }

            setCategories(
                previous =>
                    previous.filter(
                        item =>
                            item._id !==
                            category._id
                    )
            );

            if (
                editingId ===
                category._id
            ) {
                resetForm();
            }

        } catch (err) {
            console.error(
                "Delete category error:",
                err
            );

            setError(err.message);
        }
    };


    // ==========================================
    // BACK TO ADMIN DASHBOARD
    // ==========================================

    const backToDashboard = () => {
        window.location.href = "/";
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="admin-loading">
                <h2>
                    Loading categories...
                </h2>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="category-page">

            {/* HEADER */}

            <header className="category-header">

                <div>
                    <h1>
                        Category Management
                    </h1>

                    <p>
                        Create and manage quiz
                        categories
                    </p>
                </div>

                <button
                    type="button"
                    className="category-back-button"
                    onClick={backToDashboard}
                >
                    ← Back to Dashboard
                </button>

            </header>


            <main className="category-container">


                {/* FORM */}

                <section className="category-form-card">

                    <div className="category-form-heading">

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Category"
                                    : "Create Category"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update the category details."
                                    : "Add a new category for quizzes."}
                            </p>
                        </div>

                    </div>


                    {error && (
                        <div className="category-error">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="category-form"
                    >

                        <div className="category-form-group">

                            <label htmlFor="category-name">
                                Category Name
                            </label>

                            <input
                                id="category-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. JavaScript"
                                disabled={saving}
                            />

                        </div>


                        <div className="category-form-group">

                            <label htmlFor="category-description">
                                Description
                            </label>

                            <textarea
                                id="category-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Describe this category..."
                                rows="4"
                                disabled={saving}
                            />

                        </div>


                        <div className="category-form-actions">

                            <button
                                type="submit"
                                className="category-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Category"
                                    : "Create Category"}
                            </button>


                            {editingId && (
                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </section>


                {/* CATEGORY LIST */}

                <section className="category-list-section">

                    <div className="category-section-heading">

                        <div>

                            <h2>
                                Categories
                            </h2>

                            <p>
                                {categories.length}{" "}
                                {categories.length === 1
                                    ? "category"
                                    : "categories"}
                            </p>

                        </div>

                    </div>


                    {categories.length === 0 ? (

                        <div className="category-empty">

                            <h3>
                                No categories yet
                            </h3>

                            <p>
                                Create your first
                                category above.
                            </p>

                        </div>

                    ) : (

                        <div className="category-list">

                            {categories.map(
                                category => (

                                    <div
                                        className="category-card"
                                        key={category._id}
                                    >

                                        <div className="category-card-content">

                                            <h3>
                                                {category.name}
                                            </h3>

                                            <p>
                                                {category.description ||
                                                    "No description provided."}
                                            </p>

                                        </div>


                                        <div className="category-card-actions">

                                            <button
                                                type="button"
                                                className="category-edit-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        category
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="category-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        category
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default CategoryManagement;