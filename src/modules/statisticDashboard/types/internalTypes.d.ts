export interface ReferenceData {
    date: {title: string, value: string}[];
    region: string[];
}

import type { StatisticsAttribute } from "./typesStatisticDashboard";

export type SelectedStatistics = Record<
    string,
    StatisticsAttribute & {key: string, selectedOrder: number}
>
