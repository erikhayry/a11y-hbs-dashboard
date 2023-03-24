const AxeBuilder = require('@axe-core/webdriverio').default;
const { remote } = require('webdriverio');
const fs = require('fs');

function toNumberOfNodes(numberOfNodes, { nodes }) {
    return numberOfNodes + nodes.length
}

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
        return {
            name,
            url,
            result: {
                numberOfViolations: violations.reduce(toNumberOfNodes, 0),
                numberOfIncomplete: incomplete.reduce(toNumberOfNodes, 0),
            },
            violations,
            incomplete
        }
    } catch (e) {
        console.error(e);
        process.exit()
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
    const results = await Promise.all(banks.map((bank) => analyze(bank)))
    fs.writeFileSync(`./bank-a11y-dashboard/db/results.json`, JSON.stringify(results, null, 2))
    process.exit()
}

init()