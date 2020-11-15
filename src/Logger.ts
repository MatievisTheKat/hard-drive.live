import chalk from "chalk";
import moment from "moment";

export class Logger {
  private static get date(): string {
    return moment().format("DD/MM/YYYY hh:mm:ss a");
  }

  public static log(msg: unknown): void {
    console.log(`${chalk.grey(Logger.date)}   ${chalk.bold("LOG  ")}  ${msg}`);
  }

  public static warn(msg: unknown): void {
    console.log(`${chalk.grey(Logger.date)}   ${chalk.yellow("WARN ")}  ${msg}`);
  }

  public static info(msg: unknown): void {
    console.log(`${chalk.grey(Logger.date)}   ${chalk.green("INFO ")}  ${msg}`);
  }

  public static error(msg: unknown): void {
    console.log(`${chalk.grey(Logger.date)}   ${chalk.red("ERROR")}  ${msg}`);
  }
}