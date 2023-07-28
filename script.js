const { log } = console;
const now = () => new Date();
// Define the custom element
class EveServerStatus extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "Loading server status...";
    this.fetchServerStatus();
  }

  fetchServerStatus() {
    const apiUrl =
      "https://esi.evetech.net/latest/status/?datasource=tranquility";

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const { server_version, players, start_time } = data;
        const isOnline = players > 0;
        const serverStatus = isOnline ? "Online 😀" : "Offline 💔";

        const startTime = new Date(start_time);
        const uptime = calculateUptime(startTime, now());

        this.innerHTML = `
						<table>
              <thead>
                <th id="server-status-header">
                  <h3>
                    Server Monitor
                  </h3>
                </th>
              </thead>
            </table>
            <hr>
            <table>
              <tr>
								<td class="column-a">
		              ⚡&nbsp;Server&nbsp;Status&nbsp;:&nbsp;
								</td>
								<td class="column-b ${isOnline ? "online" : "offline"}" id="status">
									${serverStatus}
								</td>
							</tr>
							<tr>
								<td class="column-a">
									👨‍👩‍👧‍👦&nbsp;Player&nbsp;Count&nbsp;:&nbsp;
								</td>
								<td class="column-b" id="player-count">
									${players}
								</td>
							</tr>
							<tr>
								<td class="column-a">
									⏱&nbsp;Uptime&nbsp;:&nbsp;
								</td>
								<td class="column-b" id="uptime">
									<span id="uptime">${uptime}</span>
								</td>
							</tr>
							<tr>
								<td class="column-a">
									🎰&nbsp;Version&nbsp;:&nbsp;
								</td>
								<td class="column-b" id="version">
									${server_version}
								</td>
							</tr>
						</table>
            `;

        this.updateUptime(startTime);
      })
      .catch(() => {
        this.innerHTML = "Failed to retrieve server status.";
      });
  }

  updateUptime(startTime) {
    const uptimeElement = this.querySelector("#uptime");

    setInterval(() => {
      const uptime = calculateUptime(startTime, now());
      uptimeElement.textContent = uptime;
    }, 1000);
  }
}

// Define the custom element tag
customElements.define("eve-server-status", EveServerStatus);

// Helper function to calculate uptime
function calculateUptime(startTime, endTime) {
  const diff = endTime - startTime;
  const seconds = Math.max(Math.floor(diff / 1000), 0);
  const minutes = Math.max(Math.floor(seconds / 60), 0);
  const hours = Math.max(Math.floor(minutes / 60), 0);

  return (seconds + minutes + hours > 0) ? `${hours % 24}h : ${minutes % 60}m : ${seconds % 60}s` : `0`;
}
// Automatically update the server status every 60 seconds
setInterval(() => {
  const serverStatusElement = document.querySelector("eve-server-status");
  serverStatusElement.fetchServerStatus();
}, 60000);
