import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/api'; 

const ReportDownload = () => {
    const [city, setCity] = useState('');
    const [hours, setHours] = useState('24');
    const [downloadMessage, setDownloadMessage] = useState('');
    const [downloadError, setDownloadError] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloadMessage('');
        setDownloadError('');
        setIsDownloading(true);

        if (!city.trim() || !hours) {
            setDownloadError('Please enter a city and select a time range.');
            setIsDownloading(false);
            return;
        }

        try {
            const url = `${API_BASE_URL}/report?city=${encodeURIComponent(city)}&hours=${encodeURIComponent(hours)}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    setDownloadError(`Error: ${errorJson.error || 'Failed to download report.'}`);
                } catch {
                    setDownloadError(`HTTP error! Status: ${response.status}. ${errorText}`);
                }
                setIsDownloading(false);
                return;
            }

           
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `weather_report_${city}_${hours}h.json`;
            if (contentDisposition?.includes('filename=')) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);

            setDownloadMessage('✅ Report downloaded successfully!');
        } catch (error) {
            console.error('Error downloading report:', error);
            setDownloadError('❌ Failed to download report. Please check the server and try again.');
        }

        setIsDownloading(false);
    };

    return (
        <div className="report-download" style={{ padding: '1rem', maxWidth: '400px' }}>
            <h2>Download Weather Report</h2>
            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            />
            <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            >
                <option value="1">Last 1 Hour</option>
                <option value="5">Last 5 Hours</option>
                <option value="24">Last 24 Hours</option>
                <option value="48">Last 48 Hours</option>
                <option value="72">Last 72 Hours</option>
            </select>
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                style={{ width: '100%', padding: '0.5rem' }}
            >
                {isDownloading ? 'Downloading...' : 'Download Report'}
            </button>

            {downloadMessage && <p className="download-success" style={{ color: 'green' }}>{downloadMessage}</p>}
            {downloadError && <p className="download-error" style={{ color: 'red' }}>{downloadError}</p>}
        </div>
    );
};

export default ReportDownload;
