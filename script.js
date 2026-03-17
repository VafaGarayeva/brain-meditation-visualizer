// 1. Elementləri seçirik
const ctx = document.getElementById('hormoneChart').getContext('2d');
const slider = document.getElementById('slider');
const sleepSlider = document.getElementById('sleep-slider');
const minutesText = document.getElementById('minutes');
const sleepText = document.getElementById('sleep-hours');
const statusText = document.getElementById('status-text');
const brain = document.getElementById('brain-core');

// SVG elementləri
const vCortex = document.getElementById('v-cortex');
const vAmygdala = document.getElementById('v-amygdala');
const stressPulse = document.getElementById('stress-pulse');
const brainWaves = document.getElementById('brain-waves');

// 2. Elmi məlumat bazası
const scienceData = [
  { min: 0, text: "Yüksək stress Amygdala-nı aktivləşdirir və fokuslanmağı çətinləşdirir.", source: "Source: Harvard Health" },
  { min: 10, text: "10 dəqiqəlik meditasiya qanda kortizol səviyyəsini 15% azalda bilər.", source: "Source: Journal of Neuroscience" },
  { min: 25, text: "25 dəqiqədən sonra beyində Alpha dalğaları artır, bu da yaradıcılığı tətikləyir.", source: "Source: MIT Research" },
  { min: 45, text: "Uzunmüddətli meditasiya Prefrontal Cortex-də neyron sıxlığını artırır (Neuroplasticity).", source: "Source: PubMed / Nature" }
];

// 3. Qrafiki yaradırıq (Chart.js)
let hormoneChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Cortisol (Stress)', 'Serotonin (Happiness)'],
        datasets: [{
            label: 'Səviyyə %',
            data: [80, 20],
            backgroundColor: ['#ef4444', '#00ffcc']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

// 4. Əsas funksiya: Hər şey burada hesablanır
function updateData() {
    let medTime = parseInt(slider.value);
    let sleepTime = parseInt(sleepSlider.value);
    
    // Ekranda rəqəmləri yeniləyirik
    minutesText.innerHTML = medTime;
    sleepText.innerHTML = sleepTime;

    // --- DATA LOGIC ---
    // Yuxu azdırsa stress daha yüksək olur (baza stress)
    let baseStress = 100 - (sleepTime * 8); 
    let cortisol = baseStress - (medTime * 0.5);
    cortisol = Math.max(5, Math.min(95, cortisol)); // Sərhədlər daxilində saxla
    let serotonin = 100 - cortisol;

    // Mood Score (Əhval balı)
    let moodScore = (medTime * 1.5) + (sleepTime * 5) - (cortisol * 0.2);
    moodScore = Math.min(100, Math.max(0, moodScore));

    // Qrafiki yenilə
    hormoneChart.data.datasets[0].data = [cortisol, serotonin];
    hormoneChart.update();

    // --- VISUAL LOGIC ---
    // Status mətni
    statusText.innerHTML = `Status: ${getStatus(moodScore)} | Mood Score: ${Math.round(moodScore)}%`;

    // Amygdala vizualı (Stress)
    let stressLevel = cortisol / 100;
    vAmygdala.style.opacity = stressLevel;
    vAmygdala.setAttribute('r', 8 + (stressLevel * 10));
    stressPulse.setAttribute('dur', (0.2 + (1 - stressLevel)) + 's');

    // Cortex vizualı (Fokus)
    vCortex.style.opacity = 0.2 + (medTime / 60);
    vCortex.style.fill = medTime > 30 ? "#00ffcc" : "#3b82f6";

    // Brainwaves (Dalğalar) - Mood 70-i keçəndə görünür
    if (moodScore > 70) {
        brainWaves.style.opacity = (moodScore - 70) / 30;
    } else {
        brainWaves.style.opacity = 0;
    }

    // Elmi faktı yenilə
    updateInsights(medTime);
}

// 5. Köməkçi funksiyalar
function getStatus(score) {
    if (score > 80) return "Super Zen State 🧘‍♂️";
    if (score > 50) return "Balanced & Focused 🧠";
    if (score > 20) return "Restless / Alert ⚡";
    return "High Stress Mode 🔥";
}

function updateInsights(val) {
    const factText = document.getElementById('fact-text');
    const sourceText = document.getElementById('source-text');
    const fact = [...scienceData].reverse().find(f => val >= f.min);
    if (fact) {
        factText.innerHTML = fact.text;
        sourceText.innerHTML = fact.source;
    }
}

// 6. Dinləyicilər (Event Listeners)
slider.oninput = updateData;
sleepSlider.oninput = updateData;

// Səhifə açılanda bir dəfə işlət
updateData();
