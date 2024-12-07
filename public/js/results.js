window.addEventListener('DOMContentLoaded', ()=>{
    generateChart();
})

async function generateChart() {
    let response = await fetch('http://localhost:12000/candidates');
    let candidates = await response.json();
    let chartAttributes = createChartAttributes(candidates)
    createChart(chartAttributes.labels, chartAttributes.votes, chartAttributes.backgroundColor, chartAttributes.borderColor);
}

function createChartAttributes(candidates) {
    candidates.sort((a, b) => b.vote_count - a.vote_count);

    let labels = candidates.map(candidate => candidate.first_name + ' ' + candidate.last_name);
    let votes = candidates.map(candidate => candidate.vote_count);
    let backgroundColor = generateColors(candidates.length);
    let borderColor = backgroundColor.map(color => color.replace("0.2", "1"));

    return { labels, votes, backgroundColor, borderColor };
}

function generateColors(count) {
    let colors = [];
    for (let i = 0; i < count; i++) {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
    }
    return colors;
}

function createChart(labels, votes, backgroundColor, borderColor) {
    let ctx = document.getElementById('canvasChart').getContext('2d');
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
                display: false
            }
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    beginAtZero: true
                },
            }
        }
    };
}
