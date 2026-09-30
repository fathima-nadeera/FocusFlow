/* =====================================
   FOCUSFLOW
   POMODORO TIMER
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================
           TIMER MODES
        ================================= */

        const modes = {

            focus: 25 * 60,

            short: 5 * 60,

            long: 15 * 60

        };


        let currentMode = "focus";

        let timeLeft = modes.focus;

        let timerInterval = null;

        let isRunning = false;


        /* =================================
           SAVED DATA
        ================================= */

        let sessions =
            Number(
                localStorage.getItem(
                    "focusflowSessions"
                )
            ) || 0;


        let focusMinutes =
            Number(
                localStorage.getItem(
                    "focusflowMinutes"
                )
            ) || 0;


        let sessionHistoryData =
            JSON.parse(
                localStorage.getItem(
                    "focusflowHistory"
                )
            ) || [];


        /* =================================
           DOM ELEMENTS
        ================================= */

        const timerDisplay =
            document.querySelector(
                ".timer"
            );


        const startBtn =
            document.getElementById(
                "startBtn"
            );


        const resetBtn =
            document.getElementById(
                "resetBtn"
            );


        const sessionCount =
            document.getElementById(
                "sessionCount"
            );


        const focusTime =
            document.getElementById(
                "focusTime"
            );


        const goalText =
            document.getElementById(
                "goalText"
            );


        const progressFill =
            document.getElementById(
                "progressFill"
            );


        const taskInput =
            document.getElementById(
                "taskInput"
            );


        const modeButtons =
            document.querySelectorAll(
                ".mode"
            );


        const notification =
            document.getElementById(
                "notification"
            );


        const notificationTitle =
            document.getElementById(
                "notificationTitle"
            );


        const notificationMessage =
            document.getElementById(
                "notificationMessage"
            );


        const sessionHistory =
            document.getElementById(
                "sessionHistory"
            );


        const clearHistoryBtn =
            document.getElementById(
                "clearHistoryBtn"
            );


        const resetProgressBtn =
            document.getElementById(
                "resetProgressBtn"
            );


        const weeklyChart =
            document.getElementById(
                "weeklyChart"
            );


        const weeklyTotal =
            document.getElementById(
                "weeklyTotal"
            );


        const statusIndicator =
            document.getElementById(
                "statusIndicator"
            );


        const statusText =
            document.getElementById(
                "statusText"
            );


        const themeToggle =
            document.getElementById(
                "themeToggle"
            );


        /* =================================
           THEME
        ================================= */

        function updateThemeButton() {

            if (
                document.body.classList.contains(
                    "light-theme"
                )
            ) {

                themeToggle.textContent =
                    "☀️";

                themeToggle.setAttribute(
                    "aria-label",
                    "Switch to dark theme"
                );

            }

            else {

                themeToggle.textContent =
                    "🌙";

                themeToggle.setAttribute(
                    "aria-label",
                    "Switch to light theme"
                );

            }

        }


        function loadTheme() {

            const savedTheme =
                localStorage.getItem(
                    "focusflowTheme"
                );


            if (
                savedTheme === "light"
            ) {

                document.body.classList.add(
                    "light-theme"
                );

            }


            updateThemeButton();

        }


        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-theme"
                );


                const isLight =
                    document.body.classList.contains(
                        "light-theme"
                    );


                localStorage.setItem(
                    "focusflowTheme",
                    isLight
                        ? "light"
                        : "dark"
                );


                updateThemeButton();

            }
        );


        /* =================================
           PAGE TITLE
        ================================= */

        function updatePageTitle() {

            if (
                currentMode === "focus"
            ) {

                document.title =
                    `${timerDisplay.textContent} • FocusFlow`;

            }

            else if (
                currentMode === "short"
            ) {

                document.title =
                    `${timerDisplay.textContent} • Short Break`;

            }

            else {

                document.title =
                    `${timerDisplay.textContent} • Long Break`;

            }

        }


        /* =================================
           TIMER DISPLAY
        ================================= */

        function updateDisplay() {

            const minutes =
                Math.floor(
                    timeLeft / 60
                );


            const seconds =
                timeLeft % 60;


            timerDisplay.textContent =
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


            updatePageTitle();

        }


        /* =================================
           STATUS
        ================================= */

        function updateStatus(
            status
        ) {

            statusIndicator.className =
                "status-indicator";


            if (
                status === "focus"
            ) {

                statusIndicator.classList.add(
                    "focus"
                );


                statusText.textContent =
                    isRunning
                        ? "Focusing"
                        : "Ready to Focus";

            }


            else if (
                status === "short"
            ) {

                statusIndicator.classList.add(
                    "short"
                );


                statusText.textContent =
                    isRunning
                        ? "Taking a Short Break"
                        : "Short Break";

            }


            else if (
                status === "long"
            ) {

                statusIndicator.classList.add(
                    "long"
                );


                statusText.textContent =
                    isRunning
                        ? "Taking a Long Break"
                        : "Long Break";

            }


            else if (
                status === "paused"
            ) {

                statusIndicator.classList.add(
                    "paused"
                );


                statusText.textContent =
                    "Paused";

            }

        }


        /* =================================
           STATISTICS
        ================================= */

        function updateStats() {

            sessionCount.textContent =
                sessions;


            focusTime.textContent =
                `${focusMinutes} min`;


            const dailyGoal = 4;


            const progress =
                Math.min(
                    (sessions / dailyGoal) * 100,
                    100
                );


            goalText.textContent =
                `${Math.min(
                    sessions,
                    dailyGoal
                )} / ${dailyGoal} Sessions`;


            progressFill.style.width =
                `${progress}%`;

        }


        /* =================================
           SOUND
        ================================= */

        function playSound() {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContext) {

                return;

            }


            const audioContext =
                new AudioContext();


            const oscillator =
                audioContext.createOscillator();


            const gainNode =
                audioContext.createGain();


            oscillator.connect(
                gainNode
            );


            gainNode.connect(
                audioContext.destination
            );


            oscillator.frequency.value =
                800;


            oscillator.type =
                "sine";


            gainNode.gain.setValueAtTime(
                0.2,
                audioContext.currentTime
            );


            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.8
            );


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime + 0.8
            );

        }


        /* =================================
           NOTIFICATION
        ================================= */

        function showNotification(
            title,
            message
        ) {

            notificationTitle.textContent =
                title;


            notificationMessage.textContent =
                message;


            notification.classList.add(
                "show"
            );


            setTimeout(
                () => {

                    notification.classList.remove(
                        "show"
                    );

                },
                3500
            );

        }


        /* =================================
           START / PAUSE
        ================================= */

        function startTimer() {

            if (isRunning) {

                clearInterval(
                    timerInterval
                );


                isRunning = false;


                startBtn.textContent =
                    "Start";


                updateStatus(
                    "paused"
                );


                return;

            }


            isRunning = true;


            startBtn.textContent =
                "Pause";


            updateStatus(
                currentMode
            );


            timerInterval =
                setInterval(
                    () => {

                        timeLeft--;


                        updateDisplay();


                        if (
                            timeLeft <= 0
                        ) {

                            clearInterval(
                                timerInterval
                            );


                            isRunning = false;


                            startBtn.textContent =
                                "Start";


                            playSound();


                            completeSession();

                        }

                    },
                    1000
                );

        }


        /* =================================
           RESET TIMER
        ================================= */

        function resetTimer() {

            clearInterval(
                timerInterval
            );


            isRunning = false;


            timeLeft =
                modes[currentMode];


            startBtn.textContent =
                "Start";


            updateDisplay();


            updateStatus(
                currentMode
            );

        }


        /* =================================
           CHANGE MODE
        ================================= */

        function changeMode(
            mode
        ) {

            clearInterval(
                timerInterval
            );


            isRunning = false;


            currentMode = mode;


            timeLeft =
                modes[mode];


            startBtn.textContent =
                "Start";


            modeButtons.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            if (
                mode === "focus"
            ) {

                modeButtons[0]
                    .classList.add(
                        "active"
                    );

            }

            else if (
                mode === "short"
            ) {

                modeButtons[1]
                    .classList.add(
                        "active"
                    );

            }

            else {

                modeButtons[2]
                    .classList.add(
                        "active"
                    );

            }


            updateDisplay();


            updateStatus(
                mode
            );

        }


        /* =================================
           ADD HISTORY
        ================================= */

        function addSessionHistory() {

            const now =
                new Date();


            const year =
                now.getFullYear();


            const month =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const dateKey =
                `${year}-${month}-${day}`;


            const session = {

                type:
                    "Focus Session",

                duration:
                    "25 min",

                date:
                    dateKey,

                time:
                    now.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )

            };


            sessionHistoryData.unshift(
                session
            );


            sessionHistoryData =
                sessionHistoryData.slice(
                    0,
                    10
                );


            localStorage.setItem(
                "focusflowHistory",
                JSON.stringify(
                    sessionHistoryData
                )
            );


            renderHistory();


            renderWeeklySummary();

        }


        /* =================================
           RENDER HISTORY
        ================================= */

        function renderHistory() {

            sessionHistory.innerHTML =
                "";


            if (
                sessionHistoryData.length === 0
            ) {

                sessionHistory.innerHTML = `

                    <div class="empty-history">

                        No sessions completed yet.

                    </div>

                `;

                return;

            }


            sessionHistoryData.forEach(
                session => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "history-item";


                    item.innerHTML = `

                        <div class="history-left">

                            <div class="history-icon">
                                🍅
                            </div>


                            <div>

                                <div class="history-title">
                                    ${session.type}
                                </div>


                                <div class="history-time">
                                    ${session.date || "Previous"} • ${session.time}
                                </div>

                            </div>

                        </div>


                        <div class="history-duration">
                            ${session.duration}
                        </div>

                    `;


                    sessionHistory.appendChild(
                        item
                    );

                }
            );

        }


        /* =================================
           WEEKLY SUMMARY
        ================================= */

        function renderWeeklySummary() {

            const today =
                new Date();


            const days = [];


            for (
                let i = 6;
                i >= 0;
                i--
            ) {

                const date =
                    new Date();


                date.setDate(
                    today.getDate() - i
                );


                days.push(
                    date
                );

            }


            const counts =
                days.map(
                    day => {

                        const year =
                            day.getFullYear();


                        const month =
                            String(
                                day.getMonth() + 1
                            ).padStart(
                                2,
                                "0"
                            );


                        const date =
                            String(
                                day.getDate()
                            ).padStart(
                                2,
                                "0"
                            );


                        const dateKey =
                            `${year}-${month}-${date}`;


                        return sessionHistoryData
                            .filter(
                                session =>
                                    session.date ===
                                    dateKey
                            )
                            .length;

                    }
                );


            const total =
                counts.reduce(
                    (sum, count) =>
                        sum + count,
                    0
                );


            weeklyTotal.textContent =
                total;


            const maxCount =
                Math.max(
                    ...counts,
                    1
                );


            weeklyChart.innerHTML =
                "";


            days.forEach(
                (day, index) => {

                    const column =
                        document.createElement(
                            "div"
                        );


                    column.className =
                        "day-column";


                    const count =
                        counts[index];


                    const height =
                        (count / maxCount) *
                        100;


                    const dayName =
                        day.toLocaleDateString(
                            [],
                            {
                                weekday:
                                    "short"
                            }
                        );


                    column.innerHTML = `

                        <div class="day-count">
                            ${count}
                        </div>


                        <div class="day-bar-container">

                            <div
                                class="day-bar"
                                style="height: ${Math.max(
                                    height,
                                    5
                                )}%">

                            </div>

                        </div>


                        <div class="day-name">
                            ${dayName}
                        </div>

                    `;


                    weeklyChart.appendChild(
                        column
                    );

                }
            );

        }


        /* =================================
           COMPLETE SESSION
        ================================= */

        function completeSession() {

            if (
                currentMode === "focus"
            ) {

                sessions++;

                focusMinutes += 25;


                localStorage.setItem(
                    "focusflowSessions",
                    sessions
                );


                localStorage.setItem(
                    "focusflowMinutes",
                    focusMinutes
                );


                addSessionHistory();


                updateStats();


                if (
                    sessions % 4 === 0
                ) {

                    showNotification(
                        "🎉 4 Sessions Completed!",
                        "Amazing work! Time for a long break 🌙"
                    );


                    changeMode(
                        "long"
                    );

                }

                else {

                    showNotification(
                        "🎉 Focus Session Complete!",
                        "Great work! Time for a short break ☕"
                    );


                    changeMode(
                        "short"
                    );

                }

            }

            else {

                showNotification(
                    "☕ Break Complete!",
                    "Ready to focus again? Let's go! 🚀"
                );


                changeMode(
                    "focus"
                );

            }

        }


        /* =================================
           MODE EVENTS
        ================================= */

        modeButtons[0].addEventListener(
            "click",
            () => changeMode("focus")
        );


        modeButtons[1].addEventListener(
            "click",
            () => changeMode("short")
        );


        modeButtons[2].addEventListener(
            "click",
            () => changeMode("long")
        );


        /* =================================
           TIMER EVENTS
        ================================= */

        startBtn.addEventListener(
            "click",
            startTimer
        );


        resetBtn.addEventListener(
            "click",
            resetTimer
        );


        /* =================================
           TASK STORAGE
        ================================= */

        taskInput.addEventListener(
            "input",
            () => {

                localStorage.setItem(
                    "focusflowTask",
                    taskInput.value
                );

            }
        );


        const savedTask =
            localStorage.getItem(
                "focusflowTask"
            );


        if (
            savedTask !== null
        ) {

            taskInput.value =
                savedTask;

        }


        /* =================================
           CLEAR HISTORY
        ================================= */

        clearHistoryBtn.addEventListener(
            "click",
            () => {

                if (
                    sessionHistoryData.length === 0
                ) {

                    return;

                }


                const confirmClear =
                    confirm(
                        "Are you sure you want to clear your session history?"
                    );


                if (!confirmClear) {

                    return;

                }


                sessionHistoryData =
                    [];


                localStorage.removeItem(
                    "focusflowHistory"
                );


                renderHistory();


                renderWeeklySummary();


                showNotification(
                    "🧹 History Cleared",
                    "Your session history has been cleared."
                );

            }
        );


        /* =================================
           RESET PROGRESS
        ================================= */

        resetProgressBtn.addEventListener(
            "click",
            () => {

                const confirmReset =
                    confirm(
                        "Are you sure you want to reset all progress?"
                    );


                if (!confirmReset) {

                    return;

                }


                sessions = 0;

                focusMinutes = 0;

                sessionHistoryData =
                    [];


                localStorage.removeItem(
                    "focusflowSessions"
                );


                localStorage.removeItem(
                    "focusflowMinutes"
                );


                localStorage.removeItem(
                    "focusflowHistory"
                );


                renderHistory();


                renderWeeklySummary();


                updateStats();


                showNotification(
                    "🧹 Progress Reset",
                    "Your session statistics have been cleared."
                );

            }
        );


        /* =================================
           INITIALIZE
        ================================= */

        loadTheme();

        updateStats();

        updateDisplay();

        updateStatus("focus");

        renderHistory();

        renderWeeklySummary();

    }
);