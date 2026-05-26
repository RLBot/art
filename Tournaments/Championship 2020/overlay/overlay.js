


const blueTeamName = document.getElementById("team-name-blue");
const orangeTeamName = document.getElementById("team-name-orange");
const blueWinContainer = document.getElementById("blue-wins");
const orangeWinContainer = document.getElementById("orange-wins");
const winTemplateElement = document.createElement("img");
winTemplateElement.classList.add("win-indicator");
let previousData;
let tipCards;
function pollMatchInfo() {
	try {
		$.get("current_match.json", function (data) {
			if (data != previousData) {
				previousData = data;
				const info = JSON.parse(data);
				blueTeamName.innerText = info.blue_team_name;
				orangeTeamName.innerText = info.orange_team_name;

				blueWinContainer.innerHTML = "";
				orangeWinContainer.innerHTML = "";

				if (info.series_length > 1) {
					let winsRequired = Math.ceil(info.series_length / 2);

					let blueWinCount = info.series_wins.filter(x => x === 0).length;
					for (i = 0; i < winsRequired; i++) {
						const winEl = winTemplateElement.cloneNode();
						winEl.src = `images/win indicator ${i >= winsRequired - blueWinCount ? "on" : "off"}.png`;
						blueWinContainer.append(winEl);
					}

					let orangeWinCount = info.series_wins.filter(x => x === 1).length;
					for (i = 0; i < winsRequired; i++) {
						const winEl = winTemplateElement.cloneNode();
						winEl.src = `images/win indicator ${i < orangeWinCount ? "on" : "off"}.png`;
						orangeWinContainer.append(winEl);
					}
				}

				tipCards = [];
				for (let bots of [info.blue_bots, info.orange_bots])
					for (let bot of bots) {
						tipCards.push({
							title: `${bot.name.trim()}`,
							text: `Developed by: ${bot.developer.trim()}\nLanguage: ${bot.language.trim()}`
						});
						if (bot.description.trim().length)
							tipCards.push({
								title: `${bot.name.trim()}`,
								text: bot.description.trim(),
							});
						if (bot.fun_fact.trim().length)
							tipCards.push({
								title: `Fun fact about ${bot.name.trim()}`,
								text: bot.fun_fact.trim(),
							});
					}
			}
		}, "text");
	} catch (ex) {
		console.error(ex);
	}
	setTimeout(pollMatchInfo, 1000);
}
pollMatchInfo();


const tipCardEl = document.getElementById("tipcard");
const tipTitleEl = tipCardEl.querySelector("div[tip-title]");
const tipTextEl = tipCardEl.querySelector("div[tip-text]");
setInterval(function () {
	if (!tipCards || tipCards.length == 0)
		return;
	const tipCard = tipCards[Math.floor(Math.random() * tipCards.length)];
	tipTitleEl.innerText = tipCard.title;
	tipTextEl.innerText = tipCard.text;
	tipCardEl.setAttribute("visible", "");
	setTimeout(_ => tipCardEl.removeAttribute("visible"), 10*1000);
}, 65*1000);
