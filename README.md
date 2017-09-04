Opener Detector
===============

**A simple browser extension which checks for [`window.opener` vulnerabilities][article] as you browse.** When it finds one, it shows a warning page in the vulnerable tab, so that you can report or fix the vulnerability. (Use the back button to return to the page.) Pages or whole sites can be added to an ignore list.

`window.opener` vulnerabilities allow Web pages to control the tab which opened them. They can be fixed on [many browsers][caniuse] simply by adding `rel=noopener` to your links. For more details, [check out Mathias Bynens' article][article].

**Please use responsibly.** Disclose vulnerabilities you find, or fix them. [Keep your hat white.][white-hat]

Contributions welcome. Check out the GitHub issues if you're looking for something to do.

[caniuse]: http://caniuse.com/#feat=rel-noopener
[article]: https://mathiasbynens.github.io/rel-noopener/
[white-hat]: https://en.wikipedia.org/wiki/White_hat_(computer_security)
