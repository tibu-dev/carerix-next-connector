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
		owner: {
			emailAddress: owner.emailAddress
		},
		title: toVacancy.titleInformation,
		company: {
			id: item.toCompany._id,
			name: item.toCompany.name
		},
		startDate: item.publicationStart,
		endDate: item.publicationEnd,
		modified: item.modificationDate,
		hoursPerWeek: parseInt(toVacancy.additionalInfo['_10361']),
		salaryRange: {
			min: toVacancy.minSalary ?? 0,
			max: toVacancy.maxSalary ?? 0,
			minFormatted: `€ ${toVacancy.minSalary?.toFixed(2) ?? 0}`,
			maxFormatted: `€ ${toVacancy.maxSalary?.toFixed(2) ?? 0}`,
		},
	};
};
