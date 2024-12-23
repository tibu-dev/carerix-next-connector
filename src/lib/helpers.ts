import { GqlCarerixVacancy } from './gqlTypes';
import { CarerixVacancy } from './types';

export const parseCarerixVacancy = async (
	item: GqlCarerixVacancy,
): Promise<CarerixVacancy> => {
	const { toVacancy, owner } = item;

	return {
		id: item._id,
		content: {
			intro: item.introInformation ?? '',
			company: item.companyInformation ?? '',
			vacancy: item.vacancyInformation ?? '',
			requirements: item.requirementsInformation ?? '',
			offer: item.offerInformation ?? '',
		},
		// TODO: Rename into owner..
		contact: owner,
		title: toVacancy.titleInformation,
		// TODO: Get this again..
		// location: item.toCompany,
		startDate: item.publicationStart,
		endDate: item.publicationEnd,
		modified: item.modificationDate,
		// TODO: This ID needs something mappable.. but in the integration
		hoursPerWeek: parseInt(toVacancy.additionalInfo['_10361']),
		salaryRange: {
			min: toVacancy.minSalary ?? 0,
			max: toVacancy.maxSalary ?? 0,
			minFormatted: `€ ${toVacancy.minSalary?.toFixed(2) ?? 0}`,
			maxFormatted: `€ ${toVacancy.maxSalary?.toFixed(2) ?? 0}`,
		},
	};
};
