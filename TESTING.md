# Codewars Leaderboard — Testing Evidence

## 1. Automated Unit Tests

**Command:** `npm test`

**Result:** 8 tests passed, 0 failed.

The tests verify:

- Successful fetching of Codewars user data.
- Error handling for usernames that do not exist (HTTP 404).
- Error handling for server failures (HTTP 500).
- Sorting users by overall score.
- Sorting without modifying the original array.
- Collecting unique programming languages.
- Excluding users without the selected language and sorting the remaining users.
- Displaying a helpful error message when a network request fails.

API requests are mocked using `nock`.


![Automatic unit test](screenshots/Automatic-unit-test.png)


## 2. Manual Testing Evidence

### 2.1 Overall leaderboard

**Result:** PASS

Three Codewars users displayed and sorted by overall score, with the highest-ranked user highlighted.


![Overall leaderboard](screenshots/01-overall-leaderboard.png)


### 2.2 JavaScript ranking

**Result:** PASS

The leaderboard displays scores for JavaScript instead of overall scores.


![JavaScript ranking](screenshots/02-javascript-ranking.png)


### 2.3 SQL ranking — Missing users excluded

**Result:** PASS

Only CodeYourFuture and SallyMcGrath have SQL rankings in this test.


![SQL language ranking](screenshots/03-sql-ranking.png)


### 2.4 Go ranking — Missing users excluded

**Result:** PASS

Only CodeYourFuture appears for the selected Go ranking.


![Go language ranking](screenshots/04-go-ranking.png)


### 2.5 Invalid username

**Result:** PASS

The application displays a helpful error instead of showing incorrect results.


![Invalid username error](screenshots/05-invalid-username.png)


### 2.6 Loading state

**Result:** PASS

The application displays a loading message and disables the submit button.


[Watch the loading-state test](screenshots/06-loading-state.mov)


### 2.7 Repeated Searches and Error Recovery

**Result:** PASS

Manual testing confirmed that:

- A new search clears the previous leaderboard.
- The ranking dropdown resets to Overall.
- Old language options are replaced with the new users' languages.
- The submit button becomes enabled after loading.
- A valid search succeeds after an invalid username error.

## 3. Accessibility and HTML Validation

### 3.1 Lighthouse accessibility

**Tool:** Google Chrome Lighthouse

**Device:** Desktop

**Category:** Accessibility

**Result:** PASS — 100/100 on the initial page state.


![Lighthouse accessibility score](screenshots/07-lighthouse-accessibility.png)


The screenshot records the initial page audit. Dynamic leaderboard states were tested manually, but a separate Lighthouse score for those states has not been recorded.

### 3.2 HTML Validation

**Tool:** W3C Nu HTML Checker

**Result:** PASS — No errors or warnings reported.

The application's HTML source was checked using the W3C Nu HTML Checker.


![W3C HTML validation result](screenshots/08-Html-validation.png)


## 4. Conclusion

All 8 automated unit tests passed.

Manual browser testing confirmed that the application:

- Fetches real Codewars user data.
- Displays usernames, clans and scores.
- Sorts rankings from highest to lowest score.
- Supports overall and language-specific rankings.
- Excludes users without a selected language ranking.
- Highlights the top-ranked user.
- Displays useful messages during loading and after errors.
- Supports repeated searches.