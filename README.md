### Automated my weather widgets project:

-   [GitHub Pages](https://andtaran.github.io/weather_react/)
-   [GitHub](https://github.com/AndTaran/weather_react)

### And automated API tests for the service:

-   [Restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html)

---

#### Allure report on gh-page:

-   [allure-report](https://andtaran.github.io/playwright-ts/)

---

### Local launch:

**1. Install dependencies:**

```
npm install
```

**2. Run the tests:**

```
npx playwright test
```

**3. Generate allure report:**

```
npx allure serve
```

---

**Other commands:**

Starts the interactive UI mode.

```
npx playwright test --ui
```

Runs the tests only on Desktop Chrome.

```
npx playwright test --project=chromium
```

Runs the tests in a specific file.

```
npx playwright test example
```

Runs the tests in debug mode.

```
npx playwright test --debug
```

Auto generate tests with Codegen.

```
npx playwright codegen
```
