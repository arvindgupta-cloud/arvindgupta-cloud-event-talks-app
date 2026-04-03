
document.addEventListener('DOMContentLoaded', () => {
    const talksData = [
        {
            title: "The Future of WebAssembly in Web Development",
            speakers: ["Dr. Evelyn Reed"],
            category: ["Web Development", "Performance"],
            duration: 60,
            description: "Explore the exciting advancements and practical applications of WebAssembly beyond traditional web development, focusing on performance-critical tasks.",
        },
        {
            title: "Machine Learning with JavaScript: A Practical Guide",
            speakers: ["Alex Chen"],
            category: ["Machine Learning", "JavaScript", "AI"],
            duration: 60,
            description: "Learn how to build and deploy machine learning models directly in the browser using popular JavaScript libraries.",
        },
        {
            title: "Containerization Best Practices for Modern Applications",
            speakers: ["Maria Rodriguez", "David Lee"],
            category: ["DevOps", "Cloud", "Containers"],
            duration: 60,
            description: "Understand the key principles and best practices for effectively using Docker and Kubernetes to manage your applications.",
        },
        {
            title: "Advanced State Management in React",
            speakers: ["Sophia Miller"],
            category: ["Frontend", "React"],
            duration: 60,
            description: "Dive deep into advanced state management patterns and libraries for large-scale React applications, including Recoil and XState.",
        },
        {
            title: "Securing Your Node.js APIs: A Comprehensive Approach",
            speakers: ["Daniel Kim"],
            category: ["Backend", "Security", "Node.js"],
            duration: 60,
            description: "Implement robust security measures for your Node.js APIs, covering authentication, authorization, and common vulnerabilities.",
        },
        {
            title: "Data Visualization with D3.js: From Basics to Interactive Dashboards",
            speakers: ["Olivia Wilson"],
            category: ["Data Science", "Frontend"],
            duration: 60,
            description: "Master the art of data visualization with D3.js, creating dynamic and interactive charts and dashboards.",
        },
    ];

    const eventStartTime = new Date();
    eventStartTime.setHours(10, 0, 0); // Event starts at 10:00 AM

    const schedule = [];
    let currentTime = eventStartTime;
    const talkDuration = 60; // minutes
    const transitionDuration = 10; // minutes
    const lunchDuration = 60; // minutes

    // Calculate schedule
    talksData.forEach((talk, index) => {
        const talkStartTime = new Date(currentTime);
        const talkEndTime = new Date(talkStartTime.getTime() + talkDuration * 60 * 1000);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: talkStartTime,
            endTime: talkEndTime,
        });

        currentTime = new Date(talkEndTime.getTime() + transitionDuration * 60 * 1000); // Add transition

        // Insert lunch break after the second talk
        if (index === 1) {
            const lunchStartTime = new Date(currentTime);
            const lunchEndTime = new Date(lunchStartTime.getTime() + lunchDuration * 60 * 1000);
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                startTime: lunchStartTime,
                endTime: lunchEndTime,
                description: 'Enjoy a delicious lunch!',
            });
            currentTime = new Date(lunchEndTime.getTime() + transitionDuration * 60 * 1000); // Add transition after lunch
        }
    });

    const scheduleContainer = document.getElementById('schedule');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');

    // Populate category filter options
    const allCategories = new Set();
    schedule.forEach(item => {
        if (item.type === 'talk' && item.category) {
            item.category.forEach(cat => allCategories.add(cat));
        }
    });

    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderSchedule(filteredSchedule = schedule) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        filteredSchedule.forEach(item => {
            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');

            if (item.type === 'talk') {
                scheduleItem.classList.add('talk');
                scheduleItem.innerHTML = `
                    <div class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                    <div class="details">
                        <h3>${item.title}</h3>
                        <p class="speakers">Speakers: ${item.speakers.join(', ')}</p>
                        <p class="category">Category: ${item.category.join(', ')}</p>
                        <p class="description">${item.description}</p>
                    </div>
                `;
            } else if (item.type === 'break') {
                scheduleItem.classList.add('break');
                scheduleItem.innerHTML = `
                    <div class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                    <div class="details">
                        <h3>${item.title}</h3>
                        <p class="description">${item.description}</p>
                    </div>
                `;
            }
            scheduleContainer.appendChild(scheduleItem);
        });
    }

    function filterSchedule() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filtered = schedule.filter(item => {
            if (item.type === 'break') return true; // Always show breaks

            const matchesCategory = selectedCategory === 'all' || (item.category && item.category.includes(selectedCategory));
            const matchesSearch = searchTerm === '' ||
                                  item.title.toLowerCase().includes(searchTerm) ||
                                  item.description.toLowerCase().includes(searchTerm) ||
                                  item.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm)) ||
                                  item.category.some(cat => cat.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });

        // Ensure breaks are shown correctly even if no talks are filtered
        const finalFilteredSchedule = [];
        schedule.forEach(originalItem => {
            if (originalItem.type === 'break') {
                finalFilteredSchedule.push(originalItem);
            } else if (filtered.includes(originalItem)) {
                finalFilteredSchedule.push(originalItem);
            }
        });

        renderSchedule(finalFilteredSchedule);
    }

    categoryFilter.addEventListener('change', filterSchedule);
    searchInput.addEventListener('input', filterSchedule);

    // Initial render
    renderSchedule();
});
