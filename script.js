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
      .then((response) => response.json())
      .then((data) => {
        const { server_version, players, start_time } = data;
        const isOnline = players > 0;
        const serverStatus = isOnline ? "Online 😀" : "Offline 💔";
        if (serverStatus === "Online 😀") {
        }

        const startTime = new Date(start_time);
        const uptime = calculateUptime(startTime, now());

        this.innerHTML = `
						<table>
							<tr>
								<td class="column-a status">
		              ⚡&nbsp;Server&nbsp;Status&nbsp;:&nbsp;
								</td>
								<td class="column-b ${isOnline ? "online" : "offline"}">
									${serverStatus}
								</td>
							</tr>
							<tr>
								<td class="column-a">
									👨‍👩‍👧‍👦&nbsp;Player&nbsp;Count&nbsp;:&nbsp;
								</td>
								<td class="column-b player-count">
									${players}
								</td>
							</tr>
							<tr>
								<td class="column-a">
									⏱&nbsp;Uptime&nbsp;:&nbsp;
								</td>
								<td class="column-b uptime">
									<span id="uptime">${uptime}</span>
								</td>
							</tr>
							<tr>
								<td class="column-a">
									🎰&nbsp;Version&nbsp;:&nbsp;
								</td>
								<td class="column-b version">
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
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours % 24}h : ${minutes % 60}m : ${seconds % 60}s`;
}

// Automatically update the server status every 30 seconds
setInterval(() => {
  const serverStatusElement = document.querySelector("eve-server-status");
  serverStatusElement.fetchServerStatus();
}, 15000);
