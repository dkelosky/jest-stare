import { ILocation } from "./ILocation";

export interface IInnerTestResults {
    title: string;
    status: "failed" | "pending" | "passed";
    ancestorTitles: string[];
    failureMessages: string[];
    numPassingAsserts: number;
    location: ILocation;
}
