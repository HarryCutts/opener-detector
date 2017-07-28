(function() {
/** An object containing the parameters passed to the report page in the URL fragment. */
const fragmentObj = JSON.parse(decodeURIComponent(location.hash.slice(1)));

const page = {
	report: document.getElementById('report'),
	sourcePageLink: document.getElementById('sourcePageLink'),
	targetPageLink: document.getElementById('targetPageLink'),
	ignoreButton: document.getElementById('ignoreButton'),
	ignoreDomainButton: document.getElementById('ignoreDomainButton'),
	returnButton: document.getElementById('returnButton'),
};

if (fragmentObj.sourceURL !== null) {
	page.sourcePageLink.setAttribute('href', fragmentObj.sourceURL);
	page.sourcePageLink.innerText = fragmentObj.sourceURL;
} else {
	page.sourcePageLink.removeAttribute('href');
	page.sourcePageLink.innerText =
		"(Unknown, since this was a cross-origin link with no referrer. Click \"Return to the page\" to see it.)";
	// Disable the ignore buttons, since adding '' to the ignore list would mess things up.
	page.ignoreButton.disabled = true
	page.ignoreDomainButton.disabled = true
}

page.targetPageLink.setAttribute('href', fragmentObj.targetURL);
page.targetPageLink.innerText = fragmentObj.targetURL;

function saveConfig(config, successMessage) {
	config.save().then(
			() => {
				alert(successMessage);
			},
			(error) => {
				alert("An error occurred when adding to the ignore list. (See console for details.)");
				console.error(error);
			});
}

page.ignoreButton.addEventListener('click', (e) => {
	e.preventDefault();
	OpenerDetectorConfig.get().then((config) => {
		const ignoreList = config.getIgnoreList();
		const canonicalURL = ignoreList.add(fragmentObj.sourceURL);
		saveConfig(config, `Vulnerabilities on the page ${canonicalURL} will no longer be reported.`);
	});
});

page.ignoreDomainButton.addEventListener('click', (e) => {
	e.preventDefault();
	OpenerDetectorConfig.get().then((config) => {
		const ignoreList = config.getIgnoreList();
		const canonicalOrigin = ignoreList.addOrigin(fragmentObj.sourceURL);
		saveConfig(config, `Vulnerabilities on the origin ${canonicalOrigin} will no longer be reported.`);
	});
});

page.returnButton.addEventListener('click', (e) => {
	e.preventDefault();
	history.back();
});

// Show the report element now that it's been filled out.
page.report.classList.add('ready');
})();
