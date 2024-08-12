import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, TimeScale } from 'chart.js';
import { api_group_3 } from '@/interceptors/axios';
import 'chartjs-adapter-date-fns';
import { useParams } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, TimeScale);

const SiteReportSetting = () => {
    const [reports, setReports] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    const [secondaryTab, setSecondaryTab] = useState('Day');
    const { siteId } = useParams();

    const fetchReports = async () => {
        try {
            const response = await api_group_3.get(`/rp/${siteId}/srp`);
            const data = response.data;

            if (!Array.isArray(data)) {
                setErrorMessages({ message: 'Invalid response format' });
            } else if (data.length === 0) {
                setErrorMessages({ message: 'No reports found.' });
            } else {
                setReports(data.reverse());
                setErrorMessages({});
            }
        } catch (error) {
            console.error("Error fetching reports!", error);
            setErrorMessages({ message: error.response?.data?.message || 'Error fetching reports.' });
        }
    };

    useEffect(() => {
        if (siteId) {
            fetchReports();
        }
    }, [siteId]);

    const handleSecondaryTabClick = (tab) => {
        setSecondaryTab(tab);
    };

    const handleGenerateReportClick = async () => {
        try {
            const response = await api_group_3.post(`/rp/srp`, {
                period: secondaryTab,
                siteId: siteId,
            });

            console.log('Report generated:', response.data);
            fetchReports();
        } catch (error) {
            console.error("Error generating report!", error);
            setErrorMessages({ message: error.response?.data?.message || 'Error generating report.' });
        }
    };

    const filteredReports = reports.filter(report =>
        report.reportDescription.toLowerCase().includes(secondaryTab.toLowerCase())
    );

    const extractDateAndCount = () => {
        return reports.map(report => {
            const countMatch = report.reportDescription.match(/\d+/);
            return {
                date: new Date(report.createdAt),
                count: countMatch ? parseInt(countMatch[0], 10) : 0,
            };
        });
    };

    const chartData = {
        labels: extractDateAndCount().map(item => item.date),
        datasets: [{
            label: `Number of ${secondaryTab.toLowerCase()}`,
            data: extractDateAndCount().map(item => item.count),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: `Number of ${secondaryTab.toLowerCase()}`,
                },
            },
        },
        legend: {
            labels: {
                boxWidth: 0,
            }
        }
    };

    return (
        <div className="report-setting d-flex flex-column vh-100">
            <div className="container d-flex flex-column">
                <div className="d-flex">
                    <div className="left-container w-50 d-flex flex-column align-items-center">
                        <h1 className="mt-5 mb-4 font-weight-bold">Site Reports</h1>

                        <div className="card w-75 mb-4">
                            <div className="card-body">
                                <div className="mt-3 mb-3">
                                    <ul className="nav nav-tabs">
                                        {['Day', 'Week', 'Month', 'Year'].map((tab) => (
                                            <li className="nav-item" key={tab}>
                                                <a
                                                    className={`nav-link ${secondaryTab === tab ? 'active' : ''}`}
                                                    onClick={() => handleSecondaryTabClick(tab)}
                                                >
                                                    {tab}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="report-list" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                                    {errorMessages.message ? (
                                        <div className="text-danger mt-2">{errorMessages.message}</div>
                                    ) : (
                                        <ul className="list-group">
                                            {filteredReports.map((report, index) => (
                                                <li key={index} className="list-group-item">
                                                    <p><strong>Report Title:</strong> {report.reportTitle}</p>
                                                    <p><strong>Report Type:</strong> {report.reportType}</p>
                                                    <p><strong>Description:</strong> {report.reportDescription}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <button
                                className="btn btn-primary d-block mx-auto mt-1 mb-3"
                                style={{ width: '300px' }}
                                onClick={handleGenerateReportClick}>
                                Generate Report
                            </button>
                        </div>
                    </div>

                    <div className="right-container w-50 d-flex align-items-center justify-content-center">
                        <div className="card w-75 mb-4">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteReportSetting;