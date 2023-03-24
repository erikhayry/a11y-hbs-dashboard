const AxeBuilder = require('@axe-core/webdriverio').default;
const { remote } = require('webdriverio');
const fs = require('fs');

async function analyze({url, name}){
    const client = await remote({
        logLevel: 'error',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ["--headless", "user-agent=...","--disable-gpu","--window-size=1440,735"]
            }
        }
    });

    console.log(url)
    await client.url(url);

    const builder = new AxeBuilder({ client });
    try {
        const {violations, incomplete} = await builder.analyze();
        const report = {
            name,
            url,
            result: {
                numberOfViolations: violations.length,
                numberOfIncomplete: incomplete.length,
            },
            violations,
            incomplete
        }
        fs.writeFileSync(`./result/${name}.json`, JSON.stringify(report, null, 2))

    } catch (e) {
        console.error(e);
    }
}


const banks = [
    {name: "handelsbanken", url:'http://www.handelsbanken.se'},
    {name: "seb", url:'http://www.seb.se'},
    {name: "sbab", url:'http://www.sbab.se'},
    {name: "swebank", url:'http://www.swebank.se'},
    {name: "avanza", url:'http://www.avanza.se'},
    {name: "klarna", url:'http://www.klarna.se'},
    {name: "nordea", url:'http://www.nordea.se'},
    {name: "danskebank", url:'http://www.danskebank.se'},
    {name: "lansforsakringar", url:'http://www.lansforsakringar.se'},
    {name: "skandia", url:'http://www.skandia.se'},

]
async function init() {
    await Promise.all(banks.map((bank) => analyze(bank)))
    process.exit()
}

init()