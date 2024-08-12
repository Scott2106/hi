import React, { useState, useEffect } from "react";
import ExcelJS from 'exceljs';
import Navbar from "./Navbar.jsx";
import validator from 'validator';
import { useParams } from 'react-router-dom';


// Mock data for site configurations
const mockSiteConfigs = {
    1: ["First name", "Last name", "Address"],
    2: ["First name", "Country", "Phone no"]
};

function CreateUser() {
    const { id } = useParams();  // Get the site ID from the URL parameters
    const [siteId, setSiteId] = useState(null);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);
    const [formatError, setFormatError] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [formFields, setFormFields] = useState([]);

    useEffect(() => {
        // Set the siteId from the URL parameter
        if (id) {
            setSiteId(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (siteId !== null) {
            fetchFormConfiguration();
        }
    }, [siteId]);

    const fetchFormConfiguration = () => {
        const fields = mockSiteConfigs[siteId] || [];
        setFormFields([...fields, "email"]); // Ensure "email" is always included
    };

    const handleFile = (e) => {
        const fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                const reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = async (e) => {
                    const buffer = e.target.result;
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(buffer);
                    const worksheet = workbook.worksheets[0];
                    const data = worksheet.getSheetValues().slice(1);
                    const headers = worksheet.getRow(1).values.slice(1);
                    const jsonData = data.map(row =>
                        row.reduce((acc, val, idx) => {
                            if (headers[idx]) acc[headers[idx]] = val;
                            return acc;
                        }, {})
                    );
                    setExcelFile(buffer);
                    setExcelData(jsonData);
                };
            } else {
                setTypeError('Please select only excel file types');
                setExcelFile(null);
            }
        } else {
            console.log('Please select your file');
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (excelFile !== null) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(excelFile);
            const worksheet = workbook.worksheets[0];
            const data = worksheet.getSheetValues().slice(1);
            const headers = worksheet.getRow(1).values.slice(1);
            const jsonData = data.map(row =>
                row.reduce((acc, val, idx) => {
                    if (headers[idx]) acc[headers[idx]] = val;
                    return acc;
                }, {})
            );

            const actualColumns = Object.keys(jsonData[0]);
            const isValidFormat = formFields.every(col => actualColumns.includes(col));
            if (!isValidFormat) {
                setFormatError(`Invalid format. Expected columns: ${formFields.join(', ')}`);
                setExcelData(null);
            } else {
                const timestamp = new Date().getTime();

                const processedData = jsonData.map(row => {
                    const userId = row.user_id;
                    const inviteUrl = `${window.location.origin}/invite?user_id=${userId}&site_id=${siteId}&timestamp=${timestamp}`;
                    return { ...row, inviteUrl };
                });

                setFormatError(null);
                setExcelData(processedData.slice(0, 10));

                setInvitedUsers(processedData);
            }
        }
    };

    const validateAndSanitizeInputs = () => {
        let isValid = true;

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAndSanitizeInputs()) {
            console.log("User Created:", { email });
            setEmail("");
        }
    };

    const handleInsertUrl = async () => {
        if (excelData !== null && excelData.length > 0) {
            const timestamp = new Date().getTime();
            const updatedData = excelData.map(row => {
                const userId = row.user_id;
                const inviteUrl = `${window.location.origin}/invite?user_id=${userId}&site_id=${siteId}&timestamp=${timestamp}`;
                return { ...row, inviteUrl };
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("UpdatedData");
            worksheet.columns = Object.keys(updatedData[0]).map(key => ({ header: key, key }));

            updatedData.forEach(data => {
                worksheet.addRow(data);
            });

            await workbook.xlsx.writeFile("Updated_Invite_URLs.xlsx");
        } else {
            alert("No data to update!");
        }
    };

    const downloadSampleExcel = async () => {
        const timestamp = new Date().getTime();

        const sampleData = formFields.reduce((acc, field) => {
            acc[field] = "";
            return acc;
        }, {});

        sampleData.email = "";
        sampleData.inviteUrl = `${window.location.origin}/invite?user_id=1&site_id=${siteId}&timestamp=${timestamp}`;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sample");

        worksheet.columns = Object.keys(sampleData).map(key => ({ header: key, key }));

        worksheet.addRow(sampleData);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <Navbar />

            {/* Create User Section */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create User</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Create User Via Excel Section */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Create User Via Excel</h2>
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
                {excelData && (
                    <div className="viewer mt-6">
                        <div className="table-responsive">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr>
                                        {Object.keys(excelData[0]).map((col, idx) => (
                                            <th key={idx} className="py-2 px-4 bg-gray-100 border-b">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((data, idx) => (
                                        <tr key={idx}>
                                            {Object.keys(data).map((col, index) => (
                                                <td key={index} className="py-2 px-4 border-b">{data[col]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {invitedUsers.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">List of Invited Users</h3>
                        <div className="table-responsive">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr>
                                        {Object.keys(invitedUsers[0]).map((col, idx) => (
                                            <th key={idx} className="py-2 px-4 bg-gray-100 border-b">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {invitedUsers.map((user, idx) => (
                                        <tr key={idx}>
                                            {Object.keys(user).map((col, index) => (
                                                <td key={index} className="py-2 px-4 border-b">{user[col]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={downloadSampleExcel}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Download Sample Excel
                    </button>
                    <button
                        onClick={handleInsertUrl}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Insert URL into Excel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;
