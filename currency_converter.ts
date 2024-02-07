#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import showBanner from "node-banner";

let sleep = (time = 2000) => new Promise((r) => (setTimeout(r, time)));

async function myBanner(): Promise<void> {
    showBanner('Currency Converter',
        'Here you can convert any currency to any currency')
}

interface Data {
    [key: string]: number
}
async function userAmount(): Promise<number> {

    let { amount } = await inquirer.prompt([
        {
            name: "amount",
            type: "number",
            message: chalk.rgb(255, 245, 157).bold("Enter Amount"),
            validate: (input) => {
                if (isNaN(input)) {

                    console.error(chalk.redBright.bold(`\n"Enter Amount in Numbers"`));

                } else {
                    return true
                }
            }
        }
    ])


    return amount
}

let data: Data = await fetch("https://openexchangerates.org/api/latest.json?app_id=97330f53db4d4596b8e10fdbb51d198e")
    .then((value) => value.json())
    .then((data) => data.rates)

async function fromCurrency(): Promise<number> {
    let { from } = await inquirer.prompt([
        {
            name: "from",
            type: "list",
            choices: Object.keys(data),
            message: chalk.rgb(255, 245, 157).bold("From Currency")
        }
    ])
    return from

}

async function toCunrrency(): Promise<number> {
    let { to } = await inquirer.prompt([
        {
            name: "to",
            type: "list",
            choices: Object.keys(data),
            message: chalk.rgb(255, 245, 157).bold("To Currency")
        }
    ])
    return to
}

async function currencyConversion(to: number, from: number, amount: number) {
    return data[to] / data[from] * amount;
}


async function userExit(): Promise<boolean> {
    let { exit } = await inquirer.prompt({
        name: "exit",
        type: "confirm",
        default: false,
        message: chalk.rgb(191, 155, 82)("Do you want to Exit?")
    });

    return exit
}

async function mainFun() {
    await myBanner();
    let exit = true
    while (exit) {
        await sleep(1000)
        let amount = await userAmount();

        await sleep(1000);
        let form = await fromCurrency();

        await sleep(1000);
        let to = await toCunrrency();

        let result = await currencyConversion(to, form, amount);
        let spinner = createSpinner(chalk.whiteBright.bold("Converting....\n please Wait")).start();
        await sleep(2000)
        spinner.success({ text: chalk.greenBright(`${amount} ${form} = ${result} ${to}` )})

        let again = await userExit();
        exit = !again

console.log(`\n ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n`);

    }


}

await mainFun();
