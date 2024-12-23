import { CarerixVacancy } from './lib/types';
import {
	getCarerixVacancies,
	getCarerixVacancy,
	setCarerixEmployeeApply,
} from './lib/queries';

export const carerix = {
	vacancies: getCarerixVacancies,
	vacancy: getCarerixVacancy,
	employeeApply: setCarerixEmployeeApply,
};

export type { CarerixVacancy };
