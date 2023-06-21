const DateTime = luxon.DateTime;

function TwoLineChart(ctx, labelData, thisYearData, beforeYearData) {
  const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

  const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labelData,
      datasets: [
        {
          label: "Y" + DateTime.now().toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#cb0c9f",
          borderWidth: 3,
          backgroundColor: gradientStroke1,
          fill: true,
          data: thisYearData,
          maxBarThickness: 6,
        },
        {
          label: "Y" + DateTime.now().minus({ years: 1 }).toFormat("yyyy"),
          tension: 0.4,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#3A416F",
          borderWidth: 3,
          backgroundColor: gradientStroke2,
          fill: true,
          data: beforeYearData,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
}

function TwoBlueBarChart(ctx, labels, beforeData, thisData, titleDisplay, titleText) {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "전년",
          data: beforeData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#BDCDD6"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
        {
          label: "금년",
          data: thisData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#6096B4"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          color: "white",
          display: true,
          font: {
            size: 15,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
        title: {
          display: titleDisplay,
          text: titleText,
          position: "bottom",
          font: {
            size: 15,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
        legend: {
          labels: {
            boxWidth: 30,
            boxHeight: 10,
          },
          display: true,
        },
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: false,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 10,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 10,
            font: {
              size: 10,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
}

function TwoBrownBarChart(ctx, labels, beforeData, thisData, titleDisplay, titleText) {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "전년",
          data: beforeData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#D0B8A8"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
        {
          label: "금년",
          data: thisData,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: ["#85586F"],
          datalabels: {
            align: "center",
            anchor: "center",
          },
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          color: "white",
          display: true,
          font: {
            size: 15,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
        title: {
          display: titleDisplay,
          text: titleText,
          position: "bottom",
          font: {
            size: 15,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
        legend: {
          labels: {
            boxWidth: 30,
            boxHeight: 10,
          },
          display: true,
        },
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: false,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 10,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 10,
            font: {
              size: 10,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
}

export { TwoLineChart, TwoBlueBarChart, TwoBrownBarChart };
