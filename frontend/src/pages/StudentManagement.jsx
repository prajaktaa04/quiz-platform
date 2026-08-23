import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

function StudentManagement() {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");


    // ==========================================
    // FETCH STUDENTS
    // ==========================================

    useEffect(() => {
        fetchStudents();
    }, []);


    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/student/admin/all`,
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
                    "Failed to fetch students"
                );
            }

            setStudents(
                data.students || []
            );

        } catch (error) {

            console.error(
                "Fetch students error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "/";
    };


    // ==========================================
    // BACK TO ADMIN DASHBOARD
    // ==========================================

    const goBack = () => {

        window.location.href = "/";
    };


    // ==========================================
    // UPDATE STUDENT STATUS
    // ==========================================

    const toggleStatus = async (student) => {

        const newStatus =
            student.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";


        const confirmed =
            window.confirm(
                `Are you sure you want to make ${student.name} ${newStatus.toLowerCase()}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/student/admin/${student._id}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            status: newStatus
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update student status"
                );
            }


            setStudents(
                previous =>
                    previous.map(
                        item =>
                            item._id === student._id
                                ? {
                                    ...item,
                                    status:
                                        newStatus
                                }
                                : item
                    )
            );

        } catch (error) {

            console.error(
                "Update student status error:",
                error
            );

            alert(
                error.message
            );
        }
    };


    // ==========================================
    // DELETE STUDENT
    // ==========================================

    const deleteStudent = async (student) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to permanently delete ${student.name}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${API_URL}/student/admin/${student._id}`,
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
                    "Failed to delete student"
                );
            }


            setStudents(
                previous =>
                    previous.filter(
                        item =>
                            item._id !==
                            student._id
                    )
            );

        } catch (error) {

            console.error(
                "Delete student error:",
                error
            );

            alert(
                error.message
            );
        }
    };


    // ==========================================
    // FILTER STUDENTS
    // ==========================================

    const filteredStudents =
        useMemo(() => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            return students.filter(
                student => {

                    const name =
                        student.name || "";

                    const email =
                        student.email || "";


                    const matchesSearch =
                        !searchText ||
                        name
                            .toLowerCase()
                            .includes(searchText) ||
                        email
                            .toLowerCase()
                            .includes(searchText);


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        student.status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            students,
            search,
            statusFilter
        ]);


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalStudents =
        students.length;


    const activeStudents =
        students.filter(
            student =>
                student.status === "ACTIVE"
        ).length;


    const inactiveStudents =
        students.filter(
            student =>
                student.status === "INACTIVE"
        ).length;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="student-management-loading">

                <div className="student-management-spinner"></div>

                <h2>
                    Loading Students
                </h2>

                <p>
                    Please wait...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="student-management-error-page">

                <div className="student-management-error-card">

                    <h2>
                        Unable to load students
                    </h2>

                    <p>
                        {error}
                    </p>

                    <div className="student-management-error-actions">

                        <button
                            type="button"
                            onClick={fetchStudents}
                        >
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={goBack}
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="student-management-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="student-management-header">

                <div>

                    <h1>
                        Student Management
                    </h1>

                    <p>
                        Manage registered students
                        and their account status
                    </p>

                </div>


                <div className="student-management-header-actions">

                    <button
                        type="button"
                        className="student-management-back-button"
                        onClick={goBack}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        type="button"
                        className="student-management-logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="student-management-container">


                {/* ==================================
                    STATISTICS
                ================================== */}

                <section className="student-management-stats">

                    <div className="student-management-stat-card">

                        <span>
                            Total Students
                        </span>

                        <strong>
                            {totalStudents}
                        </strong>

                    </div>


                    <div className="student-management-stat-card active">

                        <span>
                            Active Students
                        </span>

                        <strong>
                            {activeStudents}
                        </strong>

                    </div>


                    <div className="student-management-stat-card inactive">

                        <span>
                            Inactive Students
                        </span>

                        <strong>
                            {inactiveStudents}
                        </strong>

                    </div>

                </section>


                {/* ==================================
                    FILTERS
                ================================== */}

                <section className="student-management-filters">

                    <div>

                        <label>
                            Search Students
                        </label>

                        <input
                            type="text"
                            value={search}
                            placeholder="Search by name or email..."
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    <div>

                        <label>
                            Account Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={
                                event =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                            }
                        >

                            <option value="ALL">
                                All Students
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                        </select>

                    </div>

                </section>


                {/* ==================================
                    STUDENT LIST
                ================================== */}

                <section className="student-management-section">

                    <div className="student-management-section-heading">

                        <div>

                            <h2>
                                Registered Students
                            </h2>

                            <p>
                                {filteredStudents.length}{" "}
                                student
                                {filteredStudents.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>

                        </div>

                    </div>


                    {filteredStudents.length === 0 ? (

                        <div className="student-management-empty">

                            <h3>
                                No students found
                            </h3>

                            <p>
                                Try changing your
                                search or status filter.
                            </p>

                        </div>

                    ) : (

                        <div className="student-management-table-wrapper">

                            <table className="student-management-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Joined
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredStudents.map(
                                        student => (

                                            <tr
                                                key={
                                                    student._id
                                                }
                                            >

                                                <td>

                                                    <div className="student-management-student">

                                                        <div className="student-avatar">

                                                            {student.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    student.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                STUDENT
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        student.email
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            student.status ===
                                                            "ACTIVE"
                                                                ? "student-status active"
                                                                : "student-status inactive"
                                                        }
                                                    >
                                                        {
                                                            student.status
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {student.createdAt
                                                        ? new Date(
                                                            student.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"}

                                                </td>


                                                <td>

                                                    <div className="student-management-actions">

                                                        <button
                                                            type="button"
                                                            className={
                                                                student.status ===
                                                                "ACTIVE"
                                                                    ? "student-deactivate-button"
                                                                    : "student-activate-button"
                                                            }
                                                            onClick={() =>
                                                                toggleStatus(
                                                                    student
                                                                )
                                                            }
                                                        >

                                                            {student.status ===
                                                            "ACTIVE"
                                                                ? "Deactivate"
                                                                : "Activate"}

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="student-delete-button"
                                                            onClick={() =>
                                                                deleteStudent(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default StudentManagement;