import { test } from "@playwright/test";
import { MyAccountPage } from "../page-objects/MyAccountPage.js";
import { getLoginToken } from "./../api-calls/getLoginToken.js";
import { adminDetails } from "./../data/userDetails.js";

test("My Account using cookie injection and mocking network request", async ({ page }) => {
    // Task: make a request to get login token
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)

    // mocking the request to get user details, so we can be sure that the user is logged in and we have control over the response
    page.route("**/api/user**", async (route, request) => {
        route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "Playwright error for mocking"}),
        })
    })
    // inject the login token into the browser
    const myAccount = new MyAccountPage(page)
    await myAccount.visit()
    await page.evaluate(([loginTokenInsideBrowserCode]) => {
        document.cookie = "token=" + loginTokenInsideBrowserCode
    }, [loginToken])
    await myAccount.visit()
    await myAccount.waitForPageHeading()
    await myAccount.waitForErrorMessage()
})
