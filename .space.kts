/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Run npm test ") {
    container(displayName = "Run test script", image = "node:18-alpine") {
        env["REGISTRY"] = "https://npm.pkg.jetbrains.space/mycompany/p/projectkey/mynpm"
        shellScript {
            interpreter = "/bin/sh"
            content = """
                echo Install npm dependencies...
                yarn install
                echo Run tests...
                yarn test
            """
        }
    }
}