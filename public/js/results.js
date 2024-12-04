window.addEventListener('DOMContentLoaded', ()=>{
    generateChart();
})

function generateChart() {
    const candidates = [
        { name: "Walter White", votes: 12 },
        { name: "Hank Schrader", votes: 19 },
        { name: "Hector Salamanca", votes: 3 },
        { name: "Gustavo Fring", votes: 5 }
    ];
    const chartAttributes = createChartAttributes(candidates)
    createChart(chartAttributes.labels, chartAttributes.votes, chartAttributes.backgroundColor, chartAttributes.borderColor);
}

function createChartAttributes(candidates) {
    const labels = candidates.map(candidate => candidate.name);
    const votes = candidates.map(candidate => candidate.votes);
    const backgroundColor = generateColors(candidates.length);
    const borderColor = backgroundColor.map(color => color.replace("0.2", "1"));

    return { labels, votes, backgroundColor, borderColor };
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
    }
    return colors;
}

function createChart(labels, votes, backgroundColor, borderColor) {
    const ctx = document.getElementById('canvasChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Votes',
                data: votes,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: getOptions()
    });
}

function getOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Voting Results',
                font: {
                    size: 20,
                    weight: 'bold'
                },
                align: 'center'
            },
            legend: {
                labels: {
                    display: false,
                }
            },
            legend: {
                display: false
            }
        },
    }
}