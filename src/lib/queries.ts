import { GqlCarerixVacancy } from './gqlTypes';
import {
	CarerixEmployeeApply,
	CarerixVacancy,
	GqlCarerixEmployee,
} from './types';
import { CarerixConnection, getCarerixGqlClient } from './apiHelpers';
import {
	CARERIX_MUTATION_EMPLOYEE_APPLY,
	CARERIX_QUERY_VACANCIES,
	CARERIX_QUERY_VACANCY,
	CARERIX_QUERY_VACANCY_PER_LOCATION,
} from './gql';
import moment from 'moment';
import { parseCarerixVacancy } from './helpers';

const getPublicationFilter = (mediumCode?: string) => {
	const dateFormat = 'YYYY-MM-DD HH:mm:ss';
	const startDate = moment().endOf('day').format(dateFormat);
	const endDate = moment().startOf('day').add(1, 'day').format(dateFormat);

	return `publicationStart <= (NSCalendarDate) '${startDate}' AND (publicationEnd > (NSCalendarDate) '${endDate}' OR publicationEnd = nil)`;
};

export const getCarerixVacancies = async (
	connection?: Partial<CarerixConnection>,
): Promise<CarerixVacancy[]> => {
	const { client, options } = await getCarerixGqlClient(connection ?? {});
	const response = await client.query<{
		crPublicationPage: {
			items: GqlCarerixVacancy[];
		};
	}>({
		query: CARERIX_QUERY_VACANCIES,
		variables: {
			qualifier: getPublicationFilter(),
		},
	});

	const items = response?.data?.crPublicationPage?.items;

	if (!items || !items.length) {
		return [];
	}

	const parsedVacancies = await Promise.all(items.map(parseCarerixVacancy));

	//  NOTE: Filter out vacancies that are not from the correct agency
	const filterdVacancies = parsedVacancies.filter((vacancy) => {
		if (!options.agency) {
			return true;
		}

		return vacancy.agency.name === options.agency;
	});

	return filterdVacancies;
};

export const getCarerixVacancy = async (
	vacancyId: number,
	connection?: Partial<CarerixConnection>,
): Promise<CarerixVacancy | null> => {
	if (!vacancyId) {
		throw new Error('Cannot get Carerix vacancy without vacancyId');
	}

	let response;

	try {
		const { client, options } = await getCarerixGqlClient(connection ?? {});
		response = await client.query<{ crPublication: GqlCarerixVacancy }>({
			query: CARERIX_QUERY_VACANCY,
			variables: {
				id: vacancyId,
			},
		});

		const { agency } = options;

		response = await parseCarerixVacancy(response.data.crPublication);

		if (!agency) {
			return response;
		}

		//  NOTE: Filter out vacancies that are not from the correct agency
		if (response.agency.name !== agency) {
			return null;
		}
	} catch (e) {
		// console.log(e);
	}

	if (!response) {
		return null;
	}

	return response;
};

export const getCarerixVacanciesPerLocation = async (
	locationId: string,
	connection?: Partial<CarerixConnection>,
): Promise<CarerixVacancy[]> => {
	if (!locationId) {
		throw new Error('Cannot get Carerix vacancies without locationId');
	}

	const { client, options } = await getCarerixGqlClient(connection ?? {});
	const response = await client.query<{
		crCompany: {
			vacancies: {
				items: {
					publications: {
						items: GqlCarerixVacancy[];
					};
					titleInformation: string;
					additionalInfo: string;
					minSalary: number;
					maxSalary: number;
					agency: {
						name: string;
					};
				}[];
			};
		};
	}>({
		query: CARERIX_QUERY_VACANCY_PER_LOCATION,
		variables: {
			locationId,
			qualifier: getPublicationFilter(),
		},
	});

	const items: GqlCarerixVacancy[] = [];
	response?.data?.crCompany?.vacancies?.items.forEach((vacancy) => {
		vacancy.publications.items.forEach((publication) => {
			items.push({
				...publication,
				toVacancy: {
					titleInformation: vacancy.titleInformation,
					additionalInfo: vacancy.additionalInfo,
					minSalary: vacancy.minSalary,
					maxSalary: vacancy.maxSalary,
					agency: {
						name: vacancy.agency.name,
					},
				},
			});
		});
	});

	if (!items || !items.length) {
		return [];
	}

	const parsedVacancies = await Promise.all(items.map(parseCarerixVacancy));

	const filteredVacancies = parsedVacancies.filter((vacancy) => {
		if (!options.agency) {
			return true;
		}

		return vacancy.agency.name === options.agency;
	});

	return filteredVacancies;
};

export const setCarerixEmployeeApply = async (
	publicationId: string,
	employeeData: CarerixEmployeeApply,
	connection?: Partial<CarerixConnection>,
): Promise<boolean> => {
	// NOTE: Format some fields to fit in the notes
	const notes = `Opleiding: \n${employeeData.education}\n\nMotivatie:\n${
		employeeData.motivation
	}\n\n${
		employeeData.firstYearDiploma
			? 'Heeft HBO/WO/MBO4'
			: 'Niet gediplomeerd'
	}`;

	const data: GqlCarerixEmployee = {
		_kind: 'CREmployee',
		firstName: employeeData.firstName,
		lastName: employeeData.lastName,
		emailAddress: employeeData.emailAddress,
		mobileNumber: employeeData.mobileNumber,
		city: employeeData.city,
		notes,
	};

	try {
		const { client } = await getCarerixGqlClient(connection ?? {});
		await client.mutate({
			mutation: CARERIX_MUTATION_EMPLOYEE_APPLY,
			variables: {
				publicationId,
				data,
			},
		});
	} catch (e) {
		console.log(JSON.stringify(e, null, 4));

		return false;
	}

	return true;
};
