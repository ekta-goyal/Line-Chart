const data = [
  {
    endpoint: "/home",
    time: "2023-10-08T02:18:17.735Z",
    requests: 2364,
    special: true,
  },
  { endpoint: "/home", time: "2023-10-07T02:23:17.735Z", requests: 1132 },
  {
    endpoint: "/home",
    time: "2023-10-06T02:03:17.735Z",
    requests: 3433,
    special: true,
  },
  { endpoint: "/product", time: "2023-10-07T02:13:17.735Z", requests: 1563 },
  { endpoint: "/product", time: "2023-10-06T02:12:17.735Z", requests: 1563 },
  {
    endpoint: "/contact",
    time: "2023-10-07T02:13:17.735Z",
    requests: 2298,
    special: true,
  },
  {
    endpoint: "/product",
    time: "2023-10-08T02:17:17.735Z",
    requests: 3198,
    special: true,
  },
  {
    endpoint: "/contact",
    time: "2023-10-08T02:13:17.735Z",
    requests: 1950,
    special: true,
  },
  { endpoint: "/contact", time: "2023-10-06T02:01:17.735Z", requests: 2800 },
];

const ctx = document.getElementById("lineChart").getContext("2d");
let chart;

function initializeChart(data) {
  const endpoints = [...new Set(data.map((item) => item.endpoint))];
  const datasets = endpoints.map((endpoint) => {
    const endpointData = data
      .filter((item) => item.endpoint === endpoint)
      .map((item) => ({ x: new Date(item.time), y: item.requests }));
    return {
      label: endpoint,
      data: endpointData,
      borderColor: randomColor(),
      fill: false,
    };
  });

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "MMM dd yyyy",
            },
          },
          title: {
            display: true,
            text: "Date/Time",
          },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 0,
            maxTicksLimit: 10,
            min: new Date(data[0].time).setHours(0, 0, 0, 0), 
            max: new Date(data[data.length - 1].time).setHours(23, 59, 59, 999),
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Requests",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              const date = new Date(context.raw.x).toLocaleString();
              return `${label}: ${date} - ${context.raw.y} requests`;
            },
          },
        },
      },
    },
  });
}

function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function filterDateRange() {
  const startDate = new Date(document.getElementById("start-date").value);
  const endDate = new Date(document.getElementById("end-date").value);
  const filteredData = data.filter(
    (item) => new Date(item.time) >= startDate && new Date(item.time) <= endDate
  );
  initializeChart(filteredData);
}

function filterEndpoint() {
  const endpoint = document.getElementById("endpoint-filter").value;
  const filteredData =
    endpoint === "all" ? data : data.filter((item) => item.special === true);
  initializeChart(filteredData);
}

initializeChart(data);

const endpointFilter = document.getElementById("endpoint-filter");
const endpoints = [...new Set(data.map((item) => item.endpoint))];
endpoints.forEach((endpoint) => {
  const option = document.createElement("option");
  option.value = endpoint;
  option.textContent = endpoint;
  endpointFilter.appendChild(option);
});
