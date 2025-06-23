function switchUnit() {
  const selected = document.querySelector('input[name="unit"]:checked').value;
  document.getElementById("metricFields").style.display = selected === "metric" ? "block" : "none";
  document.getElementById("imperialFields").style.display = selected === "imperial" ? "block" : "none";
}

function calculateBMI() {
  const unit = document.querySelector('input[name="unit"]:checked').value;
  let heightInMeters, weightInKg;

  if (unit === "metric") {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    if (!height || !weight || height <= 0 || weight <= 0) {
      alert("Please enter valid metric values.");
      return;
    }
    heightInMeters = height / 100;
    weightInKg = weight;
  } else {
    const feet = parseFloat(document.getElementById("feet").value);
    const inches = parseFloat(document.getElementById("inches").value);
    const pounds = parseFloat(document.getElementById("pounds").value);
    if ((!feet && feet !== 0) || (!inches && inches !== 0) || !pounds || feet < 0 || inches < 0 || pounds <= 0) {
      alert("Please enter valid imperial values.");
      return;
    }
    const totalInches = feet * 12 + inches;
    heightInMeters = totalInches * 0.0254;
    weightInKg = pounds * 0.453592;
  }

  const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);

  let category = "", tip = "", bg = "";

  if (bmi < 18.5) {
    category = "Underweight 😟";
    tip = "Eat more frequently, add healthy carbs and protein.";
    bg = "#ffeaa7";
  } else if (bmi < 25) {
    category = "Normal 😊";
    tip = "Great! Maintain your routine with balanced meals.";
    bg = "#a3f7bf";
  } else if (bmi < 30) {
    category = "Overweight 😐";
    tip = "Try portion control and regular walking/jogging.";
    bg = "#fab1a0";
  } else {
    category = "Obese 😨";
    tip = "Focus on low-impact cardio and healthy food swaps.";
    bg = "#ff7675";
  }

  document.getElementById("bmiValue").innerText = `Your BMI: ${bmi}`;
  document.getElementById("categoryText").innerText = category;
  document.getElementById("tipText").innerText = tip;

  const card = document.getElementById("tipCard");
  card.style.backgroundColor = bg;

  document.getElementById("resultBox").style.display = "block";

  saveToHistory(bmi, category);
  displayHistory();
}

function saveToHistory(bmi, category) {
  const history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
  const timestamp = new Date().toLocaleString();
  history.unshift({ bmi, category, time: timestamp });
  localStorage.setItem("bmiHistory", JSON.stringify(history.slice(0, 10)));
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";
    div.innerText = `${entry.time} → BMI: ${entry.bmi}, ${entry.category}`;
    historyDiv.appendChild(div);
  });
}

function clearHistory() {
  const confirmClear = confirm("Are you sure you want to clear your BMI history?");
  if (confirmClear) {
    localStorage.removeItem("bmiHistory");
    displayHistory();
  }
}

// THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  const toggleBtn = document.getElementById("themeToggle");
  toggleBtn.innerText = isDark ? "🌞 Light Mode" : "🌙 Dark Mode";
}

// LOAD THEME + HISTORY ON PAGE LOAD
window.onload = function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.getElementById("themeToggle").innerText = "🌞 Light Mode";
  }
  displayHistory();
};
