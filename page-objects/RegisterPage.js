export class RegisterPage {
    constructor(page) {
        this.page = page
        this.emailInput = page.getByPlaceholder('E-mail')
        this.passwordInput = page.getByPlaceholder('password')
        this.registerButton = page.getByRole('button', { name: 'Register' })
    }

    // here we are filling the registration form with email and password and clicking the register button
    signUpAsNewUser = async (email, password) => {
        await this.emailInput.waitFor()
        await this.emailInput.fill(email)
        await this.passwordInput.waitFor()
        await this.passwordInput.fill(password)
        await this.registerButton.waitFor()
        await this.registerButton.click()
    }


}