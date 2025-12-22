document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('search');
  let talks = [];

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
    const filteredTalks = talks.map(talk => {
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
  
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data.map(talk => ({...talk, visible: true}));
      renderSchedule();
      searchInput.addEventListener('input', filterTalks);
    })
    .catch(error => {
      console.error('Error fetching talks:', error);
      scheduleContainer.innerHTML = '<p>Error loading schedule. Please try again later.</p>';
    });
});
