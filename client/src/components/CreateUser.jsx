import React, { useState } from "react";
import * as XLSX from 'xlsx';
import Navbar from "./Navbar.jsx";
import validator from 'validator';

function CreateUser() {
    // State for form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // State for validation errors
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");

    // State for file upload
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [formatError, setFormatError] = useState(null);

    // State for uploaded data
    const [excelData, setExcelData] = useState(null);

    // Expected Excel columns
    const expectedColumns = ["firstName", "lastName", "email", "site_id"];

    // Handle file input change
    const handleFile = (e) => {
        const fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                const reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    setExcelFile(e.target.result);
                };
            } else {
                setTypeError('Please select only excel file types');
                setExcelFile(null);
            }
        } else {
            console.log('Please select your file');
        }
    };

    // Handle file upload submit
    const handleFileSubmit = (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = XLSX.read(excelFile, { type: 'buffer' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            // Validate the columns
            const actualColumns = Object.keys(data[0]);
            const isValidFormat = expectedColumns.every(col => actualColumns.includes(col));
            if (!isValidFormat) {
                setFormatError(`Invalid format. Expected columns: ${expectedColumns.join(', ')}`);
                setExcelData(null);
            } else {
                setFormatError(null);
                setExcelData(data.slice(0, 10)); // Display first 10 rows for example
            }
        }
    };

    // Validate and sanitize inputs
    const validateAndSanitizeInputs = () => {
        let isValid = true;

        // Name validation and sanitization
        if (validator.isEmpty(name)) {
            setNameError("Name is required");
            isValid = false;
        } else if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
            setNameError("Name can only contain letters and spaces");
            isValid = false;
        } else {
            setNameError("");
            setName(validator.trim(name));
            setName(validator.escape(name));
        }

        // Email validation and sanitization
        if (validator.isEmpty(email)) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!validator.isEmail(email)) {
            setEmailError("Invalid email format");
            isValid = false;
        } else {
            setEmailError("");
            setEmail(validator.normalizeEmail(email));
            setEmail(validator.escape(email));
        }

        return isValid;
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAndSanitizeInputs()) {
            // Handle user creation logic here
            console.log("User Created:", { name, email });
            setName("");
            setEmail("");
        }
    };

    // Generate and download sample Excel file
    const downloadSampleExcel = () => {
        const sampleData = [
            { firstName: "John", lastName: "Doe", email: "john.doe@example.com", site_id: 1 },
            { firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", site_id: 2 },
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "sample.xlsx");
    };

    return (
        <div className="p-6">
            <Navbar />
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create User</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Create User Via Excel</h3>

                <form className="form-group custom-form" onSubmit={handleFileSubmit}>
                    <input type="file" className="form-control mb-4" required onChange={handleFile} />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">UPLOAD</button>
                    {typeError && (
                        <div className="alert alert-danger mt-4" role="alert">{typeError}</div>
                    )}
                    {formatError && (
                        <div className="alert alert-danger mt-4" role="alert">{formatError}</div>
                    )}
                </form>

                <div className="mt-4">
                    <button
                        onClick={downloadSampleExcel}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Download Sample Excel
                    </button>
                </div>

                {excelData && (
                    <div className="viewer mt-6">
                        <div className="table-responsive">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        {Object.keys(excelData[0]).map((key) => (
                                            <th key={key} className="py-2 px-4 border-b">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((individualExcelData, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            {Object.keys(individualExcelData).map((key) => (
                                                <td key={key} className="py-2 px-4 border-b">{individualExcelData[key]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateUser;
