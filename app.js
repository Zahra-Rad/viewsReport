///// creating fake data

const data = [];

let now = new Date();

const monthDayCounts = [
  {
    month: 0,
    days: 31,
  },
  {
    month: 1,
    days: 28,
  },
  {
    month: 2,
    days: 31,
  },
  {
    month: 3,
    days: 30,
  },
  {
    month: 4,
    days: 31,
  },
  {
    month: 5,
    days: 30,
  },
  {
    month: 6,
    days: 31,
  },
  {
    month: 7,
    days: 31,
  },
  {
    month: 8,
    days: 30,
  },
  {
    month: 9,
    days: 31,
  },
  {
    month: 10,
    days: 30,
  },
  {
    month: 11,
    days: 31,
  },
];

let last3monthDays =
  monthDayCounts[now.getMonth()].days +
  monthDayCounts[now.getMonth() - 1].days +
  monthDayCounts[now.getMonth() - 2].days;

const last3month = [];

for (let i = 0; i < last3monthDays; i++) {
  let [x, y, z] = generateRandom(20);
  last3month.push(`${yearFormula()}/${monthFormula(i)}/${dayFormula(i)}`);
  data.push({
    date: last3month[i],
    todays_visits: x,
    todays_subscript: y,
    todays_watch: z,
    total_watch: "",
    total_visits: "",
    followers_count: "",
    alarm_on: "",
  });
}

data[data.length - 1].total_visits = Math.floor(Math.random() * 500 + 100);
data[data.length - 1].followers_count = Math.floor(
  Math.random() * data[data.length - 1].total_visits
);
data[data.length - 1].alarm_on = Math.floor(
  (Math.random() * data[data.length - 1].followers_count) / 2
);
data[data.length - 1].total_watch =
  data[data.length - 1].total_visits * Math.floor(Math.random() * 30);

for (let i = data.length - 2; i >= 0; i--) {
  data[i].total_visits = data[i].todays_visits + data[i + 1].total_visits;
  data[i].followers_count =
    Math.floor(Math.random() * data[i + 1].todays_visits) +
    data[i + 1].followers_count;
  data[i].alarm_on =
    Math.floor((Math.random() * data[i + 1].todays_subscript) / 2) +
    data[i + 1].alarm_on;
  data[i].total_watch =
    data[i + 1].todays_visits * Math.floor(Math.random() * 30) +
    data[i + 1].total_watch;
}
console.log(data);

let month_visits = 0;
let month_watch = 0;
for (let i = 0; i < 31; i++) {
  month_visits = month_visits + data[i].todays_visits;
  month_watch = month_watch + data[i].todays_watch;
}

function yearFormula() {
  return now.getMonth() - 2 < 0 ? now.getFullYear() - 1 : now.getFullYear();
}

function monthFormula(i) {
  let answer;
  if (now.getMonth() == 2 && i >= now.getDate() + 59) {
    answer = 12;
  } else if (now.getMonth() == 1 && i >= now.getDate() + 31) {
    i >= now.getDate() + 62 ? (answer = 11) : (answer = 12);
  } else if (now.getMonth() == 0 && i >= now.getDate()) {
    if (i >= now.getDate() + 61) {
      answer = 10;
    } else if (i >= now.getDate() + 31) {
      answer = 11;
    } else if (i >= now.getDate()) {
      answer = 12;
    }
  } else {
    if (i < now.getDate()) {
      answer = now.getMonth();
    } else if (i < now.getDate() + monthDayCounts[now.getMonth()].days) {
      answer = now.getMonth() - 1;
    } else {
      answer = now.getMonth() - 2;
    }
  }
  return answer;
}

function dayFormula(i) {
  let answer;
  let first =
    now.getDate() +
    monthDayCounts[now.getMonth() - 1].days +
    monthDayCounts[now.getMonth() - 2].days;
  let second = now.getDate() + monthDayCounts[now.getMonth() - 1].days;
  if (i < now.getDate()) {
    answer = now.getDate() - i;
  } else if (i >= now.getDate() && i < second) {
    answer = second - i;
  } else if (i >= second && i < first) {
    answer = first - i;
  } else {
    answer = monthDayCounts[now.getMonth() - 3].days - (i - first);
  }

  return answer;
}

function generateRandom(p) {
  let visit = Math.floor(Math.random() * p);
  let sub = Math.floor(Math.random() * visit);
  let watch = Math.floor(
    Math.random() * visit * (Math.floor(Math.random() * 30) + 10)
  );
  return [visit, sub, watch];
}

///// injecting html

const infos = document.querySelectorAll(".info");

infos.forEach((val, index) => {
  switch (index) {
    case 0:
      val.firstElementChild.innerHTML = data[0].followers_count;
      val.firstElementChild.nextElementSibling.innerHTML = "Followers";
      break;
    case 1:
      val.firstElementChild.innerHTML = data[0].total_visits;
      val.firstElementChild.nextElementSibling.innerHTML = "Total visits";
      break;
    case 2:
      val.firstElementChild.innerHTML = month_watch + " (minutes)";
      val.firstElementChild.nextElementSibling.innerHTML =
        "Watch Time<br>(Last Month)";
      break;
    case 3:
      val.firstElementChild.innerHTML = data[0].todays_visits;
      val.firstElementChild.nextElementSibling.innerHTML = "Today's Visits";
      break;
    case 4:
      val.firstElementChild.innerHTML = month_visits;
      val.firstElementChild.nextElementSibling.innerHTML = "Last Month Visits";
      break;
    case 5:
      val.firstElementChild.innerHTML = data[0].alarm_on;
      val.firstElementChild.nextElementSibling.innerHTML =
        "Users with Alarms On";
      break;

    default:
      break;
  }
});

///// chart info

const selector = document.querySelector("#selector");
const options = document.querySelectorAll("select>option");
const ctx = document.getElementById("myChart");
let total_visits_array = [];
let daily_visits_array = [];
let daily_sub_array = [];
let followers_count_array = [];

for (let i = 0; i < data.length; i++) {
  total_visits_array.push(data[i].total_visits);
  daily_visits_array.push(data[i].todays_visits);
  followers_count_array.push(data[i].followers_count);
  daily_sub_array.push(data[i].todays_subscript);
}
let period = 7;
selector.addEventListener("click", () => {
  selector.addEventListener("change", () => {
    switch (selector.value) {
      case "week":
        period = 7;
        break;
      case "month":
        period = 30;
        break;
      case "3-month":
        period = last3monthDays;
        break;
      default:
        break;
    }

    lineChart.data.labels = last3month.slice(0, period).reverse();
    lineChart.data.datasets[0].data = total_visits_array
      .slice(0, period)
      .reverse();
    lineChart.data.datasets[1].data = daily_visits_array
      .slice(0, period)
      .reverse();
    lineChart.data.datasets[2].data = followers_count_array
      .slice(0, period)
      .reverse();
    lineChart.data.datasets[3].data = daily_sub_array
      .slice(0, period)
      .reverse();
    lineChart.update();
  });
});
let lineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: last3month.slice(0, period).reverse(),
    datasets: [
      {
        label: "Total Visits",
        data: total_visits_array.slice(0, period).reverse(),
        borderWidth: 1,
      },
      {
        label: "Daily Visits",
        data: daily_visits_array.slice(0, period).reverse(),
        borderWidth: 1,
      },
      {
        label: "Followers",
        data: followers_count_array.slice(0, period).reverse(),
        borderWidth: 1,
      },
      {
        label: "Daily Subscription",
        data: daily_sub_array.slice(0, period).reverse(),
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

console.log(lineChart);
