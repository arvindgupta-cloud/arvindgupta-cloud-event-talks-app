const fs = require('fs');
const path = require('path');

const outputDir = './dist';
const outputFile = path.join(outputDir, 'index.html');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'public', 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'public', 'script.js'), 'utf8');
const talks = fs.readFileSync(path.join(__dirname, 'data', 'talks.json'), 'utf8');

const combinedHtml = html
  .replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`)
  .replace('<script src="script.js"></script>', `<script>
    // Inject talks data directly
    window.allTalksData = ${talks};

    ${js}
    // Modify the fetch call to use the injected data
    document.addEventListener('DOMContentLoaded', () => {
      const scheduleContainer = document.getElementById('schedule');
      const searchInput = document.getElementById('search');
      let talks = window.allTalksData.map(talk => ({...talk, visible: true})); // Use injected data

      const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      const renderSchedule = (filteredTalks) => {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        const talksToRender = filteredTalks || talks;
        let talkCount = 0;

        talksToRender.forEach((talk, index) => {
          if (talk.visible === false) return;
          
          const startTime = new Date(currentTime);
          const endTime = new Date(startTime.getTime() + talk.duration * 60000);

          const talkElement = document.createElement('div');
          talkElement.classList.add('talk');

          talkElement.innerHTML = `
            <div class="talk-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <h2 class="talk-title">${talk.title}</h2>
            <div class="talk-speakers">By: ${talk.speakers.join(', ')}</div>
            <div class="talk-categories">
              ${talk.categories.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
            </div>
            <p class="talk-description">${talk.description}</p>
          `;
          scheduleContainer.appendChild(talkElement);
          
          talkCount++;
          currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

          if (talkCount === 3) {
              const lunchBreak = document.createElement('div');
              lunchBreak.classList.add('break');
              const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
              lunchBreak.innerHTML = `<div class="talk-time">${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</div><h2 class="talk-title">Lunch Break</h2>`;
              scheduleContainer.appendChild(lunchBreak);
              currentTime = lunchEndTime;
          }
        });
      };

      const filterTalks = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = window.allTalksData.map(talk => { // Use injected data
            const isVisible = talk.categories.some(cat => cat.toLowerCase().includes(searchTerm));
            return {...talk, visible: isVisible};
        });
        const allHidden = filteredTalks.every(talk => !talk.visible);

        if (allHidden && searchTerm) {
            scheduleContainer.innerHTML = '<p>No talks found for this category.</p>';
        } else {
            renderSchedule(filteredTalks.filter(talk => talk.visible));
        }
      };
      
      // Initial render using injected data
      talks = window.allTalksData.map(talk => ({...talk, visible: true}));
      renderSchedule();
      searchInput.addEventListener('input', filterTalks);
    });
    </script>`);


fs.writeFileSync(outputFile, combinedHtml);

console.log(`Single-page HTML generated at ${outputFile}`);
