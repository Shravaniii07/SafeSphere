import cron from "node-cron";
import { checkTripsAndAlert } from "../services/alertService.js";

cron.schedule("* * * * *", () => {
    console.log("Checking trips...");
    checkTripsAndAlert();
});