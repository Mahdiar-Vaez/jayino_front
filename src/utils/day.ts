// src/utils/dayjs.ts
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export default dayjs;
