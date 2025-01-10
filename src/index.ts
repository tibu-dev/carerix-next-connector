import { CarerixEmployeeApply, CarerixVacancy } from './lib/types';
import {
	getCarerixVacancies,
	getCarerixVacanciesPerLocation,
	getCarerixVacancy,
	setCarerixEmployeeApply,
} from './lib/queries';

export const carerix = {
	vacancies: getCarerixVacancies,
	vacancy: getCarerixVacancy,
	vacanciesPerLocation: getCarerixVacanciesPerLocation,
	employeeApply: setCarerixEmployeeApply,
};

export type { CarerixVacancy, CarerixEmployeeApply };
