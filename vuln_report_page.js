(function() {
/** An object containing the parameters passed to the report page in the URL fragment. */
const fragmentObj = JSON.parse(decodeURIComponent(location.hash.slice(1)));

const page = {
	report: document.getElementById('report'),
	sourcePageLink: document.getElementById('sourcePageLink'),
	ignoreButton: document.getElementById('ignoreButton'),
};

page.sourcePageLink.setAttribute('href', fragmentObj.sourceURL);
page.sourcePageLink.innerText = fragmentObj.sourceURL;

page.ignoreButton.addEventListener('click', (e) => {
	e.preventDefault();
	IgnoreList.add(fragmentObj.sourceURL).then(
			(url) => {
				alert(`Vulnerabilities on the page ${url} will no longer be reported.`);
			},
			(error) => {
				alert("An error occurred when adding the page to the ignore list. (See console for details.)");
				console.error(error);
			});
});

// Show the report element now that it's been filled out.
page.report.classList.add('ready');
})();
