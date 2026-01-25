document.addEventListener('DOMContentLoaded', () => {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const uptimeElement = document.getElementById('uptime');
    const lastUpdated = document.getElementById('last-updated');

    // Simulate System Check
    setTimeout(() => {
        statusDot.classList.add('status-online');
        statusText.innerText = 'SYSTEM ONLINE';
    }, 1500);

    // Update Time
    const now = new Date();
    lastUpdated.innerText = `Last Updated: ${now.toLocaleTimeString()}`;

    // Simple Uptime Counter
    let seconds = 0;
    setInterval(() => {
        seconds++;
        uptimeElement.innerText = `${seconds}s`;
    }, 1000);

    console.log("Dashboard Loaded Successfully!");
});