import * as dotenv from "dotenv"

export default () => {
    // this will be called by the test runner before starting the tests
    // call dotenv
    dotenv.config()
}