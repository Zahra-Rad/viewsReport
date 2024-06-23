///// creating fake data /////

const { Chart } = require("chart.js");

const data = []; // the main fake data
const dates = []; // where we store dates

let now = new Date();

const days_of_month = [
  // how many days each month has
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

let months = []; // where i hold months

for (let i = 0; i < 90; i++) {
  // produce dates
  months.push(clac_month(i));
  months = [...new Set(months)]; // for having 3 numbers that show months

  let [x, y, z] = generate_random(); //random numbers generated for daily statics

  dates.push(`${calc_year(i)}/${clac_month(i)}/${calc_day(i)}`); // producing dates

  data.push({
    date: dates[i],
    todays_visits: x,
    todays_subscript: y,
    todays_watch: z,
    total_watch: "",
    total_visits: "",
    followers_count: "",
    alarm_on: "",
  });
}

// producing random data for totals in index[last]

data[data.length - 1].total_visits = Math.floor(Math.random() * 100 + 100);
data[data.length - 1].followers_count = Math.floor(
  Math.random() * data[data.length - 1].total_visits
);
data[data.length - 1].alarm_on = Math.floor(
  (Math.random() * data[data.length - 1].followers_count) / 2
);
data[data.length - 1].total_watch =
  data[data.length - 1].total_visits * Math.floor(Math.random() * 30);

//

// calcing the rest of the indexes total amounts

for (let i = data.length - 2; i >= 0; i--) {
  data[i].total_visits = data[i].todays_visits + data[i + 1].total_visits;
  data[i].followers_count =
    data[i].todays_subscript + data[i + 1].followers_count;
  data[i].alarm_on =
    Math.floor((Math.random() * data[i].todays_subscript) / 2) +
    data[i + 1].alarm_on;
  data[i].total_watch = data[i].todays_watch + data[i + 1].total_watch;
}

//

function calc_year(i) {
  let answer;
  let temp = [...months];
  if (
    temp
      .sort(function (a, b) {
        return b - a;
      })
      .toString() != months.toString()
  ) {
    if (months.toString() == "2,1,12" && i + 1 > now.getDate() + 31) {
      answer = now.getFullYear() - 1;
    } else if (months.toString() == "1,12,11" && i + 1 > now.getDate()) {
      answer = now.getFullYear() - 1;
    } else {
      answer = now.getFullYear();
    }
  } else {
    answer = now.getFullYear();
  }
  return answer;
}

function clac_month(i) {
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
    } else if (i <= now.getDate() + days_of_month[now.getMonth()].days) {
      answer = now.getMonth() - 1;
    } else if (
      i <
      now.getDate() +
        days_of_month[now.getMonth()].days +
        days_of_month[now.getMonth() - 1].days
    ) {
      answer = now.getMonth() - 2;
    } else {
      answer = now.getMonth() - 3;
    }
  }
  return answer;
}

function calc_day(i) {
  let answer;
  let first =
    now.getDate() +
    days_of_month[now.getMonth() - 1].days +
    days_of_month[now.getMonth() - 2].days;
  let second = now.getDate() + days_of_month[now.getMonth() - 1].days;
  if (i < now.getDate()) {
    answer = now.getDate() - i;
  } else if (i >= now.getDate() && i < second) {
    answer = second - i;
  } else if (i >= second && i < first) {
    answer = first - i;
  } else {
    answer = days_of_month[now.getMonth() - 3].days - (i - first);
  }

  return answer;
}

function generate_random() {
  let visit = Math.floor(Math.random() * 20);
  let sub = Math.floor(Math.random() * visit);
  let watch = Math.floor(
    Math.random() * visit * (Math.floor(Math.random() * 30) + 10)
  );
  return [visit, sub, watch];
}

console.log(data);

///////////////////////////////

let _30_day_visits = 0;
let _30_day_watch = 0;
for (let i = 0; i < 30; i++) {
  _30_day_visits = _30_day_visits + data[i].todays_visits;
  _30_day_watch = _30_day_watch + data[i].todays_watch;
}

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
      val.firstElementChild.innerHTML = _30_day_watch + " (minutes)";
      val.firstElementChild.nextElementSibling.innerHTML =
        "Watch Time<br>(Last Month)";
      break;
    case 3:
      val.firstElementChild.innerHTML = data[0].todays_visits;
      val.firstElementChild.nextElementSibling.innerHTML = "Today's Visits";
      break;
    case 4:
      val.firstElementChild.innerHTML = _30_day_visits;
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

/////////////////////////////

const ctx = document.getElementById("myChart");

let lineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: dates.slice(0, 6).reverse(),
    datasets: [
      {
        label: "Total Visits",
        data: [total_visits_array.slice(0, 6).reverse()],
        borderWidth: 1,
      },
      {
        label: "Daily Visits",
        data: daily_visits_array.slice(0, 6).reverse(),
        borderWidth: 1,
      },
      {
        label: "Followers",
        data: followers_count_array.slice(0, 6).reverse(),
        borderWidth: 1,
      },
      {
        label: "Daily Subscription",
        data: daily_sub_array.slice(0, 6).reverse(),
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

lineChart.update();
